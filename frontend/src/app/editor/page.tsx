"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DrawioEditor from "@/components/DrawioEditor";
import FormulaModal from "@/components/FormulaModal";
import { getProject, updateProject, createProject, getToken, listCategories, createCategory, createMaterial } from "@/lib/auth";

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

  // Material save state
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [materialXml, setMaterialXml] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [materialSaving, setMaterialSaving] = useState(false);

  // Push project name + size to draw.io menu bar
  function sendProjectInfo(xml?: string) {
    const xmlStr = xml || currentXmlRef.current;
    const kb = xmlStr ? (new Blob([xmlStr]).size / 1024).toFixed(1) : "0";
    const text = `${projectTitle || "未命名"} · ${kb} KB`;
    editorRef.current?.contentWindow?.postMessage(
      { type: "avisio-project-info", text },
      "*"
    );
  }

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
    const timer = setTimeout(() => sendProjectInfo(), 800);
    return () => clearTimeout(timer);
  }, [projectTitle, appliedXml]);

  // Open material dialog: load categories, get selected cell
  const openMaterialDialog = () => {
    listCategories().then((cats) => {
      setCategories(cats);
      setSelectedCategory(cats[0]?.id || 0);
      setMaterialName("");
      setNewCategoryName("");
      setShowMaterialDialog(true);
    });
    // Ask iframe for selected cell
    editorRef.current?.contentWindow?.postMessage(
      { type: "avisio-get-selected" }, "*"
    );
  };

  // Handle save material
  const handleSaveMaterial = async () => {
    if (!materialXml || !materialName.trim()) return;
    setMaterialSaving(true);
    try {
      let catId = selectedCategory;
      if (!catId && newCategoryName.trim()) {
        const cat = await createCategory(newCategoryName.trim());
        catId = cat.id;
        setCategories((prev) => [...prev, cat]);
        setSelectedCategory(cat.id);
      }
      if (!catId) { alert("请选择一个分类"); setMaterialSaving(false); return; }
      await createMaterial(catId, materialName.trim(), materialXml);
      setShowMaterialDialog(false);
      setSaveMsg("素材已保存");
      setTimeout(() => setSaveMsg(""), 2000);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setMaterialSaving(false);
    }
  };

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data.event === "open-formula") setShowFormula(true);
        if (data.event === "nav-home") router.push("/");
        if (data.event === "nav-projects") router.push("/dashboard");
        if (data.event === "avisio-get-selected-ask") openMaterialDialog();
        if (data.event === "avisio-save") {
          currentXmlRef.current = data.xml || "";
          doSave(data.xml || "");
        }
        if (data.type === "avisio-selected" && showMaterialDialog) {
          if (!data.error) {
            setMaterialXml(data.xml);
            setMaterialName(data.name || "元素");
          }
        }
      } catch {}
    };
    window.addEventListener("message", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("message", handler);
      document.body.style.overflow = "";
    };
  }, [projectId, router, showMaterialDialog]);

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
      sendProjectInfo(xmlToSave);
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

      {saveMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 bg-[#131418]/90 text-white/60 text-xs rounded-full backdrop-blur-md border border-white/10">
          {saveMsg}
        </div>
      )}

      {/* Material save dialog */}
      {showMaterialDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowMaterialDialog(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-[420px] max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-800">保存素材</h2>
              <button onClick={() => setShowMaterialDialog(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">素材名称</label>
                <input value={materialName} onChange={(e) => setMaterialName(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="给素材起个名字" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">选择分类</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(Number(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500">
                  <option value={0}>— 新建分类 —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              {!selectedCategory && (
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">新分类名称</label>
                  <input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="如：常用组件、图标..." />
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button onClick={() => setShowMaterialDialog(false)} className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">取消</button>
              <button onClick={handleSaveMaterial} disabled={materialSaving || !materialXml}
                className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {materialSaving ? "保存中..." : "保存素材"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showFormula && <FormulaModal iframeRef={editorRef} onClose={() => setShowFormula(false)} />}
    </div>
  );
}
