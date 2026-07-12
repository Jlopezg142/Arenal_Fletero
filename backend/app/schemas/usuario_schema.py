from pydantic import BaseModel, Field, field_validator

from app.core.constants import Roles


class UsuarioCrearRequest(BaseModel):
    nombre: str = Field(
        min_length=2,
        max_length=100
    )

    usuario: str = Field(
        min_length=3,
        max_length=50
    )

    password: str = Field(
        min_length=8,
        max_length=128
    )

    rol: str = Field(
        default=Roles.FLETERO
    )

    @field_validator("nombre", "usuario")
    @classmethod
    def limpiar_texto(cls, valor: str) -> str:
        return valor.strip()

    @field_validator("usuario")
    @classmethod
    def normalizar_usuario(cls, valor: str) -> str:
        return valor.strip().lower()

    @field_validator("rol")
    @classmethod
    def validar_rol(cls, valor: str) -> str:
        rol_normalizado = valor.strip().upper()

        if rol_normalizado not in {
            Roles.ADMIN,
            Roles.FLETERO
        }:
            raise ValueError(
                "El rol debe ser ADMIN o FLETERO."
            )

        return rol_normalizado


class UsuarioAdminResponse(BaseModel):
    id: int
    nombre: str
    usuario: str
    rol: str
    activo: bool

    model_config = {
        "from_attributes": True
    }