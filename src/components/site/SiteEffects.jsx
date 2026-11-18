"use client";

import { useLayoutEffect } from "react";
import "intl-tel-input/styles";
import { initSiteEffects } from "@/lib/siteEffects";

export function SiteEffects() {
  useLayoutEffect(() => initSiteEffects(), []);
  return null;
}
