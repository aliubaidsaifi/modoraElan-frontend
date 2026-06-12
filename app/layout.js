import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
      <body className="font-[family-name:var(--font-body)] min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
