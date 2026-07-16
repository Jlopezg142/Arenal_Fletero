from pydantic import BaseModel, Field, field_validator


class AgenciaCrearRequest(BaseModel):
    nombre: str = Field(
        min_length=2,
        max_length=50
    )

    @field_validator("nombre")
    @classmethod
    def limpiar_nombre(cls, valor: str) -> str:
        nombre_limpio = " ".join(valor.strip().split())

        if len(nombre_limpio) < 2:
            raise ValueError(
                "El nombre de la agencia debe tener "
                "al menos 2 caracteres."
            )

        return nombre_limpio


class AgenciaActualizarRequest(BaseModel):
    nombre: str = Field(
        min_length=2,
        max_length=50
    )

    @field_validator("nombre")
    @classmethod
    def limpiar_nombre(cls, valor: str) -> str:
        nombre_limpio = " ".join(valor.strip().split())

        if len(nombre_limpio) < 2:
            raise ValueError(
                "El nombre de la agencia debe tener "
                "al menos 2 caracteres."
            )

        return nombre_limpio


class AgenciaEstadoRequest(BaseModel):
    activa: bool


class AgenciaResponse(BaseModel):
    id: int
    nombre: str
    activa: bool

    model_config = {
        "from_attributes": True
    }