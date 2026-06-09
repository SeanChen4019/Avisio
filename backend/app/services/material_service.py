from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.material import MaterialCategory, Material
from app.utils.logging import log


# ── Categories ──

async def get_categories(session: AsyncSession, user_id: int) -> list[MaterialCategory]:
    result = await session.execute(
        select(MaterialCategory)
        .where(MaterialCategory.user_id == user_id)
        .order_by(MaterialCategory.created_at)
    )
    return list(result.scalars().all())


async def create_category(session: AsyncSession, user_id: int, name: str) -> MaterialCategory:
    cat = MaterialCategory(user_id=user_id, name=name)
    session.add(cat)
    await session.commit()
    await session.refresh(cat)
    log.info("material_category_created", id=cat.id, user_id=user_id, name=name)
    return cat


async def delete_category(session: AsyncSession, cat_id: int, user_id: int) -> bool:
    result = await session.execute(
        select(MaterialCategory).where(
            MaterialCategory.id == cat_id,
            MaterialCategory.user_id == user_id,
        )
    )
    cat = result.scalar_one_or_none()
    if not cat:
        return False
    await session.delete(cat)
    await session.commit()
    return True


# ── Materials ──

async def get_materials(session: AsyncSession, category_id: int, user_id: int) -> list[Material]:
    result = await session.execute(
        select(Material)
        .where(Material.category_id == category_id, Material.user_id == user_id)
        .order_by(Material.created_at.desc())
    )
    return list(result.scalars().all())


async def create_material(
    session: AsyncSession,
    user_id: int,
    category_id: int,
    name: str,
    cell_xml: str,
    preview_svg: str | None = None,
) -> Material:
    # Verify category belongs to user
    cat_result = await session.execute(
        select(MaterialCategory).where(
            MaterialCategory.id == category_id,
            MaterialCategory.user_id == user_id,
        )
    )
    if not cat_result.scalar_one_or_none():
        raise ValueError("Category not found")

    mat = Material(
        user_id=user_id,
        category_id=category_id,
        name=name,
        cell_xml=cell_xml,
        preview_svg=preview_svg,
    )
    session.add(mat)
    await session.commit()
    await session.refresh(mat)
    log.info("material_saved", id=mat.id, user_id=user_id, category_id=category_id)
    return mat


async def delete_material(session: AsyncSession, mat_id: int, user_id: int) -> bool:
    result = await session.execute(
        select(Material).where(Material.id == mat_id, Material.user_id == user_id)
    )
    mat = result.scalar_one_or_none()
    if not mat:
        return False
    await session.delete(mat)
    await session.commit()
    return True
