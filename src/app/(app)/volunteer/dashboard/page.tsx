"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Pickup } from "@/types/api";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableShell, Button } from "@/components/ui";
import { fmtDateTime } from "@/lib/format";
import { Truck, CheckCircle2, MapPin, ArrowRight, ShieldCheck, Clock } from "lucide-react";

export default function VolunteerDashboardPage() {
  const [pickups, setPickups] = useState<Pickup[]>([]);

  useEffect(() => {
    api.volunteerPickups(1, 50).then((x) => setPickups(x.data));
  }, []);

  const activeMissions = pickups.filter(
    (p) => p.status === "SCHEDULED" || p.status === "ACCEPTED" || p.status === "PICKED_UP"
  ).length;

  const completed = pickups.filter((p) => p.status === "DELIVERED").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        badge="Volunteer Portal · Logistics Fleet"
        title="Fleet Dispatch & Courier Hub"
        description="Transport surplus food from certified donor kitchens to verified community shelters and record safe handover timestamps."
        action={
          <Link href="/volunteer/pickups">
            <Button variant="primary">
              <Truck size={16} />
              <span>View Assigned Missions</span>
            </Button>
          </Link>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Active Missions"
          value={activeMissions}
          icon="Truck"
          accent
          trend={{ value: "In Pipeline", positive: true }}
          sub="Pickups requiring execution"
        />
        <KpiCard
          label="Completed Deliveries"
          value={completed}
          icon="CheckCircle2"
          trend={{ value: "100% On-Time", positive: true }}
          sub="Beneficiary drops verified"
        />
        <KpiCard
          label="Assigned Vehicle"
          value="TN 23 AB 4421"
          icon="ShieldCheck"
          sub="Refrigerated Van (≤4°C)"
        />
        <KpiCard
          label="Volunteer Rating"
          value="4.9 / 5.0"
          icon="Award"
          sub="Logistics reliability score"
        />
      </div>

      {/* Assigned Missions Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Your Assigned Courier Missions</h2>
            <p className="text-xs text-slate-500">
              Update task progress as you arrive at the donor site and complete shelter delivery
            </p>
          </div>
          <Link href="/volunteer/pickups">
            <Button variant="secondary" size="sm">
              <span>Launch Mission Controller</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        <TableShell>
          <Table>
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="p-4">Mission ID</th>
                <th className="p-4">Assigned Vehicle</th>
                <th className="p-4">Scheduled Window</th>
                <th className="p-4">Handling Instructions</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pickups.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-4 font-mono font-bold text-slate-900 text-xs">
                    #{p.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="p-4">
                    <div className="font-mono font-bold text-slate-900 text-xs">
                      {p.vehicleNumber}
                    </div>
                    <div className="text-[10px] text-blue-700 font-bold">Cold Storage Van</div>
                  </td>
                  <td className="p-4 text-xs font-semibold text-slate-700">
                    {fmtDateTime(p.scheduledAt)}
                  </td>
                  <td className="p-4 text-xs text-slate-500">
                    {p.notes || "Standard food handling protocol; maintain closed containers."}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="p-4 text-right">
                    <Link href="/volunteer/pickups">
                      <Button size="sm" variant="primary">
                        Update Progress
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableShell>
      </section>
    </div>
  );
}
