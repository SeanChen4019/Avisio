from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.material import CategoryCreate, CategoryOut, MaterialCreate, MaterialOut
from app.services import material_service

router = APIRouter(prefix="/api/materials", tags=["materials"])


# ── Categories ──

@router.get("/categories", response_model=list[CategoryOut])
async def list_categories(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    cats = await material_service.get_categories(session, user.id)
    return [CategoryOut.model_validate(c) for c in cats]


@router.post("/categories", response_model=CategoryOut, status_code=201)
async def create_category(
    req: CategoryCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    cat = await material_service.create_category(session, user.id, req.name)
    return CategoryOut.model_validate(cat)


@router.delete("/categories/{cat_id}")
async def delete_category(
    cat_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    ok = await material_service.delete_category(session, cat_id, user.id)
    if not ok:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"ok": True}


# ── Materials ──

@router.get("/categories/{cat_id}/items", response_model=list[MaterialOut])
async def list_materials(
    cat_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    items = await material_service.get_materials(session, cat_id, user.id)
    return [MaterialOut.model_validate(m) for m in items]


@router.post("/items", response_model=MaterialOut, status_code=201)
async def create_material(
    req: MaterialCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    try:
        mat = await material_service.create_material(
            session, user.id, req.category_id, req.name, req.cell_xml, req.preview_svg
        )
        return MaterialOut.model_validate(mat)
    except ValueError:
        raise HTTPException(status_code=404, detail="Category not found")


@router.delete("/items/{mat_id}")
async def delete_material(
    mat_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    ok = await material_service.delete_material(session, mat_id, user.id)
    if not ok:
        raise HTTPException(status_code=404, detail="Material not found")
    return {"ok": True}
