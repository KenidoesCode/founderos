"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string | {
    immediate?: string;
    plan?: Array<{ step: string; time: string }>;
    risk?: string;
    tasks?: Array<{ title: string; estimate: string; details?: string }>;
  };
}

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
}

export function ChatWindow({ messages, loading }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const renderContent = (content: Message["content"]) => {
    if (typeof content === "string") {
      return <p className="text-slate-300">{content}</p>;
    }

    return (
      <div className="space-y-4">
        {content.immediate && (
          <div className="p-4 bg-[#B26BFF]/10 border border-[#B26BFF]/30 rounded-lg">
            <div className="text-xs text-[#B26BFF] mb-1">IMMEDIATE ACTION</div>
            <div className="font-semibold">{content.immediate}</div>
          </div>
        )}

        {content.plan && content.plan.length > 0 && (
          <div>
            <div className="text-xs text-slate-400 mb-2">PLAN</div>
            <ul className="space-y-2">
              {content.plan.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#A9E9FF] mt-1">•</span>
                  <div className="flex-1">
                    <div className="text-slate-300">{item.step}</div>
                    <div className="text-xs text-slate-500">{item.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {content.risk && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="text-xs text-yellow-400 mb-1">RISK</div>
            <div className="text-sm text-slate-300">{content.risk}</div>
          </div>
        )}

        {content.tasks && content.tasks.length > 0 && (
          <div>
            <div className="text-xs text-slate-400 mb-2">TASKS</div>
            <div className="space-y-2">
              {content.tasks.map((task, idx) => (
                <div key={idx} className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-slate-200">{task.title}</div>
                    <div className="text-xs text-slate-500">{task.estimate}</div>
                  </div>
                  {task.details && (
                    <div className="text-xs text-slate-400 mt-1">{task.details}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2"
      style={{ maxHeight: "calc(100vh - 300px)" }}
    >
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-slate-500">
          <div className="text-center">
            <Bot size={48} className="mx-auto mb-4 text-slate-700" />
            <p>Ask your AI cofounder anything about your startup</p>
          </div>
        </div>
      )}

      {messages.map((msg, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          {msg.role === "assistant" && (
            <div className="w-8 h-8 rounded-full bg-[#B26BFF] flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-black" />
            </div>
          )}
          <div
            className={`max-w-[80%] ${
              msg.role === "user"
                ? "bg-[#B26BFF]/20 text-white"
                : "bg-slate-800/50 text-slate-200"
            } rounded-2xl p-4`}
          >
            {msg.role === "user" ? (
              <p>{typeof msg.content === "string" ? msg.content : "User message"}</p>
            ) : (
              renderContent(msg.content)
            )}
          </div>
          {msg.role === "user" && (
            <div className="w-8 h-8 rounded-full bg-[#A9E9FF] flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-black" />
            </div>
          )}
        </motion.div>
      ))}

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-4"
        >
          <div className="w-8 h-8 rounded-full bg-[#B26BFF] flex items-center justify-center">
            <Bot size={16} className="text-black" />
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-4">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-[#B26BFF] rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-[#B26BFF] rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-[#B26BFF] rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

