"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { Loader2 } from "lucide-react";

export default function AIAnalysisPage() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  async function generateReport() {
    if (!idea.trim()) return;
    setLoading(true);
    setReport(null);

    const res = await fetch("/api/competitive-analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
    });

    const data = await res.json();
    setReport(data);
    setLoading(false);
  }

  return (
    <div className="flex h-screen bg-[#00010A]">
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        {/* PAGE CONTENT */}
        <div className="flex-1 flex flex-col p-6 overflow-auto">
          {/* HEADER */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-1">AI Market Analysis</h1>
            <p className="text-slate-400 max-w-2xl">
              FounderOS scans the entire startup ecosystem, identifies competitors,
              market gaps, and saturation levels — helping you validate your idea instantly.
            </p>
          </div>

          {/* MAIN ANALYSIS CARD */}
          <div className="glass flex-1 rounded-2xl p-6 flex flex-col gap-6">

            {/* IDEA INPUT */}
            <div>
              <label className="text-sm text-slate-400 block mb-2">
                Enter your startup idea
              </label>
              <textarea
                className="w-full p-4 bg-black/40 border border-slate-700 rounded-xl text-white 
                           focus:outline-none focus:ring-2 focus:ring-[#B26BFF]/40 transition"
                rows={4}
                placeholder="Example: An AI tool that automates influencer marketing for small businesses..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={generateReport}
              disabled={loading || !idea}
              className={`px-6 py-3 rounded-lg w-full sm:w-auto font-medium transition
              ${(!idea || loading)
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-[#B26BFF] hover:bg-[#9e50ff] text-white"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Analyzing Market…
                </span>
              ) : (
                "Run Competitive Analysis"
              )}
            </button>

            {/* RESULT SECTION */}
            {report && (
              <div className="border border-slate-800 rounded-xl p-6 bg-black/30 mt-4 flex-1 overflow-auto">
                <h2 className="text-2xl font-bold mb-3 text-[#B26BFF]">
                  Market Report
                </h2>
                <p className="text-slate-400 mb-4">
                  FounderOS processed your idea and generated a detailed landscape overview.
                </p>

                <div className="bg-[#0b0b12] border border-slate-800 rounded-xl p-4 overflow-x-auto">
                  <pre className="whitespace-pre-wrap leading-relaxed text-slate-300">
                    {report.output}
                  </pre>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
