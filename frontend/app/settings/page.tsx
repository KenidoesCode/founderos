"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/state";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function SettingsPage() {
  const router = useRouter();
  const { personaMode, setPersonaMode } = useAppStore();

  return (
    <div className="flex h-screen bg-[#00010A]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-slate-400 mb-6">Manage your preferences</p>

            <div className="glass rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">AI Persona</label>
                <select
                  value={personaMode}
                  onChange={(e) => setPersonaMode(e.target.value as any)}
                  className="w-full px-4 py-2 bg-black/40 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B26BFF]"
                >
                  <option value="default">Default</option>
                  <option value="keni">Keni Mode (Aggressive)</option>
                  <option value="mentor">Calm Mentor</option>
                  <option value="growth">Growth Hacker</option>
                  <option value="builder">Builder Mode</option>
                </select>
                <p className="text-xs text-slate-500 mt-2">
                  Choose your AI cofounder's personality and response style
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

