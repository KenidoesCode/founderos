"use client";

import { Rocket } from "lucide-react";
import { useAppStore } from "@/lib/state";
import { useRouter } from "next/navigation";

export default function ActiveStartupCard() {
  const router = useRouter();
  const activeStartup = useAppStore((state) => state.activeStartup);

  if (!activeStartup) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Active Startup</h3>
          <Rocket className="text-[#B26BFF]" size={24} />
        </div>
        <div className="text-slate-400 text-sm mb-4">No active startup</div>
        <button
          onClick={() => router.push("/startup-generator")}
          className="w-full py-2 bg-[#B26BFF] hover:bg-[#9A5AFF] text-white rounded-lg text-sm font-medium transition-colors"
        >
          Generate Startup
        </button>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 neon-edge">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Active Startup</h3>
        <Rocket className="text-[#B26BFF]" size={24} />
      </div>
      <div className="text-xl font-semibold mb-2">{activeStartup.title}</div>
      <div className="text-sm text-slate-400 mb-4">{activeStartup.oneLiner}</div>
      <button
        onClick={() => router.push(`/startup-generator?startup=${activeStartup.slug}`)}
        className="w-full py-2 bg-[#B26BFF] hover:bg-[#9A5AFF] text-white rounded-lg text-sm font-medium transition-colors"
      >
        View Details
      </button>
    </div>
  );
}

