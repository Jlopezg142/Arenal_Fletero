from sqlalchemy.orm import Session

from app.core.constants import Mensajes
from app.core.security import (
    crear_token_acceso,
    verificar_password,
)
from app.repositories.usuario_repository import buscar_por_usuario


class ErrorAutenticacion(Exception):
    """Error controlado durante el inicio de sesión."""


def autenticar_usuario(
    db: Session,
    nombre_usuario: str,
    password: str
) -> dict:
    """
    Valida las credenciales y genera un token JWT.
    """

    nombre_usuario = nombre_usuario.strip()

    usuario = buscar_por_usuario(
        db=db,
        nombre_usuario=nombre_usuario
    )

    if usuario is None:
        raise ErrorAutenticacion(
            Mensajes.LOGIN_INCORRECTO
        )

    if not usuario.activo:
        raise ErrorAutenticacion(
            Mensajes.USUARIO_INACTIVO
        )

    password_correcto = verificar_password(
        password_plano=password,
        password_guardado=usuario.password_hash
    )

    if not password_correcto:
        raise ErrorAutenticacion(
            Mensajes.LOGIN_INCORRECTO
        )

    token = crear_token_acceso(
        datos={
            "sub": str(usuario.id),
            "usuario": usuario.usuario,
            "rol": usuario.rol
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "usuario": usuario.usuario,
            "rol": usuario.rol
        }
    }