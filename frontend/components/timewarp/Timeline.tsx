"use client";

import { motion } from "framer-motion";

interface TimelineProps {
  predictions: Array<{
    feature: string;
    confidence: number;
    explanation: string;
    dateWindow: string;
  }>;
}

export function Timeline({ predictions }: TimelineProps) {
  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">Timeline</h2>
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max px-4">
          {predictions.map((pred, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="min-w-[260px] p-4 bg-slate-800/50 rounded-lg border border-slate-700"
            >
              <div className="text-sm text-slate-400 mb-2">{pred.dateWindow}</div>
              <div className="text-lg font-semibold mb-2">{pred.feature}</div>
              <div className="text-sm text-slate-300 mb-3">{pred.explanation}</div>
              <div className="text-xs text-green-300">
                Confidence: {Math.round(pred.confidence * 100)}%
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

