from typing import Optional
from datetime import datetime
from pydantic import BaseModel, field_validator


class ProjectCreate(BaseModel):
    title: str = "Untitled"
    drawio_xml: str = ""

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        return v.strip()[:255] or "Untitled"


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    drawio_xml: Optional[str] = None


class ProjectSummary(BaseModel):
    id: int
    title: str
    created_at: datetime | None
    updated_at: datetime | None

    model_config = {"from_attributes": True}


class ProjectDetail(BaseModel):
    id: int
    title: str
    drawio_xml: str

    model_config = {"from_attributes": True}
