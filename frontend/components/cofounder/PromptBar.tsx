"use client";

import { useState, KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface PromptBarProps {
  onAsk: (question: string) => void;
  loading: boolean;
}

export function PromptBar({ onAsk, loading }: PromptBarProps) {
  const [question, setQuestion] = useState("");

  const handleSubmit = () => {
    if (question.trim() && !loading) {
      onAsk(question);
      setQuestion("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-3">
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask your AI cofounder..."
        className="flex-1 px-4 py-3 bg-black/40 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B26BFF] resize-none"
        rows={2}
        disabled={loading}
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !question.trim()}
        className="px-6 py-3 bg-[#B26BFF] hover:bg-[#9A5AFF] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Send size={18} />
        <span>Send</span>
      </button>
    </div>
  );
}

