import os
from contextlib import asynccontextmanager
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

load_dotenv()

from models import init_db, get_session, User, Project
from auth import hash_password, verify_password, create_token, decode_token

# ---------- FastAPI App ----------

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(title="Avisio API", version="0.2.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Pydantic Schemas ----------

class RegisterReq(BaseModel):
    email: str
    password: str
    name: str = ""

class LoginReq(BaseModel):
    email: str
    password: str

class AuthRes(BaseModel):
    token: str
    user: dict

class ProjectCreate(BaseModel):
    title: str = "Untitled"
    drawio_xml: str = ""

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    drawio_xml: Optional[str] = None

class OutlineReq(BaseModel):
    user_input: str
    style: str = "technical"

class OutlineRes(BaseModel):
    title: str
    summary: str
    modules: list[dict]
    relationships: list[str]

class GenerateReq(BaseModel):
    outline: str
    style: str = "technical"

class GenerateRes(BaseModel):
    drawio_xml: str
    summary: str

class BeautifyReq(BaseModel):
    drawio_xml: str
    instruction: str = ""

# ---------- Auth Dependency ----------

async def get_current_user(
    authorization: str = Header(None),
    session: AsyncSession = Depends(get_session),
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_id = decode_token(authorization[7:])
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ---------- Auth Endpoints ----------

@app.post("/api/auth/register")
async def register(req: RegisterReq, session: AsyncSession = Depends(get_session)):
    existing = await session.execute(select(User).where(User.email == req.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=req.email,
        password_hash=hash_password(req.password),
        name=req.name or req.email.split("@")[0],
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)

    token = create_token(user.id)
    return AuthRes(
        token=token,
        user={"id": user.id, "email": user.email, "name": user.name, "plan": user.plan},
    )

@app.post("/api/auth/login")
async def login(req: LoginReq, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(User).where(User.email == req.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_token(user.id)
    return AuthRes(
        token=token,
        user={"id": user.id, "email": user.email, "name": user.name, "plan": user.plan},
    )

@app.get("/api/auth/me")
async def get_me(user: User = Depends(get_current_user)):
    return {"id": user.id, "email": user.email, "name": user.name, "plan": user.plan}

# ---------- Project Endpoints ----------

@app.get("/api/projects")
async def list_projects(user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Project).where(Project.user_id == user.id).order_by(Project.updated_at.desc())
    )
    projects = result.scalars().all()
    return [
        {
            "id": p.id,
            "title": p.title,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "updated_at": p.updated_at.isoformat() if p.updated_at else None,
        }
        for p in projects
    ]

@app.post("/api/projects")
async def create_project(
    req: ProjectCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    proj = Project(user_id=user.id, title=req.title, drawio_xml=req.drawio_xml)
    session.add(proj)
    await session.commit()
    await session.refresh(proj)
    return {"id": proj.id, "title": proj.title, "drawio_xml": proj.drawio_xml}

@app.get("/api/projects/{pid}")
async def get_project(
    pid: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(Project).where(Project.id == pid, Project.user_id == user.id)
    )
    proj = result.scalar_one_or_none()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"id": proj.id, "title": proj.title, "drawio_xml": proj.drawio_xml}

@app.put("/api/projects/{pid}")
async def update_project(
    pid: int,
    req: ProjectUpdate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(Project).where(Project.id == pid, Project.user_id == user.id)
    )
    proj = result.scalar_one_or_none()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    if req.title is not None:
        proj.title = req.title
    if req.drawio_xml is not None:
        proj.drawio_xml = req.drawio_xml
    await session.commit()
    return {"id": proj.id, "title": proj.title, "drawio_xml": proj.drawio_xml}

@app.delete("/api/projects/{pid}")
async def delete_project(
    pid: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(Project).where(Project.id == pid, Project.user_id == user.id)
    )
    proj = result.scalar_one_or_none()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    await session.delete(proj)
    await session.commit()
    return {"ok": True}

# ---------- AI Endpoints ----------

SAMPLE_XML = '''<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/>
<mxCell id="2" value="System Input" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1"><mxGeometry x="40" y="40" width="160" height="60" as="geometry"/></mxCell>
<mxCell id="3" value="Processing Module" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1"><mxGeometry x="280" y="40" width="160" height="60" as="geometry"/></mxCell>
<mxCell id="4" value="System Output" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1"><mxGeometry x="520" y="40" width="160" height="60" as="geometry"/></mxCell>
<mxCell id="5" value="" style="endArrow=classic;html=1;rounded=0;" edge="1" parent="1" source="2" target="3"><mxGeometry width="50" relative="1" as="geometry"><mxPoint x="200" y="70"/><mxPoint x="280" y="70"/></mxGeometry></mxCell>
<mxCell id="6" value="" style="endArrow=classic;html=1;rounded=0;" edge="1" parent="1" source="3" target="4"><mxGeometry width="50" relative="1" as="geometry"><mxPoint x="440" y="70"/><mxPoint x="520" y="70"/></mxGeometry></mxCell>
</root></mxGraphModel>'''

@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "0.2.0"}

@app.post("/api/ai/outline")
async def generate_outline(req: OutlineReq):
    modules = [
        {"name": "Data Source", "description": f"Input layer for: {req.user_input}"},
        {"name": "Core Logic", "description": "Main processing and business logic"},
        {"name": "Output Layer", "description": "Result presentation and export"},
    ]
    return OutlineRes(
        title=f"Architecture: {req.user_input[:30]}",
        summary=f"A {req.style} architecture diagram with 3 modules.",
        modules=modules,
        relationships=["Data Source → Core Logic", "Core Logic → Output Layer"],
    )

@app.post("/api/ai/generate-drawio")
async def generate_drawio(req: GenerateReq):
    return GenerateRes(drawio_xml=SAMPLE_XML, summary="3-module architecture diagram.")

@app.post("/api/ai/beautify")
async def beautify(req: BeautifyReq):
    return GenerateRes(drawio_xml=SAMPLE_XML, summary="Diagram beautified.")

# ---------- Run ----------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
