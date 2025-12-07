"use client";

import { motion } from "framer-motion";

interface GenomeHashCardProps {
  hash: string;
  pointer?: string;
}

export default function GenomeHashCard({ hash, pointer }: GenomeHashCardProps) {
  return (
    <motion.div
      initial={{ rotateY: 0, opacity: 0 }}
      animate={{ rotateY: 360, opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="glass rounded-2xl p-8 neon-edge text-center"
      style={{ perspective: 1000 }}
    >
      <div className="mb-6">
        <div className="text-xs text-slate-400 mb-2">Founder Genome</div>
        <div className="text-2xl font-mono bg-black/20 px-4 py-2 rounded-lg inline-block">
          {hash?.slice(0, 12)}...
        </div>
      </div>
      {pointer && (
        <div className="text-xs text-slate-500 font-mono break-all">
          {pointer}
        </div>
      )}
    </motion.div>
  );
}

