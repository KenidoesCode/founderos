"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/state";

export default function Home() {
  const router = useRouter();
  const token = useAppStore((state) => state.token);

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#00010A]">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#B26BFF] to-[#A9E9FF] bg-clip-text text-transparent">
          FounderOS
        </h1>
        <p className="text-slate-400">Loading...</p>
      </div>
    </div>
  );
}

