import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import React from "react";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F4] dark:bg-[#0C0D0C] text-stone-900 dark:text-stone-100 transition-colors">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
