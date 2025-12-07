"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/state";
import api from "@/lib/api";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import GenomeHashCard from "@/components/genome/GenomeHashCard";
import MintModal from "@/components/genome/MintModal";

export default function GenomePage() {
  const router = useRouter();
  const { token, tenant } = useAppStore();
  const [genome, setGenome] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMint, setShowMint] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    loadGenome();
  }, [token, router, tenant]);

  const loadGenome = async () => {
    if (!tenant) return;

    try {
      const res = await api.get("/api/genome", {
        params: { tenantId: tenant.id },
      });

      if (res.data.success) {
        setGenome(res.data.data);
      }
    } catch (error) {
      console.error("Failed to load genome", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!tenant) return;

    // Generate a sample profile (in production, this would come from user data)
    const profile = {
      userId: tenant.id,
      name: tenant.name,
      traits: {
        riskTolerance: 0.7,
        speed: 0.8,
        collaboration: 0.6,
        marketObsession: 0.9,
        resilience: 0.75,
      },
      milestones: [],
      lastUpdated: new Date().toISOString(),
    };

    try {
      const res = await api.post("/api/genome/generate", {
        tenantId: tenant.id,
        profile,
      });

      if (res.data.success) {
        setGenome({
          hash: res.data.data.hash,
          pointer: res.data.data.pointer,
        });
      }
    } catch (error) {
      console.error("Failed to generate genome", error);
    }
  };

  return (
    <div className="flex h-screen bg-[#00010A]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Founder Genome</h1>
            <p className="text-slate-400 mb-6">Your on-chain founder identity</p>

            {loading ? (
              <div className="text-center py-12 text-slate-400">Loading...</div>
            ) : genome ? (
              <div className="space-y-6">
                <GenomeHashCard hash={genome.hash} pointer={genome.pointer} />
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Genome Details</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hash:</span>
                      <span className="font-mono text-xs">{genome.hash}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pointer:</span>
                      <span className="font-mono text-xs">{genome.pointer}</span>
                    </div>
                    {genome.txHash && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Transaction:</span>
                        <span className="font-mono text-xs">{genome.txHash}</span>
                      </div>
                    )}
                  </div>
                  {!genome.txHash && (
                    <button
                      onClick={() => setShowMint(true)}
                      className="mt-6 w-full py-3 bg-[#B26BFF] hover:bg-[#9A5AFF] text-white rounded-lg font-medium transition-colors"
                    >
                      Mint to Blockchain
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-12 text-center">
                <p className="text-slate-400 mb-6">No genome found. Generate your founder identity.</p>
                <button
                  onClick={handleGenerate}
                  className="px-6 py-3 bg-[#B26BFF] hover:bg-[#9A5AFF] text-white rounded-lg font-medium transition-colors"
                >
                  Generate Genome
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showMint && genome && (
        <MintModal
          hash={genome.hash}
          onClose={() => setShowMint(false)}
          onSuccess={() => {
            setShowMint(false);
            loadGenome();
          }}
        />
      )}
    </div>
  );
}

