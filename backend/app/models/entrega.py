from sqlalchemy import (
    Column,
    Integer,
    Text,
    String,
    ForeignKey,
    DateTime,
    Numeric
)

from datetime import datetime
from app.models.base import Base

class Entrega(Base):
    __tablename__ = "entregas"

    id = Column(Integer, primary_key=True, index=True)

    usuario_id = Column(
        Integer,
        ForeignKey("usuarios.id"),
        nullable=False
    )

    agencia_id = Column(
        Integer,
        ForeignKey("agencias.id"),
        nullable=False
    )

    envio = Column(
        Integer,
        unique=True,
        nullable=False
    )

    comentario = Column(Text)

    foto_envio = Column(String(255))

    foto_lugar = Column(String(255))

    latitud = Column(
        Numeric(10, 8)
    )

    longitud = Column(
        Numeric(11, 8)
    )

    fecha_envio = Column(
        DateTime,
        default=datetime.utcnow
    )