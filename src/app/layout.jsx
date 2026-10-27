import { Manrope, Montserrat } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { SiteEffects } from "@/components/site/SiteEffects";

import "../styles/site.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://pdr-aces.vercel.app"
  ),
  title: {
    default: "PDR Aces Academy | Paintless Dent Repair Training",
    template: "%s",
  },
  description:
    "Hands-on paintless dent repair training in Denver, Colorado. Learn PDR in 2 months.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    siteName: "PDR Aces Academy",
    images: [
      {
        url: "/assets/hero-banner.jpg",
        width: 1670,
        height: 844,
        alt: "PDR Aces Academy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`no-js ${manrope.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
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
      <body>
        {/* --- Google Tag Manager (noscript) --- */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MT9G4D49"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <Script id="js-flag" strategy="beforeInteractive">
          {`document.documentElement.classList.replace("no-js","js")`}
        </Script>
        <Header />
        {children}
        <Footer />
        <SiteEffects />
      </body>
    </html>
  );
}
