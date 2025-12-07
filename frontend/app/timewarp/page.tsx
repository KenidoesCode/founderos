"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/state";
import api from "@/lib/api";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Timeline } from "@/components/timewarp/Timeline";
import { PredictionCard } from "@/components/timewarp/PredictionCard";

export default function TimeWarpPage() {
  const router = useRouter();
  const { token, tenant } = useAppStore();
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    loadPrediction();
  }, [token, router, tenant]);

  const loadPrediction = async () => {
    if (!tenant) return;

    try {
      const res = await api.get("/api/timewarp/next", {
        params: { tenantId: tenant.id },
      });

      if (res.data.success) {
        setPrediction(res.data.data);
      }
    } catch (error) {
      console.error("Failed to load prediction", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#00010A]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Time-Warp Engine</h1>
            <p className="text-slate-400 mb-6">Predictive execution forecasting</p>

            {loading ? (
              <div className="text-center py-12 text-slate-400">Loading prediction...</div>
            ) : prediction ? (
              <div className="space-y-6">
                <PredictionCard prediction={prediction} />
                <Timeline predictions={[prediction]} />
              </div>
            ) : (
              <div className="glass rounded-2xl p-12 text-center">
                <p className="text-slate-400">No prediction available yet. Start building to see your future!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

