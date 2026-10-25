import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toast";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShrinkIt - Smart Short Links & Retargeting",
  description:
    "Turn every short link into a retargeting asset with ShrinkIt. QR codes, pixel tracking, and real-time click analytics.",
  icons: {
    icon: "/fav-icon.png",
    sizes: "8x8 16x16 32x32 64x64 128x128 256x256 512x512",
    type: "image/png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.className} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FBF9F4] text-neutral-900 dark:bg-[#0C0D0C] dark:text-neutral-100 transition-colors selection:bg-[#d9f94d]/40 selection:text-neutral-900 dark:selection:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
