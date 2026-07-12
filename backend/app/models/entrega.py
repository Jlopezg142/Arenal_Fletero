from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
)

from app.models.base import Base


class Entrega(Base):
    __tablename__ = "entregas"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    usuario_id = Column(
        Integer,
        ForeignKey("usuarios.id"),
        nullable=False,
    )

    agencia_id = Column(
        Integer,
        ForeignKey("agencias.id"),
        nullable=False,
    )

    envio = Column(
        Integer,
        unique=True,
        nullable=False,
        index=True,
    )

    comentario = Column(
        Text,
        nullable=True,
    )

    foto_envio = Column(
        String(255),
        nullable=True,
    )

    foto_lugar = Column(
        String(255),
        nullable=True,
    )

    latitud = Column(
        Numeric(10, 8),
        nullable=True,
    )

    longitud = Column(
        Numeric(11, 8),
        nullable=True,
    )

    fecha_envio = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
    