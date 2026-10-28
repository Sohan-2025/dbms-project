"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui";
import { mockUsers } from "@/lib/mock";
import { api } from "@/lib/api";
import type { UserRole } from "@/types/api";
import { 
  Users, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Database
} from "lucide-react";

export default function AdminUsersPage() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<UserRole>("ADMIN");

  const switchAccount = (role: UserRole) => {
    api.switchRole(role);
    setActiveRole(role);
    if (role === "ADMIN") router.push("/admin/dashboard");
    else if (role === "DONOR") router.push("/donor/dashboard");
    else if (role === "RECIPIENT") router.push("/recipient/dashboard");
    else if (role === "VOLUNTEER") router.push("/volunteer/dashboard");
  };

  const usersList = Object.values(mockUsers);

  const permissionsMatrix = [
    { module: "Register Surplus Food Batches", donor: true, recipient: false, volunteer: false, admin: true },
    { module: "Quality Inspection & QA Temperature Sign-Off", donor: false, recipient: false, volunteer: false, admin: true },
    { module: "Browse Available Food Marketplace", donor: false, recipient: true, volunteer: false, admin: true },
    { module: "Log Demand Requests for Meals", donor: false, recipient: true, volunteer: false, admin: true },
    { module: "Execute Concurrency-Locked Allocations", donor: false, recipient: false, volunteer: false, admin: true },
    { module: "Logistics Vehicle & Pickup Dispatch", donor: false, recipient: false, volunteer: false, admin: true },
    { module: "Update Live Pickup / Delivery Status", donor: false, recipient: false, volunteer: true, admin: true },
    { module: "Global Network Analytics & Aggregations", donor: false, recipient: false, volunteer: false, admin: true }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        badge="PostgreSQL Role-Based Access Control (RBAC)"
        title="Participant Directory & Identity Control"
        description="User roles, permissions matrix, and seeded demo accounts across Donor, Recipient, Volunteer, and Operations personas."
      />

      {/* User Directory Cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {usersList.map((u) => (
          <div
            key={u.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 border border-emerald-200">
                  {u.role}
                </span>
                <span className="font-mono text-[10px] text-slate-400">UUID Verified</span>
              </div>

              <div className="mt-4">
                <h3 className="font-bold text-base text-slate-900">{u.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{u.email}</p>
                <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 font-medium">
                  Org: <strong>{u.organizationName}</strong>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => switchAccount(u.role)}
              >
                <span>Switch to {u.role}</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Matrix */}
      <section className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs">
        <div className="flex items-center justify-between border-b pb-4 mb-5">
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
              Security Specifications
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">
              Role Privilege Matrix
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            HTTP-only Cookie Session: replate_session
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-3">Platform Capability / API Endpoint</th>
                <th className="p-3 text-center">Donor</th>
                <th className="p-3 text-center">Recipient</th>
                <th className="p-3 text-center">Volunteer</th>
                <th className="p-3 text-center">Admin / Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsMatrix.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="p-3 font-semibold text-slate-800">{p.module}</td>
                  <td className="p-3 text-center">
                    {p.donor ? (
                      <span className="text-emerald-700 font-black">✓ Allowed</span>
                    ) : (
                      <span className="text-slate-300 font-bold">―</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {p.recipient ? (
                      <span className="text-emerald-700 font-black">✓ Allowed</span>
                    ) : (
                      <span className="text-slate-300 font-bold">―</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {p.volunteer ? (
                      <span className="text-emerald-700 font-black">✓ Allowed</span>
                    ) : (
                      <span className="text-slate-300 font-bold">―</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {p.admin ? (
                      <span className="text-emerald-700 font-black">✓ Allowed</span>
                    ) : (
                      <span className="text-slate-300 font-bold">―</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
