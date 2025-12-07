"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Dna,
  Sparkles,
  Users,
  Timeline,
  Settings,
  User,
} from "lucide-react";
import { useAppStore } from "@/lib/state";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, shortcut: "D" },
  { href: "/cofounder", label: "Cofounder", icon: MessageSquare, shortcut: "C" },
  { href: "/genome", label: "Genome", icon: Dna, shortcut: "G" },
  { href: "/startup-generator", label: "Startup Generator", icon: Sparkles, shortcut: "S" },
  { href: "/swarm", label: "Swarm Matching", icon: Users, shortcut: "W" },
  { href: "/timewarp", label: "Time Warp", icon: Timeline, shortcut: "T" },
  { href: "/settings", label: "Settings", icon: Settings, shortcut: "," },
  { href: "/profile", label: "Profile", icon: User, shortcut: "P" },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);

  if (!sidebarOpen) {
    return (
      <div className="w-16 border-r border-slate-800 bg-[#0A0A12] flex flex-col items-center py-4">
        {navItems.slice(0, 4).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "p-3 rounded-lg mb-2 transition-colors",
              pathname === item.href
                ? "bg-[#B26BFF]/20 text-[#B26BFF]"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            <item.icon size={20} />
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="w-64 border-r border-slate-800 bg-[#0A0A12] flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#B26BFF] to-[#A9E9FF] bg-clip-text text-transparent">
          FounderOS
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors group",
                isActive
                  ? "bg-[#B26BFF]/20 text-[#B26BFF]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <Icon size={20} />
              <span className="flex-1">{item.label}</span>
              <kbd className="hidden group-hover:inline text-xs px-2 py-1 bg-slate-800 rounded">
                {item.shortcut}
              </kbd>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

