"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  LogIn,
  UserPlus,
  Store,
  Truck,
  Shield,
  ShieldAlert,
  PieChart,
  Layers,
  Boxes,
  Wallet,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  User,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import confetti from "canvas-confetti";
import { loginAction, signUpAction } from "@/actions/auth";
import {
  auth,
  googleProvider,
  githubProvider,
  microsoftProvider,
  signInWithPopup,
} from "@/lib/firebase";

// Neumorphic style tokens exact to your screenshot
const NEU = {
  card: {
    backgroundColor: "#EDEBF8",
    boxShadow: "-10px -10px 24px #FFFFFF, 10px 10px 24px #C5C3D8",
  },
  inset: {
    backgroundColor: "#EDEBF8",
    boxShadow: "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
  },
  insetTab: {
    backgroundColor: "#EDEBF8",
    boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
  },
  btn: {
    backgroundColor: "#EDEBF8",
    boxShadow: "-3px -3px 7px #FFFFFF, 3px 3px 7px #C5C3D8",
  },
  btnSm: {
    backgroundColor: "#EDEBF8",
    boxShadow: "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8",
  },
  btnPrimary: {
    backgroundColor: "#007BFF",
    boxShadow: "-3px -3px 8px rgba(255, 255, 255, 0.8), 3px 3px 8px rgba(0, 123, 255, 0.35)",
  },
  pillBadge: {
    backgroundColor: "#EDEBF8",
    boxShadow: "inset 1px 1px 3px #C5C3D8, inset -1px -1px 3px #FFFFFF",
  },
  errorBanner: {
    backgroundColor: "#EDEBF8",
    boxShadow: "inset 2px 2px 5px #E0B4B4, inset -2px -2px 5px #FFFFFF",
  },
  successBanner: {
    backgroundColor: "#EDEBF8",
    boxShadow: "inset 2px 2px 5px #B8DCC0, inset -2px -2px 5px #FFFFFF",
  },
};

const PORTAL_ROLES = [
  { id: "seller", title: "Seller / Retail Merchant", desc: "POS, Wholesale Orders, Catalog & Khata", icon: Store },
  { id: "distributor", title: "Distributor / Wholesaler", desc: "Wholesale Lots, Bulk Inventory, Dispatch Bins", icon: Truck },
  { id: "admin", title: "Operations Admin", desc: "Staff Control, KYC Verification & Analytics", icon: Shield },
  { id: "sudo", title: "Super Admin (Sudo Central)", desc: "Root System Architecture & System Overrides", icon: ShieldAlert },
  { id: "investor", title: "Investor Partner", desc: "Portfolio Equity, Revenue Streams & Dividends", icon: PieChart },
  { id: "sourcing", title: "Sourcing & Procurement", desc: "Mill Contracts, Bulk Factory POs & Sourcing", icon: Layers },
  { id: "inventory", title: "Warehouse & Inventory", desc: "Multi-Zone Bins, Barcodes & Dispatches", icon: Boxes },
  { id: "finance", title: "Finance & Accounts", desc: "Ledger Reconciliation, FBR Invoicing & Khata", icon: Wallet },
];

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="bg-[#DFDCF0] min-h-screen flex items-center justify-center py-8 px-4 font-sans select-none text-[#3A3F58]">
          <div className="w-full max-w-xl p-8 rounded-3xl flex flex-col items-center justify-center gap-3" style={NEU.card}>
            <RefreshCw className="w-6 h-6 animate-spin text-[#007BFF]" />
            <span className="text-xs font-bold text-[#6C7293]">Loading Wholesale Portal...</span>
          </div>
        </div>
      }
    >
      <LoginPageContent />
    </React.Suspense>
  );
}

function LoginPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = (params?.locale as string) || "en-US";

  const [isPending, startTransition] = useTransition();

  const modeParam = searchParams.get("mode");
  // Default to signup to match the screenshot view
  const [currentMode, setCurrentMode] = useState<"signin" | "signup">(
    modeParam === "signin" ? "signin" : "signup"
  );
  const [selectedRole, setSelectedRole] = useState<string>("seller");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Prefilled to match your screenshot display
  const [fullName, setFullName] = useState<string>("Haji Rafiq (Shah Alami Trader)");
  const [identifier, setIdentifier] = useState<string>("03001234567");
  const [email, setEmail] = useState<string>("trader@shahalami.pk");
  const [password, setPassword] = useState<string>("password123");
  const [confirmPassword, setConfirmPassword] = useState<string>("password123");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeRole = PORTAL_ROLES.find((r) => r.id === selectedRole) || PORTAL_ROLES[0];
  const ActiveRoleIcon = activeRole.icon;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#007BFF", "#0A84FF", "#10B981"],
    });
  };

  const switchMode = (mode: "signin" | "signup") => {
    setCurrentMode(mode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const fillDemo = (demoIdentifier: string, demoPass: string, roleId: string, name: string) => {
    switchMode("signin");
    setIdentifier(demoIdentifier);
    setPassword(demoPass);
    setSelectedRole(roleId);
    setErrorMessage(null);
    setSuccessMessage(`Populated demo credentials for ${name}`);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      setErrorMessage("Please enter your phone number or email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your account password.");
      return;
    }

    if (currentMode === "signup") {
      const cleanFullName = fullName.trim();
      const cleanEmail = email.trim();

      if (!cleanFullName) {
        setErrorMessage("Please enter your full name or business title.");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long.");
        return;
      }
      if (confirmPassword && password !== confirmPassword) {
        setErrorMessage("Passwords do not match. Please verify.");
        return;
      }

      startTransition(async () => {
        try {
          const formData = new FormData();
          formData.append("fullName", cleanFullName);
          formData.append("phone", cleanIdentifier);
          if (cleanEmail) formData.append("email", cleanEmail);
          formData.append("password", password);
          formData.append("role", selectedRole);

          const res = await signUpAction(formData, locale);

          if (res?.error) {
            setErrorMessage(res.error);
          } else {
            triggerCelebration();
            setSuccessMessage(`Account created for ${cleanFullName}! Welcome to SILA Network.`);
          }
        } catch (err: unknown) {
          if (
            err &&
            typeof err === "object" &&
            "digest" in err &&
            typeof (err as { digest?: unknown }).digest === "string" &&
            (err as { digest: string }).digest.includes("NEXT_REDIRECT")
          ) {
            return;
          }
          setErrorMessage(err instanceof Error ? err.message : "Account registration error occurred.");
        }
      });
    } else {
      startTransition(async () => {
        try {
          const formData = new FormData();
          formData.append("identifier", cleanIdentifier);
          formData.append("password", password);
          formData.append("role", selectedRole);

          const res = await loginAction(formData, locale);

          if (res?.error) {
            setErrorMessage(res.error);
          } else {
            triggerCelebration();
            setSuccessMessage("Authentication successful! Entering system...");
          }
        } catch (err: unknown) {
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
        }
      });
    }
  };

  const handleSocialLogin = async (providerName: "Google" | "Microsoft" | "GitHub") => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setSocialLoading(providerName);

    try {
      let provider;
      const lower = providerName.toLowerCase();
      if (lower === "google") provider = googleProvider;
      else if (lower === "microsoft") provider = microsoftProvider;
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
          provider: lower,
          role: selectedRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to establish secure session.");
      }

      triggerCelebration();
      setSuccessMessage(`Signed in successfully via ${providerName.toUpperCase()}!`);

      setTimeout(() => {
        router.push(`/${locale}${data.redirectPath || "/catalog"}`);
        router.refresh();
      }, 800);
    } catch (err: unknown) {
      console.error("OAuth error:", err);
      setErrorMessage(err instanceof Error ? err.message : "Social authentication was cancelled or failed.");
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="bg-[#DFDCF0] min-h-screen flex items-center justify-center py-8 px-4 font-sans select-none text-[#3A3F58]">
      <div
        id="login-setup-card"
        className="w-full max-w-xl p-6 sm:p-8 rounded-3xl transition-all duration-300"
        style={NEU.card}
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center text-[#007BFF]" style={NEU.inset}>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-mono font-extrabold text-[#3A3F58] tracking-wider">
              SHAH ALAMI WHOLESALE BOS
            </span>
          </div>
          <span className="text-[#007BFF] font-mono text-[10px] px-2.5 py-1 rounded-full" style={NEU.pillBadge}>
            B2B Secure Access
          </span>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="flex p-1.5 rounded-2xl mb-6" style={NEU.insetTab}>
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              currentMode === "signin" ? "text-[#007BFF]" : "text-[#7E8299] hover:text-[#3A3F58]"
            }`}
            style={currentMode === "signin" ? NEU.btn : undefined}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              currentMode === "signup" ? "text-[#007BFF]" : "text-[#7E8299] hover:text-[#3A3F58]"
            }`}
            style={currentMode === "signup" ? NEU.btn : undefined}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#3A3F58] tracking-tight">
            {currentMode === "signup" ? "Create Wholesale Account" : "Sign In to Wholesale Portal"}
          </h2>
          <p className="text-xs text-[#7E8299] mt-1.5 max-w-md mx-auto">
            {currentMode === "signup"
              ? "Register your wholesale credentials for immediate access to catalog, POS & Khata."
              : "Enter your registered phone number or email and password to access the system."}
          </p>
        </div>

        {/* Portal Access Role Selection */}
        {currentMode === "signup" && (
          <div className="mb-5 relative z-40" ref={dropdownRef}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6C7293]">
                Select Wholesale Role
              </label>
              <span className="text-[10px] font-semibold text-[#007BFF] bg-[#007BFF]/10 px-2 py-0.5 rounded-full">
                8 Roles Available
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="w-full py-2.5 px-3.5 rounded-2xl flex items-center justify-between text-left transition-all duration-200 cursor-pointer active:scale-[0.99]"
              style={isDropdownOpen ? NEU.inset : NEU.btn}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[#007BFF] shrink-0" style={NEU.inset}>
                  <ActiveRoleIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-[#3A3F58] flex items-center gap-2">
                    {activeRole.title}
                  </div>
                  <div className="text-[11px] text-[#7E8299] truncate font-medium">
                    {activeRole.desc}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 pl-2">
                <ChevronDown
                  className={`w-4 h-4 text-[#6C7293] shrink-0 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180 text-[#007BFF]" : ""
                  }`}
                />
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 p-2 rounded-2xl space-y-1 max-h-80 overflow-y-auto border border-[#FFFFFF]/60"
                style={{
                  backgroundColor: "#EDEBF8",
                  boxShadow: "-8px -8px 20px #FFFFFF, 8px 8px 20px #C5C3D8",
                }}
              >
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#7E8299] border-b border-[#C5C3D8]/30 mb-1 flex items-center justify-between">
                  <span>All Available Roles</span>
                  <span className="text-[#007BFF]">SILA B2B Network</span>
                </div>
                <div className="space-y-1">
                  {PORTAL_ROLES.map((r) => {
                    const isSelected = r.id === selectedRole;
                    const ItemIcon = r.icon;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setSelectedRole(r.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all duration-150 cursor-pointer ${
                          isSelected ? "text-[#007BFF]" : "hover:bg-[#E4E2F1] text-[#3A3F58]"
                        }`}
                        style={isSelected ? NEU.inset : undefined}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected ? "bg-[#007BFF] text-white shadow-sm" : "text-[#6C7293]"
                            }`}
                            style={!isSelected ? NEU.btnSm : undefined}
                          >
                            <ItemIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold">{r.title}</div>
                            <div className="text-[10px] text-[#7E8299] truncate">{r.desc}</div>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#007BFF] shrink-0 pl-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feedback Alert Banners */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl text-rose-600 text-xs flex items-start gap-2.5" style={NEU.errorBanner}>
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1 font-semibold">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 rounded-2xl text-emerald-600 text-xs flex items-start gap-2.5" style={NEU.successBanner}>
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div className="flex-1 font-semibold">{successMessage}</div>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {currentMode === "signup" && (
            <div>
              <label className="text-xs text-[#6C7293] font-bold mb-1.5 block">Full Name / Business Title</label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Haji Rafiq (Shah Alami Trader)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs text-[#3A3F58] font-medium outline-none transition"
                  style={NEU.inset}
                  required
                />
                <User className="w-4 h-4 text-[#007BFF] absolute left-3.5 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-[#6C7293] font-bold mb-1.5 flex items-center justify-between">
              <span>{currentMode === "signup" ? "Mobile Phone Number" : "Mobile Phone Number or Email"}</span>
              <span className="text-[11px] text-[#7E8299] font-normal">
                {currentMode === "signup" ? "e.g. 03001234567" : "03001234567 or email"}
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={currentMode === "signup" ? "03001234567" : "03001234567 or user@sila.pk"}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs text-[#3A3F58] font-medium outline-none transition"
                style={NEU.inset}
                required
              />
              <Smartphone className="w-4 h-4 text-[#007BFF] absolute left-3.5 top-3" />
            </div>
          </div>

          {currentMode === "signup" && (
            <div>
              <label className="text-xs text-[#6C7293] font-bold mb-1.5 flex items-center justify-between">
                <span>Email Address (Optional)</span>
                <span className="text-[10px] text-[#7E8299]">For E-Invoicing</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@shahalami.pk"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs text-[#3A3F58] font-medium outline-none transition"
                  style={NEU.inset}
                />
                <Mail className="w-4 h-4 text-[#007BFF] absolute left-3.5 top-3" />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-[#6C7293] font-bold">Password</label>
              {currentMode === "signup" && <span className="text-[10px] text-[#7E8299]">Min. 6 characters</span>}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl text-xs text-[#3A3F58] font-medium outline-none transition"
                style={NEU.inset}
                required
              />
              <Lock className="w-4 h-4 text-[#007BFF] absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-[#7E8299] hover:text-[#3A3F58] cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {currentMode === "signup" && (
            <div>
              <label className="text-xs text-[#6C7293] font-bold mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl text-xs text-[#3A3F58] font-medium outline-none transition"
                  style={NEU.inset}
                  required
                />
                <Lock className="w-4 h-4 text-[#007BFF] absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-2.5 text-[#7E8299] hover:text-[#3A3F58] cursor-pointer"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {!currentMode && currentMode === "signin" && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#6C7293]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#007BFF] focus:ring-0 cursor-pointer"
                />
                <span className="text-[11px] font-medium">Keep me signed in</span>
              </label>
              <span className="text-[11px] text-[#7E8299] font-mono">BOS-SEC-V3</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-2xl text-xs font-bold text-white transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 mt-3 hover:bg-[#0069d9]"
            style={NEU.btnPrimary}
          >
            {isPending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>{currentMode === "signup" ? "Create & Register Account" : "Sign In to Wholesale Portal"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Presets (Sign In only) */}
        {currentMode === "signin" && (
          <div className="mt-5 pt-4 border-t border-[#C5C3D8]/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E8299]">Quick Demo Accounts:</span>
              <span className="text-[10px] text-[#007BFF] font-medium">1-Click Fill</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo("03001234567", "password123", "seller", "Haji Rafiq")}
                className="p-2 rounded-xl text-left transition hover:text-[#007BFF] cursor-pointer"
                style={NEU.btnSm}
              >
                <div className="text-[11px] font-bold text-[#3A3F58] truncate">Haji Rafiq (Seller)</div>
                <div className="text-[9px] text-[#7E8299] font-mono">Seller</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemo("03009876543", "password123", "admin", "Admin Shah Alami")}
                className="p-2 rounded-xl text-left transition hover:text-[#007BFF] cursor-pointer"
                style={NEU.btnSm}
              >
                <div className="text-[11px] font-bold text-[#3A3F58] truncate">Admin Shah Alami</div>
                <div className="text-[9px] text-[#7E8299] font-mono">Admin</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemo("03000000000", "password123", "sudo", "Sudo Supervisor")}
                className="p-2 rounded-xl text-left transition hover:text-[#007BFF] cursor-pointer"
                style={NEU.btnSm}
              >
                <div className="text-[11px] font-bold text-[#3A3F58] truncate">Sudo Supervisor</div>
                <div className="text-[9px] text-[#7E8299] font-mono">Sudo</div>
              </button>
            </div>
          </div>
        )}

        {/* Social SSO Section */}
        <div className="mt-6 pt-5 border-t border-[#C5C3D8]/40">
          <p className="text-[11px] text-center text-[#7E8299] mb-3">Or continue with enterprise single sign-on:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={!!socialLoading}
              onClick={() => handleSocialLogin("Google")}
              className="py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold text-[#3A3F58] hover:text-[#007BFF] transition cursor-pointer active:scale-95 disabled:opacity-50"
              style={NEU.btnSm}
            >
              {socialLoading === "Google" ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#007BFF]" />
              ) : (
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span className="text-[11px] font-medium hidden sm:inline">Google</span>
            </button>
            <button
              type="button"
              disabled={!!socialLoading}
              onClick={() => handleSocialLogin("Microsoft")}
              className="py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold text-[#3A3F58] hover:text-[#007BFF] transition cursor-pointer active:scale-95 disabled:opacity-50"
              style={NEU.btnSm}
            >
              {socialLoading === "Microsoft" ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#007BFF]" />
              ) : (
                <svg className="w-3 h-3 shrink-0" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
              )}
              <span className="text-[11px] font-medium hidden sm:inline">Microsoft</span>
            </button>
            <button
              type="button"
              disabled={!!socialLoading}
              onClick={() => handleSocialLogin("GitHub")}
              className="py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold text-[#3A3F58] hover:text-[#007BFF] transition cursor-pointer active:scale-95 disabled:opacity-50"
              style={NEU.btnSm}
            >
              {socialLoading === "GitHub" ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#007BFF]" />
              ) : (
                <svg className="w-3.5 h-3.5 shrink-0 fill-current text-[#3A3F58]" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              )}
              <span className="text-[11px] font-medium hidden sm:inline">GitHub</span>
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-7 pt-4 border-t border-[#C5C3D8]/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7E8299] gap-2">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted Session</span>
          </div>
          <span>FBR Digital Invoicing & Khata Protected</span>
        </div>
      </div>
    </div>
  );
}