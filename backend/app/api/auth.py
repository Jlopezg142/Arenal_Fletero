from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth_schema import (
    LoginRequest,
    TokenResponse,
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
    datos: LoginRequest,
    db: Session = Depends(get_db)
):
    try:
        return autenticar_usuario(
            db=db,
            nombre_usuario=datos.usuario,
            password=datos.password
        )

    except ErrorAutenticacion as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(error),
            headers={
                "WWW-Authenticate": "Bearer"
            }
        ) from error