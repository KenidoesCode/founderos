"use client";

import { Target } from "lucide-react";

interface PriorityCardProps {
  prediction?: {
    feature: string;
    confidence: number;
    explanation: string;
    dateWindow: string;
  } | null;
}

export default function PriorityCard({ prediction }: PriorityCardProps) {
  if (!prediction) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Today's Priority</h3>
          <Target className="text-[#A9E9FF]" size={24} />
        </div>
        <div className="text-slate-400 text-sm">Loading prediction...</div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 neon-edge">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Today's Priority</h3>
        <Target className="text-[#A9E9FF]" size={24} />
      </div>
      <div className="text-xl font-semibold mb-2">{prediction.feature}</div>
      <div className="text-sm text-slate-400 mb-4">{prediction.explanation}</div>
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">{prediction.dateWindow}</div>
        <div className="text-xs font-medium text-[#A9E9FF]">
          {Math.round(prediction.confidence * 100)}% confidence
        </div>
      </div>
    </div>
  );
}

