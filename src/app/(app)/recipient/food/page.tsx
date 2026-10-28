"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { FoodBatch, FoodType } from "@/types/api";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar, Button } from "@/components/ui";
import { fmtQty, expiryLabel } from "@/lib/format";
import { 
  Utensils, 
  MapPin, 
  Clock, 
  PlusCircle, 
  Sparkles, 
  CheckCircle2, 
  Thermometer, 
  ShieldCheck 
} from "lucide-react";

export default function AvailableFoodPage() {
  const [data, setData] = useState<FoodBatch[]>([]);
  const [foodTypes, setFoodTypes] = useState<FoodType[]>([]);
  const [search, setSearch] = useState("");
  const [foodTypeId, setFoodTypeId] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    api.foodTypes(search).then((x) => setFoodTypes(x.data));
    api.availableFood(1, 50, {
      foodTypeId: foodTypeId || undefined,
      city: cityFilter || undefined
    }).then((x) => setData(x.data));
  }, [search, foodTypeId, cityFilter]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <PageHeader
        badge="Live Surplus Marketplace"
        title="Available Surplus Food"
        description="Browse certified QA-approved surplus food available in the regional network ready for allocation."
      />

      {/* Filters */}
      <div className="grid gap-3 md:grid-cols-[1fr_220px_180px]">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by food name or ingredients..."
        />
        <select
          className="rounded-2xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-bold text-slate-800 shadow-xs outline-none focus:border-emerald-600"
          value={foodTypeId}
          onChange={(e) => setFoodTypeId(e.target.value)}
        >
          <option value="">All Food Types</option>
          {foodTypes.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <select
          className="rounded-2xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-bold text-slate-800 shadow-xs outline-none focus:border-emerald-600"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="">All Locations</option>
          <option value="Vellore">Vellore Hub</option>
          <option value="Katpadi">Katpadi Sector</option>
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {data.map((b) => (
          <article
            key={b.id}
            className="group rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-emerald-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Card top */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {b.foodType.category.name}
                  </span>
                  <h2 className="mt-2 text-xl font-black text-slate-900 group-hover:text-emerald-900 transition">
                    {b.foodType.name}
                  </h2>
                </div>
                <div className="shrink-0 rounded-2xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                  {expiryLabel(b.expiryAt)}
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500 leading-relaxed line-clamp-2">
                {b.foodType.description || "QA-verified surplus meal containers ready for shelter dispatch."}
              </p>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {b.foodType.requiresRefrigeration ? (
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                    ❄ Cold Storage
                  </span>
                ) : (
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                    Room Temp
                  </span>
                )}
                {b.foodType.allergens.length > 0 ? (
                  <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                    Allergens: {b.foodType.allergens.join(", ")}
                  </span>
                ) : (
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                    No Common Allergens
                  </span>
                )}
              </div>

              {/* Inventory Metric Info */}
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Available Stock
                  </div>
                  <div className="mt-1 font-mono text-base font-black text-slate-900">
                    {fmtQty(b.availableQuantity, b.unit)}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Kitchen Origin
                  </div>
                  <div className="mt-1 text-xs font-bold text-slate-800 truncate">
                    {b.donorName}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {b.location.city}
                  </div>
                </div>
              </div>
            </div>

            {/* Request Action */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                href={`/recipient/requests/new?foodTypeId=${b.foodType.id}&unit=${b.unit}`}
                className="block"
              >
                <Button className="w-full" variant="primary">
                  <PlusCircle size={16} />
                  <span>Request This Food</span>
                </Button>
              </Link>
            </div>
          </article>
        ))}

        {data.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500 shadow-xs">
            <Utensils size={32} className="mx-auto text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-700">No surplus currently matches these filters</h3>
            <p className="text-xs text-slate-400 mt-1">Check back shortly or log a recurring demand ticket.</p>
          </div>
        )}
      </div>

    </div>
  );
}
