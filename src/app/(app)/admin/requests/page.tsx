"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { FoodRequest, FoodRequestStatus, Priority } from "@/types/api";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar, Table, TableShell, Button } from "@/components/ui";
import { StatusBadge } from "@/components/StatusBadge";
import { fmtQty, fmtDateTime } from "@/lib/format";
import { ClipboardList, GitMerge, AlertCircle, Clock } from "lucide-react";

export default function AdminRequestsPage() {
  const [data, setData] = useState<FoodRequest[]>([]);
  const [status, setStatus] = useState<FoodRequestStatus | "">("");
  const [priority, setPriority] = useState<Priority | "">("");

  const loadData = () => {
    api.adminRequests(1, 50, status || undefined, priority || undefined).then((x) => setData(x.data));
  };

  useEffect(() => {
    loadData();
  }, [status, priority]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <PageHeader
        badge="Beneficiary Demand Pipeline"
        title="Recipient Food Requests"
        description="Monitor community demand from shelters, ashrams, and kitchens. Prioritize urgent requirements for immediate allocation."
        action={
          <Link href="/admin/allocations">
            <Button variant="primary">
              <GitMerge size={16} />
              <span>Match & Allocate</span>
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          className="rounded-2xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-bold text-slate-800 shadow-xs outline-none focus:border-emerald-600"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="">All Statuses ({data.length})</option>
          <option value="OPEN">Open (Unfulfilled)</option>
          <option value="PARTIALLY_FULFILLED">Partially Fulfilled</option>
          <option value="FULFILLED">Fulfilled</option>
        </select>

        <select
          className="rounded-2xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-bold text-slate-800 shadow-xs outline-none focus:border-emerald-600"
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
        >
          <option value="">All Priorities</option>
          <option value="URGENT">Urgent (Red Alert)</option>
          <option value="HIGH">High Priority</option>
          <option value="NORMAL">Normal</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Table */}
      <TableShell>
        <Table>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <th className="p-4">Recipient Organization</th>
              <th className="p-4">Requested Food</th>
              <th className="p-4">Demand Fulfilment</th>
              <th className="p-4">Required Before</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((r) => {
              const remaining = r.requestedQuantity - r.fulfilledQuantity;
              const pct = Math.round((r.fulfilledQuantity / r.requestedQuantity) * 100);
              return (
                <tr key={r.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{r.recipientName || "Shelter"}</div>
                    <div className="text-xs text-slate-400">
                      {r.notes || "Standard dietary meal distribution"}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{r.foodType.name}</div>
                    <div className="text-xs text-slate-400">{r.foodType.category.name}</div>
                  </td>
                  <td className="p-4 font-mono">
                    <div className="font-bold text-slate-900 text-xs">
                      {fmtQty(r.fulfilledQuantity, r.unit)} / {fmtQty(r.requestedQuantity, r.unit)}
                    </div>
                    <div className="mt-1 h-1.5 w-28 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">{pct}% fulfilled</span>
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
                  <td className="p-4 text-right">
                    {r.status !== "FULFILLED" && (
                      <Link href="/admin/allocations">
                        <Button size="sm" variant="primary">
                          Allocate
                        </Button>
                      </Link>
                    )}
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
