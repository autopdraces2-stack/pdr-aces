import * as yup from "yup";
import { texts } from "@/constants";

export default yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(2, texts.contact.nameMin)
    .required(texts.contact.nameRequired),

  email: yup
    .string()
    .trim()
    .email(texts.contact.emailInvalid)
    .max(254, texts.contact.emailTooLong || "Email is too long")
    .optional(),

  phone: yup
    .string()
    .required(texts.contact.phoneRequired)
    .transform((v) => {
      if (!v) return "";
      if (typeof v === "string") return v.trim();
      if (typeof v === "object" && "value" in v) return String(v.value).trim();
      return "";
    })
    .test("valid-phone", texts.contact.phoneInvalid, (val) => {
      if (!val) return false;
      const digits = val.replace(/\D+/g, "");
      return digits.length >= 9 && digits.length <= 15;
    }),

  description: yup.string().trim().max(2000, texts.contact.descriptionTooLong),
});
