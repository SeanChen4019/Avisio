"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/lib/AuthContext";

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsInner />
    </AuthGuard>
  );
}

function SettingsInner() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Nav */}
      <nav className="border-b border-gray-200 h-14 flex items-center px-6 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/">
              <img src="/logo.png" alt="Avisio" className="h-6 w-auto" />
            </a>
            <span className="text-sm text-gray-400">账号设置</span>
          </div>
          <a
            href="/dashboard"
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← 返回控制台
          </a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8">账号设置</h1>

        {/* Profile Section */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">个人资料</h2>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
            <ProfileField label="姓名" value={user?.name || "-"} />
            <ProfileField label="邮箱" value={user?.email || "-"} />
            <ProfileField label="套餐" value={user?.plan || "free"} badge />
            <ProfileField label="用户 ID" value={user?.id?.toString() || "-"} />
          </div>
        </section>

        {/* About Section */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">关于</h2>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 text-sm text-gray-600 leading-relaxed shadow-sm">
            <p>
              Avisio v0.2.0 — AI 智能图表编辑器
            </p>
            <p>
              开发者: Sean Chen
            </p>
            <p>
              如有问题或建议，请联系
              <a href="mailto:seanchen4019@gmail.com" className="text-blue-600 hover:text-blue-700 ml-1">
                seanchen4019@gmail.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function ProfileField({ label, value, badge }: { label: string; value: string; badge?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="flex items-center gap-2">
        {badge ? (
          <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-gray-300 text-gray-600 uppercase">
            {value}
          </span>
        ) : (
          <span className="text-sm text-gray-900">{value}</span>
        )}
      </div>
    </div>
  );
}
