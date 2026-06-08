"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface FormulaModalProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  onClose: () => void;
}

export default function FormulaModal({ iframeRef, onClose }: FormulaModalProps) {
  const [latex, setLatex] = useState("\\sqrt{a^2 + b^2}");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [inserting, setInserting] = useState(false);
  const renderIdRef = useRef(0);

  const handleMessage = useCallback((e: MessageEvent) => {
    if (e.data?.type === "formula-preview") {
      setLoading(false);
      if (e.data.error) {
        setPreview(null);
      } else {
        setPreview(e.data.renderId?.toString() || null);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  useEffect(() => {
    setLoading(true);
    setPreview(null);
    if (!latex.trim() || !iframeRef.current?.contentWindow) return;

    const timer = setTimeout(() => {
      renderIdRef.current++;
      iframeRef.current?.contentWindow?.postMessage(
        { type: "render-formula", latex: latex.trim(), id: renderIdRef.current },
        "*"
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [latex]);

  const insertFormula = () => {
    if (!preview || !iframeRef.current) return;
    setInserting(true);
    iframeRef.current.contentWindow?.postMessage(
      { type: "insert-formula", renderId: Number(preview) },
      "*"
    );
    setInserting(false);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) insertFormula();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-[640px] max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-800">在线公式编辑器</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
        </div>
        <div className="p-5 space-y-4 flex-1 overflow-y-auto">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">LaTeX 公式代码</label>
            <textarea value={latex} onChange={(e) => setLatex(e.target.value)} onKeyDown={handleKeyDown}
              className="w-full h-28 p-3 text-sm font-mono border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入 LaTeX 公式代码..." spellCheck={false} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">实时预览</label>
            <div className="min-h-[100px] p-4 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
              {loading ? <p className="text-xs text-gray-400">渲染中...</p>
              : preview ? <p className="text-xs text-green-600">公式渲染成功</p>
              : <p className="text-xs text-gray-400">公式语法错误，请检查</p>}
            </div>
          </div>
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer hover:text-gray-700 font-medium">常用公式模板</summary>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {[["分式","\\frac{a}{b}"],["根号","\\sqrt{x}"],["n 次根","\\sqrt[n]{x}"],["上标","x^{2}"],["下标","x_{i}"],["积分","\\int_{a}^{b}"],["求和","\\sum_{i=1}^{n}"],["希腊字母","\\alpha \\beta \\gamma"],["箭头","\\rightarrow \\Rightarrow"],["矩阵","\\begin{matrix} a & b \\\\ c & d \\end{matrix}"],["方程组","\\begin{cases} x+y=1 \\\\ x-y=2 \\end{cases}"],["极限","\\lim_{x \\to 0}"]].map(([n,c]) => (
                <button key={n+c} onClick={() => setLatex(c)}
                  className="text-left px-2 py-1 rounded hover:bg-blue-50 hover:text-blue-700 transition-colors font-mono text-[11px] truncate">
                  <span className="text-gray-400 mr-1">{n}:</span> {c}
                </button>
              ))}
            </div>
          </details>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <p className="text-[11px] text-gray-400">Ctrl+Enter 快速插入</p>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">取消</button>
            <button onClick={insertFormula} disabled={!preview || inserting}
              className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {inserting ? "插入中..." : "插入画布"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
