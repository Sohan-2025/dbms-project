"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { RecipientDashboard, FoodBatch, Allocation } from "@/types/api";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableShell, Button } from "@/components/ui";
import { fmtDate, fmtQty, fmtDateTime } from "@/lib/format";
import { 
  Utensils, 
  ClipboardList, 
  Boxes, 
  Truck, 
  ArrowRight, 
  Clock, 
  PlusCircle,
  HeartHandshake
} from "lucide-react";

export default function RecipientDashboardPage() {
  const [data, setData] = useState<RecipientDashboard | null>(null);
  const [allocations, setAllocations] = useState<Allocation[]>([]);

  useEffect(() => {
    Promise.all([api.recipientDashboard(), api.recipientAllocations()]).then(([d, a]) => {
      setData(d.data);
      setAllocations(a.data);
    });
  }, []);

  if (!data) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-emerald-800 border-t-transparent" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Loading Recipient Center...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <PageHeader
        badge="Recipient Portal · Community Welfare"
        title="Beneficiary Operations Desk"
        description="Browse available surplus meals, submit dietary requests for community shelters, and track incoming logistics."
        action={
          <div className="flex items-center gap-2">
            <Link href="/recipient/food">
              <Button variant="secondary">
                <Utensils size={16} />
                <span>Browse Available Food</span>
              </Button>
            </Link>
            <Link href="/recipient/requests/new">
              <Button variant="primary">
                <PlusCircle size={16} />
                <span>New Food Request</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Open Requests"
          value={data.openRequests}
          icon="ClipboardList"
          trend={{ value: "Pending Fulfilment", positive: false }}
          sub="Meals needed by shelter"
        />
        <KpiCard
          label="Fulfilled Requests"
          value={data.fulfilledRequests}
          icon="HeartHandshake"
          accent
          trend={{ value: "+6 this week", positive: true }}
          sub="Successfully received"
        />
        <KpiCard
          label="Active Allocations"
          value={data.activeAllocations}
          icon="Boxes"
          sub="Bound batches in queue"
        />
        <KpiCard
          label="Community Impact"
          value="4,850"
          icon="Utensils"
          sub="Meals served this month"
        />
      </div>

      {/* Active Incoming Shipments Banner */}
      <div className="rounded-3xl border border-blue-200/90 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/50 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-xs">
              <Truck size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                Incoming Surplus Deliveries
              </h3>
              <p className="text-xs text-slate-500">
                Track volunteer couriers currently dispatched to transport meals to your facility.
              </p>
            </div>
          </div>
          <Link href="/recipient/allocations">
            <Button variant="secondary" size="sm">
              <span>View All Shipments</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allocations.slice(0, 2).map((a) => (
            <div key={a.id} className="rounded-2xl border border-blue-100 bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{a.foodName}</span>
                <StatusBadge status={a.status} />
              </div>
              <div className="mt-2 text-xs text-slate-600 flex items-center justify-between">
                <span>Origin: <strong>{a.donorName}</strong></span>
                <span className="font-mono font-bold text-blue-900">{fmtQty(a.quantity, a.unit)}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Allocated: {fmtDate(a.allocatedAt)}</span>
                <span className="text-emerald-700 font-bold">QA Inspected ✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Requests Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Recent Food Requests</h2>
            <p className="text-xs text-slate-500">
              Demand logged for your shelters, kitchens, and welfare homes
            </p>
          </div>
          <Link href="/recipient/requests">
            <Button variant="secondary" size="sm">
              <span>View All Requests</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        <TableShell>
          <Table>
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="p-4">Requested Food Type</th>
                <th className="p-4">Fulfilled / Target</th>
                <th className="p-4">Required Before</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.recentRequests.map((r) => {
                const pct = Math.round((r.fulfilledQuantity / r.requestedQuantity) * 100);
                return (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{r.foodType.name}</div>
                      <div className="text-xs text-slate-400">
                        {r.foodType.category.name} · {r.notes || "Standard meal ration"}
                      </div>
                    </td>
                    <td className="p-4 font-mono">
                      <div className="font-bold text-slate-900 text-xs">
                        {fmtQty(r.fulfilledQuantity, r.unit)} / {fmtQty(r.requestedQuantity, r.unit)}
                      </div>
                      <div className="mt-1 h-1.5 w-24 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-4 text-xs font-bold text-slate-700">
                      {fmtDateTime(r.requiredBefore)}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={r.priority} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </TableShell>
      </section>

    </div>
  );
}
