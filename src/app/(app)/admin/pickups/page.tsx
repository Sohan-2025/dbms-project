"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import type { Allocation, VolunteerOption, VehicleOption, Pickup } from "@/types/api";
import { PageHeader } from "@/components/PageHeader";
import { Button, Table, TableShell } from "@/components/ui";
import { StatusBadge } from "@/components/StatusBadge";
import { fmtDateTime, fmtQty } from "@/lib/format";
import { 
  Truck, 
  UserCheck, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Thermometer,
  ShieldAlert
} from "lucide-react";

export default function AdminPickupsPage() {
  const searchParams = useSearchParams();
  const preselectedAllocId = searchParams.get("allocationId");

  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerOption[]>([]);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [pickups, setPickups] = useState<Pickup[]>([]);

  const [allocationId, setAllocationId] = useState(preselectedAllocId || "");
  const [volunteerId, setVolunteerId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = () => {
    Promise.all([
      api.recipientAllocations(1, 50, "CONFIRMED"),
      api.volunteers(),
      api.vehicles(),
      api.volunteerPickups(1, 50)
    ]).then(([a, v, veh, p]) => {
      setAllocations(a.data);
      setVolunteers(v.data);
      setVehicles(veh.data);
      setPickups(p.data);
      if (preselectedAllocId) setAllocationId(preselectedAllocId);
    });
  };

  useEffect(() => {
    loadData();
    // Default scheduled time to 1 hour from now
    const nextHour = new Date(Date.now() + 3600000);
    nextHour.setMinutes(0, 0, 0);
    setScheduledAt(nextHour.toISOString().slice(0, 16));
  }, []);

  const selectedAlloc = allocations.find((a) => a.id === allocationId);
  const selectedVehicle = vehicles.find((v) => v.id === vehicleId);

  async function handleSchedule() {
    if (!allocationId || !volunteerId || !vehicleId || !scheduledAt) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.createPickup({
        allocationId,
        volunteerId,
        vehicleId,
        scheduledAt: new Date(scheduledAt).toISOString(),
        notes: notes || undefined
      });

      setSuccess(`✓ Pickup scheduled: Assigned vehicle ${res.data.vehicleNumber} and courier ${res.data.volunteerName}.`);
      setAllocationId("");
      setVolunteerId("");
      setVehicleId("");
      setNotes("");
      await loadData();
    } catch (e: any) {
      setError(e instanceof ApiError ? e.message : "Failed to schedule pickup");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <PageHeader
        badge="Logistics Fleet & Dispatch"
        title="Pickup & Delivery Planning"
        description="Assign verified volunteer couriers and refrigerated transport vehicles to confirmed food allocations."
      />

      <div className="grid gap-8 xl:grid-cols-[1.1fr_1fr]">
        
        {/* Schedule Form */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs">
          <div className="flex items-center justify-between border-b pb-4 mb-5">
            <div>
              <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wider">
                Fleet Dispatcher
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                Assign Volunteer & Vehicle
              </h2>
            </div>
            <span className="rounded-full bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 border border-blue-200">
              Logistics
            </span>
          </div>

          <div className="space-y-4">
            
            {/* Allocation Select */}
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
                1. Confirmed Allocation
              </label>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-bold text-slate-800 shadow-xs outline-none focus:border-emerald-600"
                value={allocationId}
                onChange={(e) => setAllocationId(e.target.value)}
              >
                <option value="">-- Choose confirmed allocation ({allocations.length} ready) --</option>
                {allocations.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.foodName} ({fmtQty(a.quantity, a.unit)}) → {a.recipientName} [From: {a.donorName}]
                  </option>
                ))}
              </select>
            </div>

            {/* Volunteer Select */}
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
                2. Assigned Volunteer Courier
              </label>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-bold text-slate-800 shadow-xs outline-none focus:border-emerald-600"
                value={volunteerId}
                onChange={(e) => setVolunteerId(e.target.value)}
              >
                <option value="">-- Select available volunteer --</option>
                {volunteers.map((v) => (
                  <option
                    key={v.id}
                    value={v.id}
                    disabled={v.availabilityStatus !== "AVAILABLE"}
                  >
                    {v.name} ({v.availabilityStatus})
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Select */}
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
                3. Transport Vehicle
              </label>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-bold text-slate-800 shadow-xs outline-none focus:border-emerald-600"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
              >
                <option value="">-- Select available vehicle --</option>
                {vehicles.map((v) => (
                  <option
                    key={v.id}
                    value={v.id}
                    disabled={v.status !== "AVAILABLE"}
                  >
                    {v.vehicleNumber} · {v.vehicleType} (Cap: {v.capacity}kg, {v.refrigerated ? "❄ Refrigerated" : "Standard"}) - {v.status}
                  </option>
                ))}
              </select>
              {selectedVehicle && (
                <div className="mt-2 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 flex items-center justify-between">
                  <span>Refrigeration: <strong>{selectedVehicle.refrigerated ? "Active Cold Storage (≤4°C)" : "Non-Refrigerated"}</strong></span>
                  <span>Payload Capacity: <strong>{selectedVehicle.capacity} kg</strong></span>
                </div>
              )}
            </div>

            {/* Schedule Time */}
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
                4. Scheduled Pickup Time
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-bold text-slate-800 shadow-xs outline-none focus:border-emerald-600"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1.5">
                Dispatch Instructions / Handling Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Fragile containers, call supervisor upon arrival"
                className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 shadow-xs outline-none focus:border-emerald-600"
              />
            </div>

            {error && (
              <div className="rounded-2xl bg-rose-50 p-3 text-xs font-bold text-rose-700 border border-rose-200">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-2xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800 border border-emerald-200">
                {success}
              </div>
            )}

            <Button
              className="w-full mt-2"
              variant="primary"
              size="lg"
              disabled={!allocationId || !volunteerId || !vehicleId || !scheduledAt}
              loading={loading}
              onClick={handleSchedule}
            >
              <Truck size={18} />
              <span>Confirm & Dispatch Pickup</span>
            </Button>

          </div>
        </section>

        {/* Pickup Queue */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Active Dispatch Queue</h2>
              <p className="text-xs text-slate-500">
                Fleet missions currently scheduled or in-transit
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              {pickups.length} missions
            </span>
          </div>

          <TableShell>
            <Table>
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="p-3.5">Mission</th>
                  <th className="p-3.5">Courier & Vehicle</th>
                  <th className="p-3.5">Scheduled</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pickups.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900 text-xs">
                        #{p.id.slice(-6).toUpperCase()}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Alloc: #{p.allocationId.slice(-6)}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 text-xs">{p.volunteerName}</div>
                      <div className="font-mono text-[11px] text-slate-500">{p.vehicleNumber}</div>
                    </td>
                    <td className="p-3.5 font-medium text-xs text-slate-700">
                      {fmtDateTime(p.scheduledAt)}
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={p.status} />
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
