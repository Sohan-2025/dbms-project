"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { api } from "@/lib/api";
import type { User, UserRole } from "@/types/api";
import { DbmsSchemaModal } from "./DbmsSchemaModal";
import { 
  Database, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Package, 
  HeartHandshake, 
  CheckCircle2,
  Menu,
  X,
  Bell,
  LogOut,
  UserCircle
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: string;
}

const roleNav = (role: UserRole): { section: string; items: NavItem[] }[] => {
  const commonSection = {
    section: "Account",
    items: [
      { href: "/notifications", label: "Notifications", icon: "Bell" },
      { href: "/profile", label: "Profile & Identity", icon: "UserCircle" }
    ]
  };

  if (role === "DONOR") {
    return [
      {
        section: "Surplus Management",
        items: [
          { href: "/donor/dashboard", label: "Overview", icon: "LayoutDashboard" },
          { href: "/donor/batches/new", label: "Register Surplus", icon: "PlusCircle", badge: "New" },
          { href: "/donor/batches", label: "Active Inventory", icon: "PackageOpen" },
          { href: "/donor/history", label: "Impact & History", icon: "History" }
        ]
      },
      commonSection
    ];
  }

  if (role === "RECIPIENT") {
    return [
      {
        section: "Demand & Allocations",
        items: [
          { href: "/recipient/dashboard", label: "Overview", icon: "LayoutDashboard" },
          { href: "/recipient/food", label: "Available Food", icon: "Utensils", badge: "Live" },
          { href: "/recipient/requests/new", label: "Create Request", icon: "PlusCircle" },
          { href: "/recipient/requests", label: "My Requests", icon: "ClipboardList" },
          { href: "/recipient/allocations", label: "Allocated Batches", icon: "Boxes" }
        ]
      },
      commonSection
    ];
  }

  if (role === "VOLUNTEER") {
    return [
      {
        section: "Fleet & Dispatch",
        items: [
          { href: "/volunteer/dashboard", label: "Fleet Hub", icon: "LayoutDashboard" },
          { href: "/volunteer/pickups", label: "Assigned Pickups", icon: "Truck", badge: "Active" }
        ]
      },
      commonSection
    ];
  }

  // ADMIN / OPERATIONS
  return [
    {
      section: "Command Center",
      items: [
        { href: "/admin/dashboard", label: "Operations Hub", icon: "LayoutDashboard" },
        { href: "/admin/batches", label: "Food Batches & QA", icon: "PackageCheck", badge: "Inspect" },
        { href: "/admin/requests", label: "Demand Requests", icon: "ClipboardList" },
        { href: "/admin/allocations", label: "Allocation Desk", icon: "GitMerge" },
        { href: "/admin/pickups", label: "Pickup Dispatch", icon: "Truck" },
        { href: "/admin/analytics", label: "Impact Analytics", icon: "ChartNoAxesCombined" },
        { href: "/admin/users", label: "Users & Privileges", icon: "Users" }
      ]
    },
    commonSection
  ];
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [isDbmsOpen, setIsDbmsOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    api.me()
      .then((r) => {
        setUser(r.data.user);
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  const handleRoleSwitch = (newRole: UserRole) => {
    const updatedUser = api.switchRole(newRole);
    setUser(updatedUser);
    setRoleMenuOpen(false);

    // Navigate to role-specific home
    if (newRole === "ADMIN") router.push("/admin/dashboard");
    else if (newRole === "DONOR") router.push("/donor/dashboard");
    else if (newRole === "RECIPIENT") router.push("/recipient/dashboard");
    else if (newRole === "VOLUNTEER") router.push("/volunteer/dashboard");
  };

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#f7f9f7]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-emerald-800 border-t-transparent" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Connecting to REPLATE Node...
          </p>
        </div>
      </div>
    );
  }

  const sections = roleNav(user.role);

  return (
    <div className="min-h-screen bg-[#f7f9f7] text-slate-800 antialiased">
      
      {/* DBMS Schema Modal */}
      <DbmsSchemaModal isOpen={isDbmsOpen} onClose={() => setIsDbmsOpen(false)} />

      {/* Sidebar for Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200/90 bg-white shadow-sm transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          
          {/* Brand header */}
          <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f2d1e] to-[#1a4a33] font-black text-[#c9f36b] shadow-sm ring-1 ring-emerald-950/20 group-hover:scale-105 transition-transform">
                R
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg tracking-tight text-slate-900">REPLATE</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[.22em] text-emerald-800">
                  DBMS Project Hub
                </div>
              </div>
            </Link>

            <button
              onClick={() => setOpen(false)}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
            >
              <X size={18} />
            </button>
          </div>

          {/* Role pill badge */}
          <div className="p-4 border-b border-slate-100 bg-emerald-50/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900">
                Active Portal
              </span>
              <span className="rounded-full bg-emerald-700 text-white text-[10px] font-black px-2 py-0.5">
                {user.role}
              </span>
            </div>
            <div className="mt-1 text-xs font-bold text-slate-700 truncate">
              {user.organizationName || user.name}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-6 overflow-y-auto p-4">
            {sections.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-[.18em] text-slate-400">
                  {sec.section}
                </div>
                {sec.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
                  return (
                    <Link
                      key={item.href}
                      onClick={() => setOpen(false)}
                      href={item.href}
                      className={`flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-bold transition-all ${
                        isActive
                          ? "bg-[#143d26] text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon name={item.icon} size={18} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                            isActive
                              ? "bg-emerald-500/20 text-[#c9f36b]"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* DBMS Schema Trigger Footer */}
          <div className="border-t border-slate-200/80 p-4 space-y-3 bg-white">
            <button
              onClick={() => setIsDbmsOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white py-3 px-4 text-xs font-bold shadow-sm hover:bg-slate-800 transition"
            >
              <Database size={15} className="text-emerald-400" />
              <span>DBMS Schema Inspector</span>
            </button>
            <div className="flex items-center justify-between px-2 text-[11px] text-slate-400">
              <span>Port: 3000 ↔ 4000</span>
              <span className="font-mono text-emerald-700 font-bold">PostgreSQL</span>
            </div>
          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 lg:hidden shadow-xs"
            >
              <Menu size={18} />
            </button>

            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-[.18em] text-slate-400">
                  REPLATE REDISTRIBUTION PLATFORM
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-emerald-800 capitalize">
                  {user.role.toLowerCase()} workspace
                </span>
              </div>
            </div>
          </div>

          {/* Quick Role Switcher & Inspector Trigger */}
          <div className="flex items-center gap-2.5">
            
            {/* Quick Portal Switcher Pills */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 rounded-2xl border border-emerald-200/80 bg-emerald-50/70 px-3.5 py-2 text-xs font-black text-emerald-900 shadow-xs hover:bg-emerald-100/70 transition"
              >
                <Sparkles size={14} className="text-emerald-700" />
                <span className="hidden md:inline">Portal:</span>
                <span>{user.role}</span>
                <ChevronDown size={14} />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 text-xs">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Switch Presentation Role
                  </div>
                  <button
                    onClick={() => handleRoleSwitch("ADMIN")}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-left transition ${
                      user.role === "ADMIN" ? "bg-emerald-50 text-emerald-900" : "hover:bg-slate-50"
                    }`}
                  >
                    <span>🏢 Operations / Admin</span>
                    {user.role === "ADMIN" && <CheckCircle2 size={15} className="text-emerald-700" />}
                  </button>
                  <button
                    onClick={() => handleRoleSwitch("DONOR")}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-left transition ${
                      user.role === "DONOR" ? "bg-emerald-50 text-emerald-900" : "hover:bg-slate-50"
                    }`}
                  >
                    <span>🥗 Donor Portal (Kitchens)</span>
                    {user.role === "DONOR" && <CheckCircle2 size={15} className="text-emerald-700" />}
                  </button>
                  <button
                    onClick={() => handleRoleSwitch("RECIPIENT")}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-left transition ${
                      user.role === "RECIPIENT" ? "bg-emerald-50 text-emerald-900" : "hover:bg-slate-50"
                    }`}
                  >
                    <span>🍲 Recipient Portal (Shelters)</span>
                    {user.role === "RECIPIENT" && <CheckCircle2 size={15} className="text-emerald-700" />}
                  </button>
                  <button
                    onClick={() => handleRoleSwitch("VOLUNTEER")}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-left transition ${
                      user.role === "VOLUNTEER" ? "bg-emerald-50 text-emerald-900" : "hover:bg-slate-50"
                    }`}
                  >
                    <span>🚚 Volunteer Logistics Fleet</span>
                    {user.role === "VOLUNTEER" && <CheckCircle2 size={15} className="text-emerald-700" />}
                  </button>
                </div>
              )}
            </div>

            {/* View DBMS ER Diagram */}
            <button
              onClick={() => setIsDbmsOpen(true)}
              className="hidden md:flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-xs transition"
              title="View Relational Entity Graph and ACID Boundaries"
            >
              <Database size={14} className="text-emerald-700" />
              <span>ER Schema</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => router.push("/notifications")}
              className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-xs transition"
              title="Notifications"
            >
              <Bell size={18} />
            </button>

            {/* Sign Out */}
            <button
              onClick={async () => {
                await api.logout();
                router.replace("/login");
              }}
              className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 shadow-xs transition"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/80 bg-white px-8 py-5 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600">REPLATE</span>
            <span>· Surplus Food Redistribution & Resource Management Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-emerald-800 font-semibold">PostgreSQL Relational Core</span>
            <span>REST API v1.0.0</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
