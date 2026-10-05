import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import Spotlight from "@/components/Spotlight";
import { site } from "@/site.config";
import "./globals.css";

// Fonts are self-hosted from npm (@fontsource-variable) rather than fetched from
// Google Fonts, so dev and build never depend on reaching fonts.googleapis.com.
// Inter for body and interface text; Fraunces stays as a fallback serif.
// Both "standard" files carry the optical-size axis, so letterforms adapt to size.
const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-standard-normal.woff2",
  weight: "100 900",
  variable: "--font-inter",
});
const fraunces = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-standard-normal.woff2",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-standard-italic.woff2",
      style: "italic",
    },
  ],
  weight: "100 900",
  variable: "--font-fraunces",
});
// Cormorant Garamond matches the lettering of the brand logo; it sets the
// headings and the wordmark.
const cormorant = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-wght-normal.woff2",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-wght-italic.woff2",
      style: "italic",
    },
  ],
  weight: "300 700",
  variable: "--font-cormorant",
});
const jetbrains = localFont({
  src: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · ${site.role}`, template: `%s · ${site.name}` },
  description: site.description,
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
  openGraph: { type: "website", siteName: site.name },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf6ef" },
    { media: "(prefers-color-scheme: dark)", color: "#171311" },
  ],
};

// Runs before first paint: saved choice wins, otherwise follow the OS setting.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

// Also before first paint: turn on entrance and scroll animations unless the
// visitor prefers reduced motion (see ScrollReveal and the [data-motion] styles).
const motionScript = `(function(){try{if(matchMedia("(prefers-reduced-motion: no-preference)").matches)document.documentElement.setAttribute("data-motion","")}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${inter.variable} ${fraunces.variable} ${cormorant.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Spotlight />
        <ScrollReveal />
      </body>
    </html>
  );
}
