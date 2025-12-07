"use client";

import { Menu, Bell } from "lucide-react";
import { useAppStore } from "@/lib/state";

export function Topbar() {
  const { sidebarOpen, setSidebarOpen, user, tenant } = useAppStore();

  return (
    <div className="h-16 border-b border-slate-800 bg-[#0A0A12] flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>
        {tenant && (
          <span className="text-sm text-slate-400">{tenant.name}</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#B26BFF] rounded-full"></span>
        </button>
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B26BFF] to-[#A9E9FF] flex items-center justify-center text-sm font-medium text-black">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-sm text-slate-300">{user.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

