"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAppStore } from "@/lib/state";

export default function Client() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const { tenant, token } = useAppStore();  

  async function generateReport() {
    if (!tenant) {
      setReport({ output: "No tenant selected. Please log in again." });
      return;
    }

    setLoading(true);
    setReport(null);

    try {
      const res = await api.post(
        "/api/aianalysis/run",
        {
          idea,
          tenantId: tenant.id,  
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      setReport({ output: res.data.data });
    } catch (err: any) {
      console.error("Analysis error:", err);
      setReport({
        output:
          err?.response?.data?.error?.message ||
          "Something went wrong. Try again.",
      });
    }

    setLoading(false);
  }

  return (
    <div className="p-10 max-w-4xl mx-auto text-white">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#B26BFF] to-[#A9E9FF] text-transparent bg-clip-text">
          AI Competitive Analysis
        </h1>
        <p className="text-slate-400 mt-2 max-w-2xl">
          FounderOS analyzes the global startup landscape — identifying competitors,
          market saturation, risks, opportunities, and differentiation angles.
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="bg-[#11111a] border border-slate-800 p-6 rounded-xl shadow-lg">
        <label className="text-sm text-slate-400 mb-2 block">
          Describe your startup idea
        </label>

        <textarea
          className="w-full p-4 border border-slate-700 rounded-xl bg-[#070708] text-white focus:outline-none focus:ring-2 focus:ring-[#B26BFF]/40 transition"
          rows={5}
          placeholder="Example: An AI tool that automates influencer marketing for small brands..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />

        <button
          onClick={generateReport}
          disabled={loading || !idea}
          className={`mt-4 px-6 py-3 rounded-lg font-medium transition w-full sm:w-auto 
            ${loading || !idea
              ? "bg-slate-700 cursor-not-allowed"
              : "bg-[#B26BFF] hover:bg-[#9e50ff]"}
          `}
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
      </div>

      {/* OUTPUT */}
      {report && (
        <div className="mt-10 bg-[#11111a] border border-slate-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-3 text-[#B26BFF]">
            Market Analysis Report
          </h2>
          <p className="text-slate-400 mb-4">
            FounderOS generated the full competitive landscape for your idea.
          </p>

          <div className="bg-[#0b0b12] border border-slate-800 rounded-xl p-4 overflow-x-auto">
            <pre className="whitespace-pre-wrap leading-relaxed text-slate-300">
              {report.output}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
}
