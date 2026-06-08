"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DrawioEditor from "@/components/DrawioEditor";
import FormulaModal from "@/components/FormulaModal";
import { getProject, updateProject, createProject, getToken } from "@/lib/auth";

export default function EditorWrapper() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#0a0b0f]" />}>
      <Editor />
    </Suspense>
  );
}

function Editor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get("project");

  const [appliedXml, setAppliedXml] = useState<string | null>(null);
  const [showFormula, setShowFormula] = useState(false);
  const [projectTitle, setProjectTitle] = useState("未命名");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const editorRef = useRef<HTMLIFrameElement>(null);
  const currentXmlRef = useRef("");

  useEffect(() => {
    if (!projectId) return;
    const pid = parseInt(projectId);
    if (isNaN(pid)) return;

    getProject(pid)
      .then((p) => {
        setProjectTitle(p.title);
        if (p.drawio_xml) {
          currentXmlRef.current = p.drawio_xml;
          setAppliedXml(p.drawio_xml);
        }
      })
      .catch(() => router.push("/dashboard"));
  }, [projectId]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data.event === "open-formula") setShowFormula(true);
        if (data.event === "nav-home") router.push("/");
        if (data.event === "nav-projects") router.push("/dashboard");
        if (data.event === "avisio-save") {
          currentXmlRef.current = data.xml || "";
          doSave(data.xml || "");
        }
      } catch {}
    };
    window.addEventListener("message", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("message", handler);
      document.body.style.overflow = "";
    };
  }, [projectId, router]);

  const doSave = async (xml?: string) => {
    if (saving) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const xmlToSave = xml || currentXmlRef.current;
      const token = getToken();

      if (projectId) {
        await updateProject(parseInt(projectId), { drawio_xml: xmlToSave });
      } else if (token) {
        const proj = await createProject(projectTitle, xmlToSave);
        router.replace(`/editor?project=${proj.id}`);
      }
      setSaveMsg("已保存");
      setTimeout(() => setSaveMsg(""), 2000);
    } catch {
      setSaveMsg("保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="flex-1 relative">
        <DrawioEditor appliedXml={appliedXml} iframeRef={editorRef} />
      </div>

      {showFormula && <FormulaModal iframeRef={editorRef} onClose={() => setShowFormula(false)} />}
    </div>
  );
}
