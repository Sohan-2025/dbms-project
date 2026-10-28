"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { 
  Bell, 
  ShieldCheck, 
  AlertTriangle, 
  Truck, 
  CheckCircle2, 
  GitMerge, 
  PackagePlus,
  Sparkles
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "qa" | "allocation" | "pickup" | "alert";
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "QA Thermal Inspection Completed",
      message: "Batch #batch-102 (Dal Makhani & Rice) passed thermal probe test at 72.0°C and was released to available inventory.",
      timestamp: "10 minutes ago",
      type: "qa",
      read: false
    },
    {
      id: "notif-2",
      title: "New Urgent Demand Ticket Logged",
      message: "Hope Community Kitchen registered an URGENT request for 150 Portions of Cooked Meals needed before 20:00.",
      timestamp: "35 minutes ago",
      type: "alert",
      read: false
    },
    {
      id: "notif-3",
      title: "PostgreSQL Transaction Committed",
      message: "Allocation #alloc-301 bound 70 portions of Vegetable Biryani to Hope Community Kitchen.",
      timestamp: "1 hour ago",
      type: "allocation",
      read: true
    },
    {
      id: "notif-4",
      title: "Volunteer Courier Assigned",
      message: "Rahul Kumar accepted mission #pick-401 using Refrigerated Van TN 23 AB 4421.",
      timestamp: "2 hours ago",
      type: "pickup",
      read: true
    }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "qa":
        return <ShieldCheck size={18} className="text-emerald-700" />;
      case "alert":
        return <AlertTriangle size={18} className="text-rose-600" />;
      case "allocation":
        return <GitMerge size={18} className="text-indigo-600" />;
      case "pickup":
        return <Truck size={18} className="text-blue-600" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        badge="Live Network Event Stream"
        title="Operations Notifications"
        description="Real-time alerts triggered by PostgreSQL database lifecycle events, QA certifications, and logistics dispatches."
        action={
          <button
            onClick={markAllRead}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 transition"
          >
            Mark all as read
          </button>
        }
      />

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`rounded-3xl border p-5 transition flex items-start gap-4 ${
              n.read
                ? "border-slate-200/90 bg-white shadow-2xs"
                : "border-emerald-200 bg-emerald-50/40 shadow-xs"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
              {getIcon(n.type)}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                <span className="text-[11px] font-semibold text-slate-400">{n.timestamp}</span>
              </div>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
