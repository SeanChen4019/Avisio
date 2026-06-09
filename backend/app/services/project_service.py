from datetime import datetime, timezone

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.project import Project
from app.models.user import User
from app.utils.logging import log


async def list_projects(
    session: AsyncSession,
    user_id: int,
    page: int = 1,
    page_size: int = 20,
) -> tuple[list[Project], int]:
    page = max(1, page)
    page_size = min(100, max(1, page_size))

    base = select(Project).where(Project.user_id == user_id, Project.deleted_at.is_(None))
    count_q = select(func.count()).select_from(Project).where(
        Project.user_id == user_id, Project.deleted_at.is_(None)
    )
    total = (await session.execute(count_q)).scalar() or 0

    projects = (
        await session.execute(
            base.order_by(Project.updated_at.desc()).offset((page - 1) * page_size).limit(page_size)
        )
    ).scalars().all()

    return list(projects), total


async def create_project(
    session: AsyncSession, user_id: int, title: str, drawio_xml: str
) -> Project:
    project = Project(user_id=user_id, title=title, drawio_xml=drawio_xml)
    session.add(project)
    await session.commit()
    await session.refresh(project)
    log.info("project_created", project_id=project.id, user_id=user_id)
    return project


async def get_project(
    session: AsyncSession, project_id: int, user_id: int
) -> Project | None:
    result = await session.execute(
        select(Project).where(
            Project.id == project_id,
            Project.user_id == user_id,
            Project.deleted_at.is_(None),
        )
    )
    return result.scalar_one_or_none()


async def update_project(
    session: AsyncSession, project: Project, title: str | None, drawio_xml: str | None
) -> Project:
    if title is not None:
        project.title = title.strip()[:255] or "Untitled"
    if drawio_xml is not None:
        project.drawio_xml = drawio_xml
    await session.commit()
    await session.refresh(project)
    log.info("project_updated", project_id=project.id)
    return project


async def soft_delete_project(session: AsyncSession, project: Project):
    project.deleted_at = datetime.now(timezone.utc)
    await session.commit()
    log.info("project_deleted", project_id=project.id)
