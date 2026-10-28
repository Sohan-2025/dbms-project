import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  Leaf, 
  PackageOpen, 
  ShieldCheck, 
  Truck, 
  Users, 
  Database, 
  Lock, 
  Layers, 
  GitMerge, 
  Sparkles,
  Utensils,
  ClipboardList
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f9f7] text-slate-800 antialiased selection:bg-[#c9f36b] selection:text-[#0c2618]">
      
      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 border-b border-slate-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0c2618] to-[#16462d] font-black text-[#c9f36b] shadow-md ring-1 ring-emerald-950/20">
            R
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-slate-900">REPLATE</span>
            <span className="block text-[10px] font-black uppercase tracking-[.22em] text-emerald-800">
              DBMS Production Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition"
          >
            Sign In / Demo Roles
          </Link>
          <Link
            href="/admin/dashboard"
            className="rounded-2xl bg-[#123824] px-5 py-2.5 text-xs font-black text-white hover:bg-[#1a4f33] shadow-md transition"
          >
            Launch Command Center
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-20">
        <div className="max-w-4xl">
          
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-xs font-bold text-emerald-900 shadow-xs">
            <Database size={15} className="text-emerald-700" />
            <span>ENTERPRISE DATABASE ARCHITECTURE (POSTGRESQL + EXPRESS + NEXT.JS)</span>
          </div>

          <h1 className="text-5xl font-black tracking-tight text-slate-950 md:text-7xl leading-[1.08]">
            Intelligent surplus food redistribution &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700">
              resource management.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-600">
            SmartMart manages products → inventory → orders. <strong>REPLATE</strong> manages the complete operational lifecycle of{" "}
            <span className="text-emerald-950 font-bold">
              surplus food → QA inspection → inventory → requests → transactional allocation → pickup → delivery → wastage analytics.
            </span>
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-[#123824] px-7 py-4 text-sm font-black text-white shadow-xl hover:bg-[#1a4f33] transition"
            >
              <span>Explore Operations Hub</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/donor/dashboard"
              className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-sm font-bold text-slate-800 hover:bg-slate-50 shadow-xs transition"
            >
              Donor Portal (Kitchens)
            </Link>

            <Link
              href="/recipient/dashboard"
              className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-sm font-bold text-slate-800 hover:bg-slate-50 shadow-xs transition"
            >
              Recipient Portal (Shelters)
            </Link>
          </div>
        </div>

        {/* 4 Stats Cards matching faculty figures */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            icon={<PackageOpen size={24} />}
            value="12,480"
            label="Meals Saved"
            sub="Across 327 active food donors"
          />
          <Stat
            icon={<Truck size={24} />}
            value="9,830"
            label="Meals Distributed"
            sub="To 84 partner beneficiary shelters"
          />
          <Stat
            icon={<ShieldCheck size={24} />}
            value="2,650"
            label="Pipeline / At Risk"
            sub="Active window before expiry"
          />
          <Stat
            icon={<Users size={24} />}
            value="78.7%"
            label="Fulfilment Efficiency"
            sub="Atomic transactional allocation"
          />
        </div>
      </section>

      {/* 3 Sides of REPLATE (Faculty Specification Image 2) */}
      <section className="border-t border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-xl">
            <span className="text-[11px] font-black uppercase tracking-[.2em] text-emerald-800">
              Role-Based Architecture (3 Sides)
            </span>
            <h2 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">
              Specialized Portals for Every Ecosystem Participant
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Unlike a generic single frontend, REPLATE delivers distinct role-optimized experiences backed by strict PostgreSQL session authentication.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            
            {/* Side 1: Donor Portal */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-8 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 font-bold mb-6">
                  <Utensils size={22} />
                </div>
                <h3 className="text-xl font-black text-slate-900">1. Donor Portal</h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  Kitchens · Messes · Supermarkets
                </p>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  Log surplus food batches with shelf-life hours, temperature criteria, allergens, and kitchen location coordinates. Receive AI/ML surplus forecasts.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/80">
                <Link
                  href="/donor/dashboard"
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800 hover:text-emerald-950"
                >
                  <span>Open Donor Workspace</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Side 2: Recipient Portal */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-8 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-800 font-bold mb-6">
                  <ClipboardList size={22} />
                </div>
                <h3 className="text-xl font-black text-slate-900">2. Recipient Portal</h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-indigo-800">
                  Community Kitchens · Shelters · NGOs
                </p>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  Browse certified available surplus marketplace. Submit meal demand tickets with urgent priority flags and track incoming volunteer fleet deliveries.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/80">
                <Link
                  href="/recipient/dashboard"
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-800 hover:text-indigo-950"
                >
                  <span>Open Recipient Workspace</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Side 3: Operations & Fleet */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-8 shadow-xs flex flex-col justify-between hover:border-blue-300 transition">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-800 font-bold mb-6">
                  <Truck size={22} />
                </div>
                <h3 className="text-xl font-black text-slate-900">3. Operations & Fleet</h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-blue-800">
                  Admins · QA Inspectors · Volunteer Fleet
                </p>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  Perform QA thermal inspections, execute atomic database allocations under <code className="font-mono text-blue-900 bg-white px-1 py-0.5 rounded">SELECT FOR UPDATE</code>, and dispatch refrigerated transport.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/80">
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-800 hover:text-blue-950"
                >
                  <span>Open Operations Center</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Relational DBMS Lifecycle Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <span className="text-[11px] font-black uppercase tracking-[.2em] text-[#c9f36b]">
              DBMS Concepts Applied
            </span>
            <h2 className="mt-2 text-3xl font-black md:text-4xl text-white">
              Why Food Rescue is Naturally a Relational DBMS Problem
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Surplus food distribution involves perishable inventory with strict time horizons, multi-party foreign key relationships, and race conditions during high-demand allocations.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            
            <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6">
              <div className="text-[#c9f36b] font-mono text-sm font-black mb-3">01 / ACID CONCURRENCY</div>
              <h4 className="text-base font-bold text-white">Row Locks (FOR UPDATE)</h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Prevents double-allocation of surplus inventory when two operators match requests simultaneously.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6">
              <div className="text-[#c9f36b] font-mono text-sm font-black mb-3">02 / REFERENTIAL INTEGRITY</div>
              <h4 className="text-base font-bold text-white">Cascading Constraints</h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Foreign keys connect Users → Locations → Batches → Allocations → Pickups with strict ON DELETE protections.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6">
              <div className="text-[#c9f36b] font-mono text-sm font-black mb-3">03 / STATE MACHINE</div>
              <h4 className="text-base font-bold text-white">Lifecycle Triggers</h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Enforces valid transitions: PENDING_INSPECTION → AVAILABLE → PARTIALLY_ALLOCATED → DELIVERED.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6">
              <div className="text-[#c9f36b] font-mono text-sm font-black mb-3">04 / OLAP AGGREGATIONS</div>
              <h4 className="text-base font-bold text-white">Materialized Analytics</h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Aggregates food category breakdowns, donor leaderboards, and wastage trend analysis.
              </p>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}

function Stat({ icon, value, label, sub }: { icon: React.ReactNode; value: string; label: string; sub: string }) {
  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-emerald-300 transition">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 mb-4">
        {icon}
      </div>
      <div className="text-3xl font-black font-mono tracking-tight text-slate-900">{value}</div>
      <div className="mt-1 text-sm font-bold text-slate-800">{label}</div>
      <div className="mt-1 text-xs text-slate-400">{sub}</div>
    </div>
  );
}
