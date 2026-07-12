from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    usuario: str = Field(
        min_length=1,
        max_length=50
    )

    password: str = Field(
        min_length=1,
        max_length=128
    )


class UsuarioResponse(BaseModel):
    id: int
    nombre: str
    usuario: str
    rol: str

    model_config = {
        "from_attributes": True
    }


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    usuario: UsuarioResponse