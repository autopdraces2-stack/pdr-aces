export function isSiteAvailable() {
  return process.env.SITE_AVAILABLE !== "false";
}
