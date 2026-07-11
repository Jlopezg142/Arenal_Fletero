from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from app.models.base import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)

    nombre = Column(String(100), nullable=False)

    usuario = Column(
        String(50),
        unique=True,
        nullable=False
    )

    password_hash = Column(
        String(255),
        nullable=False
    )

    rol = Column(
        String(20),
        nullable=False
    )

    activo = Column(
        Boolean,
        default=True
    )

    fecha_creacion = Column(
        DateTime,
        default=datetime.utcnow
    )