"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import type { FoodBatch, FoodRequest, Allocation } from "@/types/api";
import { PageHeader } from "@/components/PageHeader";
import { Button, Table, TableShell } from "@/components/ui";
import { StatusBadge } from "@/components/StatusBadge";
import { fmtQty, expiryLabel } from "@/lib/format";
import { 
  GitMerge, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  Sparkles,
  ArrowRight,
  Database
} from "lucide-react";

export default function AllocationsPage() {
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [batches, setBatches] = useState<FoodBatch[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  
  const [selectedReqId, setSelectedReqId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [quantity, setQuantity] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadData = () => {
    Promise.all([
      api.adminRequests(1, 50, "OPEN"),
      api.adminBatches(1, 50, "AVAILABLE"),
      api.recipientAllocations(1, 50)
    ]).then(([r, b, a]) => {
      setRequests(r.data);
      setBatches(b.data);
      setAllocations(a.data);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedRequest = requests.find((r) => r.id === selectedReqId);
  const selectedBatch = batches.find((b) => b.id === selectedBatchId);

  // Auto-fill recommended quantity when both selected
  const handleBatchSelect = (batchId: string) => {
    setSelectedBatchId(batchId);
    const b = batches.find((x) => x.id === batchId);
    if (b && selectedRequest) {
      const needed = selectedRequest.requestedQuantity - selectedRequest.fulfilledQuantity;
      const allocatable = Math.min(b.availableQuantity, needed);
      setQuantity(String(allocatable));
    }
  };

  async function handleAllocate() {
    if (!selectedReqId || !selectedBatchId || !quantity) return;
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await api.createAllocation({
        requestId: selectedReqId,
        batchId: selectedBatchId,
        quantity: Number(quantity)
      });

      setSuccessMsg(
        `✓ Transaction Committed: ${res.data.quantity} ${res.data.unit} allocated to ${res.data.recipientName}. Batch locked and decremented.`
      );
      setQuantity("");
      setSelectedReqId("");
      setSelectedBatchId("");
      await loadData();
    } catch (e: any) {
      setError(e instanceof ApiError ? e.message : "Transactional allocation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <PageHeader
        badge="PostgreSQL Transaction Boundary"
        title="Allocation Engine"
        description="Bind approved surplus inventory to recipient requests under strict row-level lock concurrency."
        action={
          <Link href="/admin/pickups">
            <Button variant="secondary">
              <Truck size={16} />
              <span>Logistics & Dispatch Queue</span>
            </Button>
          </Link>
        }
      />

      {/* ACID Concurrency Banner */}
      <div className="rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/40 p-5 shadow-xs flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-700 text-white shrink-0 mt-0.5">
          <Lock size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-900 text-sm">
              ACID Transaction Invariant Enforced
            </h3>
            <span className="text-[10px] font-bold font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
              SELECT ... FOR UPDATE
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            During execution, the backend acquires an exclusive row lock on the selected <code className="font-mono text-indigo-900 font-bold">food_batch</code>. It verifies remaining stock, writes an immutable historical snapshot, and atomicity guarantees zero over-allocation even under high concurrent load.
          </p>
        </div>
      </div>

      {/* Main Allocation Form & Table Grid */}
      <div className="grid gap-8 xl:grid-cols-[1.1fr_1fr]">
        
        {/* Create Allocation Card */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs">
          <div className="flex items-center justify-between border-b pb-4 mb-5">
            <div>
              <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wider">
                Matching Desk
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                New Inventory Allocation
              </h2>
            </div>
            <span className="rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 border border-emerald-200">
              Live State
            </span>
          </div>

          <div className="space-y-5">
            
            {/* Step 1: Request Selection */}
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
                1. Select Open Demand Request
              </label>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-bold text-slate-800 shadow-xs outline-none focus:border-emerald-600"
                value={selectedReqId}
                onChange={(e) => {
                  setSelectedReqId(e.target.value);
                  setSelectedBatchId("");
                  setQuantity("");
                }}
              >
                <option value="">-- Choose recipient demand request ({requests.length} open) --</option>
                {requests.map((r) => (
                  <option key={r.id} value={r.id}>
                    [{r.priority}] {r.recipientName} · {r.foodType.name} (Needs {r.requestedQuantity - r.fulfilledQuantity} {r.unit})
                  </option>
                ))}
              </select>
              {selectedRequest && (
                <div className="mt-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 flex items-center justify-between">
                  <span>Priority: <strong className="text-rose-700">{selectedRequest.priority}</strong></span>
                  <span>Required Before: <strong>{new Date(selectedRequest.requiredBefore).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
                </div>
              )}
            </div>

            {/* Step 2: Batch Selection */}
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
                2. Select Available Food Batch
              </label>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-bold text-slate-800 shadow-xs outline-none focus:border-emerald-600 disabled:opacity-50"
                value={selectedBatchId}
                onChange={(e) => handleBatchSelect(e.target.value)}
                disabled={!selectedReqId}
              >
                <option value="">-- Choose approved surplus batch ({batches.length} available) --</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.foodType.name} · {fmtQty(b.availableQuantity, b.unit)} available · {b.donorName}
                  </option>
                ))}
              </select>
              {selectedBatch && (
                <div className="mt-2 rounded-xl bg-emerald-50/70 p-3 text-xs text-emerald-950 flex items-center justify-between">
                  <span>Donor: <strong>{selectedBatch.donorName}</strong></span>
                  <span>Safe Expiry: <strong>{expiryLabel(selectedBatch.expiryAt)}</strong></span>
                </div>
              )}
            </div>

            {/* Step 3: Quantity */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-black uppercase text-slate-500">
                  3. Quantity to Bind ({selectedBatch?.unit || "units"})
                </label>
                {selectedBatch && selectedRequest && (
                  <span className="text-[11px] font-bold text-emerald-800">
                    Max Allocatable: {Math.min(selectedBatch.availableQuantity, selectedRequest.requestedQuantity - selectedRequest.fulfilledQuantity)} {selectedBatch.unit}
                  </span>
                )}
              </div>
              <input
                type="number"
                min="0.1"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity..."
                disabled={!selectedBatchId}
                className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-mono font-bold text-slate-900 shadow-xs outline-none focus:border-emerald-600 disabled:opacity-50"
              />
            </div>

            {/* Messages */}
            {error && (
              <div className="rounded-2xl bg-rose-50 p-3.5 text-xs font-bold text-rose-700 border border-rose-200 flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="rounded-2xl bg-emerald-50 p-3.5 text-xs font-bold text-emerald-800 border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit Action */}
            <Button
              className="w-full mt-2"
              variant="primary"
              size="lg"
              disabled={!selectedReqId || !selectedBatchId || !quantity}
              loading={loading}
              onClick={handleAllocate}
            >
              <GitMerge size={18} />
              <span>Execute Atomic Allocation</span>
            </Button>

          </div>
        </section>

        {/* Recent Allocations Table */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Active Allocations</h2>
              <p className="text-xs text-slate-500">
                Bound records queued for volunteer pickup dispatch
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              {allocations.length} records
            </span>
          </div>

          <TableShell>
            <Table>
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="p-3.5">Food & Recipient</th>
                  <th className="p-3.5">Donor Origin</th>
                  <th className="p-3.5">Quantity</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allocations.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{a.foodName}</div>
                      <div className="text-xs text-slate-500 font-medium">→ {a.recipientName}</div>
                    </td>
                    <td className="p-3.5 font-medium text-slate-700 text-xs">
                      {a.donorName}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-900 text-xs">
                      {fmtQty(a.quantity, a.unit)}
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="p-3.5 text-right">
                      {a.status === "CONFIRMED" ? (
                        <Link href={`/admin/pickups?allocationId=${a.id}`}>
                          <Button size="sm" variant="primary">
                            Dispatch
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700">Scheduled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableShell>
        </section>

      </div>

    </div>
  );
}
