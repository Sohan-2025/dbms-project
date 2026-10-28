import { Icon } from "./Icon";
import { Loader2 } from "lucide-react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  ...p
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const v = {
    primary:
      "bg-[#133d26] text-white hover:bg-[#1a4f32] active:bg-[#0e2c1c] shadow-xs border border-[#133d26]",
    secondary:
      "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs",
    outline:
      "bg-transparent text-emerald-800 border border-emerald-300 hover:bg-emerald-50",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-xs",
    ghost:
      "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }[variant];

  const s = {
    sm: "px-3 py-1.5 text-xs font-bold rounded-xl",
    md: "px-4 py-2.5 text-sm font-bold rounded-xl",
    lg: "px-6 py-3.5 text-base font-bold rounded-2xl"
  }[size];

  return (
    <button
      {...p}
      disabled={p.disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-bold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${v} ${s} ${
        p.className || ""
      }`}
    >
      {loading && <Loader2 className="animate-spin" size={16} />}
      {children}
    </button>
  );
}

export function EmptyState({
  title,
  description,
  icon = "Inbox",
  action
}: {
  title: string;
  description: string;
  icon?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10">
        <Icon name={icon} size={24} />
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function TableShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs ${className}`}>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function Table({ children }: { children: React.ReactNode }) {
  return <table className="w-full min-w-[700px] text-left text-sm">{children}</table>;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search..."
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative flex items-center">
      <div className="pointer-events-none absolute left-3.5 text-slate-400">
        <Icon name="Search" size={17} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 shadow-xs outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/10"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 rounded-md p-1 text-xs text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>
      )}
    </div>
  );
}
