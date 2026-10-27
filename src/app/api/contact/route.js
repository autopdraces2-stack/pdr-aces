import nodemailer from "nodemailer";
import * as yup from "yup";
import { NextResponse } from "next/server";
import {
  ALLOWED_PHOTO_TYPES,
  MAX_PHOTO_BYTES,
  MAX_PHOTOS,
  PHOTO_TOO_LARGE,
  PHOTO_TOO_MANY,
  PHOTO_TYPE,
} from "@/lib/contactLimits";

export const runtime = "nodejs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const json = (body, status) =>
  new NextResponse(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

const emptyToUndefined = (value) => {
  const trimmed = value == null ? "" : String(value).trim();
  return trimmed ? trimmed : undefined;
};

const phoneField = (required) => {
  let field = yup
    .string()
    .transform((value) => {
      const digits = value ? String(value).replace(/\D+/g, "") : "";
      return digits || undefined;
    })
    .test("digits-9-15", "Phone is invalid", (val) => {
      if (!val) return true;
      const n = String(val).length;
      return n >= 9 && n <= 15;
    });
  if (required) field = field.required("Phone is required");
  return field;
};

const emailField = (required) => {
  let field = yup
    .string()
    .transform(emptyToUndefined)
    .email("Email is invalid")
    .max(254, "Email too long");
  if (required) field = field.required("Email is required");
  return field;
};

const trainingSchema = yup
  .object({
    type: yup.string().oneOf(["training"]).required(),
    name: yup.string().trim().min(2, "Name is required").max(120, "Name too long").required("Name is required"),
    phone: phoneField(true),
    email: emailField(true),
    source: yup
      .string()
      .oneOf(
        ["Instagram", "TikTok", "Facebook", "YouTube"],
        "Please choose where you saw us"
      )
      .required("Please choose where you saw us"),
    message: yup.string().transform(emptyToUndefined).max(2000, "Message too long").optional(),
  })
  .required();

const estimateSchema = yup
  .object({
    type: yup.string().oneOf(["estimate"]).required(),
    name: yup.string().trim().min(2, "Name is required").max(120, "Name too long").required("Name is required"),
    phone: phoneField(false),
    email: emailField(false),
    damage: yup.string().transform(emptyToUndefined).max(2000, "Description too long").optional(),
  })
  .required();

const escapeHtml = (s = "") =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const safeName = (name, index) => {
  const base = String(name || `photo-${index + 1}`).split(/[/\\]/).pop();
  const clean = base.replace(/[^\w.\- ]+/g, "").slice(0, 80);
  return clean || `photo-${index + 1}`;
};

const labelFor = (type) => (type === "training" ? "Training" : "Estimate");

const rowsFor = (data, photoCount) => {
  const rows = [
    ["Type", labelFor(data.type)],
    ["Name", data.name],
  ];
  if (data.email) rows.push(["Email", data.email]);
  if (data.phone) rows.push(["Phone", data.phone]);
  if (data.source) rows.push(["Source", data.source]);
  if (data.message) rows.push(["Message", data.message]);
  if (data.damage) rows.push(["Damage", data.damage]);
  if (photoCount) rows.push(["Photos", String(photoCount)]);
  return rows;
};

const toText = (data, photoCount) =>
  [`New ${labelFor(data.type)} Request`, "", ...rowsFor(data, photoCount).map(([k, v]) => `${k}: ${v}`)].join(
    "\n"
  );

const toHtml = (data, photoCount) => `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;color:#111">
    <h3 style="margin:0 0 10px 0;">New ${escapeHtml(labelFor(data.type))} Request</h3>
    <table style="border-collapse:collapse;width:100%;max-width:640px">
      <tbody>
        ${rowsFor(data, photoCount)
          .map(
            ([label, value]) => `<tr>
              <td style="padding:8px 12px;border:1px solid #eee;background:#f8fafc;width:160px;vertical-align:top;">${escapeHtml(label)}</td>
              <td style="padding:8px 12px;border:1px solid #eee;white-space:pre-wrap;">${escapeHtml(value)}</td>
            </tr>`
          )
          .join("")}
      </tbody>
    </table>
  </div>
`;

async function readPayload(req) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const photos = form
      .getAll("photos")
      .filter((file) => file instanceof File && file.size > 0);
    return {
      fields: {
        type: String(form.get("type") || ""),
        name: String(form.get("name") || ""),
        phone: String(form.get("phone") || ""),
        email: String(form.get("email") || ""),
        damage: String(form.get("damage") || ""),
      },
      photos,
    };
  }

  const body = await req.json();
  return { fields: body, photos: [] };
}

export async function POST(req) {
  try {
    let payload;
    try {
      payload = await readPayload(req);
    } catch {
      return json({ ok: false, error: "Invalid input" }, 400);
    }

    const { fields, photos } = payload;
    if (photos.length > MAX_PHOTOS) {
      return json({ ok: false, error: PHOTO_TOO_MANY }, 400);
    }
    const total = photos.reduce((sum, file) => sum + file.size, 0);
    if (total > MAX_PHOTO_BYTES) {
      return json({ ok: false, error: PHOTO_TOO_LARGE }, 400);
    }
    if (photos.some((file) => !ALLOWED_PHOTO_TYPES.includes(file.type))) {
      return json({ ok: false, error: PHOTO_TYPE }, 400);
    }

    const schema = fields?.type === "estimate" ? estimateSchema : trainingSchema;
    let data;
    try {
      data = await schema.validate(fields, { abortEarly: false, stripUnknown: true });
    } catch (ve) {
      const message = ve?.inner?.[0]?.message || ve.message || "Invalid input";
      return json({ ok: false, error: message }, 400);
    }

    if (data.type === "training" && photos.length) {
      return json({ ok: false, error: "Invalid input" }, 400);
    }

    const senderAddress = process.env.REFERRAL_EMAIL_SENDER_ADDRESS;
    const senderAppPass = process.env.REFERRAL_EMAIL_SENDER_APP_PASS;
    if (!senderAddress || !senderAppPass) {
      console.error("Email is not configured");
      return json({ ok: false, error: "Failed to send email" }, 500);
    }

    const attachments = await Promise.all(
      photos.map(async (file, index) => ({
        filename: safeName(file.name, index),
        content: Buffer.from(await file.arrayBuffer()),
        contentType: file.type,
      }))
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: senderAddress, pass: senderAppPass },
    });

    await transporter.sendMail({
      from: senderAddress,
      to: senderAddress,
      ...(data.email ? { replyTo: data.email } : {}),
      subject: `New ${labelFor(data.type)} request: ${data.name}`,
      text: toText(data, attachments.length),
      html: toHtml(data, attachments.length),
      attachments,
      headers: { "X-Source": "Website Contact" },
    });

    return json({ ok: true, message: "Email sent successfully" }, 200);
  } catch (err) {
    console.error("Email error:", err);
    return json({ ok: false, error: "Failed to send email" }, 500);
  }
}
