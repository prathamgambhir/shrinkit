"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Copy,
  Check,
  Sparkles,
  Link as LinkIcon,
  QrCode,
  TrendingUp,
  Download,
  Share2,
  SlidersHorizontal,
} from "lucide-react";
import {
  springTransition,
  fadeInUp,
  staggerContainer,
} from "@/components/common/motion-style";

interface FormData {
  url: string;
  customText: string;
}

// Crisp Vector QR Code generator component based on text
const QRCodeDisplay = ({ text }: { text: string }) => {
  // Deterministic pattern generator based on hash
  const generateMatrix = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }

    const size = 21; // standard version 1 QR size
    const matrix: boolean[][] = Array(size)
      .fill(false)
      .map(() => Array(size).fill(false));

    // Place 3 Finder Patterns (7x7)
    const placeFinder = (startRow: number, startCol: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          matrix[startRow + r][startCol + c] = isBorder || isInner;
        }
      }
    };

    placeFinder(0, 0); // top-left
    placeFinder(0, size - 7); // top-right
    placeFinder(size - 7, 0); // bottom-left

    // Fill pseudo-data dots
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const inTL = r < 8 && c < 8;
        const inTR = r < 8 && c >= size - 8;
        const inBL = r >= size - 8 && c < 8;
        if (!inTL && !inTR && !inBL) {
          const val = Math.sin(hash * (r * size + c) + r + c);
          matrix[r][c] = val > 0.05;
        }
      }
    }

    return matrix;
  };

  const matrix = generateMatrix(text || "shrink.it");
  const size = 21;

  return (
    <div className="relative p-3 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col items-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-28 h-28 sm:w-32 sm:h-32 shape-rendering-crisp"
        fill="currentColor"
      >
        {matrix.map((row, r) =>
          row.map((active, c) =>
            active ? (
              <rect
                key={`${r}-${c}`}
                x={c}
                y={r}
                width="1"
                height="1"
                className="fill-stone-900 dark:fill-stone-100"
              />
            ) : null,
          ),
        )}
      </svg>
    </div>
  );
};

export const Hero = () => {
  const [shortUrl, setShortUrl] = useState("shrink.it/summer26");
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  // const [activePixels, setActivePixels] = useState<string[]>([
  //   "Meta Pixel",
  //   "TikTok",
  // ]);

  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      url: "https://yourstore.com/collections/summer-sale-2026",
      customText: "summer26",
    },
  });

  const customTextValue = watch("customText");

  // const togglePixel = (pixel: string) => {
  //   if (activePixels.includes(pixel)) {
  //     setActivePixels(activePixels.filter((p) => p !== pixel));
  //   } else {
  //     setActivePixels([...activePixels, pixel]);
  //   }
  // };

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(`https://${shortUrl}`);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmitShorten = (data: FormData) => {
    setIsProcessing(true);
    setTimeout(() => {
      const alias = data.customText.trim()
        ? data.customText.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase()
        : "link";
      setShortUrl(`shrink.it/${alias}`);
      setIsProcessing(false);
    }, 350);
  };

  const onGenerateQR = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const alias = customTextValue?.trim()
        ? customTextValue.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase()
        : "link";
      setShortUrl(`shrink.it/${alias}`);
      setShowQR(true);
      setIsProcessing(false);
    }, 350);
  };

  // const chartBars = [
  //   { day: "Mon", height: "35%", active: false, clicks: "320" },
  //   { day: "Tue", height: "42%", active: false, clicks: "410" },
  //   { day: "Wed", height: "38%", active: false, clicks: "385" },
  //   { day: "Thu", height: "55%", active: false, clicks: "620" },
  //   { day: "Fri", height: "48%", active: false, clicks: "540" },
  //   { day: "Sat", height: "85%", active: true, clicks: "1,180" },
  //   { day: "Sun", height: "96%", active: true, clicks: "1,366" },
  // ];

  return (
    <section
      id="shortlink"
      className="relative overflow-hidden py-10 sm:py-16 lg:py-26"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 right-10 h-96 w-96 rounded-full bg-[#D8F85D]/25 dark:bg-[#D8F85D]/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.05, 1, 1.05],
            opacity: [0.15, 0.2, 0.15],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 -left-20 h-80 w-80 rounded-full bg-amber-200/20 dark:bg-amber-500/5 blur-3xl"
        />
      </div>

      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Hero Copy */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.1, 0.05)}
            className="lg:col-span-6 flex flex-col items-start space-y-6 sm:space-y-8"
          >
            {/* Top Pill Badge */}
            <motion.div variants={fadeInUp} className="inline-block">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111C08] dark:bg-[#182310] border border-[#233512] dark:border-[#2f4618] text-[#D8F85D] text-[11px] sm:text-xs font-semibold tracking-wider uppercase shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D8F85D] animate-pulse" />
                <span>100% FREE LINK SHORTENER & DYNAMIC QR</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-[3.65rem] font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-[1.12]"
            >
              Every link you share is a{" "}
              <span className="italic font-semibold text-[#DE5630] dark:text-[#F87149] decoration-[#DE5630]/30">
                missed ad placement.
              </span>
            </motion.h1>

            {/* Subtitle / Description */}
            {/* <motion.p
              variants={fadeInUp}
              className="text-stone-600 dark:text-stone-300 text-base sm:text-lg leading-relaxed max-w-xl"
            >
              ShrinkIt turns every long link into a branded short URL with your
              custom text and an instant dynamic vector QR code. Attach
              retargeting pixels and prepare to track real-time analytics.
              Completely free, forever.
            </motion.p> */}

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center gap-4 pt-1 sm:pt-2"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={springTransition}
              >
                <Link
                  href="#shortlink"
                  className="group inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#111C08] text-white hover:bg-[#1c2c10] dark:bg-[#D8F85D] dark:text-[#111C08] dark:hover:bg-[#cbef46] text-sm sm:text-base font-semibold shadow-md transition-all cursor-pointer"
                >
                  <span>Start Shortening Free</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springTransition}
              >
                <button
                  type="button"
                  onClick={onGenerateQR}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white dark:bg-[#1A1C18] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm sm:text-base font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-[#DE5630] dark:text-[#D8F85D]" />
                  <span>Generate QR Code</span>
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </motion.div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-3 pt-2 sm:pt-4"
            >
              <div className="flex -space-x-2">
                {[
                  {
                    label: "JR",
                    bg: "bg-stone-300 text-stone-800 dark:bg-stone-700 dark:text-stone-200",
                  },
                  {
                    label: "SK",
                    bg: "bg-stone-200 text-stone-700 dark:bg-stone-600 dark:text-stone-100",
                  },
                  {
                    label: "AM",
                    bg: "bg-stone-300 text-stone-900 dark:bg-stone-800 dark:text-stone-200",
                  },
                  {
                    label: "PL",
                    bg: "bg-stone-200 text-stone-800 dark:bg-stone-700 dark:text-stone-100",
                  },
                ].map((user, idx) => (
                  <div
                    key={idx}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#FBF9F4] dark:border-[#0C0D0C] ${user.bg} shadow-xs select-none`}
                  >
                    {user.label}
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium leading-snug">
                100% Free • No credit card needed
                <br />
                Over 50,000+ links shrunk & tracked
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column: Interactive Generator & Analytics Preview */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:col-span-6 flex flex-col space-y-5 sm:space-y-6"
          >
            {/* Top Card: Shortener & QR Generator with Custom Text */}
            <div className="rounded-3xl bg-white/95 dark:bg-[#141513]/95 border border-dashed border-stone-300 dark:border-stone-800 p-5 sm:p-7 shadow-xl shadow-stone-200/40 dark:shadow-none backdrop-blur-sm transition-colors">
              <div className="text-[11px] sm:text-xs font-semibold tracking-wider text-stone-400 dark:text-stone-500 uppercase mb-3 sm:mb-4 flex items-center justify-between">
                <span>CREATE SHORT LINK & DYNAMIC QR</span>
                <span className="flex items-center gap-1 text-[10px] text-stone-400 dark:text-stone-500 lowercase font-mono">
                  <Sparkles className="w-3 h-3 text-[#D8F85D]" /> free tool
                </span>
              </div>

              {/* Form with React Hook Form */}
              <form
                onSubmit={handleSubmit(onSubmitShorten)}
                className="space-y-3.5"
              >
                {/* Destination URL Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                    Paste your long URL:
                  </label>
                  <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-2xl bg-stone-100/90 dark:bg-[#1C1D1B] border border-stone-200 dark:border-stone-800 transition-colors">
                    <div className="pl-2 text-stone-400">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <input
                      {...register("url", { required: true })}
                      placeholder="https://example.com/very-long-product-url..."
                      className="w-full bg-transparent text-xs sm:text-sm text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none font-mono truncate"
                    />
                  </div>
                </div>

                {/* Custom Text / Alias Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 flex items-center justify-between">
                    <span>Customize your link alias (optional):</span>
                    <span className="text-[10px] text-[#DE5630] dark:text-[#D8F85D] font-mono">
                      custom back-half
                    </span>
                  </label>
                  <div className="flex items-center rounded-2xl bg-stone-100/90 dark:bg-[#1C1D1B] border border-stone-200 dark:border-stone-800 overflow-hidden">
                    <span className="pl-3 pr-1 text-xs font-mono font-semibold text-stone-400 dark:text-stone-500 select-none">
                      shrink.it/
                    </span>
                    <input
                      {...register("customText")}
                      placeholder="custom-text"
                      className="w-full py-2 sm:py-2.5 pr-3 bg-transparent text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Action Buttons: Generate QR + Shorten Link */}
                <div className="flex items-center gap-2 pt-1">
                  <motion.button
                    type="button"
                    onClick={onGenerateQR}
                    disabled={isProcessing}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2 sm:py-2.5 px-4 rounded-xl bg-white dark:bg-[#1C1D1B] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs sm:text-sm font-semibold hover:bg-stone-50 dark:hover:bg-stone-800 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-[#DE5630] dark:text-[#D8F85D]" />
                    <span>Generate QR</span>
                  </motion.button>

                  <motion.button
                    type="submit"
                    disabled={isProcessing}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2 sm:py-2.5 px-4 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs sm:text-sm font-semibold hover:bg-black dark:hover:bg-white transition-opacity flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? "Shrinking..." : "Shorten Link"}
                  </motion.button>
                </div>

                {/* Result Box */}
                <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-2xl bg-stone-50 dark:bg-[#181A16] border-2 border-[#D8F85D] dark:border-[#C4ED37] transition-all">
                  <div className="flex items-center gap-2 pl-2 overflow-hidden">
                    <span className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 font-mono truncate">
                      {shortUrl}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowQR(!showQR)}
                      className="p-1.5 sm:p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800 text-xs transition-colors cursor-pointer"
                      title="Toggle QR Code"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#D8F85D] text-[#111C08] hover:bg-[#c9ee40] text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* QR Code Animated Reveal */}
                <AnimatePresence>
                  {showQR && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 rounded-2xl bg-stone-100/90 dark:bg-[#181916] border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <QRCodeDisplay text={shortUrl} />
                        <div className="flex-1 space-y-2 text-center sm:text-left">
                          <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                            Dynamic Vector QR Ready
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400">
                            Permanent high-res QR code pointing to{" "}
                            <span className="font-mono text-stone-800 dark:text-stone-200 font-semibold">
                              {shortUrl}
                            </span>
                          </div>
                          <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                            <button
                              type="button"
                              onClick={handleCopy}
                              className="px-3 py-1 text-xs font-semibold rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copy Link</span>
                            </button>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              • Scannable
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              {/* Pixel Tags Pills */}
              {/* <div className="flex flex-wrap items-center gap-2 pt-4">
                {[
                  { name: "Meta Pixel", dotColor: "bg-[#1877F2]" },
                  { name: "TikTok", dotColor: "bg-black dark:bg-white" },
                  { name: "Pinterest", dotColor: "bg-[#E60023]" },
                ].map((pixel) => {
                  const isActive = activePixels.includes(pixel.name);
                  return (
                    <button
                      key={pixel.name}
                      type="button"
                      onClick={() => togglePixel(pixel.name)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                        isActive
                          ? "bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200"
                          : "bg-transparent border-dashed border-stone-300 dark:border-stone-800 text-stone-400 dark:text-stone-500 opacity-60"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${pixel.dotColor}`}
                      />
                      <span>{pixel.name}</span>
                    </button>
                  );
                })}
              </div> */}
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


            // {/* Bottom Card: LINK PERFORMANCE & MARKETING ANALYTICS */}
            // <div
            //   id="analytics"
            //   className="rounded-3xl bg-white/95 dark:bg-[#141513]/95 border border-dashed border-stone-300 dark:border-stone-800 p-5 sm:p-7 shadow-xl shadow-stone-200/40 dark:shadow-none backdrop-blur-sm transition-colors"
            // >
            //   <div className="text-[11px] sm:text-xs font-semibold tracking-wider text-stone-400 dark:text-stone-500 uppercase mb-4 sm:mb-5 flex items-center justify-between">
            //     <span>REAL-TIME ANALYTICS · LIVE TRACKING</span>
            //     <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            //       <TrendingUp className="w-3.5 h-3.5" /> +142% this week
            //     </span>
            //   </div>

            //   {/* 3 Metric Columns */}
            //   <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-5 sm:mb-6">
            //     <div className="p-3 sm:p-4 rounded-2xl bg-stone-100/70 dark:bg-[#1C1D1B] text-center border border-stone-200/50 dark:border-stone-800/50">
            //       <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 dark:text-stone-100 font-sans">
            //         4,821
            //       </div>
            //       <div className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
            //         Total clicks
            //       </div>
            //     </div>

            //     <div className="p-3 sm:p-4 rounded-2xl bg-stone-100/70 dark:bg-[#1C1D1B] text-center border border-stone-200/50 dark:border-stone-800/50">
            //       <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 dark:text-stone-100 font-sans">
            //         68%
            //       </div>
            //       <div className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
            //         Mobile share
            //       </div>
            //     </div>

            //     <div className="p-3 sm:p-4 rounded-2xl bg-stone-100/70 dark:bg-[#1C1D1B] text-center border border-stone-200/50 dark:border-stone-800/50">
            //       <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 dark:text-stone-100 font-sans">
            //         12
            //       </div>
            //       <div className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
            //         Countries
            //       </div>
            //     </div>
            //   </div>

            //   {/* Mini Interactive Bar Chart */}
            //   <div className="space-y-2">
            //     <div className="h-16 sm:h-20 flex items-end justify-between gap-1.5 sm:gap-2 pt-2">
            //       {chartBars.map((bar, index) => (
            //         <div
            //           key={index}
            //           className="group/bar relative flex-1 h-full flex flex-col justify-end items-center cursor-pointer"
            //         >
            //           {/* Tooltip */}
            //           <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity absolute -top-7 text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 pointer-events-none whitespace-nowrap z-10 shadow-xs">
            //             {bar.clicks}
            //           </div>

            //           <div
            //             style={{ height: bar.height }}
            //             className={`w-full rounded-md sm:rounded-lg transition-all duration-300 group-hover/bar:brightness-110 ${
            //               bar.active
            //                 ? "bg-[#D8F85D] dark:bg-[#D8F85D]"
            //                 : "bg-stone-200 dark:bg-stone-800"
            //             }`}
            //           />
            //         </div>
            //       ))}
            //     </div>

            //     <div className="flex justify-between text-[10px] font-mono text-stone-400 dark:text-stone-500 px-0.5">
            //       {chartBars.map((b) => (
            //         <span key={b.day}>{b.day}</span>
            //       ))}
            //     </div>
            //   </div>
            // </div>