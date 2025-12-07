"use client";

import { useState } from "react";

interface IdeaPersonaFormProps {
  onSubmit: (data: {
    name: string;
    description: string;
    targetMarket: string;
    revenueModel: string;
    skills?: string;
    stage?: string;
  }) => void;
}

const revenueModels = ["Free", "Paid", "Freemium", "Subscription", "One-time", "Agency"];

export function IdeaPersonaForm({ onSubmit }: IdeaPersonaFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    targetMarket: "",
    revenueModel: "",
    skills: "",
    stage: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Startup Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 bg-black/40 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B26BFF]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">One-line Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 bg-black/40 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B26BFF]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Target Market</label>
        <input
          type="text"
          value={formData.targetMarket}
          onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
          className="w-full px-4 py-2 bg-black/40 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B26BFF]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Revenue Model</label>
        <select
          value={formData.revenueModel}
          onChange={(e) => setFormData({ ...formData, revenueModel: e.target.value })}
          className="w-full px-4 py-2 bg-black/40 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B26BFF]"
          required
        >
          <option value="">Select revenue model</option>
          {revenueModels.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Skills (optional)</label>
        <input
          type="text"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          className="w-full px-4 py-2 bg-black/40 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B26BFF]"
          placeholder="e.g., Builder, Designer, Growth"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-[#B26BFF] hover:bg-[#9A5AFF] text-white rounded-lg font-medium transition-colors"
      >
        Continue
      </button>
    </form>
  );
}

