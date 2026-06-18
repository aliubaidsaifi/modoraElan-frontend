import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";

const display = Cormorant_Garamond({
  subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-display",
});
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });

export const metadata = {
  title: { default: "Modora — Modest Wear", template: "%s | Modora" },
  description: "Thoughtfully crafted abayas and modest fashion, made in Delhi.",
  openGraph: { title: "Modora", type: "website" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
     <body>
  <SiteChrome>{children}</SiteChrome>
</body>
    </html>
  );
}
