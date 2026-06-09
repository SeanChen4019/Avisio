from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from app.database import Base


class MaterialCategory(Base):
    __tablename__ = "material_categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    materials = relationship("Material", back_populates="category", cascade="all, delete-orphan")


class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("material_categories.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    cell_xml = Column(Text, nullable=False)  # the mxCell XML string
    preview_svg = Column(Text, nullable=True)  # SVG preview of the cell
    created_at = Column(DateTime, server_default=func.now())

    category = relationship("MaterialCategory", back_populates="materials")
