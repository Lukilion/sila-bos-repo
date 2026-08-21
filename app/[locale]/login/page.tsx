"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  auth,
  googleProvider,
  githubProvider,
  microsoftProvider,
  signInWithPopup,
} from "@/lib/firebase";
import { loginAction, signUpAction } from "@/actions/auth";
import {
  Mail,
  ShieldCheck,
  Smartphone,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Lock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import confetti from "canvas-confetti";

type AuthMode = "otp" | "social" | "password";

export default function AuthPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "en-US";
  const isUrdu = locale === "ur-PK";

  const [isSignUp, setIsSignUp] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("otp");
  const [selectedRole, setSelectedRole] = useState<string>("seller");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Status & Feedback
  const [pending, setPending] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerSeconds]);

  // Handle individual digit OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.slice(-1);
    setOtpValues(newOtp);

    // Auto-advance cursor
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otpValues];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtpValues(newOtp);
  };

  // 1. Trigger Email OTP Send
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !email.includes("@")) {
      setErrorMessage(isUrdu ? "درست ای میل درج کریں" : "Please enter a valid email address.");
      return;
    }

    if (isSignUp && !fullName.trim()) {
      setErrorMessage(isUrdu ? "براہ کرم اپنا نام درج کریں" : "Please enter your full name.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          purpose: isSignUp ? "signup" : "login",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch verification code.");
      }

      setOtpSent(true);
      setTimerSeconds(60);
      setDevOtpHint(data.devOtp || null);
      setSuccessMessage(
        isUrdu
          ? `6 ہندسوں کا کوڈ ${email} پر بھیج دیا گیا ہے`
          : `6-digit verification code sent to ${email}`
      );
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error sending OTP");
    } finally {
      setPending(false);
    }
  };

  // 2. Verify Email OTP & Complete Login/Signup
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const enteredOtp = otpValues.join("");
    if (enteredOtp.length !== 6) {
      setErrorMessage(isUrdu ? "6 ہندسوں کا کوڈ مکمل درج کریں" : "Please enter the full 6-digit OTP code.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: enteredOtp,
          fullName: isSignUp ? fullName : undefined,
          role: selectedRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed.");
      }

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#15a0fa", "#007BFF", "#10B981"],
      });

      setSuccessMessage(
        isUrdu ? "تصدیق کامیاب! پورٹل میں داخل ہو رہے ہیں..." : "Verified successfully! Redirecting..."
      );

      setTimeout(() => {
        router.push(`/${locale}${data.redirectPath || "/catalog"}`);
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Invalid code. Please try again.");
    } finally {
      setPending(false);
    }
  };

  // 3. Social OAuth Direct Sign In (Google / Microsoft / GitHub)
  const handleSocialLogin = async (providerName: "google" | "microsoft" | "github") => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setSocialLoading(providerName);

    try {
      let provider;
      if (providerName === "google") provider = googleProvider;
      else if (providerName === "microsoft") provider = microsoftProvider;
      else provider = githubProvider;

      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const res = await fetch("/api/auth/oauth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || fullName || null,
          photoURL: user.photoURL,
          provider: providerName,
          role: selectedRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to establish secure session.");
      }

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#15a0fa", "#007BFF", "#8B5CF6"],
      });

      setSuccessMessage(
        isUrdu
          ? `${providerName.toUpperCase()} سے لاگ ان کامیاب!`
          : `Signed in successfully via ${providerName.toUpperCase()}!`
      );

      setTimeout(() => {
        router.push(`/${locale}${data.redirectPath || "/catalog"}`);
        router.refresh();
      }, 800);
    } catch (err: unknown) {
      console.error("OAuth error:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Social authentication was cancelled or failed."
      );
    } finally {
      setSocialLoading(null);
    }
  };

  // 4. Password Fallback Submission
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setPending(true);

    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("role", selectedRole);
    if (isSignUp) formData.append("fullName", fullName);

    const res = isSignUp
      ? await signUpAction(formData, locale)
      : await loginAction(formData, locale);

    if (res?.error) {
      setErrorMessage(res.error);
      setPending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] py-6 px-4">
      <div className="neu-card w-full max-w-lg p-6 sm:p-8 transition-all">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#15a0fa]">
            <Sparkles className="w-4 h-4 text-[#15a0fa]" />
            <span>SHAH ALAMI WHOLESALE BOS</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#15a0fa]/15 text-[#15a0fa] border border-[#15a0fa]/30">
            v3.4 Multi-Auth
          </span>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="flex bg-neu-pressed p-1.5 rounded-2xl shadow-neu-inset mb-6">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setOtpSent(false);
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              !isSignUp
                ? "neu-card text-[#15a0fa] shadow-sm"
                : "text-neu-muted hover:text-neu-text"
            }`}
          >
            {isUrdu ? "لاگ ان (Sign In)" : "Sign In"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setOtpSent(false);
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              isSignUp
                ? "neu-card text-[#15a0fa] shadow-sm"
                : "text-neu-muted hover:text-neu-text"
            }`}
          >
            {isUrdu ? "نیا اکاؤنٹ (Sign Up)" : "Create Account"}
          </button>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-neu-text">
            {isSignUp
              ? isUrdu
                ? "صلہ پورٹل پر نیا اکاؤنٹ بنائیں"
                : "Join SILA Wholesale"
              : isUrdu
                ? "صلہ ہول سیل میں خوش آمدید"
                : "Welcome Back to SILA"}
          </h2>
          <p className="text-xs text-neu-muted mt-1.5">
            {isSignUp
              ? isUrdu
                ? "تھوک ریٹس، ادھار کھاتہ اور آرڈرز مینجمنٹ کیلئے فوری رجسٹر ہوں"
                : "Activate instant wholesale lot pricing, credit khata & inventory"
              : isUrdu
                ? "اپنے تصدیق شدہ ای میل یا سوشل اکاؤنٹ سے لاگ ان کریں"
                : "Verify via instant Email OTP or direct 1-click social sign-in"}
          </p>
        </div>

        {/* Role Selector */}
        <div className="mb-5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-neu-muted mb-2 block">
            {isUrdu ? "اپنا کردار منتخب کریں (Portal Role)" : "Select Portal Access Role"}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              ["seller", isUrdu ? "سیلر / دکاندار" : "Seller"],
              ["distributor", isUrdu ? "ڈسٹری بیوٹر" : "Distributor"],
              ["admin", isUrdu ? "ایڈمن" : "Admin"],
              ["sudo", isUrdu ? "سوڈو" : "Super Admin"],
            ].map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setSelectedRole(val)}
                className={`py-2 px-2 text-xs font-semibold rounded-xl text-center transition-all ${
                  selectedRole === val
                    ? "neu-card text-[#15a0fa] border border-[#15a0fa]/40 shadow-sm"
                    : "neu-btn text-neu-muted hover:text-neu-text"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Auth Method Selector Pills */}
        <div className="flex items-center justify-center gap-2 mb-6 border-b border-neu-muted/20 pb-4">
          <button
            type="button"
            onClick={() => {
              setAuthMode("otp");
              setErrorMessage(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              authMode === "otp"
                ? "bg-[#15a0fa] text-white shadow-md shadow-[#15a0fa]/30"
                : "text-neu-muted hover:text-neu-text bg-neu-pressed/40"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{isUrdu ? "ای میل OTP تصدیق" : "Email OTP (Fast)"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode("social");
              setErrorMessage(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              authMode === "social"
                ? "bg-[#15a0fa] text-white shadow-md shadow-[#15a0fa]/30"
                : "text-neu-muted hover:text-neu-text bg-neu-pressed/40"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isUrdu ? "سوشل لاگ ان" : "Direct OAuth"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode("password");
              setErrorMessage(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              authMode === "password"
                ? "bg-[#15a0fa] text-white shadow-md shadow-[#15a0fa]/30"
                : "text-neu-muted hover:text-neu-text bg-neu-pressed/40"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isUrdu ? "پاس ورڈ" : "Password"}</span>
          </button>
        </div>

        {/* Alert / Feedback Messages */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-500 text-xs flex items-start gap-2.5 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            <div className="flex-1">{successMessage}</div>
          </div>
        )}

        {/* --- METHOD 1: EMAIL OTP VERIFICATION SYSTEM --- */}
        {authMode === "otp" && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="text-xs text-neu-muted font-semibold mb-1.5 block">
                      {isUrdu ? "مکمل نام" : "Full Name / Business Title"}
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={isUrdu ? "محمد علی" : "Muhammad Ali (Shah Alami Trader)"}
                      className="neu-input w-full px-4 py-2.5 text-sm text-neu-text focus:ring-2 focus:ring-[#15a0fa]"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs text-neu-muted font-semibold mb-1.5 block">
                    {isUrdu ? "ای میل ایڈریس" : "Official Email Address"}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="trader@shahalami.pk"
                      className="neu-input w-full pl-10 pr-4 py-2.5 text-sm text-neu-text focus:ring-2 focus:ring-[#15a0fa]"
                      required
                    />
                    <Mail className="w-4 h-4 text-[#15a0fa] absolute left-3.5 top-3" />
                  </div>
                  <p className="text-[11px] text-neu-muted mt-1">
                    {isUrdu
                      ? "ہم آپ کے ای میل پر 6 ہندسوں کا ون ٹائم پاس ورڈ بھیجیں گے"
                      : "We'll send a 6-digit one-time passcode for secure instant verification"}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  className="neu-btn-primary w-full py-3 text-sm font-bold text-white rounded-xl shadow-lg shadow-[#15a0fa]/30 transition-all hover:opacity-95 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {pending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{isUrdu ? "کوڈ بھیج رہے ہیں..." : "Sending OTP..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{isSignUp ? (isUrdu ? "رجسٹریشن کوڈ حاصل کریں" : "Get Signup OTP Code") : (isUrdu ? "لاگ ان کوڈ حاصل کریں" : "Send Verification OTP")}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="text-center">
                  <div className="inline-flex p-3 rounded-full bg-[#15a0fa]/15 text-[#15a0fa] mb-2 shadow-sm">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-neu-muted">
                    {isUrdu ? "براہ کرم درج ذیل باکسز میں موصولہ 6 ہندسوں کا کوڈ درج کریں:" : "Enter the 6-digit passcode sent to:"}
                  </p>
                  <span className="text-xs font-mono font-bold text-neu-text">{email}</span>
                </div>

                {/* 6-Digit OTP Inputs */}
                <div className="flex justify-center items-center gap-2 sm:gap-3">
                  {otpValues.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className="neu-input w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold font-mono text-[#15a0fa] focus:ring-2 focus:ring-[#15a0fa] rounded-xl"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                {/* Dev Mode OTP Quick Paste Helper */}
                {devOtpHint && (
                  <div className="p-2.5 rounded-xl bg-[#15a0fa]/10 border border-[#15a0fa]/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-neu-muted">
                      <Sparkles className="w-3.5 h-3.5 text-[#15a0fa]" />
                      <span>{isUrdu ? "فوری ٹیسٹ کوڈ:" : "Instant Test Code:"}</span>
                      <strong className="font-mono text-[#15a0fa]">{devOtpHint}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpValues(devOtpHint.split(""))}
                      className="text-[11px] font-bold text-[#15a0fa] hover:underline"
                    >
                      {isUrdu ? "آٹو فل کریں" : "Auto-fill"}
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={pending || otpValues.join("").length !== 6}
                  className="neu-btn-primary w-full py-3 text-sm font-bold text-white rounded-xl shadow-lg shadow-[#15a0fa]/30 transition-all hover:opacity-95 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {pending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{isUrdu ? "تصدیق کی جا رہی ہے..." : "Verifying Code..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{isUrdu ? "تصدیق اور لاگ ان کریں" : "Verify & Access Portal"}</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Resend OTP button */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpValues(["", "", "", "", "", ""]);
                    }}
                    className="text-neu-muted hover:text-neu-text transition"
                  >
                    {isUrdu ? "ای میل تبدیل کریں" : "Change Email"}
                  </button>

                  <button
                    type="button"
                    disabled={timerSeconds > 0 || pending}
                    onClick={() => handleSendOtp()}
                    className="font-semibold text-[#15a0fa] hover:underline disabled:opacity-40"
                  >
                    {timerSeconds > 0
                      ? isUrdu
                        ? `دوبارہ بھیجیں (${timerSeconds}s)`
                        : `Resend in ${timerSeconds}s`
                      : isUrdu
                        ? "دوبارہ کوڈ بھیجیں"
                        : "Resend Code"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* --- METHOD 2: DIRECT SOCIAL 1-CLICK OAUTH --- */}
        {authMode === "social" && (
          <div className="space-y-4">
            <p className="text-xs text-center text-neu-muted mb-2">
              {isUrdu
                ? "براہ راست گوگل، مائیکروسافٹ یا گٹ ہب سے سائن ان کریں:"
                : "One-click authentication via your enterprise or personal OAuth account:"}
            </p>

            {/* Google Sign-in */}
            <button
              type="button"
              disabled={!!socialLoading}
              onClick={() => handleSocialLogin("google")}
              className="neu-btn w-full py-3 px-4 rounded-2xl flex items-center justify-center gap-3 text-xs sm:text-sm font-bold text-neu-text hover:text-[#15a0fa] transition shadow-sm active:scale-98 disabled:opacity-50"
            >
              {socialLoading === "google" ? (
                <RefreshCw className="w-5 h-5 animate-spin text-[#15a0fa]" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{isUrdu ? "Google کے ساتھ لاگ ان کریں" : "Continue with Google"}</span>
            </button>

            {/* Microsoft Sign-in */}
            <button
              type="button"
              disabled={!!socialLoading}
              onClick={() => handleSocialLogin("microsoft")}
              className="neu-btn w-full py-3 px-4 rounded-2xl flex items-center justify-center gap-3 text-xs sm:text-sm font-bold text-neu-text hover:text-[#15a0fa] transition shadow-sm active:scale-98 disabled:opacity-50"
            >
              {socialLoading === "microsoft" ? (
                <RefreshCw className="w-5 h-5 animate-spin text-[#15a0fa]" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
              )}
              <span>{isUrdu ? "Microsoft کے ساتھ لاگ ان کریں" : "Continue with Microsoft"}</span>
            </button>

            {/* GitHub Sign-in */}
            <button
              type="button"
              disabled={!!socialLoading}
              onClick={() => handleSocialLogin("github")}
              className="neu-btn w-full py-3 px-4 rounded-2xl flex items-center justify-center gap-3 text-xs sm:text-sm font-bold text-neu-text hover:text-[#15a0fa] transition shadow-sm active:scale-98 disabled:opacity-50"
            >
              {socialLoading === "github" ? (
                <RefreshCw className="w-5 h-5 animate-spin text-[#15a0fa]" />
              ) : (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              )}
              <span>{isUrdu ? "GitHub کے ساتھ لاگ ان کریں" : "Continue with GitHub"}</span>
            </button>
          </div>
        )}

        {/* --- METHOD 3: CLASSIC PHONE / PASSWORD LOGIN --- */}
        {authMode === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="text-xs text-neu-muted font-semibold mb-1.5 block">
                  {isUrdu ? "مکمل نام" : "Full Name"}
                </label>
                <input
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Muhammad Ali"
                  className="neu-input w-full px-4 py-2.5 text-sm text-neu-text focus:ring-2 focus:ring-[#15a0fa]"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-xs text-neu-muted font-semibold mb-1.5 block">
                {isUrdu ? "موبائل فون نمبر" : "Mobile Phone Number"}
              </label>
              <div className="relative">
                <input
                  name="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03001234567"
                  className="neu-input w-full pl-10 pr-4 py-2.5 text-sm text-neu-text font-mono focus:ring-2 focus:ring-[#15a0fa]"
                  required
                />
                <Smartphone className="w-4 h-4 text-[#15a0fa] absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs text-neu-muted font-semibold mb-1.5 block">
                {isUrdu ? "پاس ورڈ" : "Password"}
              </label>
              <div className="relative">
                <input
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="neu-input w-full pl-10 pr-4 py-2.5 text-sm text-neu-text focus:ring-2 focus:ring-[#15a0fa]"
                  required
                />
                <Lock className="w-4 h-4 text-[#15a0fa] absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="neu-btn-primary w-full py-3 text-sm font-bold text-white rounded-xl shadow-lg shadow-[#15a0fa]/30 transition-all hover:opacity-95 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {pending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isUrdu ? "توثیق کی جا رہی ہے..." : "Authenticating..."}</span>
                </>
              ) : (
                <>
                  <span>
                    {isSignUp
                      ? isUrdu
                        ? "اکاؤنٹ بنائیں"
                        : "Register Account"
                      : isUrdu
                        ? "لاگ ان کریں"
                        : "Sign In"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Security Badge */}
        <div className="mt-8 pt-4 border-t border-neu-muted/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neu-muted gap-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit SSL Encrypted Session</span>
          </div>
          <span>FBR Digital Invoicing & Khata Protected</span>
        </div>
      </div>
    </div>
  );
}
