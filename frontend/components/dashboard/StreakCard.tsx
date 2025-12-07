"use client";

import { Flame } from "lucide-react";
import { useAppStore } from "@/lib/state";

export function StreakCard() {
  const streak = useAppStore((state) => state.streak);

  return (
    <div className="glass rounded-2xl p-6 neon-edge">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Daily Streak</h3>
        <Flame className="text-[#F5C96B]" size={24} />
      </div>
      <div className="text-4xl font-bold mb-2">{streak}</div>
      <div className="text-sm text-slate-400">days in a row</div>
      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-500">
          Keep building to maintain your streak!
        </div>
      </div>
    </div>
  );
}

