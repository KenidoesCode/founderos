"use client";

import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function SwarmPage() {
  return (
    <div className="flex h-screen bg-[#00010A]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Swarm Matching</h1>
            <p className="text-slate-400 mb-6">Find cofounders based on founder genomes</p>

            <div className="glass rounded-2xl p-12 text-center">
              <p className="text-slate-400">Swarm matching coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

