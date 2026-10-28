"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Allocation } from "@/types/api";
import { PageHeader } from "@/components/PageHeader";
import { Table, TableShell } from "@/components/ui";
import { StatusBadge } from "@/components/StatusBadge";
import { fmtQty, fmtDateTime, expiryLabel } from "@/lib/format";
import { Boxes, Truck, ShieldCheck, MapPin, CheckCircle2 } from "lucide-react";

export default function RecipientAllocationsPage() {
  const [data, setData] = useState<Allocation[]>([]);

  useEffect(() => {
    api.recipientAllocations(1, 50).then((x) => setData(x.data));
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <PageHeader
        badge="Supply Binding & Traceability"
        title="Allocated Food Batches"
        description="Verified surplus batches assigned to your organization, including immutable expiry snapshots and volunteer delivery progress."
      />

      {/* Allocations Table */}
      <TableShell>
        <Table>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <th className="p-4">Allocated Food Item</th>
              <th className="p-4">Donor Kitchen Origin</th>
              <th className="p-4">Bound Quantity</th>
              <th className="p-4">Expiry Snapshot</th>
              <th className="p-4">Allocation Time</th>
              <th className="p-4">Logistics Journey Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50/60 transition">
                <td className="p-4">
                  <div className="font-bold text-slate-900">{a.foodName}</div>
                  <div className="text-xs text-slate-400 font-mono">
                    Alloc ID: #{a.id.slice(-6).toUpperCase()}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-slate-800 text-xs">{a.donorName}</div>
                  <div className="text-[11px] text-emerald-700 font-bold">QA Inspected ✓</div>
                </td>
                <td className="p-4 font-mono font-bold text-slate-900 text-xs">
                  {fmtQty(a.quantity, a.unit)}
                </td>
                <td className="p-4 text-xs font-bold text-slate-700">
                  {a.expirySnapshot ? expiryLabel(a.expirySnapshot) : "Safe for 8h"}
                </td>
                <td className="p-4 text-xs font-medium text-slate-600">
                  {fmtDateTime(a.allocatedAt)}
                </td>
                <td className="p-4">
                  <StatusBadge status={a.status} />
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-400">
                  No allocations currently active for this recipient account.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableShell>

    </div>
  );
}
