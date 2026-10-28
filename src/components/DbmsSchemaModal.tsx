"use client";

import { useState } from "react";
import { dbmsTables, DbmsTableMeta } from "@/lib/mock";
import { 
  Database, 
  Layers, 
  GitCommit, 
  Key, 
  Lock, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Table2,
  Cpu,
  Clock,
  Sparkles
} from "lucide-react";

export function DbmsSchemaModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"diagram" | "tables" | "transaction">("diagram");
  const [selectedTable, setSelectedTable] = useState<DbmsTableMeta>(dbmsTables[3]); // food_batches default

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-emerald-950 via-[#133824] to-[#17462d] text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-emerald-300 ring-1 ring-white/20">
              <Database size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-white">REPLATE DBMS Architecture</h2>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-400/30">
                  PostgreSQL 16 & Express
                </span>
              </div>
              <p className="text-xs text-emerald-100/70">
                Relational entity-relationship design, ACID transaction boundaries & live schema dictionary
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/80 hover:bg-white/20 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 gap-2">
          <button
            onClick={() => setActiveTab("diagram")}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-black uppercase tracking-wider transition ${
              activeTab === "diagram"
                ? "border-emerald-700 text-emerald-800 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers size={15} />
            ER Diagram & Lifecycle
          </button>
          <button
            onClick={() => setActiveTab("tables")}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-black uppercase tracking-wider transition ${
              activeTab === "tables"
                ? "border-emerald-700 text-emerald-800 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Table2 size={15} />
            Relational Schema Dictionary
          </button>
          <button
            onClick={() => setActiveTab("transaction")}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-black uppercase tracking-wider transition ${
              activeTab === "transaction"
                ? "border-emerald-700 text-emerald-800 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Lock size={15} />
            ACID Transaction Simulator (SELECT FOR UPDATE)
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/40">
          
          {/* TAB 1: ER Diagram & Lifecycle Flow */}
          {activeTab === "diagram" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-xs text-emerald-950 flex items-start gap-3">
                <Sparkles size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Faculty DBMS Architecture Note:</span> REPLATE mirrors production-grade enterprise ER design with 3 distinct participant roles branching from <code className="bg-white px-1.5 py-0.5 rounded font-mono text-emerald-800">users</code>, verified quality checks via <code className="bg-white px-1.5 py-0.5 rounded font-mono text-emerald-800">inspections</code>, transactional matching in <code className="bg-white px-1.5 py-0.5 rounded font-mono text-emerald-800">allocations</code>, logistics dispatch via <code className="bg-white px-1.5 py-0.5 rounded font-mono text-emerald-800">pickups</code>, and materialized <code className="bg-white px-1.5 py-0.5 rounded font-mono text-emerald-800">surplus_forecasts</code>.
                </div>
              </div>

              {/* Visual ASCII / Node Flow */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                  Entity Relationship & Lifecycle Topology
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Branch 1: Donor & Food Inventory */}
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">1. Supply Side</span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Donor</span>
                    </div>

                    <div className="space-y-2">
                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                        <div className="font-bold text-sm text-slate-800">USERS (Role: DONOR)</div>
                        <div className="text-[11px] text-slate-500 mt-1">ABC Restaurant, VIT Mess, FreshMart</div>
                      </div>
                      <div className="flex justify-center text-emerald-600 font-bold text-xs">↓ has many</div>
                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                        <div className="font-bold text-sm text-slate-800">DONOR_LOCATIONS</div>
                        <div className="text-[11px] text-slate-500 mt-1">Geo coordinates, kitchens, loading bays</div>
                      </div>
                      <div className="flex justify-center text-emerald-600 font-bold text-xs">↓ originates</div>
                      <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50/80 p-3 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm text-emerald-950">FOOD_BATCH</span>
                          <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded">Core Stock</span>
                        </div>
                        <div className="text-[11px] text-emerald-800 mt-1">Quantity, Unit, Expiry, Status</div>
                      </div>
                      <div className="flex justify-center text-slate-400 font-bold text-xs">↕ audited by</div>
                      <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-3 shadow-xs">
                        <div className="font-bold text-sm text-amber-950">INSPECTIONS</div>
                        <div className="text-[11px] text-amber-800 mt-1">Temp °C, Quality Score (1-5), Pass/Reject</div>
                      </div>
                    </div>
                  </div>

                  {/* Branch 2: Allocation & Transaction Engine */}
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-800 uppercase tracking-wider">2. Demand & Matching</span>
                      <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">ACID Engine</span>
                    </div>

                    <div className="space-y-2">
                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                        <div className="font-bold text-sm text-slate-800">USERS (Role: RECIPIENT)</div>
                        <div className="text-[11px] text-slate-500 mt-1">Shelters, Community Kitchens, Orphanages</div>
                      </div>
                      <div className="flex justify-center text-indigo-600 font-bold text-xs">↓ logs demand</div>
                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                        <div className="font-bold text-sm text-slate-800">FOOD_REQUESTS</div>
                        <div className="text-[11px] text-slate-500 mt-1">Requested qty, required by, priority</div>
                      </div>
                      <div className="flex justify-center text-indigo-600 font-bold text-xs">↓ locks & binds</div>
                      <div className="rounded-xl border-2 border-indigo-500 bg-indigo-50/80 p-3 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm text-indigo-950">ALLOCATIONS</span>
                          <span className="text-[10px] font-bold bg-indigo-700 text-white px-2 py-0.5 rounded">Row Lock</span>
                        </div>
                        <div className="text-[11px] text-indigo-800 mt-1">Qty decrement, Expiry Snapshot, Status</div>
                      </div>
                      <div className="flex justify-center text-slate-400 font-bold text-xs">↓ forecasts</div>
                      <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-3 shadow-xs">
                        <div className="font-bold text-sm text-purple-950">SURPLUS_FORECASTS</div>
                        <div className="text-[11px] text-purple-800 mt-1">ML day-of-week aggregations & tips</div>
                      </div>
                    </div>
                  </div>

                  {/* Branch 3: Volunteer, Fleet & Logistics */}
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-blue-800 uppercase tracking-wider">3. Logistics Dispatch</span>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Volunteer</span>
                    </div>

                    <div className="space-y-2">
                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                        <div className="font-bold text-sm text-slate-800">USERS (Role: VOLUNTEER)</div>
                        <div className="text-[11px] text-slate-500 mt-1">Couriers, Drivers, Fleet Handlers</div>
                      </div>
                      <div className="flex justify-center text-blue-600 font-bold text-xs">+ assigned to</div>
                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                        <div className="font-bold text-sm text-slate-800">VEHICLES</div>
                        <div className="text-[11px] text-slate-500 mt-1">Plate, Van type, Refrigeration (True/False)</div>
                      </div>
                      <div className="flex justify-center text-blue-600 font-bold text-xs">↓ fulfills allocation</div>
                      <div className="rounded-xl border-2 border-blue-500 bg-blue-50/80 p-3 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm text-blue-950">PICKUPS & DELIVERY</span>
                          <span className="text-[10px] font-bold bg-blue-700 text-white px-2 py-0.5 rounded">Dispatch</span>
                        </div>
                        <div className="text-[11px] text-blue-800 mt-1">Scheduled → Picked Up → Delivered</div>
                      </div>
                      <div className="flex justify-center text-slate-400 font-bold text-xs">↓ on expiry/decay</div>
                      <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 shadow-xs">
                        <div className="font-bold text-sm text-rose-950">WASTAGE_RECORDS</div>
                        <div className="text-[11px] text-rose-800 mt-1">Reason, date, prevented kg analytics</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Relational Schema Dictionary */}
          {activeTab === "tables" && (
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
              
              {/* Tables Sidebar */}
              <div className="space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-2 mb-2">
                  PostgreSQL Tables ({dbmsTables.length})
                </div>
                {dbmsTables.map(tbl => (
                  <button
                    key={tbl.tableName}
                    onClick={() => setSelectedTable(tbl)}
                    className={`w-full text-left p-3 rounded-2xl border transition ${
                      selectedTable.tableName === tbl.tableName
                        ? "border-emerald-600 bg-emerald-50/80 text-emerald-950 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold">{tbl.tableName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {tbl.recordCount} rows
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">{tbl.entityRole}</div>
                  </button>
                ))}
              </div>

              {/* Selected Table Detail */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b pb-4 mb-4">
                  <div>
                    <div className="text-xs font-black uppercase text-emerald-700 tracking-wider">
                      {selectedTable.entityRole}
                    </div>
                    <h3 className="text-2xl font-black font-mono mt-0.5">{selectedTable.tableName}</h3>
                    <p className="text-xs text-slate-500 mt-1">{selectedTable.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400">Primary Key</span>
                    <div className="font-mono text-xs font-bold text-amber-700 flex items-center gap-1 justify-end">
                      <Key size={13} /> {selectedTable.primaryKey}
                    </div>
                  </div>
                </div>

                {/* Foreign Keys Badge */}
                {selectedTable.foreignKeys.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-bold text-slate-400">Foreign Keys:</span>
                    {selectedTable.foreignKeys.map((fk, idx) => (
                      <span key={idx} className="rounded-lg bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-[11px] font-mono text-indigo-700">
                        {fk.column} → {fk.references}
                      </span>
                    ))}
                  </div>
                )}

                {/* Columns Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-500">
                        <th className="p-3">Column Name</th>
                        <th className="p-3">SQL Data Type</th>
                        <th className="p-3">Nullable</th>
                        <th className="p-3">Constraints & Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {selectedTable.columns.map((col, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="p-3 font-bold text-slate-900">{col.name}</td>
                          <td className="p-3 text-emerald-800 font-semibold">{col.type}</td>
                          <td className="p-3">
                            {col.nullable ? (
                              <span className="text-slate-400">NULL</span>
                            ) : (
                              <span className="text-amber-700 font-bold">NOT NULL</span>
                            )}
                          </td>
                          <td className="p-3 font-sans text-slate-600">{col.notes || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ACID Transaction Simulation */}
          {activeTab === "transaction" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                  <ShieldCheck size={18} className="text-amber-700" />
                  PostgreSQL Concurrency Control & ACID Guarantee
                </div>
                <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                  Surplus food distribution requires strict database concurrency control. If multiple operations managers or automatic matching engines attempt to allocate the same food batch simultaneously, a naive non-locking read could double-allocate food and result in delivery failure. REPLATE enforces row-level locking via <code className="font-mono bg-white px-1.5 py-0.5 rounded text-amber-900 font-bold">SELECT ... FOR UPDATE</code>.
                </p>
              </div>

              {/* Transaction Execution Steps */}
              <div className="rounded-3xl border border-slate-200 bg-slate-900 text-slate-200 p-6 shadow-xl font-mono text-xs overflow-x-auto">
                <div className="text-emerald-400 font-bold text-sm border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
                  <span>SQL Transaction Lifecycle: POST /api/admin/allocations</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                    Isolation Level: READ COMMITTED
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
                    <span className="text-purple-400 font-bold">-- Step 1: Open Transaction Boundary</span>
                    <div className="text-white mt-1">BEGIN TRANSACTION;</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-amber-900/50">
                    <span className="text-amber-400 font-bold">-- Step 2: Acquire Exclusive Row Lock on Food Batch</span>
                    <div className="text-white mt-1">
                      SELECT id, available_quantity, status, expiry_at, unit<br/>
                      FROM food_batches<br/>
                      WHERE id = &apos;batch-101&apos;<br/>
                      <span className="text-amber-300 font-black">FOR UPDATE;</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-2 font-sans">
                      ↳ Blocks concurrent allocation requests on batch-101 until commit/rollback.
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
                    <span className="text-cyan-400 font-bold">-- Step 3: Verify Business Invariants</span>
                    <div className="text-white mt-1">
                      -- IF (available_quantity &lt; 70 OR status != &apos;AVAILABLE&apos; OR expiry_at &lt; NOW()) THEN<br/>
                      -- &nbsp;&nbsp;ROLLBACK; RAISE EXCEPTION &apos;INSUFFICIENT_QUANTITY&apos;;<br/>
                      -- END IF;
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-emerald-900/50">
                    <span className="text-emerald-400 font-bold">-- Step 4: Decrement Available Stock Atomically</span>
                    <div className="text-white mt-1">
                      UPDATE food_batches<br/>
                      SET available_quantity = available_quantity - 70,<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;status = CASE WHEN available_quantity - 70 = 0 THEN &apos;FULLY_ALLOCATED&apos; ELSE &apos;PARTIALLY_ALLOCATED&apos; END<br/>
                      WHERE id = &apos;batch-101&apos;;
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-blue-900/50">
                    <span className="text-blue-400 font-bold">-- Step 5: Insert Allocation Record with Immutable Snapshot</span>
                    <div className="text-white mt-1">
                      INSERT INTO allocations (id, request_id, batch_id, quantity, expiry_snapshot, status, allocated_at)<br/>
                      VALUES (gen_random_uuid(), &apos;req-201&apos;, &apos;batch-101&apos;, 70, &apos;2026-10-28T19:00:00Z&apos;, &apos;CONFIRMED&apos;, NOW());
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
                    <span className="text-teal-400 font-bold">-- Step 6: Update Recipient Request Progress</span>
                    <div className="text-white mt-1">
                      UPDATE food_requests<br/>
                      SET fulfilled_quantity = fulfilled_quantity + 70,<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;status = CASE WHEN fulfilled_quantity + 70 &gt;= requested_quantity THEN &apos;FULFILLED&apos; ELSE &apos;PARTIALLY_FULFILLED&apos; END<br/>
                      WHERE id = &apos;req-201&apos;;
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-600/80">
                    <span className="text-emerald-300 font-black">-- Step 7: Commit Atomic Unit of Work</span>
                    <div className="text-white font-bold mt-1">COMMIT;</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-white px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PostgreSQL Contract: <strong>openapi.yaml</strong> & <strong>FRONTEND_BACKEND_CONTRACT.md</strong></span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-800 transition"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
