from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from pwdlib import PasswordHash

from app.core.config import settings


password_hash = PasswordHash.recommended()


def generar_hash_password(password: str) -> str:
    """Genera un hash seguro para una contraseña."""
    return password_hash.hash(password)


def verificar_password(
    password_plano: str,
    password_guardado: str
) -> bool:
    """Compara una contraseña con su hash almacenado."""
    return password_hash.verify(
        password_plano,
        password_guardado
    )


def crear_token_acceso(
    datos: dict[str, Any],
    minutos_expiracion: int | None = None
) -> str:
    """Genera un token JWT con fecha de expiración."""
    contenido = datos.copy()

    minutos = (
        minutos_expiracion
        if minutos_expiracion is not None
        else settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    expiracion = datetime.now(timezone.utc) + timedelta(
        minutes=minutos
    )

    contenido.update({"exp": expiracion})

    return jwt.encode(
        contenido,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )


def decodificar_token(token: str) -> dict[str, Any]:
    """Valida y decodifica un token JWT."""
    return jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=[settings.ALGORITHM]
    )