from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.dependencies import obtener_usuario_actual
from app.database import get_db
from app.models.usuario import Usuario
from app.schemas.auth_schema import (
    TokenResponse,
    UsuarioResponse,
)
from app.services.auth_service import (
    ErrorAutenticacion,
    autenticar_usuario,
)


router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"]
)


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK
)
def login(
    formulario: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Inicia sesión mediante el formulario OAuth2 estándar.

    Swagger enviará:
    - username
    - password
    """

    try:
        return autenticar_usuario(
            db=db,
            nombre_usuario=formulario.username,
            password=formulario.password
        )

    except ErrorAutenticacion as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(error),
            headers={
                "WWW-Authenticate": "Bearer"
            }
        ) from error


@router.get(
    "/me",
    response_model=UsuarioResponse,
    status_code=status.HTTP_200_OK
)
def consultar_usuario_actual(
    usuario_actual: Usuario = Depends(
        obtener_usuario_actual
    )
):
    return usuario_actual