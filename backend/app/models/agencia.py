from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from app.models.base import Base

class Agencia(Base):
    __tablename__ = "agencias"

    id = Column(Integer, primary_key=True, index=True)

    nombre = Column(
        String(100),
        nullable=False
    )

    activa = Column(
        Boolean,
        default=True
    )

    fecha_creacion = Column(
        DateTime,
        default=datetime.utcnow
    )