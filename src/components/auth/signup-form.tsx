"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithSocial, signUpWithEmail } from "@/actions/auth-action";
import { signUpSchema } from "@/schemas/auth-schema";
import useFetch from "@/hooks/use-fetch";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { springTransition } from "@/components/common/motion-style";
import GoogleIcon from "@/components/logos/google";
import XIcon from "@/components/logos/x";

interface SignUpInputs {
  name: string;
  email: string;
  password: string;
}

export default function SignUpForm({
  callbackUrl,
  customAlias,
}: {
  callbackUrl: string;
  customAlias: string | null;
}) {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [activeSocialProvider, setActiveSocialProvider] = useState<
    string | null
  >(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInputs>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // useFetch for Email Registration
  const {
    loading: isSigningUp,
    error: signUpError,
    fn: executeSignUp,
  } = useFetch(signUpWithEmail);

  // useFetch for Social Registration / Sign In
  const {
    loading: isSocialLoading,
    error: socialError,
    fn: executeSocialSignUp,
  } = useFetch(signInWithSocial);

  const onSubmit = async (data: SignUpInputs) => {
    const result = await executeSignUp(data);
    if (result) {
      toast.add({
        title: "Account Created!",
        description: "Welcome to ShrinkIt. Your account is ready.",
        type: "success",
      });
      router.push(callbackUrl);
      router.refresh();
    } else {
      toast.add({
        title: "Sign up failed",
        description:
          signUpError?.message || "Could not create account. Please try again.",
        type: "error",
      });
    }
  };

  const handleSocialSignUp = async (provider: "google" | "twitter") => {
    setActiveSocialProvider(provider);
    const result = await executeSocialSignUp({ provider, callbackUrl });
    if (result?.url) {
      window.location.assign(result.url);
    } else {
      toast.add({
        title: "Social Login Failed",
        description:
          socialError?.message ??
          `Failed to connect with ${provider === "twitter" ? "X" : "Google"}.`,
        type: "error",
      });
    }
  };

  const isBusy = isSigningUp || isSocialLoading;
  const currentError = signUpError?.message || socialError?.message;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#FBF9F4] dark:bg-[#0C0D0C] text-stone-900 dark:text-stone-100 transition-colors selection:bg-[#d9f94d]/40">
      {/* Top ambient lights */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="absolute top-10 w-96 h-96 rounded-full bg-[#D8F85D]/20 dark:bg-[#D8F85D]/10 blur-3xl" />
        <div className="absolute bottom-10 w-80 h-80 rounded-full bg-amber-200/20 dark:bg-amber-500/5 blur-3xl" />
      </div>

      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={springTransition}
        className="w-full max-w-md rounded-3xl bg-white/95 dark:bg-[#141513]/95 border border-dashed border-stone-300 dark:border-stone-800 p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden"
      >
        {/* Subtle top card aura */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-b from-[#D8F85D]/30 to-transparent blur-2xl" />

        {/* Logo */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FFE600] text-black flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
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
            <span className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              ShrinkIt
            </span>
          </Link>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
              Create your account
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Start shortening branded links & generating dynamic QR codes
            </p>
          </div>

          {customAlias && (
            <div className="w-full text-xs bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-200 px-3 py-2 rounded-xl text-center flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                Sign up to claim your custom alias:{" "}
                <strong className="font-mono font-bold">
                  shrink.it/{customAlias}
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {currentError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-2 p-3 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{currentError}</span>
          </motion.div>
        )}

        {/* Social Sign Up Buttons: Google and X */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleSocialSignUp("google")}
            disabled={isBusy}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#1A1C18] hover:bg-stone-100 dark:hover:bg-stone-800/70 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isSocialLoading && activeSocialProvider === "google" ? (
              <Spinner className="w-4 h-4 text-stone-500" />
            ) : (
              <GoogleIcon className="w-4 h-4" />
            )}
            <span>Google</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleSocialSignUp("twitter")}
            disabled={isBusy}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#1A1C18] hover:bg-stone-100 dark:hover:bg-stone-800/70 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isSocialLoading && activeSocialProvider === "twitter" ? (
              <Spinner className="w-4 h-4 text-stone-500" />
            ) : (
              <XIcon className="w-3.5 h-3.5 text-stone-900 dark:text-stone-100" />
            )}
            <span>(Twitter)</span>
          </motion.button>
        </div>

        {/* Or Divider */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="w-full border-t border-stone-200 dark:border-stone-800" />
          <span className="absolute px-3 bg-white dark:bg-[#141513] text-[10px] uppercase tracking-wider text-stone-400 dark:text-stone-500 font-semibold">
            or with email
          </span>
        </div>

        {/* Form with React Hook Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                {...register("name")}
                placeholder="Your Name"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-[#1A1C18] border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D8F85D]/60 dark:focus:ring-[#D8F85D]/40 transition-all"
              />
            </div>
            {errors.name && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* E-mail */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              E-mail Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="email"
                {...register("email")}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-[#1A1C18] border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D8F85D]/60 dark:focus:ring-[#D8F85D]/40 transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Password (min. 8 characters)
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-50 dark:bg-[#1A1C18] border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D8F85D]/60 dark:focus:ring-[#D8F85D]/40 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <motion.button
              type="submit"
              disabled={isBusy}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#111C08] text-[#D8F85D] hover:bg-[#1a2c0c] dark:bg-[#D8F85D] dark:text-[#111C08] dark:hover:bg-[#cbef46] font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSigningUp ? (
                <>
                  <Spinner className="w-4 h-4" />
                  <span>Creating account</span>
                </>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </form>

        {/* Switch to Sign In */}
        <div className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400">
          Already have an account?{" "}
          <Link
            href={`/auth/signin${customAlias ? `?customAlias=${customAlias}&callbackUrl=${callbackUrl}` : callbackUrl !== "/" ? `?callbackUrl=${callbackUrl}` : ""}`}
            className="font-semibold text-stone-900 dark:text-stone-100 hover:underline"
          >
            Sign in
          </Link>
        </div>

        {/* Terms notice */}
        <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800/80 text-center text-[10px] sm:text-[11px] text-stone-400 dark:text-stone-500 leading-tight">
          By proceeding, you agree to our{" "}
          <span className="underline">Terms</span> and acknowledge our{" "}
          <span className="underline">Privacy Policy</span>.
        </div>
      </motion.div>
    </div>
  );
}
