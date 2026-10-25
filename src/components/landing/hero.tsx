"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import { authClient } from "@/lib/auth-client";
import { createShortLink, generateQrForLink } from "@/actions/url-action";
import {
  pendingLinkSchema,
  urlFormSchema,
  type PendingLink,
  type UrlFormInput,
  type UrlFormData,
} from "@/schemas/url-schema";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import {
  ArrowRight,
  Copy,
  Check,
  Link as LinkIcon,
  QrCode,
  X,
  Lock,
  UserCheck,
  UnlockIcon,
} from "lucide-react";
import {
  springTransition,
  fadeInUp,
  staggerContainer,
} from "@/components/common/motion-style";

interface CreatedLink {
  id: string;
  longUrl: string;
  slug: string;
  isOwned: boolean;
  shortUrl: string;
  qrCodeUrl: string | null;
}

const pendingLinkStorageKey = "shrinkit:pending-link";

const QRCodeDisplay = ({ dataUrl }: { dataUrl: string }) => {
  return (
    <div className="relative p-3 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col items-center">
      <Image
        src={dataUrl}
        alt="QR code for your short link"
        width={512}
        height={512}
        className="w-28 h-28 sm:w-32 sm:h-32"
      />
    </div>
  );
};

export const Hero = () => {
  const { data: session } = authClient.useSession();

  const [createdLink, setCreatedLink] = useState<CreatedLink | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingOperation, setPendingOperation] = useState<PendingLink | null>(
    null,
  );

  const pendingLinkProcessing = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<UrlFormInput, unknown, UrlFormData>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      url: "",
      customText: "",
    },
  });

  const runLinkCreation = useCallback(
    async (data: UrlFormInput, generateQr: boolean) => {
      setIsProcessing(true);
      try {
        const link = await createShortLink({
          url: data.url,
          customAlias: data.customText.trim() || undefined,
          generateQr,
        });
        setCreatedLink(link);
        setShowQR(Boolean(link.qrCodeUrl));
        setCopied(false);
        toast.add({
          title: generateQr ? "QR code created!" : "Short link created!",
          description: generateQr
            ? "Your QR code has been saved to your account."
            : "Your short link has been saved.",
          type: "success",
        });
        return true;
      } catch (error) {
        toast.add({
          title: "Could not create your link",
          description:
            error instanceof Error ? error.message : "Please try again.",
          type: "error",
        });
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [],
  );

  const runQrGeneration = useCallback(async (link: CreatedLink) => {
    setIsProcessing(true);
    try {
      const qrCodeUrl = await generateQrForLink(link.id);
      setCreatedLink((currentLink) =>
        currentLink?.id === link.id
          ? { ...currentLink, qrCodeUrl }
          : currentLink,
      );
      setShowQR(true);
      toast.add({
        title: "QR code created!",
        description: "Your QR code has been saved to your account.",
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Could not create your QR code",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const requestLinkCreation = (data: UrlFormData, generateQr: boolean) => {
    const operation = { ...data, generateQr };
    if (!session?.user && (data.customText.trim() || generateQr)) {
      setPendingOperation(operation);
      setAuthModalOpen(true);
      return;
    }

    if (generateQr && createdLink && session?.user) {
      let destination: string | null = null;
      try {
        destination = new URL(data.url).toString();
      } catch {
        destination = null;
      }

      const alias = data.customText.trim().toLowerCase();
      const sameAlias = !alias || alias === createdLink.slug;

      if (
        createdLink.isOwned &&
        createdLink.longUrl === destination &&
        sameAlias
      ) {
        if (createdLink.qrCodeUrl) {
          setShowQR(true);
        } else {
          void runQrGeneration(createdLink);
        }
        return;
      }
    }

    void runLinkCreation(data, generateQr);
  };

  useEffect(() => {
    if (!session?.user || pendingLinkProcessing.current) {
      return;
    }

    let storedOperation: string | null;
    try {
      storedOperation = window.sessionStorage.getItem(pendingLinkStorageKey);
    } catch {
      toast.add({
        title: "Could not restore your pending link",
        description: "Please enter the link details again.",
        type: "error",
      });
      return;
    }

    if (!storedOperation) {
      return;
    }

    pendingLinkProcessing.current = true;
    try {
      window.sessionStorage.removeItem(pendingLinkStorageKey);
      const operation: PendingLink = pendingLinkSchema.parse(
        JSON.parse(storedOperation),
      );

      setValue("url", operation.url);
      setValue("customText", operation.customText);
      queueMicrotask(() => {
        void runLinkCreation(operation, operation.generateQr).finally(() => {
          pendingLinkProcessing.current = false;
        });
      });
    } catch (error) {
      pendingLinkProcessing.current = false;
      toast.add({
        title: "Could not restore your pending link",
        description:
          error instanceof Error
            ? error.message
            : "Please enter the link details again.",
        type: "error",
      });
    }
  }, [runLinkCreation, session?.user, setValue]);

  const handleCopy = async () => {
    if (!createdLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(createdLink.shortUrl);
      setCopied(true);
      toast.add({
        title: "Copied!",
        description: "Short link copied to clipboard.",
        type: "success",
      });
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.add({
        title: "Could not copy link",
        description:
          error instanceof Error
            ? error.message
            : "Please copy the link manually.",
        type: "error",
      });
    }
  };

  const onSubmitShorten = handleSubmit((data) =>
    requestLinkCreation(data, false),
  );

  const onGenerateQR = handleSubmit((data) => requestLinkCreation(data, true));

  const handleShortenRandom = () => {
    setAuthModalOpen(false);
    setValue("customText", "");
    void runLinkCreation({ ...getValues(), customText: "" }, false);
  };

  const savePendingOperation = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!pendingOperation) {
      return;
    }

    try {
      window.sessionStorage.setItem(
        pendingLinkStorageKey,
        JSON.stringify(pendingOperation),
      );
      setAuthModalOpen(false);
    } catch (error) {
      event.preventDefault();
      toast.add({
        title: "Could not save your pending link",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    }
  };

  const authUrl = (path: "signin" | "signup") => {
    const params = new URLSearchParams({ callbackUrl: "/" });
    const customAlias = pendingOperation?.customText.trim();
    if (customAlias) {
      params.set("customAlias", customAlias);
    }
    return `/auth/${path}?${params.toString()}`;
  };

  return (
    <section
      id="shortlink"
      className="relative overflow-hidden py-10 sm:py-16 lg:py-20"
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

      <div className="w-full px-2">
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
                  disabled={isProcessing}
                  className="group inline-flex items-center gap-2 px-4 py-3 text-sm sm:text-base font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
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
                <span className="flex items-center gap-2 text-[10px] text-stone-400 dark:text-stone-500 lowercase font-mono">
                  <UnlockIcon className="w-2 h-2 text-[#D8F85D]" /> free tool
                </span>
              </div>

              {/* Form with React Hook Form */}
              <form onSubmit={onSubmitShorten} className="space-y-3.5">
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
                      type="url"
                      {...register("url")}
                      placeholder="https://example.com/very-long-product-url..."
                      className="w-full bg-transparent text-xs sm:text-sm text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none font-mono truncate"
                    />
                  </div>
                  {errors.url && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400">
                      {errors.url.message}
                    </p>
                  )}
                </div>

                {/* Custom Text / Alias Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                      Customize your link alias:
                    </label>
                    <span className="text-[10px] text-[#DE5630] dark:text-[#D8F85D] font-mono flex items-center gap-1">
                      {!session?.user && <Lock className="w-2.5 h-2.5" />}
                      {session?.user
                        ? "custom back-half enabled"
                        : "Sign in required"}
                    </span>
                  </div>
                  <div className="flex items-center rounded-2xl bg-stone-100/90 dark:bg-[#1C1D1B] border border-stone-200 dark:border-stone-800 overflow-hidden">
                    <input
                      {...register("customText")}
                      placeholder="custom-text"
                      className="w-full py-2 px-4 sm:py-2.5 pr-3 bg-transparent text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none font-mono"
                    />
                  </div>
                  {errors.customText && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400">
                      {errors.customText.message}
                    </p>
                  )}
                  {!session?.user && (
                    <p className="text-[10px] text-stone-400 dark:text-stone-500">
                      Leave blank for an anonymous random link. Sign in to use
                      an alias or create a QR code.
                    </p>
                  )}
                </div>

                {/* Action Buttons: Generate QR + Shorten Link */}
                <div className="flex flex-col gap-4 pt-1">
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
                    {isProcessing ? (
                      <>
                        <Spinner className="w-3.5 h-3.5" />
                        <span>Shrinking</span>
                      </>
                    ) : (
                      "Shorten Link"
                    )}
                  </motion.button>
                </div>

                {/* Result Box — only show after generation */}
                {createdLink && (
                  <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-2xl bg-stone-50 dark:bg-[#181A16] border-2 border-[#D8F85D] dark:border-[#C4ED37] transition-all">
                    <div className="flex items-center gap-2 pl-2 overflow-hidden">
                      <span className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 font-mono truncate">
                        {createdLink.shortUrl}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {createdLink.qrCodeUrl ? (
                        <button
                          type="button"
                          onClick={() => setShowQR(!showQR)}
                          className="p-1.5 sm:p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800 text-xs transition-colors cursor-pointer"
                          title="Toggle QR Code"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={onGenerateQR}
                          disabled={isProcessing}
                          className="p-1.5 sm:p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800 text-xs transition-colors cursor-pointer disabled:opacity-50"
                          title="Create and save a QR code"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                      )}

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
                )}

                {/* QR Code Animated Reveal */}
                <AnimatePresence>
                  {showQR && createdLink?.qrCodeUrl && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 rounded-2xl bg-stone-100/90 dark:bg-[#181916] border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <QRCodeDisplay dataUrl={createdLink.qrCodeUrl} />
                        <div className="flex-1 space-y-2 text-center sm:text-left">
                          <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                            Saved QR Code Ready
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400">
                            Permanent high-res QR code pointing to{" "}
                            <span className="font-mono text-stone-800 dark:text-stone-200 font-semibold">
                              {createdLink.shortUrl}
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
            </div>
          </motion.div>
        </div>
      </div>

      {/* Auth Prompt Modal */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuthModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={springTransition}
              className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#141513] border border-dashed border-stone-300 dark:border-stone-800 p-6 sm:p-8 shadow-2xl z-10 space-y-5"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon & Title */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFE600] text-black flex items-center justify-center shadow-xs">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                  {pendingOperation?.generateQr
                    ? "Sign in to create your QR code"
                    : "Claim Your Custom Alias"}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                  {pendingOperation?.generateQr
                    ? "QR codes are created for signed-in users and saved with your account."
                    : "Sign in or create an account to claim your custom alias."}
                  {pendingOperation?.customText.trim() && (
                    <>
                      <br />
                      <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-sm mt-1 inline-block">
                        {pendingOperation.customText.trim()}
                      </span>
                    </>
                  )}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300 leading-snug">
                Your pending link details will be restored after you
                authenticate. Links and QR codes are saved to your account.
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Link
                  href={authUrl("signup")}
                  onClick={savePendingOperation}
                  className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#111C08] text-[#D8F85D] hover:bg-[#1a2c0c] dark:bg-[#D8F85D] dark:text-[#111C08] font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  <span>Create a free account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={authUrl("signin")}
                  onClick={savePendingOperation}
                  className="w-full py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800/60 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  <span>Already have an account? Sign in</span>
                </Link>

                {!pendingOperation?.generateQr && (
                  <button
                    type="button"
                    onClick={handleShortenRandom}
                    className="w-full pt-1 text-center text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors cursor-pointer"
                  >
                    Or shorten with a random link instead (no account needed)
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
