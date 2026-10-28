"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import type { BatchStatus, FoodBatch } from "@/types/api";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar, Table, TableShell, Button } from "@/components/ui";
import { StatusBadge } from "@/components/StatusBadge";
import { fmtQty, expiryLabel, fmtDate } from "@/lib/format";
import { 
  ShieldCheck, 
  Thermometer, 
  Star, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Filter,
  Package,
  Clock
} from "lucide-react";

export default function AdminBatchesPage() {
  const searchParams = useSearchParams();
  const initialInspectId = searchParams.get("inspect");

  const [data, setData] = useState<FoodBatch[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BatchStatus | "">("");
  const [selectedBatch, setSelectedBatch] = useState<FoodBatch | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const loadData = () => {
    api.adminBatches(1, 50, status || undefined, search).then((x) => {
      setData(x.data);
      if (initialInspectId) {
        const target = x.data.find((b) => b.id === initialInspectId);
        if (target) setSelectedBatch(target);
      }
    });
  };

  useEffect(() => {
    loadData();
  }, [search, status]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-900 text-white px-5 py-3.5 shadow-2xl border border-emerald-700 animate-slide-up">
          <CheckCircle2 size={18} className="text-emerald-300" />
          <span className="text-sm font-bold">{notification}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        badge="Quality Assurance & Verification"
        title="Food Operations & Batch QA"
        description="Inspect registered surplus batches, record thermal compliance, and authorize stock into the active redistribution pool."
      />

      {/* Filter Bar */}
      <div className="grid gap-3 md:grid-cols-[1fr_260px]">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Filter by food name or donor origin..."
        />
        <div className="relative">
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-4 text-sm font-bold text-slate-800 shadow-xs outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/10 cursor-pointer"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="">All Statuses ({data.length})</option>
            <option value="PENDING_INSPECTION">Pending QA Inspection</option>
            <option value="AVAILABLE">Available / Approved</option>
            <option value="PARTIALLY_ALLOCATED">Partially Allocated</option>
            <option value="FULLY_ALLOCATED">Fully Allocated</option>
            <option value="EXPIRED">Expired</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Batches Table */}
      <TableShell>
        <Table>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <th className="p-4">Food Batch</th>
              <th className="p-4">Donor Organization</th>
              <th className="p-4">Total / Available</th>
              <th className="p-4">Safe Expiry Window</th>
              <th className="p-4">Storage Criteria</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Verification Action</th>
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
                <td className="p-4">
                  <div className="font-medium text-slate-800">{b.donorName}</div>
                  <div className="text-xs text-slate-400">{b.location.label}</div>
                </td>
                <td className="p-4 font-mono">
                  <div className="font-bold text-slate-900">
                    {fmtQty(b.availableQuantity, b.unit)}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    of {fmtQty(b.quantity, b.unit)} original
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-xs text-slate-800">
                    {expiryLabel(b.expiryAt)}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {b.foodType.requiresRefrigeration && (
                      <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                        Cold Chain
                      </span>
                    )}
                    {b.foodType.allergens.length > 0 ? (
                      <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                        Allergens: {b.foodType.allergens.join(", ")}
                      </span>
                    ) : (
                      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                        Allergen Free
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <StatusBadge status={b.status} />
                </td>
                <td className="p-4 text-right">
                  {b.status === "PENDING_INSPECTION" ? (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => setSelectedBatch(b)}
                    >
                      <ShieldCheck size={14} />
                      <span>Inspect Batch</span>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedBatch(b)}
                    >
                      View Details
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-400">
                  No food batches match your current search and status filters.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableShell>

      {/* Inspection Modal */}
      {selectedBatch && (
        <InspectionModal
          batch={selectedBatch}
          onClose={() => setSelectedBatch(null)}
          onDone={(msg) => {
            setSelectedBatch(null);
            showToast(msg);
            loadData();
          }}
        />
      )}

    </div>
  );
}

// Modal Component
function InspectionModal({
  batch,
  onClose,
  onDone
}: {
  batch: FoodBatch;
  onClose: () => void;
  onDone: (msg: string) => void;
}) {
  const isPending = batch.status === "PENDING_INSPECTION";
  const [passed, setPassed] = useState(true);
  const [qualityScore, setQualityScore] = useState(5);
  const [temperatureC, setTemperatureC] = useState(
    batch.foodType.requiresRefrigeration ? "3.5" : "65.0"
  );
  const [remarks, setRemarks] = useState(
    "Inspected sealed transport vessels; fresh aroma and optimal packaging integrity."
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setLoading(true);
    setError("");
    try {
      await api.inspectBatch(batch.id, {
        passed,
        qualityScore,
        temperatureC: temperatureC ? Number(temperatureC) : undefined,
        remarks: remarks || undefined
      });
      onDone(
        passed
          ? `✓ Batch "${batch.foodType.name}" approved into available pool.`
          : `Batch "${batch.foodType.name}" marked as REJECTED.`
      );
    } catch (e: any) {
      setError(e instanceof ApiError ? e.message : "Inspection submission failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b pb-4">
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
              QA Audit Form
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">{batch.foodType.name}</h2>
            <p className="text-xs text-slate-500">
              Donor: {batch.donorName} · {fmtQty(batch.quantity, batch.unit)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="mt-5 space-y-4">
          
          {/* Decision */}
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
              Inspection Decision
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPassed(true)}
                className={`flex items-center justify-center gap-2 rounded-2xl p-3 text-xs font-black transition border ${
                  passed
                    ? "bg-emerald-50 text-emerald-900 border-emerald-600 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <CheckCircle2 size={16} className={passed ? "text-emerald-700" : "text-slate-400"} />
                PASS (Authorize)
              </button>
              <button
                type="button"
                onClick={() => setPassed(false)}
                className={`flex items-center justify-center gap-2 rounded-2xl p-3 text-xs font-black transition border ${
                  !passed
                    ? "bg-rose-50 text-rose-900 border-rose-600 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <AlertCircle size={16} className={!passed ? "text-rose-700" : "text-slate-400"} />
                REJECT (Unsafe)
              </button>
            </div>
          </div>

          {/* Quality Score Stars (1 to 5) */}
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
              Hygienic Quality Rating ({qualityScore}/5)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setQualityScore(star)}
                  className={`p-2 rounded-xl transition ${
                    star <= qualityScore
                      ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                      : "text-slate-300 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <Star size={20} fill={star <= qualityScore ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>

          {/* Temperature Measurement */}
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
              Probe Temperature (°C)
            </label>
            <div className="relative flex items-center">
              <Thermometer size={16} className="absolute left-3 text-slate-400" />
              <input
                type="number"
                step="0.1"
                value={temperatureC}
                onChange={(e) => setTemperatureC(e.target.value)}
                placeholder="e.g. 65.5 for hot meals or 3.8 for chilled"
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm font-mono font-bold text-slate-800 shadow-xs outline-none focus:border-emerald-600"
              />
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              {batch.foodType.requiresRefrigeration
                ? "Refrigerated item: Target ≤ 4.0 °C cold chain compliance."
                : "Hot cooked item: Target ≥ 60.0 °C holding temperature."}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
              Inspector Notes & Remarks
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 shadow-xs outline-none focus:border-emerald-600"
            />
          </div>

          {error && (
            <div className="rounded-2xl bg-rose-50 p-3 text-xs font-bold text-rose-700 border border-rose-200">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant={passed ? "primary" : "danger"}
              onClick={handleSave}
              loading={loading}
            >
              {passed ? "Approve Batch" : "Reject Batch"}
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
}
