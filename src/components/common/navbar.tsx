"use client";

import React, { useState } from "react";
import Link from "next/link";
import Container from "@/components/common/container";
import { ThemeToggle } from "@/components/common/theme-toggle";
import {
  ChevronDown,
  Menu,
  X,
  Link2,
  QrCode,
  BarChart3,
  ArrowRight,
} from "lucide-react";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navLinks = [
    {
      name: "ShortLink",
      href: "#shortlink",
      subItems: [
        {
          label: "URL Shortener",
          desc: "Shorten links with custom aliases",
          icon: Link2,
        },
        {
          label: "Retargeting Pixels",
          desc: "Attach Meta, TikTok & Google pixels",
          icon: ArrowRight,
        },
      ],
    },
    {
      name: "QR",
      href: "#qr",
      subItems: [
        {
          label: "Dynamic QR Codes",
          desc: "High-resolution vector codes with live tracking",
          icon: QrCode,
        },
      ],
    },
    {
      name: "Analytics",
      href: "#analytics",
      subItems: [
        {
          label: "Real-time Metrics",
          desc: "Clicks, geo-location, referrers and devices",
          icon: BarChart3,
        },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full pt-3 sm:pt-4 pb-2">
      <Container>
        <div className="relative flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-[#FBF9F4]/90 dark:bg-[#121312]/90 backdrop-blur-md border border-dashed border-stone-300/80 dark:border-stone-800 shadow-xs transition-colors">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group select-none">
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FFE600] text-black shadow-xs group-hover:scale-105 transition-transform duration-200">
              {/* Stylized loop/link icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-black"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <div className="flex items-center">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                ShrinkIt
              </span>
              <span className="ml-1.5 -translate-y-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#FFE600] text-black tracking-wide uppercase leading-none shadow-xs">
                beta
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800/60 transition-colors"
                >
                  <span>{item.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180" />
                </button>

                {/* Dropdown Menu */}
                {openDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-1 w-64 p-2 rounded-xl bg-white dark:bg-[#161715] border border-stone-200 dark:border-stone-800 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    {item.subItems.map((sub, idx) => {
                      const Icon = sub.icon;
                      return (
                        <Link
                          key={idx}
                          href={item.href}
                          className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800/80 transition-colors group/item"
                        >
                          <div className="mt-0.5 p-1 rounded-md bg-[#FFE600]/25 dark:bg-[#FFE600]/15 text-stone-900 dark:text-[#FFE600]">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 group-hover/item:text-black dark:group-hover/item:text-white">
                              {sub.label}
                            </div>
                            <div className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                              {sub.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle />

            <Link
              href="/login"
              className="px-4 py-1.5 text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 border border-black/20 dark:border-white/20 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Log In
            </Link>

            <Link
              href="/register"
              className="px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-[#111C08] text-[#D8F85D] hover:bg-[#1b2b0e] dark:bg-[#D8F85D] dark:text-[#111C08] dark:hover:bg-[#cbf140] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>It's Free</span>
              <span className="opacity-80">→</span>
              <span>Try now!</span>
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center gap-1.5">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg border border-black/20 dark:border-white/20 text-stone-800 dark:text-stone-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-4 rounded-2xl bg-white dark:bg-[#151614] border border-dashed border-stone-300 dark:border-stone-800 shadow-lg space-y-3">
            <div className="flex flex-col space-y-1.5">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/80 flex items-center justify-between"
                >
                  <span>{item.name}</span>
                  <span className="text-xs text-stone-400">→</span>
                </Link>
              ))}
            </div>
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 text-sm font-medium text-stone-800 dark:text-stone-200 border border-black/20 dark:border-white/20 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 text-sm font-semibold rounded-lg bg-[#111C08] text-[#D8F85D] hover:bg-[#1b2b0e] dark:bg-[#D8F85D] dark:text-[#111C08] transition-colors"
              >
                It's Free → Try now!
              </Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Navbar;
