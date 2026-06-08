"use client";

import { useRef, useCallback, useEffect, useState } from "react";

interface DrawioEditorProps {
  appliedXml: string | null;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
  onLoad?: () => void;
}

const DRAWIO_EMBED_URL =
  "/drawio/index.html?embed=1&proto=json&spin=1&splash=0&lang=zh";

const BLANK_XML = `<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>`;

export default function DrawioEditor({ appliedXml, iframeRef: externalRef, onLoad }: DrawioEditorProps) {
  const internalRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Sync internal ref to external ref
  const iframeRef = externalRef || internalRef;

  // Listen for postMessage from draw.io
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (!iframeRef.current) return;
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data.event === "init") {
          setReady(true);
          onLoad?.();
          const msg = JSON.stringify({ action: "load", xml: BLANK_XML });
          iframeRef.current.contentWindow?.postMessage(msg, "*");
        }
      } catch {
        // ignore non-JSON messages
      }
    },
    [onLoad]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  // Send XML to draw.io when new content arrives
  useEffect(() => {
    if (!appliedXml || !iframeRef.current || !ready) return;
    const msg = JSON.stringify({ action: "load", xml: appliedXml });
    iframeRef.current.contentWindow?.postMessage(msg, "*");
  }, [appliedXml, ready]);

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-3"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <p className="text-sm text-gray-500">加载编辑器中...</p>
          </div>
        </div>
      )}
      <iframe
          ref={iframeRef}
          src={DRAWIO_EMBED_URL}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="w-full h-full border-0"
          title="Avisio Editor"
          allowFullScreen
        />
    </div>
  );
}
