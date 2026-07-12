from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.constants import Roles
from app.core.security import generar_hash_password
from app.database import SessionLocal
from app.models.usuario import Usuario
from app.repositories.usuario_repository import (
    buscar_por_usuario,
    crear_usuario,
)


class ErrorUsuario(Exception):
    """Error controlado del módulo de usuarios."""


def crear_administrador_inicial() -> None:
    db = SessionLocal()

    try:
        usuario_existente = buscar_por_usuario(
            db=db,
            nombre_usuario=settings.ADMIN_INITIAL_USER
        )

        if usuario_existente is not None:
            print(
                "Administrador inicial ya existe: "
                f"{settings.ADMIN_INITIAL_USER}"
            )
            return

        administrador = Usuario(
            nombre=settings.ADMIN_INITIAL_NAME,
            usuario=settings.ADMIN_INITIAL_USER.lower(),
            password_hash=generar_hash_password(
                settings.ADMIN_INITIAL_PASSWORD
            ),
            rol=Roles.ADMIN,
            activo=True
        )

        crear_usuario(
            db=db,
            usuario=administrador
        )

        print(
            "Administrador inicial creado correctamente: "
            f"{settings.ADMIN_INITIAL_USER}"
        )

    except SQLAlchemyError as error:
        db.rollback()
        print(
            "No fue posible crear el administrador inicial: "
            f"{error}"
        )
        raise

    finally:
        db.close()


def crear_nuevo_usuario(
    db: Session,
    nombre: str,
    nombre_usuario: str,
    password: str,
    rol: str
) -> Usuario:
    nombre_usuario = nombre_usuario.strip().lower()

    usuario_existente = buscar_por_usuario(
        db=db,
        nombre_usuario=nombre_usuario
    )

    if usuario_existente is not None:
        raise ErrorUsuario(
            "El nombre de usuario ya está registrado."
        )

    nuevo_usuario = Usuario(
        nombre=nombre.strip(),
        usuario=nombre_usuario,
        password_hash=generar_hash_password(password),
        rol=rol,
        activo=True
    )

    try:
        return crear_usuario(
            db=db,
            usuario=nuevo_usuario
        )

    except IntegrityError as error:
        db.rollback()

        raise ErrorUsuario(
            "El nombre de usuario ya está registrado."
        ) from error