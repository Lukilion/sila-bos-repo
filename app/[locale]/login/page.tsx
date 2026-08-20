"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { loginAction, signUpAction } from "@/actions/auth";

export default function AuthPage() {
  const params = useParams();
  const locale = (params.locale as string) || "en-US";
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("seller");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const res = isSignUp
      ? await signUpAction(formData, locale)
      : await loginAction(formData, locale);

    if (res?.error) {
      setErrorMessage(res.error);
      setPending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh]">
      <div className="neu-card w-full max-w-md">
        <div className="flex bg-neu-pressed p-1.5 rounded-xl shadow-neu-inset mb-6">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
              !isSignUp ? "neu-card text-neu-accent" : "text-neu-muted hover:text-neu-text"
            }`}
          >
            {locale === "ur-PK" ? "لاگ ان" : "Sign In"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
              isSignUp ? "neu-card text-neu-accent" : "text-neu-muted hover:text-neu-text"
            }`}
          >
            {locale === "ur-PK" ? "نیا اکاؤنٹ" : "Create Account"}
          </button>
        </div>

        <h2 className="text-xl font-bold text-center text-neu-text mb-2">
          {isSignUp
            ? locale === "ur-PK"
              ? "صلہ پر اکاؤنٹ بنائیں"
              : "Join SILA Wholesale"
            : locale === "ur-PK"
              ? "صلہ پورٹل لاگ ان"
              : "Welcome Back"}
        </h2>
        <p className="text-center text-xs text-neu-muted mb-6">
          {isSignUp
            ? "Register to access wholesale lot prices & credit khata"
            : "Enter your registered mobile credentials"}
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col form-gap-normal">
          <div>
            <label className="text-xs text-neu-muted font-medium mb-1 block">Role</label>
            <div className="flex gap-2">
              {[
                ["sudo", locale === "ur-PK" ? "سوڈو" : "Super Admin"],
                ["admin", locale === "ur-PK" ? "ایڈمن" : "Admin"],
                ["distributor", locale === "ur-PK" ? "ڈسٹری بیوٹر" : "Distributor"],
                ["seller", locale === "ur-PK" ? "سیلر" : "Seller"],
              ].map(([val, label]) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => setSelectedRole(String(val))}
                  className={`px-3 py-1 text-sm rounded-lg transition border-none ${
                    selectedRole === val ? "neu-card text-neu-accent font-semibold" : "text-neu-muted"
                  }`}
                >
                  {String(label)}
                </button>
              ))}
            </div>
          </div>
          <input type="hidden" name="role" value={selectedRole} />
          {isSignUp && (
            <div>
              <label className="text-xs text-neu-muted font-medium mb-1 block">
                {locale === "ur-PK" ? "مکمل نام" : "Full Name"}
              </label>
              <input
                name="fullName"
                type="text"
                placeholder="Muhammad Ali"
                className="neu-input w-full px-4 py-2.5 text-sm text-neu-text focus:ring-1 focus:ring-neu-accent"
                required
              />
            </div>
          )}

          <div>
            <label className="text-xs text-neu-muted font-medium mb-1 block">
              {locale === "ur-PK" ? "موبائل فون نمبر" : "Phone Number"}
            </label>
            <input
              name="phone"
              type="text"
              placeholder="03001234567"
              className="neu-input w-full px-4 py-2.5 text-sm text-neu-text focus:ring-1 focus:ring-neu-accent font-mono"
              required
            />
          </div>

          <div>
            <label className="text-xs text-neu-muted font-medium mb-1 block">
              {locale === "ur-PK" ? "پاس ورڈ" : "Password"}
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="neu-input w-full px-4 py-2.5 text-sm text-neu-text focus:ring-1 focus:ring-neu-accent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="neu-btn-primary mt-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95 disabled:opacity-50"
          >
            {pending
              ? "Authenticating..."
              : isSignUp
                ? locale === "ur-PK"
                  ? "رجسٹر کریں"
                  : "Register Account"
                : locale === "ur-PK"
                  ? "لاگ ان کریں"
                  : "Sign In to BOS"}
          </button>
        </form>
      </div>
    </div>
  );
}
