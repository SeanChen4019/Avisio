"use client";

import { useState } from "react";
import { generateOutline, generateDrawio, OutlineResult, GenerateResult } from "@/lib/api";

interface AIPanelProps {
  onApplyXml: (xml: string) => void;
}

export default function AIPanel({ onApplyXml }: AIPanelProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [outline, setOutline] = useState<OutlineResult | null>(null);
  const [draft, setDraft] = useState<GenerateResult | null>(null);
  const [tab, setTab] = useState<"prompt" | "outline" | "preview">("prompt");

  const handleGenerateOutline = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await generateOutline(input);
      setOutline(result);
      setTab("outline");
    } catch (e) {
      alert("生成大纲失败，请确认后端服务是否运行。");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDiagram = async () => {
    if (!outline) return;
    setLoading(true);
    try {
      const result = await generateDrawio(outline.title);
      setDraft(result);
      setTab("preview");
    } catch (e) {
      alert("生成图示失败。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-700">AI 助手</h2>
        <p className="text-xs text-gray-500 mt-0.5">描述你需要的图示</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 text-xs">
        {(["prompt", "outline", "preview"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-center font-medium transition-colors ${
              tab === t
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "prompt" ? "输入" : t === "outline" ? "大纲" : "预览"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tab === "prompt" && (
          <>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='例如："三层卫星无人机应急通信架构"'
              className="w-full h-28 p-3 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleGenerateOutline}
              disabled={loading || !input.trim()}
              className="w-full py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "生成中..." : "生成大纲"}
            </button>
          </>
        )}

        {tab === "outline" && outline && (
          <>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-sm text-blue-800">{outline.title}</h3>
              <p className="text-xs text-blue-600 mt-1">{outline.summary}</p>
            </div>
            <div className="space-y-2">
              {outline.modules.map((m, i) => (
                <div key={i} className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-xs font-semibold text-gray-700 bg-gray-200 rounded px-1.5 py-0.5">
                    模块 {i + 1}
                  </span>
                  <p className="text-sm font-medium text-gray-800 mt-1">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.description}</p>
                </div>
              ))}
            </div>
            {outline.relationships.length > 0 && (
              <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-1">关系连线</p>
                {outline.relationships.map((r, i) => (
                  <p key={i} className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="text-gray-400">→</span> {r}
                  </p>
                ))}
              </div>
            )}
            <button
              onClick={handleGenerateDiagram}
              disabled={loading}
              className="w-full py-2 px-4 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "生成中..." : "生成图示"}
            </button>
            <button
              onClick={() => setOutline(null)}
              className="w-full py-1.5 text-xs text-gray-500 hover:text-gray-700"
            >
              ← 返回输入
            </button>
          </>
        )}

        {tab === "preview" && draft && (
          <>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <p className="text-xs text-yellow-700 font-medium">草稿已就绪</p>
              <p className="text-xs text-yellow-600 mt-1">{draft.summary}</p>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <div className="p-4 flex items-center justify-center h-40 bg-gray-50">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => onApplyXml(draft.drawio_xml)}
              className="w-full py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              应用到画布
            </button>
            <button
              onClick={() => {
                setDraft(null);
                setTab("prompt");
              }}
              className="w-full py-1.5 text-xs text-gray-500 hover:text-gray-700"
            >
              ← 丢弃并重新开始
            </button>
          </>
        )}

        {tab === "outline" && !outline && (
          <p className="text-xs text-gray-400 text-center py-8">请先生成大纲</p>
        )}
        {tab === "preview" && !draft && (
          <p className="text-xs text-gray-400 text-center py-8">请先生成图示</p>
        )}
      </div>
    </div>
  );
}
