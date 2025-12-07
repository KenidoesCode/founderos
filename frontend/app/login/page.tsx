"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/state";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser, setTenant, setToken } = useAppStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/auth/login", { email, password });
      if (res.data.success) {
        const { user, tenant, token } = res.data.data;
        setUser(user);
        setTenant(tenant);
        setToken(token);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#00010A] p-4">
      <div className="w-full max-w-md glass rounded-2xl p-8 neon-edge">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#B26BFF] to-[#A9E9FF] bg-clip-text text-transparent">
          FounderOS
        </h1>
        <p className="text-slate-400 mb-6">Your AI Cofounder</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-black/40 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B26BFF]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-black/40 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B26BFF]"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#B26BFF] hover:bg-[#9A5AFF] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <a href="/register" className="text-[#B26BFF] hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

