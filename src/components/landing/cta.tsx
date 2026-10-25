"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import Container from "@/components/common/container";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Link2,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import {
  springTransition,
  fadeInUp,
  staggerContainer,
} from "@/components/common/motion-style";

export const CTA = () => {
  const highlights = [
    { icon: Link2, label: "Custom Link Aliases" },
    { icon: QrCode, label: "High-Res QR Codes" },
    // { icon: BarChart3, label: "Real-Time Analytics" },
    { icon: ShieldCheck, label: "100% Free Forever" },
  ];

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer(0.12, 0.1)}
          className="relative rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-14 lg:p-20 overflow-hidden border border-dashed border-stone-300 dark:border-stone-800 bg-gradient-to-b from-white via-stone-50 to-[#F6F4EB] dark:from-[#151713] dark:via-[#111310] dark:to-[#0D0E0C] shadow-2xl text-center"
        >
          {/* Animated Ambient Glow Elements */}
          <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.2, 0.35, 0.2],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-24 w-96 h-96 rounded-full bg-[#D8F85D]/25 dark:bg-[#D8F85D]/15 blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.1, 1, 1.1],
                opacity: [0.15, 0.25, 0.15],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-24 w-96 h-96 rounded-full bg-[#FFE600]/20 dark:bg-[#FFE600]/10 blur-3xl"
            />
          </div>

          <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
            {/* Pill Badge */}
            <motion.div variants={fadeInUp} className="inline-block">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111C08] dark:bg-[#1C2612] border border-[#233512] dark:border-[#2f4618] text-[#D8F85D] text-xs font-semibold tracking-wider uppercase shadow-xs">
                {/* <Sparkles className="w-3.5 h-3.5 text-[#D8F85D]" /> */}
                <span>100% Free Forever • No Subscriptions</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-[1.14]"
            >
              Start Supercharging Every Link & QR Code Today
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-xs sm:text-sm  text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed"
            >
              Create memorable branded short links, generate instant dynamic QR codes,
              and prepare to track real-time click analytics. Completely free for
              creators, marketers, and developers.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={springTransition}
              >
                <Link
                  href="#shortlink"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#111C08] text-[#D8F85D] hover:bg-[#1a2c0c] dark:bg-[#D8F85D] dark:text-[#111C08] dark:hover:bg-[#cbf140] text-sm sm:text-base font-semibold shadow-xl transition-colors cursor-pointer"
                >
                  <span>Shorten a Link Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={springTransition}
              >
                <Link
                  href="#qr"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white dark:bg-[#1A1C18] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm sm:text-base font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-stone-500" />
                  <span>Generate QR Code</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Highlights Grid */}
            <motion.div
              variants={fadeInUp}
              className="grid sm:grid-cols-3 gap-3 pt-6 sm:pt-8 max-w-2xl mx-auto"
            >
              {highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -3 }}
                    transition={springTransition}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800/80 shadow-xs"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#DE5630] dark:text-[#D8F85D]" />
                    <span className="text-xs font-medium text-stone-800 dark:text-stone-200">
                      {item.label}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default CTA;
