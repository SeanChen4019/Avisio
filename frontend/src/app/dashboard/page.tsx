"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/lib/AuthContext";
import {
  listProjects, createProject, deleteProject, ProjectSummary,
  listCategories, createCategory, deleteCategory,
  listMaterials, deleteMaterial,
  MaterialCategory, MaterialItem,
} from "@/lib/auth";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardInner />
    </AuthGuard>
  );
}

function DashboardInner() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  // Materials state
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [activeCatId, setActiveCatId] = useState<number>(0);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const loadProjects = async () => {
    setLoading(true);
    try {
      const list = await listProjects();
      setProjects(list);
    } catch { setProjects([]); }
    finally { setLoading(false); }
  };

  const loadCategories = async () => {
    try {
      const cats = await listCategories();
      setCategories(cats);
      if (cats.length > 0 && !activeCatId) setActiveCatId(cats[0].id);
    } catch {}
  };

  const loadMaterials = async (catId: number) => {
    if (!catId) { setMaterials([]); return; }
    try {
      const items = await listMaterials(catId);
      setMaterials(items);
    } catch { setMaterials([]); }
  };

  useEffect(() => { loadProjects(); loadCategories(); }, []);
  useEffect(() => { loadMaterials(activeCatId); }, [activeCatId]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      const proj = await createProject(newTitle.trim());
      router.push(`/editor?project=${proj.id}`);
    } catch (e: any) { alert(e.message); }
    setShowNew(false); setNewTitle("");
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`确认删除"${title}"？`)) return;
    try { await deleteProject(id); setProjects((prev) => prev.filter((p) => p.id !== id)); }
    catch (e: any) { alert(e.message); }
  };

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const cat = await createCategory(newCatName.trim());
      setCategories((prev) => [...prev, cat]);
      setActiveCatId(cat.id);
    } catch (e: any) { alert(e.message); }
    setShowNewCat(false); setNewCatName("");
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("确认删除此分类及其所有素材？")) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (activeCatId === id) setActiveCatId(0);
    } catch (e: any) { alert(e.message); }
  };

  const handleDeleteMaterial = async (id: number) => {
    if (!confirm("确认删除此素材？")) return;
    try { await deleteMaterial(id); setMaterials((prev) => prev.filter((m) => m.id !== id)); }
    catch (e: any) { alert(e.message); }
  };

  // Insert material into editor
  const handleInsertMaterial = (mat: MaterialItem) => {
    const editorUrl = new URL("/editor", window.location.origin);
    const newWindow = window.open(editorUrl.toString(), "_blank");
    // Insert will be handled if we pass the material XML somehow
    // For now: open editor and copy to clipboard for manual insert
    navigator.clipboard.writeText(mat.cell_xml).then(() => {
      alert("素材 XML 已复制到剪贴板，在编辑器中可用 Ctrl+Shift+M 快捷粘贴。或直接使用编辑器的素材菜单。");
    });
    if (newWindow) newWindow.focus();
  };

  const handleLogout = () => { logout(); router.push("/"); };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Nav */}
      <nav className="border-b border-gray-200 h-14 flex items-center px-6 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/"><img src="/logo.png" alt="Avisio" className="h-6 w-auto" /></a>
            <span className="text-sm text-gray-400 hidden sm:inline">控制台</span>
          </div>
          <div className="flex items-center gap-3">
            <UserMenu user={user} onLogout={handleLogout} />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">我的项目</h1>
            <p className="text-sm text-gray-500 mt-1">{projects.length} 个项目</p>
          </div>
          <button onClick={() => setShowNew(true)}
            className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all">
            + 新建项目
          </button>
        </div>

        {/* New Project Dialog */}
        {showNew && (
          <div className="mb-6 p-4 rounded-2xl border border-gray-200 bg-white flex items-center gap-3 shadow-sm">
            <input autoFocus value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="项目名称..."
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 transition-all">创建</button>
            <button onClick={() => setShowNew(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">取消</button>
          </div>
        )}

        {/* Project Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-300 rounded-3xl bg-white">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 text-sm mb-4">还没有项目</p>
            <button onClick={() => setShowNew(true)} className="px-4 py-2 bg-gray-900 text-white text-sm rounded-full hover:bg-gray-800 transition-all">创建你的第一个项目</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} onOpen={() => router.push(`/editor?project=${p.id}`)} onDelete={() => handleDelete(p.id, p.title)} />
            ))}
          </div>
        )}

        {/* ───── Materials Section ───── */}
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">我的素材</h2>
              <p className="text-sm text-gray-500 mt-1">在编辑器中选中元素，点击菜单栏的"素材"保存</p>
            </div>
            <button onClick={() => setShowNewCat(true)}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-full hover:bg-gray-50 transition-all">
              + 新建分类
            </button>
          </div>

          {/* New Category Dialog */}
          {showNewCat && (
            <div className="mb-4 p-4 rounded-2xl border border-gray-200 bg-white flex items-center gap-3 shadow-sm">
              <input autoFocus value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
                placeholder="分类名称，如：常用图标、流程图组件..."
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              <button onClick={handleCreateCategory} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 transition-all">创建</button>
              <button onClick={() => setShowNewCat(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">取消</button>
            </div>
          )}

          {/* Category Tabs */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-3 overflow-x-auto">
              {categories.map((cat) => (
                <button key={cat.id}
                  onClick={() => setActiveCatId(cat.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                    activeCatId === cat.id ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}>
                  {cat.name}
                  <span onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}
                    className="text-[10px] opacity-50 hover:opacity-100 cursor-pointer">&times;</span>
                </button>
              ))}
            </div>
          )}

          {/* Material Items Grid */}
          {categories.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-3xl bg-white">
              <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-500 text-sm mb-3">还没有素材分类</p>
              <button onClick={() => setShowNewCat(true)} className="px-4 py-2 bg-gray-900 text-white text-sm rounded-full hover:bg-gray-800 transition-all">创建第一个分类</button>
            </div>
          ) : materials.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-3xl bg-white">
              <p className="text-gray-500 text-sm">此分类下还没有素材</p>
              <p className="text-gray-400 text-xs mt-1">在编辑器中选中元素，点击菜单栏"素材"保存</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {materials.map((mat) => (
                <div key={mat.id}
                  className="group relative p-4 rounded-2xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="aspect-video rounded-lg bg-gray-50 mb-3 flex items-center justify-center border border-gray-100 text-gray-300 text-4xl">
                    ◈
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 truncate">{mat.name}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {mat.created_at ? new Date(mat.created_at).toLocaleDateString("zh-CN") : ""}
                  </p>
                  <button onClick={() => handleDeleteMaterial(mat.id)}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, onOpen, onDelete }: { project: ProjectSummary; onOpen: () => void; onDelete: () => void }) {
  const updated = project.updated_at
    ? new Date(project.updated_at).toLocaleDateString("zh-CN", { month: "short", day: "numeric", year: "numeric" })
    : "未知";

  return (
    <div className="group relative p-5 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md transition-all cursor-pointer" onClick={onOpen}>
      <div className="aspect-video rounded-lg bg-gray-50 mb-4 flex items-center justify-center border border-gray-100">
        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-sm font-medium text-gray-900 truncate">{project.title}</h3>
      <p className="text-xs text-gray-400 mt-1">{updated}</p>
      <button onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
        <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

/* ───── User Dropdown Menu ───── */

function UserMenu({ user, onLogout }: { user: { email: string; name: string; plan: string } | null; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const initial = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-xs font-medium text-blue-600">{initial}</div>
        <div className="hidden sm:block text-left">
          <div className="text-xs text-gray-700 leading-tight">{user?.name || user?.email}</div>
          <div className="text-[10px] text-gray-400 leading-tight">{user?.email}</div>
        </div>
        <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-200/50 py-1.5 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="text-xs text-gray-600">{user?.email}</div>
            <span className="text-[10px] px-2 py-0.5 mt-1 inline-block rounded-full border border-gray-200 text-gray-500 uppercase">{user?.plan}</span>
          </div>
          <a href="/settings" className="flex items-center gap-2 px-4 py-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            账号设置
          </a>
          <button onClick={onLogout} className="flex items-center gap-2 w-full px-4 py-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            退出登录
          </button>
        </div>
      )}
    </div>
  );
}
