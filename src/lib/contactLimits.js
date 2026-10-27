export const MAX_PHOTOS = 5;
export const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

export const PHOTO_TOO_MANY = "You can add up to 5 photos.";
export const PHOTO_TOO_LARGE =
  "Photos are too large. Please keep them under 4 MB total.";
export const PHOTO_TYPE = "Please upload image files only.";
export const PHOTO_PREPARING = "Still preparing photos. Please wait.";
export const CONTACT_REQUIRED = "Enter a phone number or email so we can reach you.";
export const RATE_LIMITED = "Please wait a few minutes and try again.";

export function photoUnreadable(name) {
  const base = String(name || "this photo").split(/[/\\]/).pop() || "this photo";
  return `Couldn't read ${base}. Save it as a JPEG and try again.`;
}

export const ALLOWED_PHOTO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
];
