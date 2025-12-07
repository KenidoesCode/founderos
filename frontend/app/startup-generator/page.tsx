"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/state";
import api from "@/lib/api";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { GeneratorForm } from "@/components/startup/GeneratorForm";
import { IdeaOutput } from "@/components/startup/IdeaOutput";

export default function StartupGeneratorPage() {
  const router = useRouter();
  const { token, tenant, setActiveStartup } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [startup, setStartup] = useState<any>(null);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  const handleGenerate = async (data: {
    tags?: string[];
    market?: string;
    skillLevel?: string;
    budget?: string;
    geography?: string;
  }) => {
    if (!tenant) return;

    setLoading(true);
    try {
      const res = await api.post("/api/startup/generate", {
        tenantId: tenant.id,
        ...data,
      });

      if (res.data.success) {
        setStartup(res.data.data);
        setShowForm(false);
        setActiveStartup(res.data.data);
      }
    } catch (error) {
      console.error("Failed to generate startup", error);
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Startup Generator</h1>
            <p className="text-slate-400 mb-6">Generate validated startup ideas with AI</p>

            {showForm ? (
              <GeneratorForm onSubmit={handleGenerate} loading={loading} />
            ) : (
              <IdeaOutput
                startup={startup}
                onBack={() => setShowForm(true)}
                onGenerateNew={() => {
                  setStartup(null);
                  setShowForm(true);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

