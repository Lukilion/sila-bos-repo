"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ChevronDown,
  Store,
  Truck,
  Shield,
  ShieldAlert,
  PieChart,
  Boxes,
  Layers,
  Wallet,
} from "lucide-react";
import confetti from "canvas-confetti";

type AuthMode = "password" | "otp" | "social";

const PORTAL_ROLES = [
  {
    id: "seller",
    titleEn: "Seller / Retail Merchant",
    titleUr: "سیلر / ریٹیل دکاندار",
    descEn: "POS, Wholesale Orders, Catalog & Khata",
    descUr: "پی او ایس، تھوک آرڈرز، کاتالوگ، ادھار کھاتہ",
    icon: Store,
  },
  {
    id: "distributor",
    titleEn: "Distributor / Wholesaler",
    titleUr: "ڈسٹری بیوٹر / ہول سیلر",
    descEn: "Wholesale Lots, Bulk Inventory, Dispatch Bins",
    descUr: "تھوک مال، بلک انوینٹری، ڈسپیچ گودام",
    icon: Truck,
  },
  {
    id: "admin",
    titleEn: "Operations Admin",
    titleUr: "آپریشنز ایڈمن",
    descEn: "Staff Control, KYC Verification & Analytics",
    descUr: "سٹاف کنٹرول، تصدیق، اینالیٹکس ڈیش بورڈ",
    icon: Shield,
  },
  {
    id: "sudo",
    titleEn: "Super Admin (Sudo Central)",
    titleUr: "سوڈو سپروائزر (Sudo Root)",
    descEn: "Root System Architecture & System Overrides",
    descUr: "سسٹم آرکیٹیکچر، مکمل گلوبل کنٹرول",
    icon: ShieldAlert,
  },
  {
    id: "investor",
    titleEn: "Investor Partner",
    titleUr: "انویسٹر پارٹنر (Capital Pool)",
    descEn: "Portfolio Equity, Revenue Streams & Dividends",
    descUr: "منافع، آمدن اسٹریمز، سرمایہ کاری شراکت",
    icon: PieChart,
  },
  {
    id: "sourcing",
    titleEn: "Sourcing & Procurement",
    titleUr: "سورسنگ و پروکیورمنٹ",
    descEn: "Mill Contracts, Bulk Factory POs & Sourcing",
    descUr: "فیکٹری سورسنگ، سپلائر معاہدے، بلک خریداری",
    icon: Layers,
  },
  {
    id: "inventory",
    titleEn: "Warehouse & Inventory",
    titleUr: "گودام و انوینٹری مینیجر",
    descEn: "Multi-Zone Bins, Barcodes & Dispatches",
    descUr: "زون ریف، بارکوڈز، اسٹاک آڈٹ اور ترسیل",
    icon: Boxes,
  },
  {
    id: "finance",
    titleEn: "Finance & Accounts",
    titleUr: "فنانس و کھاتہ جات",
    descEn: "Ledger Reconciliation, FBR Invoicing & Khata",
    descUr: "لیجر کھاتہ، ڈیجیٹل انوائسز اور وصولیاں",
    icon: Wallet,
  },
];

export default function AuthPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "en-US";
  const isUrdu = locale === "ur-PK";

  const [isSignUp, setIsSignUp] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("password");
  const [selectedRole, setSelectedRole] = useState<string>("seller");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

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

  const activeRoleConfig =
    PORTAL_ROLES.find((r) => r.id === selectedRole) || PORTAL_ROLES[0];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsRoleDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsRoleDropdownOpen(false);
      }
    }
    if (isRoleDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isRoleDropdownOpen]);

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

  // 1. Phone + Password Submission (Primary Authentication)
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!phone.trim()) {
      setErrorMessage(isUrdu ? "موبائل فون نمبر درج کریں" : "Please enter your phone number.");
      return;
    }
    if (!password) {
      setErrorMessage(isUrdu ? "پاس ورڈ درج کریں" : "Please enter your password.");
      return;
    }
    if (isSignUp && !fullName.trim()) {
      setErrorMessage(isUrdu ? "مکمل نام درج کریں" : "Please enter your full name.");
      return;
    }

    setPending(true);

    try {
      const formData = new FormData();
      formData.append("phone", phone.trim());
      formData.append("password", password);
      formData.append("role", selectedRole);
      if (isSignUp) formData.append("fullName", fullName.trim());

      const res = isSignUp
        ? await signUpAction(formData, locale)
        : await loginAction(formData, locale);

      if (res?.error) {
        setErrorMessage(res.error);
        setPending(false);
      } else {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#007BFF", "#0A84FF", "#10B981"],
        });
        setSuccessMessage(
          isUrdu
            ? "لاگ ان کامیاب! سسٹم میں داخل ہو رہے ہیں..."
            : "Authentication successful! Redirecting..."
        );
      }
    } catch (err: unknown) {
      // In Next.js, redirect() throws an internal NEXT_REDIRECT error which is caught here
      if (
        err &&
        typeof err === "object" &&
        "digest" in err &&
        typeof (err as { digest?: unknown }).digest === "string" &&
        (err as { digest: string }).digest.includes("NEXT_REDIRECT")
      ) {
        return;
      }
      setErrorMessage(err instanceof Error ? err.message : "Authentication error occurred.");
      setPending(false);
    }
  };

  // 2. Trigger Email OTP Send
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

  // 3. Verify Email OTP & Complete Login/Signup
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
        colors: ["#007BFF", "#0A84FF", "#10B981"],
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

  // 4. Social OAuth Direct Sign In (Google / Microsoft / GitHub)
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
        colors: ["#007BFF", "#0A84FF", "#8B5CF6"],
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

  return (
    <div className="flex items-center justify-center min-h-[85vh] py-8 px-4 select-none">
      <div
        id="login-setup-card"
        className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-[#EDEBF8] transition-all duration-300"
        style={{
          boxShadow: "-10px -10px 24px #FFFFFF, 10px 10px 24px #C5C3D8",
        }}
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div
              className="size-7 rounded-xl bg-[#EDEBF8] flex items-center justify-center text-[#007BFF]"
              style={{
                boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#007BFF]" />
            </div>
            <span className="text-xs font-mono font-extrabold text-[#3A3F58] tracking-wider">
              SHAH ALAMI WHOLESALE BOS
            </span>
          </div>
          <span
            className="neu-pill-badge bg-[#EDEBF8] text-[#007BFF] font-mono text-[10px]"
            style={{
              boxShadow: "inset 1px 1px 3px #C5C3D8, inset -1px -1px 3px #FFFFFF",
            }}
          >
            B2B Secure Access
          </span>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        <div
          className="flex p-1.5 rounded-2xl bg-[#EDEBF8] mb-6"
          style={{
            boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
          }}
        >
          <button
            type="button"
            id="auth-tab-signin"
            onClick={() => {
              setIsSignUp(false);
              setOtpSent(false);
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer ${
              !isSignUp
                ? "bg-[#EDEBF8] text-[#007BFF]"
                : "text-[#7E8299] hover:text-[#3A3F58]"
            }`}
            style={
              !isSignUp
                ? {
                    boxShadow: "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
                  }
                : undefined
            }
          >
            {isUrdu ? "لاگ ان (Sign In)" : "Sign In"}
          </button>
          <button
            type="button"
            id="auth-tab-signup"
            onClick={() => {
              setIsSignUp(true);
              setOtpSent(false);
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer ${
              isSignUp
                ? "bg-[#EDEBF8] text-[#007BFF]"
                : "text-[#7E8299] hover:text-[#3A3F58]"
            }`}
            style={
              isSignUp
                ? {
                    boxShadow: "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
                  }
                : undefined
            }
          >
            {isUrdu ? "نیا اکاؤنٹ (Sign Up)" : "Create Account"}
          </button>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#3A3F58] tracking-tight">
            {isSignUp
              ? isUrdu
                ? "صلہ پورٹل پر نیا اکاؤنٹ بنائیں"
                : "Register Wholesale Account"
              : isUrdu
                ? "صلہ ہول سیل میں خوش آمدید"
                : "Wholesale Portal Login"}
          </h2>
          <p className="text-xs text-[#7E8299] mt-1.5 max-w-md mx-auto">
            {isSignUp
              ? isUrdu
                ? "تھوک ریٹس، ادھار کھاتہ اور گودام مینجمنٹ کیلئے فون نمبر اور پاس ورڈ درج کریں"
                : "Enter your mobile phone number and password to register your B2B account."
              : isUrdu
                ? "اپنے رجسٹرڈ موبائل فون نمبر اور پاس ورڈ کے ساتھ لاگ ان کریں"
                : "Enter your registered mobile phone number and password to access the system."}
          </p>
        </div>

        {/* Portal Access Role Dropdown Button */}
        <div className="mb-5 relative z-40" id="portal-role-dropdown-container" ref={dropdownRef}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#6C7293]">
              {isUrdu ? "پورٹل رسائی کا انتخاب (Portal Access)" : "Select Portal Access"}
            </label>
            <span className="text-[10px] font-semibold text-[#007BFF] bg-[#007BFF]/10 px-2 py-0.5 rounded-full">
              {PORTAL_ROLES.length} {isUrdu ? "پورٹلز دستیاب" : "Portals Available"}
            </span>
          </div>

          <button
            type="button"
            id="portal-role-dropdown-btn"
            aria-haspopup="listbox"
            aria-expanded={isRoleDropdownOpen}
            onClick={() => setIsRoleDropdownOpen((prev) => !prev)}
            className="w-full py-2.5 px-3.5 rounded-2xl bg-[#EDEBF8] flex items-center justify-between text-left transition-all duration-200 cursor-pointer active:scale-[0.99]"
            style={{
              boxShadow: isRoleDropdownOpen
                ? "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF"
                : "-3px -3px 7px #FFFFFF, 3px 3px 7px #C5C3D8",
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="size-9 rounded-xl bg-[#EDEBF8] flex items-center justify-center text-[#007BFF] shrink-0"
                style={{
                  boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
                }}
              >
                {activeRoleConfig?.icon ? (
                  <activeRoleConfig.icon className="w-4 h-4 text-[#007BFF]" />
                ) : (
                  <Store className="w-4 h-4 text-[#007BFF]" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-[#3A3F58] flex items-center gap-2">
                  <span>{isUrdu ? activeRoleConfig?.titleUr : activeRoleConfig?.titleEn}</span>
                </div>
                <div className="text-[11px] text-[#7E8299] truncate font-medium">
                  {isUrdu ? activeRoleConfig?.descUr : activeRoleConfig?.descEn}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 pl-2">
              <ChevronDown
                className={`w-4 h-4 text-[#6C7293] shrink-0 transition-transform duration-200 ${
                  isRoleDropdownOpen ? "rotate-180 text-[#007BFF]" : ""
                }`}
              />
            </div>
          </button>

          {/* Dropdown Menu Popup */}
          {isRoleDropdownOpen && (
            <div
              id="portal-role-dropdown-menu"
              role="listbox"
              aria-label="Select Portal"
              className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 p-2 rounded-2xl bg-[#EDEBF8] space-y-1 transition-all duration-200 max-h-80 overflow-y-auto border border-[#FFFFFF]/60"
              style={{
                boxShadow: "-8px -8px 20px #FFFFFF, 8px 8px 20px #C5C3D8",
              }}
            >
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#7E8299] border-b border-[#C5C3D8]/30 mb-1 flex items-center justify-between">
                <span>{isUrdu ? "تمام پورٹل آپشنز" : "All Available Portals"}</span>
                <span className="text-[#007BFF]">SILA B2B Network</span>
              </div>
              {PORTAL_ROLES.map((roleItem) => {
                const isSelected = selectedRole === roleItem.id;
                const RoleIcon = roleItem.icon;
                return (
                  <button
                    key={roleItem.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    id={`portal-option-${roleItem.id}`}
                    onClick={() => {
                      setSelectedRole(roleItem.id);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-[#EDEBF8] text-[#007BFF]"
                        : "hover:bg-[#E4E2F1] text-[#3A3F58]"
                    }`}
                    style={
                      isSelected
                        ? {
                            boxShadow:
                              "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
                          }
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-[#007BFF] text-white shadow-sm"
                            : "bg-[#EDEBF8] text-[#6C7293]"
                        }`}
                        style={
                          !isSelected
                            ? {
                                boxShadow:
                                  "-2px -2px 4px #FFFFFF, 2px 2px 4px #C5C3D8",
                              }
                            : undefined
                        }
                      >
                        <RoleIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div
                          className={`text-xs font-bold ${
                            isSelected ? "text-[#007BFF]" : "text-[#3A3F58]"
                          }`}
                        >
                          {isUrdu ? roleItem.titleUr : roleItem.titleEn}
                        </div>
                        <div className="text-[10px] text-[#7E8299] truncate">
                          {isUrdu ? roleItem.descUr : roleItem.descEn}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="flex items-center gap-1 shrink-0 pl-2">
                        <CheckCircle2 className="w-4 h-4 text-[#007BFF]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Auth Method Selector Pills */}
        <div className="flex items-center justify-center gap-2 mb-6 border-b border-[#C5C3D8]/40 pb-4">
          <button
            type="button"
            id="auth-mode-password-btn"
            onClick={() => {
              setAuthMode("password");
              setErrorMessage(null);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              authMode === "password"
                ? "bg-[#007BFF] text-white shadow-md shadow-[#007BFF]/20"
                : "bg-[#EDEBF8] text-[#7E8299] hover:text-[#3A3F58]"
            }`}
            style={
              authMode !== "password"
                ? {
                    boxShadow: "-2px -2px 4px #FFFFFF, 2px 2px 4px #C5C3D8",
                  }
                : undefined
            }
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isUrdu ? "فون نمبر اور پاس ورڈ" : "Phone & Password"}</span>
          </button>

          <button
            type="button"
            id="auth-mode-otp-btn"
            onClick={() => {
              setAuthMode("otp");
              setErrorMessage(null);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              authMode === "otp"
                ? "bg-[#007BFF] text-white shadow-md shadow-[#007BFF]/20"
                : "bg-[#EDEBF8] text-[#7E8299] hover:text-[#3A3F58]"
            }`}
            style={
              authMode !== "otp"
                ? {
                    boxShadow: "-2px -2px 4px #FFFFFF, 2px 2px 4px #C5C3D8",
                  }
                : undefined
            }
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{isUrdu ? "ای میل OTP تصدیق" : "Email OTP"}</span>
          </button>

          <button
            type="button"
            id="auth-mode-social-btn"
            onClick={() => {
              setAuthMode("social");
              setErrorMessage(null);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              authMode === "social"
                ? "bg-[#007BFF] text-white shadow-md shadow-[#007BFF]/20"
                : "bg-[#EDEBF8] text-[#7E8299] hover:text-[#3A3F58]"
            }`}
            style={
              authMode !== "social"
                ? {
                    boxShadow: "-2px -2px 4px #FFFFFF, 2px 2px 4px #C5C3D8",
                  }
                : undefined
            }
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isUrdu ? "سوشل لاگ ان" : "OAuth"}</span>
          </button>
        </div>

        {/* Alert / Feedback Messages */}
        {errorMessage && (
          <div
            id="auth-error-banner"
            className="mb-5 p-3.5 rounded-2xl bg-[#EDEBF8] text-rose-600 text-xs flex items-start gap-2.5"
            style={{
              boxShadow: "inset 2px 2px 5px #E0B4B4, inset -2px -2px 5px #FFFFFF",
            }}
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1 font-semibold">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div
            id="auth-success-banner"
            className="mb-5 p-3.5 rounded-2xl bg-[#EDEBF8] text-emerald-600 text-xs flex items-start gap-2.5"
            style={{
              boxShadow: "inset 2px 2px 5px #B8DCC0, inset -2px -2px 5px #FFFFFF",
            }}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div className="flex-1 font-semibold">{successMessage}</div>
          </div>
        )}

        {/* --- METHOD 1: PHONE NUMBER & PASSWORD LOGIN SETUP (PRIMARY) --- */}
        {authMode === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4" id="phone-password-form">
            {isSignUp && (
              <div>
                <label className="text-xs text-[#6C7293] font-bold mb-1.5 block">
                  {isUrdu ? "مکمل نام / کاروباری نام" : "Full Name / Business Title"}
                </label>
                <div className="relative">
                  <input
                    name="fullName"
                    id="input-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isUrdu ? "محمد علی" : "Haji Rafiq Wholesale"}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEBF8] text-xs text-[#3A3F58] font-medium outline-none transition"
                    style={{
                      boxShadow: "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
                    }}
                    required
                  />
                </div>
              </div>
            )}

            {/* Phone Number Field */}
            <div>
              <label className="text-xs text-[#6C7293] font-bold mb-1.5 flex items-center justify-between">
                <span>{isUrdu ? "موبائل فون نمبر (Phone Number)" : "Mobile Phone Number"}</span>
                <span className="text-[11px] text-[#7E8299] font-normal">e.g. 03001234567</span>
              </label>
              <div className="relative">
                <input
                  name="phone"
                  id="input-phone-number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03001234567"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#EDEBF8] text-xs text-[#3A3F58] font-mono font-bold outline-none transition"
                  style={{
                    boxShadow: "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
                  }}
                  required
                />
                <Smartphone className="w-4 h-4 text-[#007BFF] absolute left-3.5 top-3" />
              </div>
              <p className="text-[10px] text-[#7E8299] mt-1">
                {isUrdu
                  ? "اپنا 11 ہندسوں کا پاکستانی موبائل نمبر درج کریں"
                  : "Enter your 11-digit registered Pakistani mobile number"}
              </p>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-[#6C7293] font-bold">
                  {isUrdu ? "پاس ورڈ (Password)" : "Password"}
                </label>
              </div>
              <div className="relative">
                <input
                  name="password"
                  id="input-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#EDEBF8] text-xs text-[#3A3F58] font-medium outline-none transition"
                  style={{
                    boxShadow: "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
                  }}
                  required
                />
                <Lock className="w-4 h-4 text-[#007BFF] absolute left-3.5 top-3" />
                <button
                  type="button"
                  id="toggle-password-visibility-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-[#7E8299] hover:text-[#3A3F58] cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Assistance */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#6C7293]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#007BFF] focus:ring-0 cursor-pointer"
                />
                <span className="text-[11px] font-medium">
                  {isUrdu ? "مجھے یاد رکھیں (Keep Signed In)" : "Keep me signed in"}
                </span>
              </label>

              <span className="text-[11px] text-[#7E8299] font-mono">
                BOS-SEC-V3
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="submit-auth-btn"
              disabled={pending}
              className="neu-btn-primary w-full py-3 rounded-2xl text-xs font-bold text-white transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 mt-2"
            >
              {pending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isUrdu ? "توثیق کی جا رہی ہے..." : "Authenticating..."}</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>
                    {isSignUp
                      ? isUrdu
                        ? "نیا اکاؤنٹ بنائیں"
                        : "Create & Register Account"
                      : isUrdu
                        ? "سسٹم میں لاگ ان کریں"
                        : "Sign In to Wholesale Portal"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* --- METHOD 2: EMAIL OTP VERIFICATION SYSTEM --- */}
        {authMode === "otp" && (
          <div className="space-y-4" id="email-otp-section">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="text-xs text-[#6C7293] font-bold mb-1.5 block">
                      {isUrdu ? "مکمل نام" : "Full Name / Business Title"}
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={isUrdu ? "محمد علی" : "Muhammad Ali (Shah Alami Trader)"}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#EDEBF8] text-xs text-[#3A3F58] outline-none font-medium"
                      style={{
                        boxShadow: "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
                      }}
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs text-[#6C7293] font-bold mb-1.5 block">
                    {isUrdu ? "ای میل ایڈریس" : "Official Email Address"}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="trader@shahalami.pk"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#EDEBF8] text-xs text-[#3A3F58] outline-none font-medium"
                      style={{
                        boxShadow: "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
                      }}
                      required
                    />
                    <Mail className="w-4 h-4 text-[#007BFF] absolute left-3.5 top-3" />
                  </div>
                  <p className="text-[11px] text-[#7E8299] mt-1">
                    {isUrdu
                      ? "ہم آپ کے ای میل پر 6 ہندسوں کا ون ٹائم پاس ورڈ بھیجیں گے"
                      : "We'll send a 6-digit one-time passcode for secure instant verification"}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  className="neu-btn-primary w-full py-3 rounded-2xl text-xs font-bold text-white transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
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
                  <div
                    className="inline-flex p-3 rounded-full bg-[#EDEBF8] text-[#007BFF] mb-2"
                    style={{
                      boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
                    }}
                  >
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-[#7E8299]">
                    {isUrdu ? "براہ کرم درج ذیل باکسز میں موصولہ 6 ہندسوں کا کوڈ درج کریں:" : "Enter the 6-digit passcode sent to:"}
                  </p>
                  <span className="text-xs font-mono font-bold text-[#3A3F58]">{email}</span>
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
                      className="w-11 h-12 sm:w-12 sm:h-14 rounded-2xl bg-[#EDEBF8] text-center text-lg sm:text-xl font-bold font-mono text-[#007BFF] outline-none"
                      style={{
                        boxShadow: "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
                      }}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                {/* Dev Mode OTP Quick Paste Helper */}
                {devOtpHint && (
                  <div
                    className="p-2.5 rounded-2xl bg-[#EDEBF8] flex items-center justify-between text-xs"
                    style={{
                      boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
                    }}
                  >
                    <div className="flex items-center gap-1.5 text-[#7E8299]">
                      <Sparkles className="w-3.5 h-3.5 text-[#007BFF]" />
                      <span>{isUrdu ? "فوری ٹیسٹ کوڈ:" : "Instant Test Code:"}</span>
                      <strong className="font-mono text-[#007BFF]">{devOtpHint}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpValues(devOtpHint.split(""))}
                      className="text-[11px] font-bold text-[#007BFF] hover:underline cursor-pointer"
                    >
                      {isUrdu ? "آٹو فل کریں" : "Auto-fill"}
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={pending || otpValues.join("").length !== 6}
                  className="neu-btn-primary w-full py-3 rounded-2xl text-xs font-bold text-white transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
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
                    className="text-[#7E8299] hover:text-[#3A3F58] transition cursor-pointer"
                  >
                    {isUrdu ? "ای میل تبدیل کریں" : "Change Email"}
                  </button>

                  <button
                    type="button"
                    disabled={timerSeconds > 0 || pending}
                    onClick={() => handleSendOtp()}
                    className="font-semibold text-[#007BFF] hover:underline disabled:opacity-40 cursor-pointer"
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

        {/* --- METHOD 3: DIRECT SOCIAL 1-CLICK OAUTH --- */}
        {authMode === "social" && (
          <div className="space-y-4" id="social-oauth-section">
            <p className="text-xs text-center text-[#7E8299] mb-2">
              {isUrdu
                ? "براہ راست گوگل، مائیکروسافٹ یا گٹ ہب سے سائن ان کریں:"
                : "One-click authentication via your enterprise or personal OAuth account:"}
            </p>

            {/* Google Sign-in */}
            <button
              type="button"
              disabled={!!socialLoading}
              onClick={() => handleSocialLogin("google")}
              className="w-full py-3 px-4 rounded-2xl bg-[#EDEBF8] flex items-center justify-center gap-3 text-xs sm:text-sm font-bold text-[#3A3F58] hover:text-[#007BFF] transition cursor-pointer active:scale-95 disabled:opacity-50"
              style={{
                boxShadow: "-4px -4px 8px #FFFFFF, 4px 4px 8px #C5C3D8",
              }}
            >
              {socialLoading === "google" ? (
                <RefreshCw className="w-5 h-5 animate-spin text-[#007BFF]" />
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
              className="w-full py-3 px-4 rounded-2xl bg-[#EDEBF8] flex items-center justify-center gap-3 text-xs sm:text-sm font-bold text-[#3A3F58] hover:text-[#007BFF] transition cursor-pointer active:scale-95 disabled:opacity-50"
              style={{
                boxShadow: "-4px -4px 8px #FFFFFF, 4px 4px 8px #C5C3D8",
              }}
            >
              {socialLoading === "microsoft" ? (
                <RefreshCw className="w-5 h-5 animate-spin text-[#007BFF]" />
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
              className="w-full py-3 px-4 rounded-2xl bg-[#EDEBF8] flex items-center justify-center gap-3 text-xs sm:text-sm font-bold text-[#3A3F58] hover:text-[#007BFF] transition cursor-pointer active:scale-95 disabled:opacity-50"
              style={{
                boxShadow: "-4px -4px 8px #FFFFFF, 4px 4px 8px #C5C3D8",
              }}
            >
              {socialLoading === "github" ? (
                <RefreshCw className="w-5 h-5 animate-spin text-[#007BFF]" />
              ) : (
                <svg className="w-5 h-5 fill-current text-[#3A3F58]" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              )}
              <span>{isUrdu ? "GitHub کے ساتھ لاگ ان کریں" : "Continue with GitHub"}</span>
            </button>
          </div>
        )}

        {/* Footer Security Badge */}
        <div className="mt-8 pt-4 border-t border-[#C5C3D8]/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7E8299] gap-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted Session</span>
          </div>
          <span>FBR Digital Invoicing & Khata Protected</span>
        </div>
      </div>
    </div>
  );
}

