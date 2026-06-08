"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "出错了");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.04)_0%,transparent_60%)]" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <a href="/" className="flex justify-center mb-8">
          <img src="/logo.png" alt="Avisio" className="h-8 w-auto" />
        </a>

        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl shadow-gray-200/50">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("login")}
              className={`px-4 py-1.5 text-sm rounded-full transition-all ${
                mode === "login" ? "bg-gray-900 text-white font-medium" : "text-gray-400 hover:text-gray-700"
              }`}
            >
              登录
            </button>
            <button
              onClick={() => setMode("register")}
              className={`px-4 py-1.5 text-sm rounded-full transition-all ${
                mode === "register" ? "bg-gray-900 text-white font-medium" : "text-gray-400 hover:text-gray-700"
              }`}
            >
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">姓名</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="你的姓名"
                />
              </div>
            )}
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all text-sm disabled:opacity-50"
            >
              {busy ? "请稍候..." : mode === "login" ? "登录" : "创建账户"}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            <a href="/" className="text-blue-600 hover:text-blue-700">← 返回首页</a>
          </p>
        </div>
      </div>
    </div>
  );
}
