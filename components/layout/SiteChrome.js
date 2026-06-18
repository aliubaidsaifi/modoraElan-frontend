"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PromoBar from "../home/PromoBar";
import Newsletter from "../home/Newsletter";

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const hideChrome = pathname?.startsWith("/admin");
  return (
    <>
      {!hideChrome && <PromoBar />}
      {!hideChrome && <Navbar />}
      {children}
      {!hideChrome && <Footer />}
    </>
  );
}