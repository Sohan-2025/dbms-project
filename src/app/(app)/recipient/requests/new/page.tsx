"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import type { FoodType, Priority, QuantityUnit } from "@/types/api";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui";
import { ArrowLeft, PlusCircle, AlertCircle, CheckCircle2, Clock } from "lucide-react";

export default function NewFoodRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedFoodTypeId = searchParams.get("foodTypeId");
  const preselectedUnit = searchParams.get("unit") as QuantityUnit | null;

  const [foodTypes, setFoodTypes] = useState<FoodType[]>([]);
  const [foodTypeId, setFoodTypeId] = useState(preselectedFoodTypeId || "");
  const [requestedQuantity, setRequestedQuantity] = useState("100");
  const [unit, setUnit] = useState<QuantityUnit>(preselectedUnit || "PORTION");
  const [requiredBefore, setRequiredBefore] = useState("");
  const [priority, setPriority] = useState<Priority>("NORMAL");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.foodTypes().then((x) => {
      setFoodTypes(x.data);
      if (!foodTypeId && x.data.length > 0) {
        setFoodTypeId(x.data[0].id);
      }
    });

    const targetTime = new Date(Date.now() + 6 * 3600000); // 6 hours from now
    setRequiredBefore(targetTime.toISOString().slice(0, 16));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!foodTypeId || !requestedQuantity || !requiredBefore) return;

    setLoading(true);
    setError("");

    try {
      await api.createFoodRequest({
        foodTypeId,
        requestedQuantity: Number(requestedQuantity),
        unit,
        requiredBefore: new Date(requiredBefore).toISOString(),
        priority,
        notes: notes || undefined
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/recipient/requests");
      }, 1500);
    } catch (e: any) {
      setError(e instanceof ApiError ? e.message : "Failed to create food request");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/recipient/requests"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft size={14} /> Back to Requests
        </Link>
        <PageHeader
          badge="Demand Pipeline Entry"
          title="Create Food Demand Ticket"
          description="Log emergency or scheduled food ration needs for your shelter or community kitchen."
        />
      </div>

      {success && (
        <div className="rounded-3xl border border-emerald-300 bg-emerald-50 p-6 text-center text-emerald-950 shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white mb-3">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-lg font-black">Food Request Published!</h3>
          <p className="text-xs text-emerald-800 mt-1">
            Status initialized to <code className="font-bold bg-white px-2 py-0.5 rounded">OPEN</code>. Central Operations will match this ticket with verified available batches.
          </p>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs space-y-5">
          
          {/* Food Type */}
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
              1. Desired Food Type
            </label>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-bold text-slate-900 shadow-xs outline-none focus:border-emerald-600 cursor-pointer"
              value={foodTypeId}
              onChange={(e) => setFoodTypeId(e.target.value)}
              required
            >
              {foodTypes.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.category.name})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
                2. Required Quantity
              </label>
              <input
                type="number"
                min="1"
                step="any"
                value={requestedQuantity}
                onChange={(e) => setRequestedQuantity(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-mono font-bold text-slate-900 shadow-xs outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
                Unit
              </label>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-bold text-slate-900 shadow-xs outline-none focus:border-emerald-600"
                value={unit}
                onChange={(e) => setUnit(e.target.value as QuantityUnit)}
                required
              >
                <option value="PORTION">PORTION (Meals)</option>
                <option value="KG">KG (Kilograms)</option>
                <option value="G">G (Grams)</option>
                <option value="L">L (Liters)</option>
                <option value="PACK">PACK (Containers)</option>
                <option value="UNIT">UNIT (Individual Pieces)</option>
              </select>
            </div>
          </div>

          {/* Timing & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
                3. Needed By (Deadline)
              </label>
              <input
                type="datetime-local"
                value={requiredBefore}
                onChange={(e) => setRequiredBefore(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-bold text-slate-800 shadow-xs outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
                Priority Level
              </label>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-bold text-slate-900 shadow-xs outline-none focus:border-emerald-600"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                required
              >
                <option value="LOW">Low (Flexible buffer)</option>
                <option value="NORMAL">Normal (Regular lunch/dinner)</option>
                <option value="HIGH">High (Shortage alert)</option>
                <option value="URGENT">Urgent (Imminent food crisis)</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
              Service Context & Dietary Requirements
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Evening meal distribution for 100 shelter residents; mild spices required."
              className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 shadow-xs outline-none focus:border-emerald-600"
            />
          </div>

          {error && (
            <div className="rounded-2xl bg-rose-50 p-3.5 text-xs font-bold text-rose-700 border border-rose-200 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-3 border-t flex items-center justify-end gap-3">
            <Link href="/recipient/requests">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <Button variant="primary" size="lg" type="submit" loading={loading}>
              <PlusCircle size={18} />
              <span>Publish Demand Ticket</span>
            </Button>
          </div>

        </form>
      )}

    </div>
  );
}
