"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import "mathlive";
import "mathlive/fonts.css";
import { TEMPLATES } from "@/lib/latex-templates";

interface FormulaModalProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  onClose: () => void;
}

export default function FormulaModal({ iframeRef, onClose }: FormulaModalProps) {
  const [latex, setLatex] = useState("sqrt(a^2 + b^2)");
  const [previewSvg, setPreviewSvg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rendererReady, setRendererReady] = useState(false);
  const [inserting, setInserting] = useState(false);
  const rendererRef = useRef<HTMLIFrameElement>(null);
  const renderIdRef = useRef(0);
  const pendingReplies = useRef<Map<number, (svg: string) => void>>(new Map());

  // Listen for renderer replies
  const handleMessage = useCallback((e: MessageEvent) => {
    if (e.data && e.data.type === "formula-renderer-ready") {
      setRendererReady(true);
      return;
    }
    if (e.data && e.data.type === "result") {
      const resolve = pendingReplies.current.get(e.data.id);
      if (resolve) {
        pendingReplies.current.delete(e.data.id);
        resolve(e.data.svg || "");
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  // Render LaTeX to SVG via hidden iframe
  const renderLatex = useCallback((latexStr: string) => {
    if (!latexStr.trim() || !rendererRef.current || !rendererRef.current.contentWindow || !rendererReady) {
      setPreviewSvg(null);
      return;
    }
    setLoading(true);
    setError("");
    setPreviewSvg(null);
    const id = ++renderIdRef.current;
    const promise: Promise<string> = new Promise((resolve) => {
      pendingReplies.current.set(id, resolve);
    });
    rendererRef.current.contentWindow.postMessage({ type: "render", latex: latexStr, id }, "*");
    promise.then((svg) => {
      setLoading(false);
      if (svg) setPreviewSvg(svg);
      else setError("公式语法错误");
    });
    setTimeout(() => {
      if (pendingReplies.current.has(id)) {
        pendingReplies.current.delete(id);
        setLoading(false);
        setError("渲染超时");
      }
    }, 5000);
  }, [rendererReady]);

  // Auto-render on latex change
  useEffect(() => {
    const timer = setTimeout(() => renderLatex(latex), 500);
    return () => clearTimeout(timer);
  }, [latex, renderLatex, rendererReady]);

  // Insert into canvas
  const insertFormula = async () => {
    if (!previewSvg || !iframeRef.current || !iframeRef.current.contentWindow) return;
    setInserting(true);
    try {
      iframeRef.current.contentWindow.postMessage(
        { type: "insert-formula-svg", svg: previewSvg },
        "*"
      );
      onClose();
    } finally {
      setInserting(false);
    }
  };

  const previewDataUrl = previewSvg
    ? "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(previewSvg)))
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-[680px] h-auto max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        <iframe ref={rendererRef} src="/drawio/formula-render.html" className="hidden" title="FormulaRenderer" />

        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-800">公式编辑器</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* MathLive WYSIWYG */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">可视化公式编辑</label>
            <div ref={(el) => {
              if (el && !el.querySelector(".math-field-instance")) {
                const mf = document.createElement("math-field");
                mf.className = "math-field-instance";
                mf.style.cssText = "width:100%;min-height:60px;font:18px/1.4 'Times New Roman',serif;--caret-color:#185abd;";
                mf.setAttribute("smart-mode", "");
                mf.addEventListener("input", (e: Event) => {
                  const target = e.target as any;
                  setLatex((target.value ?? target.getValue?.() ?? "").trim());
                });
                el.appendChild(mf);
              }
            }}
            className="border border-gray-300 rounded-lg p-1 focus-within:ring-2 focus-within:ring-blue-500" />
          </div>

          {/* Preview */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">SVG 预览</label>
            <div className="min-h-[80px] p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-x-auto">
              {!rendererReady ? (
                <p className="text-xs text-gray-400">加载公式引擎中...</p>
              ) : loading ? (
                <p className="text-xs text-gray-400">渲染中...</p>
              ) : previewDataUrl ? (
                <img src={previewDataUrl} alt="" className="max-w-full" style={{ maxHeight: "160px" }} />
              ) : (
                <p className="text-xs text-gray-400">{error || "输入公式即可预览"}</p>
              )}
            </div>
          </div>

          {/* Template buttons */}
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer hover:text-gray-700 font-medium">常用公式模板</summary>
            <div className="mt-2 flex flex-wrap gap-1">
              {TEMPLATES.map(([name, tex]) => (
                <button key={name} onClick={() => {
                  setLatex(tex);
                  // Also set math-field value directly
                  const mf = document.querySelector("math-field");
                  if (mf) (mf as any).value = tex;
                }}
                  className="px-2 py-1 rounded hover:bg-blue-50 hover:text-blue-700 transition-colors font-mono text-xs border border-gray-200">
                  {name}
                </button>
              ))}
            </div>
          </details>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <p className="text-xs text-gray-400">输入自动识别数学公式</p>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">取消</button>
            <button onClick={insertFormula} disabled={!previewSvg || inserting}
              className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {inserting ? "插入中..." : "插入画布"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
