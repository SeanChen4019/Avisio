const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export interface OutlineResult {
  title: string;
  summary: string;
  modules: { name: string; description: string }[];
  relationships: string[];
}

export interface GenerateResult {
  drawio_xml: string;
  summary: string;
}

export async function generateOutline(userInput: string, style = "technical"): Promise<OutlineResult> {
  const res = await fetch(`${API_BASE}/api/ai/outline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_input: userInput, style }),
  });
  if (!res.ok) throw new Error("Failed to generate outline");
  return res.json();
}

export async function generateDrawio(outline: string, style = "technical"): Promise<GenerateResult> {
  const res = await fetch(`${API_BASE}/api/ai/generate-drawio`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ outline, style }),
  });
  if (!res.ok) throw new Error("Failed to generate diagram");
  return res.json();
}

export async function beautifyDiagram(drawioXml: string, instruction = ""): Promise<GenerateResult> {
  const res = await fetch(`${API_BASE}/api/ai/beautify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ drawio_xml: drawioXml, instruction }),
  });
  if (!res.ok) throw new Error("Failed to beautify diagram");
  return res.json();
}

export async function saveProject(title: string, drawioXml: string) {
  const res = await fetch(`${API_BASE}/api/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, drawio_xml: drawioXml }),
  });
  if (!res.ok) throw new Error("Failed to save project");
  return res.json();
}

export async function loadProject(id: number) {
  const res = await fetch(`${API_BASE}/api/projects/${id}`);
  if (!res.ok) throw new Error("Failed to load project");
  return res.json();
}
