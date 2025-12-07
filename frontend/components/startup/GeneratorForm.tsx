"use client";

import { useState } from "react";

interface GeneratorFormProps {
  onSubmit: (data: {
    tags?: string[];
    market?: string;
    skillLevel?: string;
    budget?: string;
    geography?: string;
  }) => void;
  loading: boolean;
}

const domains = [
  "Web3",
  "SaaS",
  "AI Automation",
  "Creator Tools",
  "EdTech",
  "FinTech",
  "Commerce Tools",
  "India-first products",
  "Global SMB tools",
];

const skillLevels = ["Builder", "Designer", "PM", "Growth", "Mixed"];
const budgets = ["Low", "Medium", "High"];
const geographies = ["India-first", "US SMB", "Europe", "APAC"];

export function GeneratorForm({ onSubmit, loading }: GeneratorFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [market, setMarket] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [budget, setBudget] = useState("");
  const [geography, setGeography] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      tags: selectedTags,
      market,
      skillLevel,
      budget,
      geography,
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3">Pick domains</label>
        <div className="flex flex-wrap gap-2">
          {domains.map((domain) => (
            <button
              key={domain}
              type="button"
              onClick={() => toggleTag(domain)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedTags.includes(domain)
                  ? "bg-[#B26BFF] text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Skillset</label>
        <select
          value={skillLevel}
          onChange={(e) => setSkillLevel(e.target.value)}
          className="w-full px-4 py-2 bg-black/40 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B26BFF]"
        >
          <option value="">Select skillset</option>
          {skillLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Budget</label>
        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full px-4 py-2 bg-black/40 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B26BFF]"
        >
          <option value="">Select budget</option>
          {budgets.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Geography</label>
        <select
          value={geography}
          onChange={(e) => setGeography(e.target.value)}
          className="w-full px-4 py-2 bg-black/40 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B26BFF]"
        >
          <option value="">Select geography</option>
          {geographies.map((geo) => (
            <option key={geo} value={geo}>
              {geo}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading || selectedTags.length === 0}
        className="w-full py-3 bg-[#B26BFF] hover:bg-[#9A5AFF] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Startup Ideas"}
      </button>
    </form>
  );
}

