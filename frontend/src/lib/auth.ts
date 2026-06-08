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
