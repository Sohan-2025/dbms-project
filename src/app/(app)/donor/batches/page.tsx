"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { BatchStatus, FoodBatch } from "@/types/api";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar, Table, TableShell, Button } from "@/components/ui";
import { StatusBadge } from "@/components/StatusBadge";
import { fmtQty, expiryLabel, fmtDate } from "@/lib/format";
import { PackagePlus, Clock, ArrowRight } from "lucide-react";

export default function DonorBatchesPage() {
  const [data, setData] = useState<FoodBatch[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BatchStatus | "">("");

  const loadData = () => {
    api.donorBatches(1, 50, status || undefined, search).then((x) => setData(x.data));
  };

  useEffect(() => {
    loadData();
  }, [search, status]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <PageHeader
        badge="Donor Inventory Desk"
        title="Active Food Batches"
        description="Track all surplus registered by your kitchen, live available balance, and allocation status."
        action={
          <Link href="/donor/batches/new">
            <Button variant="primary">
              <PackagePlus size={16} />
              <span>Register Surplus</span>
            </Button>
          </Link>
        }
      />

      {/* Search and Filters */}
      <div className="grid gap-3 md:grid-cols-[1fr_260px]">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by food name..."
        />
        <select
          className="rounded-2xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-bold text-slate-800 shadow-xs outline-none focus:border-emerald-600"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="">All Batches ({data.length})</option>
          <option value="PENDING_INSPECTION">Pending Inspection</option>
          <option value="AVAILABLE">Available / Approved</option>
          <option value="PARTIALLY_ALLOCATED">Partially Allocated</option>
          <option value="FULLY_ALLOCATED">Fully Allocated</option>
          <option value="EXPIRED">Expired</option>
        </select>
      </div>

      {/* Table */}
      <TableShell>
        <Table>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <th className="p-4">Food Item</th>
              <th className="p-4">Available Quantity</th>
              <th className="p-4">Safe Expiry Window</th>
              <th className="p-4">Location</th>
              <th className="p-4">Storage Conditions</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((b) => (
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
                <td className="p-4 text-xs font-bold text-slate-800">
                  {expiryLabel(b.expiryAt)}
                </td>
                <td className="p-4 text-xs text-slate-600">
                  <div className="font-medium text-slate-800">{b.location.label}</div>
                  <div className="text-slate-400">{b.location.city}</div>
                </td>
                <td className="p-4">
                  {b.foodType.requiresRefrigeration ? (
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                      Cold Storage (≤4°C)
                    </span>
                  ) : (
                    <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                      Ambient
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <StatusBadge status={b.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableShell>

    </div>
  );
}
