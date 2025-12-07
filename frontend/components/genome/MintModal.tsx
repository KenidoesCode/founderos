"use client";

import { useState } from "react";
import { X } from "lucide-react";
import api from "@/lib/api";
import { useAppStore } from "@/lib/state";

interface MintModalProps {
  hash: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function MintModal({ hash, onClose, onSuccess }: MintModalProps) {
  const { tenant } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMint = async () => {
    if (!tenant) return;

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/genome/mint", {
        tenantId: tenant.id,
        genomeHash: hash,
        mode: "user-signed",
      });

      if (res.data.success) {
        const { unsignedTx } = res.data.data;

        // Check if MetaMask is available
        if (typeof window !== "undefined" && (window as any).ethereum) {
          try {
            const txHash = await (window as any).ethereum.request({
              method: "eth_sendTransaction",
              params: [unsignedTx],
            });
            console.log("Transaction sent:", txHash);
            onSuccess();
          } catch (err: any) {
            setError(err.message || "Transaction failed");
          }
        } else {
          setError("MetaMask not found. Please install MetaMask.");
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Minting failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl p-6 max-w-md w-full neon-edge">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Mint Founder Genome</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-slate-400 text-sm">
            Mint your founder genome hash to the blockchain. This creates an on-chain record of your founder identity.
          </p>

          <div className="p-3 bg-slate-800/50 rounded-lg">
            <div className="text-xs text-slate-400 mb-1">Hash</div>
            <div className="font-mono text-xs break-all">{hash}</div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleMint}
              disabled={loading}
              className="flex-1 py-2 bg-[#B26BFF] hover:bg-[#9A5AFF] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Minting..." : "Mint"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

