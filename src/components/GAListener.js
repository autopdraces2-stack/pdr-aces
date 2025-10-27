"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GAListener() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const qs = window.location.search;
    const url = pathname + qs;

    window.dataLayer?.push({ event: "pageview", page_path: url });
  }, [pathname]);

  return null;
}
