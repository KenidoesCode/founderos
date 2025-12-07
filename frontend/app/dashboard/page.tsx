"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/state";
import api from "@/lib/api";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import StreakCard  from "@/components/dashboard/StreakCard";
import  PriorityCard  from "@/components/dashboard/PriorityCard";
import ActiveStartupCard  from "@/components/dashboard/ActiveStartupCard";

export default function DashboardPage() {
  const router = useRouter();
  const { token, tenant, setStreak, setActiveStartup } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [timewarp, setTimewarp] = useState<any>(null);
  const [startups, setStartups] = useState<any[]>([]);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    loadDashboard();
  }, [token, router]);

  const loadDashboard = async () => {
    try {
      // Load Time-Warp prediction
      const twRes = await api.get("/api/timewarp/next", {
        params: { tenantId: tenant?.id },
      });
      if (twRes.data.success) {
        setTimewarp(twRes.data.data);
      }

      // Load startups
      const startupsRes = await api.get("/api/startup/list", {
        params: { tenantId: tenant?.id },
      });
      if (startupsRes.data.success) {
        const startupList = startupsRes.data.data;
        setStartups(startupList);
        if (startupList.length > 0 && !startupList[0].published) {
          setActiveStartup(startupList[0]);
        }
      }

      // TODO: Load streak from API
      setStreak(5);
    } catch (error) {
      console.error("Failed to load dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#00010A]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#00010A]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, Founder</h1>
              <p className="text-slate-400">Let's build something great today</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StreakCard />
              <PriorityCard prediction={timewarp} />
              <ActiveStartupCard />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="glass rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push("/cofounder")}
                    className="w-full p-4 bg-[#B26BFF]/10 hover:bg-[#B26BFF]/20 border border-[#B26BFF]/30 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium">Ask Cofounder</div>
                    <div className="text-sm text-slate-400">Get AI-powered advice</div>
                  </button>
                  <button
                    onClick={() => router.push("/startup-generator")}
                    className="w-full p-4 bg-[#A9E9FF]/10 hover:bg-[#A9E9FF]/20 border border-[#A9E9FF]/30 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium">Generate Startup</div>
                    <div className="text-sm text-slate-400">Create a new startup idea</div>
                  </button>
                  <button
                    onClick={() => router.push("/timewarp")}
                    className="w-full p-4 bg-[#F5C96B]/10 hover:bg-[#F5C96B]/20 border border-[#F5C96B]/30 rounded-lg text-left transition-colors"
                  >
                    <div className="font-medium">View Timeline</div>
                    <div className="text-sm text-slate-400">See your predicted future</div>
                  </button>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-3 text-sm text-slate-400">
                  <div>No recent activity</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


