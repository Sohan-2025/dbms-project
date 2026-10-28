"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { Pickup } from "@/types/api";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button, Table, TableShell } from "@/components/ui";
import { fmtDateTime } from "@/lib/format";
import { 
  Truck, 
  CheckCircle2, 
  MapPin, 
  ArrowRight, 
  AlertCircle, 
  Clock, 
  PackageCheck 
} from "lucide-react";

export default function VolunteerPickupsPage() {
  const [data, setData] = useState<Pickup[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    const x = await api.volunteerPickups();
    setData(x.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  async function advanceMission(p: Pickup) {
    const nextStatus =
      p.status === "SCHEDULED"
        ? "ACCEPTED"
        : p.status === "ACCEPTED"
        ? "PICKED_UP"
        : p.status === "PICKED_UP"
        ? "DELIVERED"
        : null;

    if (!nextStatus) return;

    setError("");
    setSuccess("");

    try {
      await api.updatePickupStatus(p.id, {
        status: nextStatus as any,
        ...(nextStatus === "PICKED_UP" ? { pickedAt: new Date().toISOString() } : {}),
        ...(nextStatus === "DELIVERED"
          ? { deliveredAt: new Date().toISOString(), receivedQuantity: 70 }
          : {})
      });

      setSuccess(`✓ Mission #${p.id.slice(-6).toUpperCase()} updated to ${nextStatus}.`);
      await loadData();
    } catch (e: any) {
      setError(e instanceof ApiError ? e.message : "Unable to advance mission");
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <PageHeader
        badge="Logistics Execution & Audit"
        title="Assigned Courier Missions"
        description="Advance pickup status in real-time. Timestamp checkpoints are automatically written to PostgreSQL delivery audit tables."
      />

      {error && (
        <div className="rounded-2xl bg-rose-50 p-3.5 text-xs font-bold text-rose-700 border border-rose-200 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="rounded-2xl bg-emerald-50 p-3.5 text-xs font-bold text-emerald-800 border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Pickups Table */}
      <TableShell>
        <Table>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <th className="p-4">Mission ID</th>
              <th className="p-4">Assigned Vehicle</th>
              <th className="p-4">Scheduled Window</th>
              <th className="p-4">Logistics Notes</th>
              <th className="p-4">Mission Status</th>
              <th className="p-4 text-right">Checkpoint Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((p) => {
              const isDone = p.status === "DELIVERED" || p.status === "FAILED" || p.status === "CANCELLED";
              const actionLabel =
                p.status === "SCHEDULED"
                  ? "1. Accept Mission"
                  : p.status === "ACCEPTED"
                  ? "2. Mark Picked Up"
                  : p.status === "PICKED_UP"
                  ? "3. Confirm Delivered"
                  : "Completed";

              return (
                <tr key={p.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-4">
                    <div className="font-mono font-bold text-slate-900 text-xs">
                      #{p.id.slice(-6).toUpperCase()}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Alloc: #{p.allocationId.slice(-6)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-mono font-bold text-slate-900 text-xs">
                      {p.vehicleNumber}
                    </div>
                    <div className="text-[10px] text-blue-700 font-bold">Cold Storage Van</div>
                  </td>
                  <td className="p-4 text-xs font-semibold text-slate-700">
                    {fmtDateTime(p.scheduledAt)}
                    {p.pickedAt && (
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Picked: {new Date(p.pickedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-xs text-slate-500 max-w-xs">
                    {p.notes || "Standard route protocol"}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="p-4 text-right">
                    {!isDone ? (
                      <Button
                        size="sm"
                        variant={p.status === "PICKED_UP" ? "primary" : "secondary"}
                        onClick={() => advanceMission(p)}
                      >
                        <PackageCheck size={14} />
                        <span>{actionLabel}</span>
                      </Button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <CheckCircle2 size={14} /> Verified Handover
                      </span>
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
