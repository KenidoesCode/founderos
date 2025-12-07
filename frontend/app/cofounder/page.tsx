"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/state";
import api from "@/lib/api";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { ChatWindow } from "@/components/cofounder/ChatWindow";
import { PromptBar } from "@/components/cofounder/PromptBar";

export default function CofounderPage() {
  const router = useRouter();
  const { token, tenant, personaMode, setPersonaMode } = useAppStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  const handleAsk = async (question: string) => {
    if (!tenant || !question.trim()) return;

    const userMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await api.post("/api/cofounder/ask", {
        tenantId: tenant.id,
        question,
        persona: personaMode,
      });

      if (res.data.success) {
        const answer = res.data.data;
        const aiMessage = {
          role: "assistant",
          content: answer,
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Failed to ask cofounder", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: { immediate: "Sorry, I encountered an error. Please try again." },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#00010A]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 flex flex-col p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">AI Cofounder</h1>
                <p className="text-slate-400">Ask anything about your startup</p>
              </div>
              <select
                value={personaMode}
                onChange={(e) => setPersonaMode(e.target.value as any)}
                className="px-4 py-2 bg-black/40 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B26BFF]"
              >
                <option value="default">Default</option>
                <option value="keni">Keni Mode</option>
                <option value="mentor">Calm Mentor</option>
                <option value="growth">Growth Hacker</option>
                <option value="builder">Builder Mode</option>
              </select>
            </div>
          </div>
          <div className="flex-1 flex flex-col glass rounded-2xl p-6">
            <ChatWindow messages={messages} loading={loading} />
            <PromptBar onAsk={handleAsk} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}

