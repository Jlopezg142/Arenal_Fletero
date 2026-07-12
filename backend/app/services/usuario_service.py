from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.core.constants import Roles
from app.core.security import generar_hash_password
from app.database import SessionLocal
from app.models.usuario import Usuario
from app.repositories.usuario_repository import (
    buscar_por_usuario,
    crear_usuario,
)


def crear_administrador_inicial() -> None:
    """
    Crea el usuario administrador inicial si todavía no existe.
    """

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
            usuario=settings.ADMIN_INITIAL_USER,
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