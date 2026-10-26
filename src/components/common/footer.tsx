import React from "react";
import Link from "next/link";
import Container from "@/components/common/container";
import { ArrowRight, Heart } from "lucide-react";

// const footerLinks = {
//   products: [
//     { name: "Short Links", href: "#shortlink" },
//     { name: "Dynamic QR Codes", href: "#qr" },
//     { name: "Pixel Retargeting", href: "#pixels" },
//     { name: "Custom Domains", href: "#domains" },
//     { name: "Real-time Analytics", href: "#analytics" },
//     // { name: "Developer API", href: "#api" },
//   ],
//   useCases: [
//     { name: "For Marketers", href: "#marketers" },
//     { name: "For Creators", href: "#creators" },
//     { name: "For E-Commerce", href: "#ecommerce" },
//     { name: "For Growth Agencies", href: "#agencies" },
//     { name: "For Developers", href: "#developers" },
//   ],
//   // resources: [
//   //   { name: "Documentation", href: "#docs" },
//   //   { name: "Pixel Setup Guide", href: "#guide" },
//   //   { name: "UTM Builder", href: "#utm" },
//   //   { name: "Blog & Insights", href: "#blog" },
//   //   { name: "Changelog", href: "#changelog" },
//   //   { name: "System Status", href: "#status" },
//   // ],
//   company: [
//     { name: "About clipath", href: "#about" },
//     { name: "Customer Stories", href: "#customers" },
//     { name: "Careers", href: "#careers" },
//     { name: "Contact Us", href: "#contact" },
//     { name: "Brand Assets", href: "#brand" },
//   ],
//   legal: [
//     { name: "Terms of Service", href: "#terms" },
//     { name: "Privacy Policy", href: "#privacy" },
//     { name: "Cookie Policy", href: "#cookies" },
//     { name: "Security & GDPR", href: "#security" },
//     { name: "Compliance", href: "#compliance" },
//   ],
// };

const Footer = () => {
  return (
    <footer className="relative w-full pt-16 sm:pt-20 pb-0 overflow-hidden bg-[#FBF9F4] dark:bg-[#0C0D0C] text-stone-900 dark:text-stone-100 transition-colors">
      <Container>
        {/* 1. Sub Footer Bar (Forced Single Row on all devices) */}
        <div className="pt-4 px-4 pb-6 flex flex-row items-center justify-between gap-2 text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 whitespace-nowrap">
          {/* Left Copyright */}
          <div className="truncate">
            <span>© 2026 clipath. All rights reserved.</span>
          </div>

          {/* Right Author / Made With Tag */}
          <div className="flex items-center shrink-0">
            <span className="inline-flex items-center">
              Built with{" "}
              <Heart className="fill-red-500 text-red-500 size-3 mx-1 inline" />{" "}
              by
              <Link href="https://x.com/_PrathamGambhir" target="_blank" className="font-medium text-stone-700 dark:text-stone-300 ml-1 underline">
                Pratham Gambhir
              </Link>
            </span>
          </div>
        </div>

        {/* 2. Full-width Separator Line */}
        <div className="w-full h-[1px] bg-stone-200/80 dark:bg-stone-800/80" />
      </Container>

      {/* 3. Giant subtle watermark brand text across the bottom with ambient glow */}
      <div className="relative w-full overflow-hidden select-none pointer-events-none my-8 text-center leading-none">
        {/* Ambient Glow Gradient Blob positioned right behind the watermark text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[60vw] h-[15vw] rounded-full bg-gradient-to-r from-[#D8F85D]/20 via-emerald-400/15 to-cyan-400/20 dark:from-[#D8F85D]/15 dark:via-emerald-500/10 dark:to-teal-500/15 blur-[80px] -z-10" />
        </div>

        {/* Watermark Text */}
        <span className="block text-[28vw] sm:text-[18vw] lg:text-[16vw] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-stone-900/[0.07] via-stone-900/[0.06] to-transparent dark:from-white/[0.08] dark:via-white/[0.06] dark:to-transparent leading-none select-none">
          clipath
        </span>
      </div>
    </footer>
  );
};

export default Footer;

{
  /* 5 Column Navigation Grid */
}
{
  /* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-8 sm:gap-10 pb-12 sm:pb-16"> */
}
{
  /* Products */
}
{
  /* <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-4 sm:mb-5">
              Products
            </h3>
            <ul className="space-y-2.5 sm:space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */
}

{
  /* Use Cases */
}
{
  /* <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-4 sm:mb-5">
              Use Cases
            </h3>
            <ul className="space-y-2.5 sm:space-y-3">
              {footerLinks.useCases.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */
}

{
  /* Resources */
}
{
  /* <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-4 sm:mb-5">
              Resources
            </h3>
            <ul className="space-y-2.5 sm:space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */
}

{
  /* Company */
}
{
  /* <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-4 sm:mb-5">
              Company
            </h3>
            <ul className="space-y-2.5 sm:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */
}

{
  /* Legal */
}
{
  /* <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-4 sm:mb-5">
              Legal
            </h3>
            <ul className="space-y-2.5 sm:space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */
}
{
  /* </div> */
}
