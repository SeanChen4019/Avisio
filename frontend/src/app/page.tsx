"use client";

import { useEffect, useRef, useState } from "react";
import { getStoredUser } from "@/lib/auth";

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    setLoggedIn(!!getStoredUser());
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">
      {/* ---------- Navigation ---------- */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Avisio" className="h-7 w-auto" />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <button onClick={() => scrollTo("features")} className="hover:text-gray-900 transition-colors">功能特点</button>
            <button onClick={() => scrollTo("pricing")} className="hover:text-gray-900 transition-colors">价格方案</button>
            <button onClick={() => scrollTo("about")} className="hover:text-gray-900 transition-colors">关于</button>
          </div>
          <div className="flex items-center gap-3">
            {loggedIn ? (
              <a href="/dashboard" className="text-sm font-medium bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-all">
                Dashboard
              </a>
            ) : (
              <>
                <a href="/auth" className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">登录</a>
                <a href="/auth" className="text-sm font-medium bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-all">免费开始</a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ---------- Hero ---------- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.06)_0%,transparent_60%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-[10%] w-px h-32 bg-gradient-to-b from-transparent via-blue-400/10 to-transparent" />
          <div className="absolute top-40 right-[15%] w-px h-48 bg-gradient-to-b from-transparent via-violet-400/10 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-xs text-gray-500 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            AI 智能图表编辑器
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
              用思维画图
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-blue-400 bg-clip-text text-transparent">
              让 AI 帮你构建
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Avisio 将专业图表编辑与 AI 智能生成相结合。描述你的架构，即刻呈现。
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/editor"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all text-sm shadow-lg shadow-gray-900/10"
            >
              免费开始画图
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
            <button
              onClick={() => scrollTo("features")}
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50 hover:text-gray-900 transition-all text-sm"
            >
              了解更多
            </button>
          </div>

          {/* Preview mockup */}
          <div className="mt-16 relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative rounded-2xl border border-gray-200 overflow-hidden shadow-2xl shadow-gray-200/50 bg-white">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="ml-4 text-[11px] text-gray-400">avisio.app — AI 图表编辑器</div>
              </div>
              <div className="aspect-[16/9] bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="flex items-center gap-6 justify-center text-gray-400 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-12 rounded-lg border border-gray-200 bg-white" />
                      <div className="text-left"><div className="font-medium text-gray-700 text-sm">系统输入</div><div className="text-[10px] text-gray-400">数据层</div></div>
                    </div>
                    <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-12 rounded-lg border border-gray-200 bg-white" />
                      <div className="text-left"><div className="font-medium text-gray-700 text-sm">核心逻辑</div><div className="text-[10px] text-gray-400">处理层</div></div>
                    </div>
                    <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-12 rounded-lg border border-gray-200 bg-white" />
                      <div className="text-left"><div className="font-medium text-gray-700 text-sm">系统输出</div><div className="text-[10px] text-gray-400">结果层</div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section id="features" className="py-28 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs text-blue-600 font-medium tracking-widest uppercase">功能特点</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4 text-gray-900">
              你需要的一切
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">打造精美图表</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">基于专业级图表编辑器，赋予 AI 超能力。</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: "◈", title: "AI 智能生成", desc: "用自然语言描述你的系统，Avisio 在数秒内生成可编辑的专业图表。" },
              { icon: "✦", title: "专业编辑器", desc: "完整的 draw.io 集成，支持形状、连线、图层、主题等所有专业工具。" },
              { icon: "◇", title: "公式与数学支持", desc: "内置 LaTeX 公式编辑器，基于 MathJax 渲染，完美适用于科研和技术图表。" },
              { icon: "▣", title: "多格式导出", desc: "导出为 PNG、SVG、PDF 或原生 .drawio 格式，无缝适配你的工作流。" },
              { icon: "◎", title: "云端同步", desc: "项目自动本地保存，云端同步即将上线，实现无缝协作。" },
              { icon: "⊡", title: "私有化部署", desc: "数据完全由你掌控。完全自包含，核心功能无需任何外部服务。" },
            ].map((f, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md transition-all duration-300"
              >
                <div className="text-2xl mb-4 text-blue-500/70 group-hover:text-blue-600 transition-colors">{f.icon}</div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Pricing ---------- */}
      <section id="pricing" className="py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs text-blue-600 font-medium tracking-widest uppercase">价格方案</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4 text-gray-900">
              简洁透明
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">的价格方案</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "免费版", price: "$0", desc: "基础功能免费使用", features: ["每日 5 次 AI 生成", "基础形状与模板", "PNG 导出", "本地存储"] },
              { name: "专业版", price: "$9", period: "/月", desc: "适合专业人士和团队", features: ["无限 AI 生成", "全部形状与模板", "SVG/PDF 导出", "云端同步", "优先支持"], popular: true },
              { name: "企业版", price: "$29", period: "/月", desc: "适合组织级用户", features: ["包含专业版所有功能", "团队协作", "自定义模板", "私有化部署支持", "API 访问"] },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                  plan.popular
                    ? "border-blue-500 bg-white shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/20"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-[11px] font-semibold rounded-full">
                    最受欢迎
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-400 text-sm">{plan.period}</span>}
                </div>
                <p className="text-sm text-gray-500 mb-8">{plan.desc}</p>
                <ul className="space-y-3 mb-10">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {feat}
                    </li>
                  ))}
                </ul>
                <a
                  href="/editor"
                  className={`block text-center py-3 rounded-full text-sm font-medium transition-all ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-500 shadow-sm"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  立即使用
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="py-28 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-blue-500/5 rounded-3xl blur-3xl" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              准备好简化你的
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">图表工作流程了吗？</span>
            </h2>
            <p className="text-gray-500 mb-10 max-w-md mx-auto text-sm">无需注册，即刻开始画图。</p>
            <a
              href="/editor"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all text-sm shadow-lg shadow-gray-900/10"
            >
              立即打开 Avisio
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ---------- About / Footer ---------- */}
      <footer id="about" className="border-t border-gray-200 py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="Avisio" className="h-6 w-auto" />
              </div>
              <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                Avisio 是一款基于 AI 的智能图表编辑器，专为工程师、研究人员和团队打造。
                生成、编辑、导出专业图表——一切在浏览器中完成。
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">产品</h4>
              <div className="space-y-2.5 text-sm text-gray-500">
                <button onClick={() => scrollTo("features")} className="block hover:text-gray-800 transition-colors">功能特点</button>
                <button onClick={() => scrollTo("pricing")} className="block hover:text-gray-800 transition-colors">价格方案</button>
                <a href="/editor" className="block hover:text-gray-800 transition-colors">编辑器</a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">开发者</h4>
              <div className="space-y-2.5 text-sm text-gray-500">
                <span>Sean Chen</span>
                <a href="mailto:seanchen4019@gmail.com" className="block hover:text-gray-800 transition-colors">seanchen4019@gmail.com</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <span>&copy; {new Date().getFullYear()} Avisio。保留所有权利。</span>
            <span>由 Sean Chen 开发</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
