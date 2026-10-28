"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from "recharts";

// Custom polished Tooltip
function CustomTooltip({ active, payload, label, unit = "units" }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-xs text-xs">
        <p className="font-bold text-slate-800">{label || payload[0]?.name}</p>
        <p className="mt-1 font-mono font-black text-emerald-700">
          {Number(payload[0]?.value).toLocaleString()} {unit}
        </p>
      </div>
    );
  }
  return null;
}

export function TrendChart({ data }: { data: { date: string; quantity: number }[] }) {
  return (
    <div className="h-72 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="deliveryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#15803d" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#15803d" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            tickFormatter={(x) => {
              const d = new Date(x);
              return isNaN(d.getTime()) ? x.slice(5) : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            }}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
          />
          <Tooltip content={<CustomTooltip unit="portions" />} />
          <Area
            type="monotone"
            dataKey="quantity"
            stroke="#15803d"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#deliveryGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Category Distribution Pie/Donut matching Image 4
// Cooked Meals 48%, Bakery 21%, Fruits 15%, Vegetables 10%, Other 6%
export function CategoryChart({ data }: { data: { categoryName: string; quantity: number }[] }) {
  const COLORS = ["#15803d", "#3b82f6", "#eab308", "#14b8a6", "#8b5cf6"];
  const total = data.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="h-72 w-full flex flex-col md:flex-row items-center justify-between">
      <div className="h-64 w-full md:w-3/5">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="quantity"
              nameKey="categoryName"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip unit="units" />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Side Legend with Percentage Badges */}
      <div className="w-full md:w-2/5 space-y-2 pr-2">
        {data.map((cat, i) => {
          const pct = total > 0 ? Math.round((cat.quantity / total) * 100) : 0;
          return (
            <div key={cat.categoryName} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-md shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="font-semibold text-slate-700 truncate max-w-[110px]">{cat.categoryName}</span>
              </div>
              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Donor Contribution Bar Chart matching Image 3:
// ABC Restaurant, VIT Hostel Mess, FreshMart, College Mess
export function DonorChart({ data }: { data: { donorName: string; quantity: number }[] }) {
  return (
    <div className="h-72 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 10, right: 30, top: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="donorName"
            width={130}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#334155", fontSize: 12, fontWeight: 700 }}
          />
          <Tooltip content={<CustomTooltip unit="portions donated" />} />
          <Bar
            dataKey="quantity"
            fill="#15803d"
            radius={[0, 8, 8, 0]}
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Wastage Trend matching Image 4: Oct 21, Oct 22, Oct 23, Oct 24, Oct 25
export function WastageChart({ data }: { data: { date: string; quantity: number }[] }) {
  return (
    <div className="h-72 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            tickFormatter={(x) => {
              const d = new Date(x);
              return isNaN(d.getTime()) ? x.slice(5) : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            }}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
          />
          <Tooltip content={<CustomTooltip unit="kg expired/wasted" />} />
          <Bar
            dataKey="quantity"
            fill="#ea580c"
            radius={[6, 6, 0, 0]}
            barSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
