"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/state";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function ProfilePage() {
  const router = useRouter();
  const { user, tenant } = useAppStore();

  return (
    <div className="flex h-screen bg-[#00010A]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Profile</h1>
            <p className="text-slate-400 mb-6">Your founder profile</p>

            <div className="glass rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <div className="text-slate-300">{user?.name || "Not set"}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="text-slate-300">{user?.email || "Not set"}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Workspace</label>
                <div className="text-slate-300">{tenant?.name || "Not set"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

