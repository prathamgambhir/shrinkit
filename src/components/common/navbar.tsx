"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import Container from "@/components/common/container";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { signOutUser } from "@/actions/auth-action";
import useFetch from "@/hooks/use-fetch";
import { toast } from "@/components/ui/toast";
import { Menu, X, ArrowRight, LogOut, User } from "lucide-react";
import { springTransition } from "@/components/common/motion-style";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const { data: session } = authClient.useSession();
  const {
    loading: isSigningOut,
    error: signOutError,
    fn: executeSignOut,
  } = useFetch(signOutUser);

  const navLinks = [
    { name: "ShortLink", href: "#shortlink" },
    { name: "QR Code", href: "#qr" },
    // { name: "Analytics", href: "#analytics" },
    { name: "FAQ", href: "#faq" },
  ];

  const handleSignOut = async () => {
    const result = await executeSignOut();
    if (result) {
      window.location.href = new URL("/", window.location.href).toString();
      return;
    }

    toast.add({
      title: "Could not sign out",
      description: signOutError?.message ?? "Please try again.",
      type: "error",
    });
  };

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full pt-3 sm:pt-4 pb-2"
    >
      <Container>
        <div className="relative flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-[#FBF9F4]/90 dark:bg-[#121312]/90 backdrop-blur-md border border-dashed border-stone-300/80 dark:border-stone-800 shadow-xs transition-colors">
          {/* Logo */}
          <Link href="/" className="flex items-center group select-none">
            <motion.div
              whileHover={{ rotate: -8, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={springTransition}
              className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-black shadow-xs"
            >
              {/* <svg
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
              </svg> */}
              <Image
                src="/main-icon.png"
                width={100}
                height={100}
                className="w-full h-full object-cover dark:invert"
                alt="Picture of the author"
              />
            </motion.div>
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
          <nav
            onMouseLeave={() => setHoveredLink(null)}
            className="hidden md:flex items-center gap-1"
          >
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onMouseEnter={() => setHoveredLink(item.name)}
                className="relative px-3.5 py-1.5 text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white rounded-lg transition-colors select-none"
              >
                {hoveredLink === item.name && (
                  <motion.span
                    layoutId="navbar-hover-pill"
                    className="absolute inset-0 rounded-lg bg-stone-200/75 dark:bg-stone-800/80 -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle />

            {session?.user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-800 dark:text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-[#FFE600] text-black flex items-center justify-center text-[10px] font-bold">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="max-w-[100px] truncate">
                    {session.user.name}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 border border-black/15 dark:border-white/15 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </motion.button>
              </div>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/auth/signin"
                    className="px-4 py-1.5 text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 border border-black/20 dark:border-white/20 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer inline-block"
                  >
                    Log In
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/auth/signup"
                    className="px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-[#111C08] text-[#D8F85D] hover:bg-[#1b2b0e] dark:bg-[#D8F85D] dark:text-[#111C08] dark:hover:bg-[#cbf140] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center gap-1.5">
            <ThemeToggle />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg border border-black/20 dark:border-white/20 text-stone-800 dark:text-stone-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Animated Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute left-4 right-4 top-full mt-2 p-4 rounded-2xl bg-white/95 dark:bg-[#151614]/95 backdrop-blur-md border border-dashed border-stone-300 dark:border-stone-800 shadow-xl space-y-3 z-50"
            >
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
                {session?.user ? (
                  <>
                    <div className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>
                        {session.user.name} ({session.user.email})
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        void handleSignOut();
                      }}
                      className="w-full text-center px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      disabled={isSigningOut}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center px-4 py-2 text-sm font-medium text-stone-800 dark:text-stone-200 border border-black/20 dark:border-white/20 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center px-4 py-2 text-sm font-semibold rounded-lg bg-[#111C08] text-[#D8F85D] hover:bg-[#1b2b0e] dark:bg-[#D8F85D] dark:text-[#111C08] transition-colors"
                    >
                      Get Started Free →
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </motion.header>
  );
};

export default Navbar;
