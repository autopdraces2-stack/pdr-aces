import { Poppins } from "next/font/google";
import { Footer, Header } from "@/components";
import { Background } from "@/ui";
import Script from "next/script";

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
  metadataBase: new URL("https://pdr-aces.vercel.app"),
  title: "PDRACES",
  description: "Paintless Dent Repair Specialists",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "PDRACES",
    description: "Paintless Dent Repair Specialists",
    siteName: "PDRACES",
    images: [
      { url: "/pdr-course-logo.jpg", width: 400, height: 400, alt: "PDRACES" },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* --- Google Tag Manager --- */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0], j=d.createElement(s),
                dl=l!='dataLayer'?'&l='+l:'';
                j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MT9G4D49');
            `,
          }}
        />

        {/* --- Google tag (gtag.js) --- */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-YC10QFN7LQ"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YC10QFN7LQ');
            `,
          }}
        />
      </head>

      <body className={poppins.variable}>
        {/* --- Google Tag Manager (noscript) --- */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MT9G4D49"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <Background />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
