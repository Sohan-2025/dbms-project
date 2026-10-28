"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { FoodRequest, FoodRequestStatus } from "@/types/api";
import { PageHeader } from "@/components/PageHeader";
import { Table, TableShell, Button } from "@/components/ui";
import { StatusBadge } from "@/components/StatusBadge";
import { fmtQty, fmtDateTime } from "@/lib/format";
import { PlusCircle, Clock, CheckCircle2 } from "lucide-react";

export default function RecipientRequestsPage() {
  const [data, setData] = useState<FoodRequest[]>([]);
  const [status, setStatus] = useState<FoodRequestStatus | "">("");

  const loadData = () => {
    api.recipientRequests(1, 50, status || undefined).then((x) => setData(x.data));
  };

  useEffect(() => {
    loadData();
  }, [status]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <PageHeader
        badge="Beneficiary Demand"
        title="Community Food Requests"
        description="Track all demand tickets logged by your organization, fulfilment progress, and delivery targets."
        action={
          <Link href="/recipient/requests/new">
            <Button variant="primary">
              <PlusCircle size={16} />
              <span>New Request</span>
            </Button>
          </Link>
        }
      />

      {/* Filter */}
      <div className="flex gap-2">
        <select
          className="rounded-2xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-bold text-slate-800 shadow-xs outline-none focus:border-emerald-600"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="">All Statuses ({data.length})</option>
          <option value="OPEN">Open (Waiting for match)</option>
          <option value="PARTIALLY_FULFILLED">Partially Fulfilled</option>
          <option value="FULFILLED">Fulfilled</option>
        </select>
      </div>

      {/* Table */}
      <TableShell>
        <Table>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <th className="p-4">Food Demand Item</th>
              <th className="p-4">Fulfilled / Target</th>
              <th className="p-4">Required Before</th>
              <th className="p-4">Urgency Priority</th>
              <th className="p-4">Fulfilment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((r) => {
              const pct = Math.round((r.fulfilledQuantity / r.requestedQuantity) * 100);
              return (
                <tr key={r.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{r.foodType.name}</div>
                    <div className="text-xs text-slate-400">
                      {r.foodType.category.name} · {r.notes || "Community meal distribution"}
                    </div>
                  </td>
                  <td className="p-4 font-mono">
                    <div className="font-bold text-slate-900 text-xs">
                      {fmtQty(r.fulfilledQuantity, r.unit)} / {fmtQty(r.requestedQuantity, r.unit)}
                    </div>
                    <div className="mt-1.5 h-1.5 w-28 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">{pct}% bound</span>
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

    </div>
  );
}
