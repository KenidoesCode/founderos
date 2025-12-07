"use client";

import { motion } from "framer-motion";

interface PredictionCardProps {
  prediction: {
    feature: string;
    confidence: number;
    explanation: string;
    dateWindow: string;
  };
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 neon-edge"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Next Feature Prediction</h2>
        <div className="px-4 py-2 bg-[#A9E9FF]/20 border border-[#A9E9FF]/30 rounded-lg">
          <div className="text-xs text-slate-400 mb-1">Confidence</div>
          <div className="text-lg font-bold text-[#A9E9FF]">
            {Math.round(prediction.confidence * 100)}%
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-sm text-slate-400 mb-1">Feature</div>
          <div className="text-xl font-semibold">{prediction.feature}</div>
        </div>

        <div>
          <div className="text-sm text-slate-400 mb-1">Explanation</div>
          <div className="text-slate-300">{prediction.explanation}</div>
        </div>

        <div>
          <div className="text-sm text-slate-400 mb-1">Predicted Window</div>
          <div className="text-[#F5C96B] font-medium">{prediction.dateWindow}</div>
        </div>
      </div>
    </motion.div>
  );
}

