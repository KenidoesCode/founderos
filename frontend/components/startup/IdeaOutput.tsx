"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/state";
import api from "@/lib/api";
import { ChevronDown, ChevronUp, Rocket, CheckCircle } from "lucide-react";

interface IdeaOutputProps {
  startup: any;
  onBack: () => void;
  onGenerateNew: () => void;
}

export function IdeaOutput({ startup, onBack, onGenerateNew }: IdeaOutputProps) {
  const router = useRouter();
  const { tenant, setActiveStartup } = useAppStore();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["landing"]));
  const [saving, setSaving] = useState(false);

  if (!startup || !startup.json) {
    return <div>No startup data</div>;
  }

  const data = startup.json;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const handleSaveAsActive = async () => {
    setActiveStartup(startup);
    router.push("/dashboard");
  };

  const handleGenerateLanding = () => {
    router.push(`/startup-generator/${startup.slug}/landing`);
  };

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{data.title}</h2>
            <p className="text-slate-400 mt-1">{data.oneLiner}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm"
            >
              Back
            </button>
            <button
              onClick={onGenerateNew}
              className="px-4 py-2 bg-[#A9E9FF] hover:bg-[#8FD9FF] text-black rounded-lg text-sm font-medium"
            >
              New Idea
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <Section
            title="Problem"
            content={data.problem}
            expanded={expandedSections.has("problem")}
            onToggle={() => toggleSection("problem")}
          />
          <Section
            title="Solution"
            content={data.solution}
            expanded={expandedSections.has("solution")}
            onToggle={() => toggleSection("solution")}
          />
          <Section
            title="Landing Page"
            expanded={expandedSections.has("landing")}
            onToggle={() => toggleSection("landing")}
          >
            {data.landing && (
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-slate-400 mb-1">Headline</div>
                  <div className="text-lg font-semibold">{data.landing.headline}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Subheadline</div>
                  <div className="text-slate-300">{data.landing.subheadline}</div>
                </div>
                {data.landing.bullets && (
                  <div>
                    <div className="text-sm text-slate-400 mb-2">Key Benefits</div>
                    <ul className="space-y-1">
                      {data.landing.bullets.map((bullet: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle size={16} className="text-[#B26BFF] mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Section>
          <Section
            title="Validation Tasks"
            expanded={expandedSections.has("validation")}
            onToggle={() => toggleSection("validation")}
          >
            {data.validationTasks && (
              <div className="space-y-3">
                {data.validationTasks.map((task: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="font-medium text-slate-200">{task.task}</div>
                    <div className="text-sm text-slate-400 mt-1">
                      Metric: {task.metric} • Time: {task.timeEstimate}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
          <Section
            title="Pricing"
            expanded={expandedSections.has("pricing")}
            onToggle={() => toggleSection("pricing")}
          >
            {data.pricing && (
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-xs text-slate-400 mb-1">Free</div>
                  <div className="text-sm">{data.pricing.free}</div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-xs text-slate-400 mb-1">Paid</div>
                  <div className="text-sm">{data.pricing.paid}</div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-xs text-slate-400 mb-1">Enterprise</div>
                  <div className="text-sm">{data.pricing.enterprise}</div>
                </div>
              </div>
            )}
          </Section>
          <Section
            title="Competitors"
            expanded={expandedSections.has("competitors")}
            onToggle={() => toggleSection("competitors")}
          >
            {data.competitors && (
              <div className="space-y-3">
                {data.competitors.map((comp: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="font-medium text-slate-200">{comp.name}</div>
                    <div className="text-sm text-slate-400 mt-1">{comp.whyTheyFail}</div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800 flex gap-3">
          <button
            onClick={handleSaveAsActive}
            className="flex-1 py-3 bg-[#B26BFF] hover:bg-[#9A5AFF] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Rocket size={18} />
            Save as Active Startup
          </button>
          <button
            onClick={handleGenerateLanding}
            className="flex-1 py-3 bg-[#A9E9FF] hover:bg-[#8FD9FF] text-black rounded-lg font-medium transition-colors"
          >
            Generate Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  content,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  content?: string;
  expanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="border border-slate-800 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
      >
        <span className="font-medium">{title}</span>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {expanded && (
        <div className="px-4 py-3 border-t border-slate-800">
          {content && <p className="text-slate-300">{content}</p>}
          {children}
        </div>
      )}
    </div>
  );
}

