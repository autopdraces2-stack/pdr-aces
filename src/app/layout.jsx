import { Poppins } from "next/font/google";
import { Footer, Header } from "@/components";
import { Background } from "@/ui";

import "../styles/variables.css";
import "../styles/reset.css";
import "../styles/globals.css";
import "../styles/paged-scroller.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://pdr-aces.vercel.app"
  ),
  title: "PDRACES",
  description: "Paintless Dent Repair Specialists",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "PDRACES",
    description: "Paintless Dent Repair Specialists",
    siteName: "PDRACES",
    images: [
      {
        url: "/pdr-course-logo.jpg",
        width: 400,
        height: 400,
        alt: "PDRACES - Paintless Dent Repair Specialists",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <Background />
        <Header />

        {children}

        <Footer />
      </body>
    </html>
  );
}
