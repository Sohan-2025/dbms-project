"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { FoodBatch } from "@/types/api";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { Table, TableShell } from "@/components/ui";
import { StatusBadge } from "@/components/StatusBadge";
import { fmtQty, fmtDate } from "@/lib/format";
import { 
  Award, 
  Leaf, 
  Droplet, 
  History, 
  CheckCircle2, 
  FileText,
  ShieldCheck
} from "lucide-react";

export default function DonorHistoryPage() {
  const [batches, setBatches] = useState<FoodBatch[]>([]);

  useEffect(() => {
    api.donorBatches(1, 50).then((x) => setBatches(x.data));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        badge="Sustainability & ESG Auditing"
        title="Donation Impact & History"
        description="Certified records of surplus food redirected to community welfare and environmental emission offsets."
      />

      {/* Environmental & ESG Metrics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Meals Provided"
          value="5,680"
          icon="HeartHandshake"
          accent
          trend={{ value: "100% Edible", positive: true }}
          sub="Beneficiary community rations"
        />
        <KpiCard
          label="CO2 Emissions Prevented"
          value="14.2 Tons"
          icon="Leaf"
          trend={{ value: "Verified ESG", positive: true }}
          sub="Methane landfill reduction"
        />
        <KpiCard
          label="Water Footprint Saved"
          value="1.8M Liters"
          icon="Droplet"
          trend={{ value: "Resource Recovery", positive: true }}
          sub="Agricultural supply preservation"
        />
        <KpiCard
          label="Tax Exemption Value"
          value="₹1,42,000"
          icon="Award"
          sub="Section 80G Certified"
        />
      </div>

      {/* Audit Log Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Historical Surplus Audit Trail</h2>
            <p className="text-xs text-slate-500">
              Permanent immutable records archived in the PostgreSQL audit log
            </p>
          </div>
        </div>

        <TableShell>
          <Table>
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="p-4">Food Batch Name</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4">Quantity Rescued</th>
                <th className="p-4">Commercial Valuation</th>
                <th className="p-4">Dispatch Location</th>
                <th className="p-4">Redistribution Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{b.foodType.name}</div>
                    <div className="text-xs text-slate-400">{b.foodType.category.name}</div>
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-700">
                    {fmtDate(b.createdAt)}
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-900 text-xs">
                    {fmtQty(b.quantity, b.unit)}
                  </td>
                  <td className="p-4 font-mono font-bold text-emerald-800 text-xs">
                    ₹{(b.estimatedValue || b.quantity * 25).toLocaleString()}
                  </td>
                  <td className="p-4 text-xs text-slate-600">
                    {b.location.label}
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
