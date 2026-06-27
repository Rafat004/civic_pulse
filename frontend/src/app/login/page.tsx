"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function LoginContent() {
  const [activeTab, setActiveTab] = useState<"citizen" | "admin">("citizen");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex-1 w-full bg-background text-on-surface flex items-center justify-center relative overflow-hidden font-body-md antialiased py-xl">
      {/* Decorative Background Elements */}
      <div 
        className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none" 
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCnDOV9DDDiAI-cHxYno6u86DcP58uk_E_hDOsosSoIaB8IDxyCXb3fhUGCVrqag_81G5QYW0hmL5Do82DtQ4eRUw25M7WDl9JRxDiDIn5m6DjLKsLzTLm6t8Z6Uo5UU_LOd0tUMrFJfLv8kvdjZqFXlTpPtC0bo22OKxOSZV8P1YM1boQO3YL7QG6bMD8erW05h_5RoA1RrwthVHrGM_t98iWvePIv65e7A7DNKwNVoPtqK7ydQfoLYyjVdavaUpjycQ14qA9UA1Mb')" }}
      ></div>
      <div className="absolute inset-0 z-0 bg-surface opacity-60" style={{ backgroundImage: "radial-gradient(#dee3ec 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-surface-container-high to-transparent z-0"></div>
      
      <main className="relative z-10 w-full max-w-[28rem] px-margin-mobile md:px-0 mt-8 mb-8">
        {/* Brand Header */}
        <div className="text-center mb-lg">
          <Link href="/" className="font-headline-lg text-headline-lg md:font-display-lg md:text-display-lg text-primary font-bold tracking-tight flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
            CivicPulse
          </Link>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-xs max-w-[24rem] mx-auto">Digital Infrastructure for Public Good</p>
        </div>

        {/* The Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] w-full">
          <div className="text-center mb-md">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Welcome Back</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Sign in to access civic data tools and transparent reporting infrastructure.</p>
          </div>

          {/* Error Message */}
          {error === "AccountNotFound" && (
            <div className="bg-error-container text-on-error-container border border-error px-4 py-3 rounded-lg mb-md text-sm font-body-md text-center">
              Account not found. Please sign up to create an account.
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-outline-variant mb-xl">
            <button 
              onClick={() => setActiveTab("citizen")}
              className={`flex-1 py-3 text-center font-label-caps text-label-caps uppercase transition-colors focus:outline-none ${
                activeTab === "citizen" 
                  ? "border-b-2 border-primary text-primary" 
                  : "border-b-2 border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant"
              }`}
            >
              Citizen
            </button>
            <button 
              onClick={() => setActiveTab("admin")}
              className={`flex-1 py-3 text-center font-label-caps text-label-caps uppercase transition-colors focus:outline-none ${
                activeTab === "admin" 
                  ? "border-b-2 border-primary text-primary" 
                  : "border-b-2 border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant"
              }`}
            >
              Administrator
            </button>
          </div>

          {/* Citizen Tab Content */}
          {activeTab === "citizen" && (
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const { localLogin } = await import("@/lib/api");
                const result = await localLogin({
                  email: (e.target as any).email.value,
                  password: (e.target as any).password.value
                });
                if (result.role === "admin") {
                  window.location.href = "/admin/queue";
                } else {
                  window.location.href = "/my-reports";
                }
              } catch (err: any) {
                alert(err.message || "Login failed");
              }
            }} className="space-y-md animate-in fade-in zoom-in-95 duration-200">
              <div>
                <label className="block font-body-md text-sm font-medium text-on-surface mb-1" htmlFor="email">Email</label>
                <input required className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow" id="email" name="email" placeholder="citizen@example.com" type="email" />
              </div>
              <div className="mt-4">
                <label className="block font-body-md text-sm font-medium text-on-surface mb-1" htmlFor="password">Password</label>
                <input required className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow" id="password" name="password" placeholder="••••••••" type="password" />
              </div>
              <button type="submit" className="w-full flex items-center justify-center bg-primary hover:bg-primary-container text-white hover:text-on-primary border-none rounded-lg py-3 px-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mt-6">
                <span className="font-body-md text-body-md font-medium">Log In</span>
              </button>

              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-outline-variant"></div>
                <span className="flex-shrink-0 mx-4 text-on-surface-variant text-sm">or</span>
                <div className="flex-grow border-t border-outline-variant"></div>
              </div>

              <a href="http://localhost:8000/api/v1/auth/google/login?action=login" className="w-full flex items-center justify-center gap-xs bg-surface-container-lowest border border-outline-variant hover:bg-surface-variant text-on-surface rounded-lg py-3 px-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <svg className="w-5 h-5 bg-white rounded-full p-[2px]" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span className="font-body-md text-body-md font-medium">Continue with Google</span>
              </a>
              <div className="mt-4 text-center">
                <p className="font-body-md text-sm text-on-surface-variant">
                  New to CivicPulse? <Link className="text-primary hover:underline font-medium" href="/signup">Create a citizen account</Link>
                </p>
              </div>
            </form>
          )}

          {/* Administrator Tab Content */}
          {activeTab === "admin" && (
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const { localLogin } = await import("@/lib/api");
                const result = await localLogin({
                  email: (e.target as any).email.value,
                  password: (e.target as any).password.value
                });
                if (result.role === "admin") {
                  window.location.href = "/admin/queue";
                } else {
                  alert("You are not an admin");
                }
              } catch (err: any) {
                alert(err.message || "Admin login failed");
              }
            }} className="space-y-md animate-in fade-in zoom-in-95 duration-200">
              <div>
                <label className="block font-body-md text-sm font-medium text-on-surface mb-1" htmlFor="admin-email">Institutional Email</label>
                <input required className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow" id="admin-email" name="email" placeholder="admin@gov.city.org" type="email" />
              </div>
              <div className="mt-4">
                <label className="block font-body-md text-sm font-medium text-on-surface mb-1" htmlFor="admin-password">Password</label>
                <input required className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow" id="admin-password" name="password" placeholder="••••••••" type="password" />
              </div>
              <div className="flex items-center justify-between mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input className="rounded text-primary focus:ring-primary border-outline-variant bg-surface-container-lowest" type="checkbox" />
                  <span className="font-body-md text-sm text-on-surface-variant">Remember me</span>
                </label>
                <a className="font-body-md text-sm text-primary hover:underline" href="#">Forgot password?</a>
              </div>
              <button type="submit" className="w-full flex items-center justify-center bg-primary-container hover:bg-surface-tint text-on-primary border-none rounded-lg py-3 px-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mt-6">
                <span className="font-body-md text-body-md font-medium text-white">Sign In to Dashboard</span>
              </button>
            </form>
          )}

          {/* Trust / Security Note */}
          <div className="mt-xl text-center border-t border-surface-variant pt-md">
            <p className="font-label-caps text-label-caps text-on-surface-variant flex items-center justify-center gap-1 uppercase">
              <span className="material-symbols-outlined text-[14px]">shield</span>
              Secure Platform Access
            </p>
            <p className="font-body-md text-[13px] text-outline mt-2 px-sm">
              By proceeding, you acknowledge our commitment to data integrity and agree to the <a className="text-primary hover:underline" href="#">Terms of Service</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 w-full bg-background text-on-surface flex items-center justify-center min-h-screen">
        <div className="text-on-surface-variant">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
