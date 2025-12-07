"use client";

import { useState } from "react";
import { X, Rocket, Sparkles } from "lucide-react";

interface OnboardingModalProps {
  onClose: () => void;
  onSelectPath: (path: "idea" | "explorer") => void;
}

export function OnboardingModal({ onClose, onSelectPath }: OnboardingModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl p-8 max-w-2xl w-full neon-edge">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Welcome to FounderOS</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-slate-400 mb-8">
          Do you already have a startup idea?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onSelectPath("idea")}
            className="p-6 glass rounded-xl hover:bg-slate-800/50 transition-colors text-left border border-slate-700 hover:border-[#B26BFF]"
          >
            <Rocket className="text-[#B26BFF] mb-3" size={32} />
            <div className="font-semibold mb-2">Yes — I have an idea</div>
            <div className="text-sm text-slate-400">
              I already have a startup idea or project. Help me execute it.
            </div>
          </button>

          <button
            onClick={() => onSelectPath("explorer")}
            className="p-6 glass rounded-xl hover:bg-slate-800/50 transition-colors text-left border border-slate-700 hover:border-[#A9E9FF]"
          >
            <Sparkles className="text-[#A9E9FF] mb-3" size={32} />
            <div className="font-semibold mb-2">No — I want an idea</div>
            <div className="text-sm text-slate-400">
              Generate startup ideas and a launch plan for me.
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

