from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field, field_validator


class EntregaCrearRequest(BaseModel):
    agencia_id: int = Field(gt=0)
    envio: int = Field(gt=0)

    comentario: str | None = Field(
        default=None,
        max_length=1000,
    )

    @field_validator("comentario")
    @classmethod
    def limpiar_comentario(
        cls,
        valor: str | None,
    ) -> str | None:
        if valor is None:
            return None

        comentario_limpio = valor.strip()

        if not comentario_limpio:
            return None

        return comentario_limpio


class EntregaResponse(BaseModel):
    id: int
    usuario_id: int
    agencia_id: int
    envio: int
    comentario: str | None
    foto_envio: str | None
    foto_lugar: str | None
    latitud: Decimal | None
    longitud: Decimal | None
    fecha_envio: datetime

    model_config = {
        "from_attributes": True
    }


class ValidacionEnvioResponse(BaseModel):
    envio: int
    disponible: bool
    mensaje: str


class UsuarioEntregaResponse(BaseModel):
    id: int
    nombre: str
    usuario: str


class AgenciaEntregaResponse(BaseModel):
    id: int
    nombre: str


class EntregaDetalleResponse(BaseModel):
    id: int
    envio: int
    comentario: str | None
    foto_envio: str | None
    foto_lugar: str | None
    latitud: Decimal | None
    longitud: Decimal | None
    fecha_envio: datetime
    usuario: UsuarioEntregaResponse
    agencia: AgenciaEntregaResponse