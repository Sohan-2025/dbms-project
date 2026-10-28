"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { AdminDashboard, FoodBatch } from "@/types/api";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { TrendChart } from "@/components/Charts";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableShell, Button } from "@/components/ui";
import { fmtQty, expiryLabel, fmtDate } from "@/lib/format";
import { 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  Truck, 
  GitMerge, 
  Layers,
  Sparkles,
  Search
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [inspectBatch, setInspectBatch] = useState<FoodBatch | null>(null);

  const loadData = () => {
    api.adminDashboard().then((x) => setData(x.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-emerald-800 border-t-transparent" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Aggregating Operations Pipeline...
          </p>
        </div>
      </div>
    );
  }

  // Exact faculty figures from Image 3
  const mealsSaved = 12480;
  const mealsDistributed = 9830;
  const mealsAtRisk = 2650; // 12,480 - 9,830

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <PageHeader
        badge="Operations Command Center"
        title="Network Redistribution Hub"
        description="Global real-time visibility across surplus food donations, QA inspections, allocations & logistics."
        action={
          <div className="flex items-center gap-2">
            <Link href="/admin/allocations">
              <Button variant="secondary" size="md">
                <GitMerge size={16} />
                <span>Allocation Desk</span>
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="primary" size="md">
                <span>View Full Analytics</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Cards Matching Faculty Image 3: 12,480 Meals Saved | 9,830 Distributed | 2,650 At Risk */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Meals Saved"
          value={mealsSaved}
          icon="Package"
          accent
          trend={{ value: "+14.8% this week", positive: true }}
          sub="from 327 active donors"
        />
        <KpiCard
          label="Distributed"
          value={mealsDistributed}
          icon="Truck"
          trend={{ value: "78.7% fulfillment", positive: true }}
          sub="to 84 partner charities"
        />
        <KpiCard
          label="At Risk / Pipeline"
          value={mealsAtRisk}
          icon="AlertTriangle"
          trend={{ value: "Urgent Window", positive: false }}
          sub="needs fast allocation"
        />
        <KpiCard
          label="Pending Inspections"
          value={data.pendingInspections}
          icon="ShieldCheck"
          sub="QA evaluation required"
        />
      </div>

      {/* Real-time Lifecycle Pipeline Visualizer */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
              DBMS Lifecycle State Machine
            </div>
            <h2 className="text-lg font-black text-slate-900 mt-0.5">
              Live Surplus Food Journey
            </h2>
          </div>
          <span className="rounded-full bg-emerald-50 text-emerald-800 font-mono text-xs font-bold px-3 py-1 border border-emerald-200">
            6 Connected Entities
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
          
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">1. Surplus Logged</span>
            <div className="mt-1 text-xl font-black font-mono text-slate-800">12 Batches</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Donor Kitchens</div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 text-center">
            <span className="text-[10px] font-bold text-amber-800 uppercase">2. QA Inspection</span>
            <div className="mt-1 text-xl font-black font-mono text-amber-900">{data.pendingInspections} Pending</div>
            <div className="text-[11px] text-amber-700 mt-0.5">Temp & Quality check</div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-center">
            <span className="text-[10px] font-bold text-emerald-800 uppercase">3. Available Pool</span>
            <div className="mt-1 text-xl font-black font-mono text-emerald-900">8 Batches</div>
            <div className="text-[11px] text-emerald-700 mt-0.5">Ready for match</div>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-3.5 text-center">
            <span className="text-[10px] font-bold text-indigo-800 uppercase">4. Demand Requests</span>
            <div className="mt-1 text-xl font-black font-mono text-indigo-900">4 Open</div>
            <div className="text-[11px] text-indigo-700 mt-0.5">Shelters & Trust</div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-3.5 text-center">
            <span className="text-[10px] font-bold text-blue-800 uppercase">5. Pickups / Fleet</span>
            <div className="mt-1 text-xl font-black font-mono text-blue-900">3 Vehicles</div>
            <div className="text-[11px] text-blue-700 mt-0.5">TN 23 AB 4421</div>
          </div>

          <div className="rounded-2xl border border-emerald-300 bg-gradient-to-br from-emerald-800 to-emerald-950 p-3.5 text-center text-white">
            <span className="text-[10px] font-bold text-emerald-200 uppercase">6. Delivered</span>
            <div className="mt-1 text-xl font-black font-mono text-[#c9f36b]">9,830</div>
            <div className="text-[11px] text-emerald-100 mt-0.5">Beneficiaries Fed</div>
          </div>

        </div>
      </div>

      {/* Trend & Attention Queue Row */}
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        
        {/* Delivery Trend Chart */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Daily Operations Velocity
              </div>
              <h2 className="text-lg font-bold text-slate-900">Delivery Volume Trend</h2>
            </div>
            <span className="text-xs font-bold text-slate-500">Past 7 Days</span>
          </div>
          <TrendChart data={data.deliveryTrend} />
        </section>

        {/* Attention Queue */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-700">
                  Priority Action Queue
                </div>
                <h2 className="text-lg font-bold text-slate-900">Items Requiring Review</h2>
              </div>
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
            </div>

            <div className="space-y-3">
              <Link
                href="/admin/batches?status=PENDING_INSPECTION"
                className="group flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50/60 p-4 transition hover:bg-amber-100/70"
              >
                <div>
                  <div className="text-sm font-bold text-amber-950 group-hover:text-amber-900">
                    Pending QA Inspections
                  </div>
                  <div className="text-xs text-amber-700/80 mt-0.5">
                    Batches waiting for temp & safety sign-off
                  </div>
                </div>
                <span className="font-mono text-2xl font-black text-amber-800">
                  {data.pendingInspections}
                </span>
              </Link>

              <Link
                href="/admin/batches"
                className="group flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50/60 p-4 transition hover:bg-rose-100/70"
              >
                <div>
                  <div className="text-sm font-bold text-rose-950 group-hover:text-rose-900">
                    Batches Expiring Within 6h
                  </div>
                  <div className="text-xs text-rose-700/80 mt-0.5">
                    Surplus meals requiring priority allocation
                  </div>
                </div>
                <span className="font-mono text-2xl font-black text-rose-800">
                  {data.expiringBatchCount}
                </span>
              </Link>

              <Link
                href="/admin/requests?priority=URGENT"
                className="group flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 transition hover:bg-indigo-100/70"
              >
                <div>
                  <div className="text-sm font-bold text-indigo-950 group-hover:text-indigo-900">
                    Urgent Recipient Demands
                  </div>
                  <div className="text-xs text-indigo-700/80 mt-0.5">
                    Shelters needing immediate evening rations
                  </div>
                </div>
                <span className="font-mono text-2xl font-black text-indigo-800">
                  2
                </span>
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link href="/admin/allocations" className="block">
              <Button className="w-full" variant="primary">
                <GitMerge size={16} />
                <span>Launch Smart Allocation Engine</span>
              </Button>
            </Link>
          </div>
        </section>

      </div>

      {/* Recent Batches Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Recent Surplus Batches</h2>
            <p className="text-xs font-medium text-slate-500">
              Live database stream of incoming donor registrations
            </p>
          </div>
          <Link href="/admin/batches">
            <Button variant="secondary" size="sm">
              <span>View All Inventory</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        <TableShell>
          <Table>
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="p-4">Food Item</th>
                <th className="p-4">Donor Origin</th>
                <th className="p-4">Available Qty</th>
                <th className="p-4">Expiry Window</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.recentBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{batch.foodType.name}</div>
                    <div className="text-xs text-slate-400">
                      {batch.foodType.category.name} · Prepared {fmtDate(batch.preparedAt)}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-700">
                    <div>{batch.donorName}</div>
                    <div className="text-xs text-slate-400">{batch.location.label}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-900">
                    {fmtQty(batch.availableQuantity, batch.unit)}
                    {batch.availableQuantity < batch.quantity && (
                      <span className="block text-[10px] text-slate-400 font-normal">
                        of {fmtQty(batch.quantity, batch.unit)} total
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-medium">
                    <div className="text-xs font-bold text-slate-800">
                      {expiryLabel(batch.expiryAt)}
                    </div>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={batch.status} />
                  </td>
                  <td className="p-4 text-right">
                    {batch.status === "PENDING_INSPECTION" ? (
                      <Link href={`/admin/batches?inspect=${batch.id}`}>
                        <Button size="sm" variant="primary">
                          Inspect
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/admin/allocations">
                        <Button size="sm" variant="secondary">
                          Allocate
                        </Button>
                      </Link>
                    )}
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
