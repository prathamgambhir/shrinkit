"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Copy,
  Check,
  Sparkles,
  Link as LinkIcon,
  QrCode,
  TrendingUp,
  Globe2,
  Smartphone,
  MousePointerClick,
} from "lucide-react";

export const Hero = () => {
  const [urlInput, setUrlInput] = useState(
    "https://yourstore.com/collections/summer-sale-2026",
  );
  const [shortUrl, setShortUrl] = useState("shrink.it/summer26");
  const [copied, setCopied] = useState(false);
  const [isShortening, setIsShortening] = useState(false);
  const [activePixels, setActivePixels] = useState<string[]>([
    "Meta Pixel",
    "TikTok",
    "Pinterest",
  ]);

  const togglePixel = (pixel: string) => {
    if (activePixels.includes(pixel)) {
      setActivePixels(activePixels.filter((p) => p !== pixel));
    } else {
      setActivePixels([...activePixels, pixel]);
    }
  };

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(`https://${shortUrl}`);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;
    setIsShortening(true);
    setTimeout(() => {
      const slug = urlInput.split("/").filter(Boolean).pop() || "promo";
      const cleanSlug = slug
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 10)
        .toLowerCase();
      setShortUrl(`shrink.it/${cleanSlug || "link"}`);
      setIsShortening(false);
    }, 400);
  };

  const chartBars = [
    { day: "Mon", height: "35%", active: false, clicks: "320" },
    { day: "Tue", height: "42%", active: false, clicks: "410" },
    { day: "Wed", height: "38%", active: false, clicks: "385" },
    { day: "Thu", height: "55%", active: false, clicks: "620" },
    { day: "Fri", height: "48%", active: false, clicks: "540" },
    { day: "Sat", height: "85%", active: true, clicks: "1,180" },
    { day: "Sun", height: "96%", active: true, clicks: "1,366" },
  ];

  return (
    <section className="relative overflow-hidden py-10 sm:py-16 lg:py-20">
      {/* Background ambient lighting matching navbar theme */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="absolute -top-32 right-10 h-96 w-96 rounded-full bg-[#D8F85D]/20 dark:bg-[#D8F85D]/10 blur-3xl" />
        <div className="absolute top-1/2 -left-20 h-80 w-80 rounded-full bg-amber-200/20 dark:bg-amber-500/5 blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 h-72 w-72 rounded-full bg-[#DE5630]/10 dark:bg-[#DE5630]/5 blur-3xl" />
      </div>

      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6 sm:space-y-8">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111C08] dark:bg-[#182310] border border-[#233512] dark:border-[#2f4618] text-[#D8F85D] text-[11px] sm:text-xs font-semibold tracking-wider uppercase shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D8F85D] animate-pulse" />
              <span>RETARGETING PIXELS ON EVERY LINK</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.65rem] font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-[1.12]">
              Every link you share is a{" "}
              <span className="italic font-semibold text-[#DE5630] dark:text-[#F87149] decoration-[#DE5630]/30">
                missed ad placement.
              </span>
            </h1>

            {/* Subtitle / Description */}
            <p className="text-stone-600 dark:text-stone-300 text-base sm:text-lg leading-relaxed max-w-xl">
              ShrinkIt turns every short link and QR code into a powerful
              retargeting engine. Attach{" "}
              <strong className="font-semibold text-stone-900 dark:text-stone-100">
                Meta, TikTok, and Pinterest pixels
              </strong>{" "}
              to any destination. Turn outbound traffic into owned retargeting
              audiences.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1 sm:pt-2">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#111C08] text-white hover:bg-[#1c2c10] dark:bg-[#D8F85D] dark:text-[#111C08] dark:hover:bg-[#cbef46] text-sm sm:text-base font-semibold shadow-md transition-all hover:gap-3 cursor-pointer"
              >
                <span>Start free – 7 days</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="#demo"
                className="group inline-flex items-center gap-1.5 px-4 py-3 text-sm sm:text-base font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors cursor-pointer"
              >
                <span>See how it works</span>
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            {/* Social Proof Section */}
            <div className="flex items-center gap-3 pt-2 sm:pt-4">
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
                Most people who try ShrinkIt
                <br />
                become paying customers
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Product Showcase Cards */}
          <div className="lg:col-span-6 flex flex-col space-y-5 sm:space-y-6">
            {/* Top Card: YOUR LINK, SQUEEZED */}
            <div className="rounded-3xl bg-white/95 dark:bg-[#141513]/95 border border-stone-200/80 dark:border-stone-800/80 p-5 sm:p-7 shadow-xl shadow-stone-200/40 dark:shadow-none backdrop-blur-sm transition-colors">
              <div className="text-[11px] sm:text-xs font-semibold tracking-wider text-stone-400 dark:text-stone-500 uppercase mb-3 sm:mb-4 flex items-center justify-between">
                <span>YOUR LINK, SQUEEZED</span>
                <span className="flex items-center gap-1 text-[10px] text-stone-400 dark:text-stone-500 lowercase font-mono">
                  <Sparkles className="w-3 h-3 text-[#D8F85D]" /> live demo
                </span>
              </div>

              {/* Input field with Shorten button */}
              <form onSubmit={handleShorten} className="space-y-3">
                <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-2xl bg-stone-100/90 dark:bg-[#1C1D1B] border border-stone-200 dark:border-stone-800 transition-colors">
                  <div className="pl-2 text-stone-400">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste your long link here..."
                    className="w-full bg-transparent text-xs sm:text-sm text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none font-mono truncate"
                  />
                  <button
                    type="submit"
                    disabled={isShortening}
                    className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs sm:text-sm font-semibold hover:bg-black dark:hover:bg-white transition-opacity shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {isShortening ? "Shrinking..." : "Shorten"}
                  </button>
                </div>

                {/* Squeezed Link Output with Lime Highlight */}
                <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-2xl bg-stone-50 dark:bg-[#181A16] border-2 border-[#D8F85D] dark:border-[#C4ED37] transition-all">
                  <div className="flex items-center gap-2 pl-2 overflow-hidden">
                    <span className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 font-mono truncate">
                      {shortUrl}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#D8F85D] text-[#111C08] hover:bg-[#c9ee40] text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
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
              </form>

              {/* Pixel Tags Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-4">
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
              </div>
            </div>

            {/* Bottom Card: LINK PERFORMANCE · LAST 7 DAYS */}
            <div className="rounded-3xl bg-white/95 dark:bg-[#141513]/95 border border-stone-200/80 dark:border-stone-800/80 p-5 sm:p-7 shadow-xl shadow-stone-200/40 dark:shadow-none backdrop-blur-sm transition-colors">
              <div className="text-[11px] sm:text-xs font-semibold tracking-wider text-stone-400 dark:text-stone-500 uppercase mb-4 sm:mb-5 flex items-center justify-between">
                <span>LINK PERFORMANCE · LAST 7 DAYS</span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" /> +142%
                </span>
              </div>

              {/* 3 Metric Columns */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-5 sm:mb-6">
                <div className="p-3 sm:p-4 rounded-2xl bg-stone-100/70 dark:bg-[#1C1D1B] text-center border border-stone-200/50 dark:border-stone-800/50">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 dark:text-stone-100">
                    4,821
                  </div>
                  <div className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                    Total clicks
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl bg-stone-100/70 dark:bg-[#1C1D1B] text-center border border-stone-200/50 dark:border-stone-800/50">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 dark:text-stone-100">
                    68%
                  </div>
                  <div className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                    Mobile share
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl bg-stone-100/70 dark:bg-[#1C1D1B] text-center border border-stone-200/50 dark:border-stone-800/50">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 dark:text-stone-100">
                    12
                  </div>
                  <div className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                    Countries
                  </div>
                </div>
              </div>

              {/* Mini Interactive Bar Chart */}
              <div className="space-y-2">
                <div className="h-16 sm:h-20 flex items-end justify-between gap-1.5 sm:gap-2 pt-2">
                  {chartBars.map((bar, index) => (
                    <div
                      key={index}
                      className="group/bar relative flex-1 h-full flex flex-col justify-end items-center cursor-pointer"
                    >
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity absolute -top-7 text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 pointer-events-none whitespace-nowrap z-10 shadow-xs">
                        {bar.clicks}
                      </div>

                      <div
                        style={{ height: bar.height }}
                        className={`w-full rounded-md sm:rounded-lg transition-all duration-300 group-hover/bar:brightness-110 ${
                          bar.active
                            ? "bg-[#D8F85D] dark:bg-[#D8F85D]"
                            : "bg-stone-200 dark:bg-stone-800"
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-[10px] font-mono text-stone-400 dark:text-stone-500 px-0.5">
                  {chartBars.map((b) => (
                    <span key={b.day}>{b.day}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
