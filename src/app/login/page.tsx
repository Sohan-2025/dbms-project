"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Leaf, Loader2, Sparkles, CheckCircle2, ShieldCheck, Database } from "lucide-react";
import { api, ApiError } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@replate.app");
  const [password, setPassword] = useState("replate2026");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSignIn(targetEmail?: string) {
    const finalEmail = targetEmail || email;
    setLoading(true);
    setError("");

    try {
      const res = await api.login(finalEmail, password);
      const role = res.data.user.role;
      if (role === "ADMIN") router.replace("/admin/dashboard");
      else if (role === "DONOR") router.replace("/donor/dashboard");
      else if (role === "RECIPIENT") router.replace("/recipient/dashboard");
      else if (role === "VOLUNTEER") router.replace("/volunteer/dashboard");
    } catch (e: any) {
      setError(e instanceof ApiError ? e.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2 bg-[#f7f9f7]">
      
      {/* Left Hero Panel */}
      <section className="hidden bg-gradient-to-br from-[#0c2618] via-[#123824] to-[#18492e] p-12 text-white lg:flex lg:flex-col lg:justify-between relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#c9f36b]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white/70 hover:text-white transition"
          >
            <ArrowLeft size={16} /> Back to Overview
          </Link>

          <div className="mt-20 max-w-lg">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-emerald-300 ring-1 ring-white/15">
              <Leaf size={14} className="text-[#c9f36b]" />
              <span>DBMS PRODUCTION PROJECT ARCHITECTURE</span>
            </div>
            
            <h1 className="text-5xl font-black tracking-tight leading-[1.15]">
              Food redistribution with database integrity.
            </h1>
            
            <p className="mt-6 text-base leading-relaxed text-white/75">
              REPLATE orchestrates the full lifecycle of surplus food — registration, QA thermal inspection, transactional allocation under row-level locks, and volunteer fleet dispatch.
            </p>

            <div className="mt-8 space-y-3 font-mono text-xs text-emerald-200/90 bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#c9f36b]" />
                <span>Express + TypeScript + PostgreSQL (Port 4000)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#c9f36b]" />
                <span>Strict REST contract defined in openapi.yaml</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#c9f36b]" />
                <span>ACID Concurrency & SELECT FOR UPDATE Isolation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-white/40 pt-8 border-t border-white/10">
          <span>© 2026 REPLATE Platform</span>
          <span>VIT University DBMS Project</span>
        </div>
      </section>

      {/* Right Sign-in Form */}
      <section className="grid place-items-center p-6 md:p-12">
        <div className="w-full max-w-md">
          
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2 font-black text-xl text-slate-900">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#123824] font-black text-[#c9f36b]">
                R
              </div>
              <span>REPLATE</span>
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xl">
            
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
                Portal Authentication
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                Demo Mode Active
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-black text-slate-900">Sign in to REPLATE</h2>
            <p className="mt-1 text-xs text-slate-500">
              Select one of the 4 seeded demo accounts below for one-click evaluation:
            </p>

            {/* Quick 1-Click Role Logins */}
            <div className="mt-6 space-y-2">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                1-Click Preset Roles
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                
                <button
                  type="button"
                  onClick={() => {
                    setEmail("admin@replate.app");
                    handleSignIn("admin@replate.app");
                  }}
                  className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 font-bold text-left transition flex flex-col justify-between"
                >
                  <span className="text-slate-900">🏢 Admin / Ops</span>
                  <span className="text-[10px] text-slate-400 mt-1">Full Operations</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail("donor@replate.app");
                    handleSignIn("donor@replate.app");
                  }}
                  className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 font-bold text-left transition flex flex-col justify-between"
                >
                  <span className="text-slate-900">🥗 Donor Portal</span>
                  <span className="text-[10px] text-slate-400 mt-1">VIT Hostel Mess</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail("recipient@replate.app");
                    handleSignIn("recipient@replate.app");
                  }}
                  className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 font-bold text-left transition flex flex-col justify-between"
                >
                  <span className="text-slate-900">🍲 Recipient</span>
                  <span className="text-[10px] text-slate-400 mt-1">Hope Kitchen</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail("volunteer@replate.app");
                    handleSignIn("volunteer@replate.app");
                  }}
                  className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 font-bold text-left transition flex flex-col justify-between"
                >
                  <span className="text-slate-900">🚚 Volunteer</span>
                  <span className="text-[10px] text-slate-400 mt-1">Fleet Logistics</span>
                </button>

              </div>
            </div>

            {/* Manual Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSignIn();
              }}
              className="mt-6 space-y-4 pt-5 border-t border-slate-100"
            >
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-900 shadow-xs outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                  Password
                </label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-900 shadow-xs outline-none focus:border-emerald-600"
                />
              </div>

              {error && (
                <div className="rounded-2xl bg-rose-50 p-3 text-xs font-bold text-rose-700 border border-rose-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#123824] py-3.5 text-sm font-bold text-white hover:bg-[#1a4f33] active:bg-[#0c2618] transition shadow-md disabled:opacity-60 cursor-pointer"
              >
                {loading && <Loader2 className="animate-spin" size={16} />}
                <span>Sign In to Selected Portal</span>
              </button>
            </form>

          </div>

        </div>
      </section>

    </main>
  );
}
