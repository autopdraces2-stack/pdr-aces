"use client";

import { useLayoutEffect } from "react";
import { initSiteEffects } from "@/lib/siteEffects";

export function SiteEffects() {
  useLayoutEffect(() => initSiteEffects(), []);
  return null;
}
