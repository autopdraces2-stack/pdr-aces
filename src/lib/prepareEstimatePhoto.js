const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.8;

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|heic|heif)$/i;
const HEIC_EXT = /\.(heic|heif)$/i;

const HEIC_BRANDS = new Set([
  "heic",
  "heix",
  "hevc",
  "hevx",
  "heif",
  "heim",
  "heis",
  "hevm",
  "hevs",
  "mif1",
  "msf1",
]);

let orientationSupport;

function jpegName(name) {
  const base = String(name || "photo").split(/[/\\]/).pop();
  const stem = base.replace(/\.[^.]+$/, "").replace(/[^\w.\- ]+/g, "").slice(0, 76);
  return `${stem || "photo"}.jpg`;
}

function ascii(bytes, start, length) {
  let out = "";
  for (let i = 0; i < length; i++) out += String.fromCharCode(bytes[start + i]);
  return out.toLowerCase();
}

function isUntyped(type) {
  return !type || type === "application/octet-stream";
}

function sniffKind(header) {
  if (header.length >= 3 && header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
    return "jpeg";
  }
  if (
    header.length >= 8 &&
    header[0] === 0x89 &&
    header[1] === 0x50 &&
    header[2] === 0x4e &&
    header[3] === 0x47
  ) {
    return "png";
  }
  if (
    header.length >= 6 &&
    header[0] === 0x47 &&
    header[1] === 0x49 &&
    header[2] === 0x46 &&
    header[3] === 0x38
  ) {
    return "gif";
  }
  if (header.length >= 12 && ascii(header, 0, 4) === "riff" && ascii(header, 8, 4) === "webp") {
    return "webp";
  }
  if (header.length >= 12 && ascii(header, 4, 4) === "ftyp") {
    for (let i = 8; i + 4 <= header.length; i += 4) {
      if (i === 12) continue;
      if (HEIC_BRANDS.has(ascii(header, i, 4))) return "heic";
    }
  }
  return null;
}

async function readHeader(file) {
  return new Uint8Array(await file.slice(0, 64).arrayBuffer());
}

function readExifOrientation(bytes, start, length) {
  if (length < 16 || ascii(bytes, start, 4) !== "exif") return 0;
  const tiff = start + 6;
  const little = bytes[tiff] === 0x49 && bytes[tiff + 1] === 0x49;
  const big = bytes[tiff] === 0x4d && bytes[tiff + 1] === 0x4d;
  if (!little && !big) return 0;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const end = Math.min(bytes.length, start + length);
  const u16 = (pos) => (pos + 2 <= end ? view.getUint16(pos, little) : 0);
  const u32 = (pos) => (pos + 4 <= end ? view.getUint32(pos, little) : 0);
  if (u16(tiff + 2) !== 42) return 0;
  let ifd = tiff + u32(tiff + 4);
  if (ifd + 2 > end) return 0;
  const count = u16(ifd);
  ifd += 2;
  for (let i = 0; i < count; i++) {
    const entry = ifd + i * 12;
    if (entry + 12 > end) break;
    if (u16(entry) !== 0x0112) continue;
    const value = u16(entry + 8);
    return value >= 1 && value <= 8 ? value : 1;
  }
  return 0;
}

function isSof(marker) {
  return (
    (marker >= 0xc0 && marker <= 0xc3) ||
    (marker >= 0xc5 && marker <= 0xc7) ||
    (marker >= 0xc9 && marker <= 0xcb) ||
    (marker >= 0xcd && marker <= 0xcf)
  );
}

function readJpegInfo(bytes) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let offset = 2;
  let orientation = 1;
  let width = 0;
  let height = 0;
  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) break;
    while (offset < bytes.length && bytes[offset] === 0xff) offset++;
    if (offset >= bytes.length) break;
    const marker = bytes[offset++];
    if (marker === 0xd9 || marker === 0xda) break;
    if (marker === 0x00 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 2 > bytes.length) break;
    const length = (bytes[offset] << 8) | bytes[offset + 1];
    if (length < 2) break;
    const content = offset + 2;
    const segmentEnd = offset + length;
    if (marker === 0xe1) {
      const found = readExifOrientation(bytes, content, Math.min(segmentEnd, bytes.length) - content);
      if (found) orientation = found;
    }
    if (isSof(marker) && content + 5 < bytes.length) {
      height = (bytes[content + 1] << 8) | bytes[content + 2];
      width = (bytes[content + 3] << 8) | bytes[content + 4];
    }
    if (segmentEnd > bytes.length) break;
    offset = segmentEnd;
  }
  return { orientation, width, height };
}

async function jpegInfo(file) {
  try {
    const bytes = new Uint8Array(await file.slice(0, 256 * 1024).arrayBuffer());
    return readJpegInfo(bytes);
  } catch {
    return null;
  }
}

function swapsAxes(orientation) {
  return orientation >= 5 && orientation <= 8;
}

function scaledSize(width, height) {
  const longest = Math.max(width, height) || 1;
  const scale = longest > MAX_EDGE ? MAX_EDGE / longest : 1;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function exifApp1(orientation) {
  const body = new Uint8Array([
    0x45, 0x78, 0x69, 0x66, 0x00, 0x00,
    0x49, 0x49, 0x2a, 0x00,
    0x08, 0x00, 0x00, 0x00,
    0x01, 0x00,
    0x12, 0x01,
    0x03, 0x00,
    0x01, 0x00, 0x00, 0x00,
    orientation, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
  ]);
  const segment = new Uint8Array(4 + body.length);
  segment[0] = 0xff;
  segment[1] = 0xe1;
  segment[2] = 0x00;
  segment[3] = body.length + 2;
  segment.set(body, 4);
  return segment;
}

async function probeJpeg() {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(0, 0, 1, 1);
  ctx.fillStyle = "#00ff00";
  ctx.fillRect(1, 0, 1, 1);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
  if (!blob) return null;
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const exif = exifApp1(6);
  const out = new Uint8Array(bytes.length + exif.length);
  out.set(bytes.subarray(0, 2), 0);
  out.set(exif, 2);
  out.set(bytes.subarray(2), 2 + exif.length);
  return new Blob([out], { type: "image/jpeg" });
}

async function detectOrientationSupport() {
  if (typeof createImageBitmap !== "function") return false;
  try {
    const blob = await probeJpeg();
    if (!blob) return false;
    const bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" });
    const honors = bitmap.height > bitmap.width;
    if (typeof bitmap.close === "function") bitmap.close();
    return honors;
  } catch {
    return false;
  }
}

function browserHonorsOrientation() {
  if (!orientationSupport) {
    orientationSupport = detectOrientationSupport().catch(() => false);
  }
  return orientationSupport;
}

function decodeWithImage(source) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(source);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode"));
    };
    img.src = url;
  });
}

async function decodeBitmap(source, options) {
  if (typeof createImageBitmap === "function") {
    if (options) {
      try {
        return await createImageBitmap(source, options);
      } catch {
        /* Resize or orientation options are unsupported, or the image is not decodable. */
      }
      if (options.imageOrientation) {
        try {
          return await createImageBitmap(source, { imageOrientation: options.imageOrientation });
        } catch {
          /* Try a bare decode next. */
        }
      }
    }
    try {
      return await createImageBitmap(source);
    } catch {
      /* Fall through to an image element. */
    }
  }
  return decodeWithImage(source);
}

function drawOriented(ctx, source, orientation, destWidth, destHeight) {
  switch (orientation) {
    case 2:
      ctx.translate(destWidth, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(source, 0, 0, destWidth, destHeight);
      break;
    case 3:
      ctx.translate(destWidth, destHeight);
      ctx.rotate(Math.PI);
      ctx.drawImage(source, 0, 0, destWidth, destHeight);
      break;
    case 4:
      ctx.translate(0, destHeight);
      ctx.scale(1, -1);
      ctx.drawImage(source, 0, 0, destWidth, destHeight);
      break;
    case 5:
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      ctx.drawImage(source, 0, 0, destHeight, destWidth);
      break;
    case 6:
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(0, -destHeight);
      ctx.drawImage(source, 0, 0, destHeight, destWidth);
      break;
    case 7:
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(destWidth, -destHeight);
      ctx.scale(-1, 1);
      ctx.drawImage(source, 0, 0, destHeight, destWidth);
      break;
    case 8:
      ctx.rotate(-0.5 * Math.PI);
      ctx.translate(-destWidth, 0);
      ctx.drawImage(source, 0, 0, destHeight, destWidth);
      break;
    default:
      ctx.drawImage(source, 0, 0, destWidth, destHeight);
  }
}

async function bitmapToJpeg(source, name, orientation, applyOrientation) {
  const srcW = source.width || 1;
  const srcH = source.height || 1;
  const swapped = applyOrientation && swapsAxes(orientation);
  const orientedW = swapped ? srcH : srcW;
  const orientedH = swapped ? srcW : srcH;
  const fitted = scaledSize(orientedW, orientedH);
  const canvas = document.createElement("canvas");
  canvas.width = fitted.width;
  canvas.height = fitted.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, fitted.width, fitted.height);
  ctx.save();
  if (applyOrientation && orientation > 1) {
    drawOriented(ctx, source, orientation, fitted.width, fitted.height);
  } else {
    ctx.drawImage(source, 0, 0, fitted.width, fitted.height);
  }
  ctx.restore();
  if (typeof source.close === "function") source.close();
  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
  });
  if (!blob) return null;
  return new File([blob], jpegName(name), { type: "image/jpeg" });
}

async function heicFallbackKind(file) {
  const type = file.type || "";
  if (type === "image/heic" || type === "image/heif") return "heic";
  if (HEIC_EXT.test(file.name || "")) return "heic";
  if (!isUntyped(type) || IMAGE_EXT.test(file.name || "")) return null;
  try {
    return sniffKind(await readHeader(file));
  } catch {
    return null;
  }
}

async function decodeHeic(file) {
  const mod = await import("libheif-js/wasm-bundle");
  const exported = mod.default ?? mod;
  const libheif = exported.HeifDecoder ? exported : exported.default;
  if (!libheif?.HeifDecoder) return null;
  const images = new libheif.HeifDecoder().decode(new Uint8Array(await file.arrayBuffer()));
  const image = images && images[0];
  if (!image) return null;
  const width = image.get_width();
  const height = image.get_height();
  if (!width || !height) return null;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const imageData = ctx.createImageData(width, height);
  await new Promise((resolve, reject) => {
    image.display(imageData, (displayData) => {
      if (!displayData) {
        reject(new Error("heif"));
        return;
      }
      resolve();
    });
  });
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export async function isEstimateImage(file) {
  if (!file || file.size <= 0) return false;
  const type = file.type || "";
  if (type.startsWith("image/")) return true;
  if (!isUntyped(type)) return false;
  if (IMAGE_EXT.test(file.name || "")) return true;
  try {
    return sniffKind(await readHeader(file)) != null;
  } catch {
    return false;
  }
}

export async function prepareEstimatePhoto(file) {
  try {
    const info = await jpegInfo(file);
    const orientation = info?.orientation || 1;
    const honors = await browserHonorsOrientation();
    const manual = !honors && orientation > 1;
    const options = { imageOrientation: honors ? "from-image" : "none" };
    if (info?.width && info?.height) {
      const displayedW = honors && swapsAxes(orientation) ? info.height : info.width;
      const displayedH = honors && swapsAxes(orientation) ? info.width : info.height;
      const size = scaledSize(displayedW, displayedH);
      if (Math.max(size.width, size.height) < Math.max(info.width, info.height)) {
        options.resizeWidth = size.width;
        options.resizeHeight = size.height;
      }
    }
    const decoded = await decodeBitmap(file, options);
    return await bitmapToJpeg(decoded, file.name, orientation, manual);
  } catch {
    /* Native decode failed. HEIC may still be recoverable. */
  }
  try {
    if ((await heicFallbackKind(file)) !== "heic") return null;
    const canvas = await decodeHeic(file);
    if (!canvas) return null;
    return await bitmapToJpeg(canvas, file.name, 1, false);
  } catch {
    return null;
  }
}
