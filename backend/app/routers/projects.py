from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectSummary, ProjectDetail
from app.schemas.common import PaginatedResponse
from app.services import project_service

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("", response_model=PaginatedResponse[ProjectSummary])
async def list_projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    projects, total = await project_service.list_projects(session, user.id, page, page_size)
    items = [ProjectSummary.model_validate(p) for p in projects]
    return PaginatedResponse(items=items, total=total, page=page, page_size=page_size)


@router.post("", response_model=ProjectDetail, status_code=201)
async def create_project(
    req: ProjectCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    project = await project_service.create_project(session, user.id, req.title, req.drawio_xml)
    return ProjectDetail.model_validate(project)


@router.get("/{project_id}", response_model=ProjectDetail)
async def get_project(
    project_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    project = await project_service.get_project(session, project_id, user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectDetail.model_validate(project)


@router.put("/{project_id}", response_model=ProjectDetail)
async def update_project(
    project_id: int,
    req: ProjectUpdate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    project = await project_service.get_project(session, project_id, user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project = await project_service.update_project(session, project, req.title, req.drawio_xml)
    return ProjectDetail.model_validate(project)


@router.delete("/{project_id}")
async def delete_project(
    project_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    project = await project_service.get_project(session, project_id, user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    await project_service.soft_delete_project(session, project)
    return {"ok": True}
