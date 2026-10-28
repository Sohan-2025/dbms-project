"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import type { FoodType, Location, QuantityUnit } from "@/types/api";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui";
import { 
  PackagePlus, 
  ArrowLeft, 
  Clock, 
  Thermometer, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Info
} from "lucide-react";

export default function NewBatchPage() {
  const router = useRouter();

  const [foodTypes, setFoodTypes] = useState<FoodType[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [foodTypeId, setFoodTypeId] = useState("");
  const [quantity, setQuantity] = useState("100");
  const [unit, setUnit] = useState<QuantityUnit>("PORTION");
  const [preparedAt, setPreparedAt] = useState("");
  const [expiryAt, setExpiryAt] = useState("");
  const [locationId, setLocationId] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("2500");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Promise.all([api.foodTypes(), api.donorLocations()]).then(([f, l]) => {
      setFoodTypes(f.data);
      setLocations(l.data);
      if (f.data.length > 0) {
        setFoodTypeId(f.data[0].id);
        applyFoodTypeDefaults(f.data[0]);
      }
      if (l.data.length > 0) setLocationId(l.data[0].id);
    });

    const now = new Date();
    setPreparedAt(now.toISOString().slice(0, 16));
  }, []);

  const selectedFood = foodTypes.find((f) => f.id === foodTypeId);

  const applyFoodTypeDefaults = (food: FoodType) => {
    // Choose sensible default unit
    if (food.category.name === "Cooked Meals") setUnit("PORTION");
    else if (food.category.name === "Bakery") setUnit("UNIT");
    else if (food.category.name === "Fruits" || food.category.name === "Vegetables") setUnit("KG");
    else if (food.category.name.includes("Dairy")) setUnit("L");

    // Automatically calculate recommended expiry datetime based on shelfLifeHours
    const prep = new Date();
    const expiry = new Date(prep.getTime() + food.shelfLifeHours * 3600000);
    setExpiryAt(expiry.toISOString().slice(0, 16));
  };

  const handleFoodTypeChange = (id: string) => {
    setFoodTypeId(id);
    const target = foodTypes.find((f) => f.id === id);
    if (target) applyFoodTypeDefaults(target);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!foodTypeId || !locationId || !quantity || !preparedAt || !expiryAt) return;

    setLoading(true);
    setError("");

    try {
      await api.createFoodBatch({
        foodTypeId,
        quantity: Number(quantity),
        unit,
        preparedAt: new Date(preparedAt).toISOString(),
        expiryAt: new Date(expiryAt).toISOString(),
        locationId,
        estimatedValue: estimatedValue ? Number(estimatedValue) : undefined,
        notes: notes || undefined
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/donor/batches");
      }, 1500);
    } catch (e: any) {
      setError(e instanceof ApiError ? e.message : "Failed to register surplus batch");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Back button & Header */}
      <div>
        <Link
          href="/donor/batches"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft size={14} /> Back to Active Batches
        </Link>
        <PageHeader
          badge="Donor Inventory Entry"
          title="Register Surplus Food Batch"
          description="Log newly prepared or unsold surplus with preparation time, cold storage criteria & shelf-life limits."
        />
      </div>

      {success && (
        <div className="rounded-3xl border border-emerald-300 bg-emerald-50 p-6 text-center text-emerald-950 shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white mb-3">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-lg font-black">Surplus Batch Logged Successfully!</h3>
          <p className="text-xs text-emerald-800 mt-1">
            Status initialized to <code className="font-bold bg-white px-2 py-0.5 rounded">PENDING_INSPECTION</code>. Operations QA will evaluate the batch before release.
          </p>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs space-y-6">
          
          {/* Food Type Selector */}
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
              1. Food Item & Classification
            </label>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-bold text-slate-900 shadow-xs outline-none focus:border-emerald-600 cursor-pointer"
              value={foodTypeId}
              onChange={(e) => handleFoodTypeChange(e.target.value)}
              required
            >
              {foodTypes.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.category.name} · Shelf Life: {f.shelfLifeHours}h)
                </option>
              ))}
            </select>

            {/* Smart food metadata auto-populated banner */}
            {selectedFood && (
              <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-xs space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold text-emerald-900">
                    Category: {selectedFood.category.name}
                  </span>
                  <span>·</span>
                  <span className="font-bold text-emerald-900">
                    Max Safe Shelf Life: {selectedFood.shelfLifeHours} hours
                  </span>
                  <span>·</span>
                  {selectedFood.requiresRefrigeration ? (
                    <span className="rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-[10px] font-black">
                      ❄ Cold Storage Required (≤4°C)
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-[10px] font-black">
                      Room Temperature Stable
                    </span>
                  )}
                </div>
                {selectedFood.allergens.length > 0 && (
                  <div className="text-[11px] text-amber-800 font-semibold">
                    Known Allergens: {selectedFood.allergens.join(", ")}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
                2. Surplus Quantity
              </label>
              <input
                type="number"
                min="1"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-mono font-bold text-slate-900 shadow-xs outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
                Measurement Unit
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

          {/* Timing: Prepared at & Expiry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
                3. Prepared / Packaged At
              </label>
              <input
                type="datetime-local"
                value={preparedAt}
                onChange={(e) => setPreparedAt(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-bold text-slate-800 shadow-xs outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
                Calculated Expiry Deadline
              </label>
              <input
                type="datetime-local"
                value={expiryAt}
                onChange={(e) => setExpiryAt(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-bold text-slate-800 shadow-xs outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Location & Estimated Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
                4. Kitchen / Dispatch Location
              </label>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-bold text-slate-900 shadow-xs outline-none focus:border-emerald-600"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                required
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.label} ({loc.address}, {loc.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
                Estimated Commercial Value (₹)
              </label>
              <input
                type="number"
                min="0"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                placeholder="e.g. 2500"
                className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-mono font-bold text-slate-900 shadow-xs outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
              Handling & Packaging Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Packed in stainless steel insulated dispensers; please bring food trays."
              className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 shadow-xs outline-none focus:border-emerald-600"
            />
          </div>

          {error && (
            <div className="rounded-2xl bg-rose-50 p-3.5 text-xs font-bold text-rose-700 border border-rose-200 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <div className="pt-3 border-t flex items-center justify-end gap-3">
            <Link href="/donor/batches">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <Button
              variant="primary"
              size="lg"
              type="submit"
              loading={loading}
            >
              <PackagePlus size={18} />
              <span>Submit for Verification</span>
            </Button>
          </div>

        </form>
      )}

    </div>
  );
}
