import { Icon } from "./Icon";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: string;
  sub?: string;
  accent?: boolean;
  trend?: {
    value: string;
    positive?: boolean;
  };
}

export function KpiCard({ label, value, icon, sub, accent = false, trend }: KpiCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-6 transition-all duration-200 hover:shadow-lg ${
        accent
          ? "border-emerald-700 bg-gradient-to-br from-[#123824] to-[#1a4a32] text-white shadow-md shadow-emerald-950/10"
          : "border-slate-200/90 bg-white shadow-xs hover:border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`text-[11px] font-black uppercase tracking-[.14em] ${
              accent ? "text-emerald-200/70" : "text-slate-400"
            }`}
          >
            {label}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight font-mono">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>

          <div className="mt-2 flex items-center gap-2">
            {trend && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  accent
                    ? "bg-white/15 text-emerald-200"
                    : trend.positive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {trend.value}
              </span>
            )}
            {sub && (
              <span className={`text-xs ${accent ? "text-emerald-100/75" : "text-slate-500"}`}>
                {sub}
              </span>
            )}
          </div>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            accent
              ? "bg-white/10 text-emerald-300 ring-1 ring-white/20"
              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10"
          }`}
        >
          <Icon name={icon} size={22} />
        </div>
      </div>
    </div>
  );
}
