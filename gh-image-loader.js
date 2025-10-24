export default function ghLoader({ src }) {
  const prefix = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${prefix}${src.startsWith("/") ? src : `/${src}`}`;
}
