from collections.abc import Callable

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.constants import Mensajes, Roles
from app.core.security import decodificar_token
from app.database import get_db
from app.models.usuario import Usuario
from app.repositories.usuario_repository import buscar_por_id


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)

def obtener_usuario_actual(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Usuario:
    """
    Valida el JWT y devuelve el usuario autenticado.
    """

    error_credenciales = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o vencido.",
        headers={
            "WWW-Authenticate": "Bearer"
        }
    )

    try:
        contenido = decodificar_token(token)

        usuario_id_texto = contenido.get("sub")

        if usuario_id_texto is None:
            raise error_credenciales

        usuario_id = int(usuario_id_texto)

    except (
        jwt.ExpiredSignatureError,
        jwt.InvalidTokenError,
        TypeError,
        ValueError
    ) as error:
        raise error_credenciales from error

    usuario = buscar_por_id(
        db=db,
        usuario_id=usuario_id
    )

    if usuario is None:
        raise error_credenciales

    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=Mensajes.USUARIO_INACTIVO
        )

    return usuario


def requerir_roles(
    *roles_permitidos: str
) -> Callable:
    """
    Crea una dependencia que limita una ruta por rol.
    """

    def validar_rol(
        usuario_actual: Usuario = Depends(
            obtener_usuario_actual
        )
    ) -> Usuario:
        if usuario_actual.rol not in roles_permitidos:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "No tiene permisos para realizar "
                    "esta operación."
                )
            )

        return usuario_actual

    return validar_rol


obtener_administrador = requerir_roles(
    Roles.ADMIN
)

obtener_fletero_o_administrador = requerir_roles(
    Roles.ADMIN,
    Roles.FLETERO
)