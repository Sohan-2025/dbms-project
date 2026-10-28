"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { DonorDashboard } from "@/types/api";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableShell, Button } from "@/components/ui";
import { fmtDate, fmtQty, expiryLabel } from "@/lib/format";
import { surplusForecasts } from "@/lib/mock";
import { 
  PackagePlus, 
  Utensils, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck,
  AlertTriangle
} from "lucide-react";

export default function DonorDashboardPage() {
  const [data, setData] = useState<DonorDashboard | null>(null);

  useEffect(() => {
    api.donorDashboard().then((x) => setData(x.data));
  }, []);

  if (!data) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-emerald-800 border-t-transparent" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Loading Donor Inventory...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <PageHeader
        badge="Donor Portal · Kitchen Operations"
        title="Surplus Food Hub"
        description="Register kitchen surplus, track quality inspection approvals, and prevent edible meals from entering landfill."
        action={
          <Link href="/donor/batches/new">
            <Button variant="primary" size="lg">
              <PackagePlus size={18} />
              <span>Register Surplus Batch</span>
            </Button>
          </Link>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total Registered"
          value={data.totalBatches}
          icon="Package"
          trend={{ value: "+8 this month", positive: true }}
          sub="Donation batches logged"
        />
        <KpiCard
          label="Food Donated"
          value={data.totalQuantityDonated}
          icon="Utensils"
          accent
          trend={{ value: "5,680 Portions", positive: true }}
          sub="Feed community shelters"
        />
        <KpiCard
          label="Available / Active"
          value={data.availableBatches}
          icon="Clock"
          sub="Ready in central pool"
        />
        <KpiCard
          label="Wastage Avoided"
          value="98.2%"
          icon="ShieldCheck"
          trend={{ value: "High Efficiency", positive: true }}
          sub="140 kg spoiled only"
        />
      </div>

      {/* Surplus Forecast Insight (DONOR + FOOD_TYPE -> SURPLUS_FORECAST from faculty schema) */}
      <div className="rounded-3xl border border-emerald-200/90 bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/50 p-6 shadow-xs">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-800 text-[#c9f36b] shadow-xs">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-base">
                  Surplus Forecast & Waste Prevention Advisory
                </h3>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  ML Prediction
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculated from <code className="font-mono text-emerald-800">surplus_forecasts</code> database table based on your day-of-week patterns.
              </p>
            </div>
          </div>
          <Link href="/donor/batches/new">
            <Button variant="secondary" size="sm">
              <span>Log Anticipated Batch</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {surplusForecasts.map((f, i) => (
            <div key={i} className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-800">{f.expectedDay}</span>
                <span className="font-mono text-[11px] font-bold bg-emerald-50 px-2 py-0.5 rounded text-emerald-700">
                  {f.confidenceScore}% confidence
                </span>
              </div>
              <div className="mt-2 text-sm font-black text-slate-900">{f.foodTypeName}</div>
              <div className="mt-1 font-mono font-bold text-emerald-700 text-xs">
                Expected ~{f.predictedSurplusQuantity} {f.unit}
              </div>
              <p className="mt-2 text-[11px] text-slate-500 leading-tight">
                {f.recommendedAction}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Batches */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Recent Kitchen Batches</h2>
            <p className="text-xs text-slate-500">
              Live status across QA inspection, allocation, and volunteer transport
            </p>
          </div>
          <Link href="/donor/batches">
            <Button variant="secondary" size="sm">
              <span>View Full Inventory</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        <TableShell>
          <Table>
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="p-4">Food Item</th>
                <th className="p-4">Quantity Available</th>
                <th className="p-4">Safe Expiry Window</th>
                <th className="p-4">Pickup Location</th>
                <th className="p-4">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.recentBatches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{b.foodType.name}</div>
                    <div className="text-xs text-slate-400">
                      {b.foodType.category.name} · Prepared {fmtDate(b.preparedAt)}
                    </div>
                  </td>
                  <td className="p-4 font-mono">
                    <div className="font-bold text-slate-900">
                      {fmtQty(b.availableQuantity, b.unit)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      of {fmtQty(b.quantity, b.unit)} total
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-bold text-slate-800">
                      {expiryLabel(b.expiryAt)}
                    </div>
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-600">
                    <div>{b.location.label}</div>
                    <div className="text-slate-400">{b.location.city}</div>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={b.status} />
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
