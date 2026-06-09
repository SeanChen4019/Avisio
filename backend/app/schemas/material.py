from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator


class CategoryCreate(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        return v.strip()[:100]


class CategoryOut(BaseModel):
    id: int
    name: str
    created_at: datetime | None

    model_config = {"from_attributes": True}


class MaterialCreate(BaseModel):
    category_id: int
    name: str
    cell_xml: str
    preview_svg: Optional[str] = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        return v.strip()[:255]


class MaterialOut(BaseModel):
    id: int
    category_id: int
    name: str
    cell_xml: str
    preview_svg: str | None
    created_at: datetime | None

    model_config = {"from_attributes": True}
