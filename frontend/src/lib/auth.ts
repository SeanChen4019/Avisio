const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export interface User {
  id: number;
  email: string;
  name: string;
  plan: string;
}

export interface AuthResult {
  token: string;
  user: User;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("avisio_token");
}

export function setToken(token: string) {
  localStorage.setItem("avisio_token", token);
}

export function clearToken() {
  localStorage.removeItem("avisio_token");
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("avisio_user");
  return raw ? JSON.parse(raw) : null;
}

export function setStoredUser(user: User) {
  localStorage.setItem("avisio_user", JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem("avisio_user");
}

async function api(method: string, path: string, body?: unknown) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

// ---------- Auth API ----------

export async function register(email: string, password: string, name?: string): Promise<AuthResult> {
  const data = await api("POST", "/api/auth/register", { email, password, name: name || "" });
  setToken(data.token);
  setStoredUser(data.user);
  return data;
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const data = await api("POST", "/api/auth/login", { email, password });
  setToken(data.token);
  setStoredUser(data.user);
  return data;
}

export async function getMe(): Promise<User> {
  return api("GET", "/api/auth/me");
}

export function logout() {
  clearToken();
  clearStoredUser();
}

// ---------- Project API ----------

export interface ProjectSummary {
  id: number;
  title: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProjectDetail {
  id: number;
  title: string;
  drawio_xml: string;
}

export async function listProjects(): Promise<ProjectSummary[]> {
  return api("GET", "/api/projects");
}

export async function createProject(title = "Untitled", drawioXml = ""): Promise<ProjectDetail> {
  return api("POST", "/api/projects", { title, drawio_xml: drawioXml });
}

export async function getProject(id: number): Promise<ProjectDetail> {
  return api("GET", `/api/projects/${id}`);
}

export async function updateProject(id: number, data: { title?: string; drawio_xml?: string }): Promise<ProjectDetail> {
  return api("PUT", `/api/projects/${id}`, data);
}

export async function deleteProject(id: number): Promise<void> {
  return api("DELETE", `/api/projects/${id}`);
}

// ---------- Material API ----------

export interface MaterialCategory {
  id: number;
  name: string;
  created_at: string | null;
}

export interface MaterialItem {
  id: number;
  category_id: number;
  name: string;
  cell_xml: string;
  preview_svg: string | null;
  created_at: string | null;
}

export async function listCategories(): Promise<MaterialCategory[]> {
  return api("GET", "/api/materials/categories");
}

export async function createCategory(name: string): Promise<MaterialCategory> {
  return api("POST", "/api/materials/categories", { name });
}

export async function deleteCategory(id: number): Promise<void> {
  return api("DELETE", `/api/materials/categories/${id}`);
}

export async function listMaterials(categoryId: number): Promise<MaterialItem[]> {
  return api("GET", `/api/materials/categories/${categoryId}/items`);
}

export async function createMaterial(
  categoryId: number,
  name: string,
  cellXml: string,
  previewSvg?: string
): Promise<MaterialItem> {
  return api("POST", "/api/materials/items", {
    category_id: categoryId,
    name,
    cell_xml: cellXml,
    preview_svg: previewSvg || null,
  });
}

export async function deleteMaterial(id: number): Promise<void> {
  return api("DELETE", `/api/materials/items/${id}`);
}
