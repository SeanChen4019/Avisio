from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.dependencies import get_admin
from app.models.user import User
from app.models.project import Project
from app.schemas.auth import UserOut

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/users")
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    admin: User = Depends(get_admin),
    session: AsyncSession = Depends(get_session),
):
    count_q = select(func.count()).select_from(User)
    total = (await session.execute(count_q)).scalar() or 0

    users = (
        await session.execute(
            select(User)
            .order_by(User.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
    ).scalars().all()

    return {
        "items": [UserOut.model_validate(u) for u in users],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/stats")
async def get_stats(
    admin: User = Depends(get_admin),
    session: AsyncSession = Depends(get_session),
):
    total_users = (await session.execute(select(func.count()).select_from(User))).scalar() or 0
    total_projects = (await session.execute(select(func.count()).select_from(Project))).scalar() or 0
    active_projects = (
        await session.execute(
            select(func.count()).select_from(Project).where(Project.deleted_at.is_(None))
        )
    ).scalar() or 0

    return {
        "total_users": total_users,
        "total_projects": total_projects,
        "active_projects": active_projects,
    }
