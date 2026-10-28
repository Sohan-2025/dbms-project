"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { User, UserRole } from "@/types/api";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui";
import { mockUsers } from "@/lib/mock";
import { 
  UserCircle, 
  ShieldCheck, 
  Building2, 
  Mail, 
  Key, 
  Database,
  ArrowRight
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.me().then((x) => setUser(x.data.user));
  }, []);

  const switchRole = (newRole: UserRole) => {
    const updated = api.switchRole(newRole);
    setUser(updated);
    if (newRole === "ADMIN") router.push("/admin/dashboard");
    else if (newRole === "DONOR") router.push("/donor/dashboard");
    else if (newRole === "RECIPIENT") router.push("/recipient/dashboard");
    else if (newRole === "VOLUNTEER") router.push("/volunteer/dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <PageHeader
        badge="PostgreSQL Identity Model"
        title="Account & Identity Profile"
        description="Active authenticated session details, organization affiliations, and role-based permissions."
      />

      {/* Profile Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0c2618] to-[#16462d] text-2xl font-black text-[#c9f36b] shadow-md">
            {user?.name?.[0] || "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">{user?.name}</h2>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black text-emerald-800 border border-emerald-200">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <p className="text-xs font-semibold text-slate-700 mt-1">
              Organization: <strong>{user?.organizationName || "Independent Operator"}</strong>
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 text-xs">
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Session Mechanism
            </span>
            <div className="mt-1 font-mono font-bold text-slate-800">
              HTTP-only Cookie (replate_session)
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Stored securely by browser; immune to client-side XSS leaks.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              API Connection Target
            </span>
            <div className="mt-1 font-mono font-bold text-slate-800">
              http://localhost:4000/api
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Express TypeScript Backend + PostgreSQL 16
            </p>
          </div>
        </div>

        {/* Demo Role Switcher Inside Profile */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h3 className="text-sm font-black text-slate-900 mb-3">
            Quick Persona Switcher for Presentation:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(["ADMIN", "DONOR", "RECIPIENT", "VOLUNTEER"] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => switchRole(r)}
                className={`p-3 rounded-2xl border text-xs font-bold transition flex flex-col justify-between ${
                  user?.role === r
                    ? "bg-emerald-900 text-white border-emerald-900 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300"
                }`}
              >
                <span>{r}</span>
                <span className="text-[10px] font-normal opacity-70 mt-1">
                  {r === "ADMIN" ? "Operations" : r === "DONOR" ? "Kitchens" : r === "RECIPIENT" ? "Shelters" : "Fleet"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
