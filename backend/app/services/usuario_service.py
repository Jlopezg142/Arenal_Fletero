from sqlalchemy.exc import (
    IntegrityError,
    SQLAlchemyError,
)
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.constants import Roles
from app.core.security import generar_hash_password
from app.database import SessionLocal
from app.models.usuario import Usuario
from app.repositories.usuario_repository import (
    actualizar_usuario,
    buscar_por_id,
    buscar_por_usuario,
    buscar_por_usuario_excluyendo_id,
    contar_administradores_activos,
    crear_usuario,
    listar_fleteros_activos,
    listar_usuarios,
)


class ErrorUsuario(Exception):
    """Error controlado del modulo de usuarios."""


def crear_administrador_inicial() -> None:
    db = SessionLocal()

    try:
        usuario_existente = buscar_por_usuario(
            db=db,
            nombre_usuario=(
                settings.ADMIN_INITIAL_USER
            ),
        )

        if usuario_existente is not None:
            print(
                "Administrador inicial ya existe: "
                f"{settings.ADMIN_INITIAL_USER}"
            )
            return

        administrador = Usuario(
            nombre=settings.ADMIN_INITIAL_NAME,
            usuario=(
                settings.ADMIN_INITIAL_USER.lower()
            ),
            password_hash=generar_hash_password(
                settings.ADMIN_INITIAL_PASSWORD
            ),
            rol=Roles.ADMIN,
            activo=True,
        )

        crear_usuario(
            db=db,
            usuario=administrador,
        )

        print(
            "Administrador inicial creado "
            "correctamente: "
            f"{settings.ADMIN_INITIAL_USER}"
        )

    except SQLAlchemyError as error:
        db.rollback()

        print(
            "No fue posible crear el "
            "administrador inicial: "
            f"{error}"
        )

        raise

    finally:
        db.close()


def obtener_usuarios(
    db: Session,
) -> list[Usuario]:
    return listar_usuarios(
        db=db
    )


def obtener_fleteros_activos(
    db: Session,
) -> list[Usuario]:
    return listar_fleteros_activos(
        db=db
    )


def crear_nuevo_usuario(
    db: Session,
    nombre: str,
    nombre_usuario: str,
    password: str,
    rol: str,
) -> Usuario:
    nombre_usuario = (
        nombre_usuario.strip().lower()
    )

    usuario_existente = buscar_por_usuario(
        db=db,
        nombre_usuario=nombre_usuario,
    )

    if usuario_existente is not None:
        raise ErrorUsuario(
            "El nombre de usuario ya esta "
            "registrado."
        )

    nuevo_usuario = Usuario(
        nombre=" ".join(
            nombre.strip().split()
        ),
        usuario=nombre_usuario,
        password_hash=generar_hash_password(
            password
        ),
        rol=rol,
        activo=True,
    )

    try:
        return crear_usuario(
            db=db,
            usuario=nuevo_usuario,
        )

    except IntegrityError as error:
        db.rollback()

        raise ErrorUsuario(
            "El nombre de usuario ya esta "
            "registrado."
        ) from error


def modificar_usuario(
    db: Session,
    usuario_id: int,
    nombre: str,
    nombre_usuario: str,
    rol: str,
    administrador_id: int,
) -> Usuario:
    usuario = buscar_por_id(
        db=db,
        usuario_id=usuario_id,
    )

    if usuario is None:
        raise ErrorUsuario(
            "El usuario no existe."
        )

    if (
        usuario.id == administrador_id
        and rol != Roles.ADMIN
    ):
        raise ErrorUsuario(
            "No puedes cambiar tu propio rol "
            "de administrador."
        )

    nombre_usuario = (
        nombre_usuario.strip().lower()
    )

    usuario_existente = (
        buscar_por_usuario_excluyendo_id(
            db=db,
            nombre_usuario=nombre_usuario,
            usuario_id=usuario_id,
        )
    )

    if usuario_existente is not None:
        raise ErrorUsuario(
            "El nombre de usuario ya esta "
            "registrado."
        )

    usuario.nombre = " ".join(
        nombre.strip().split()
    )

    usuario.usuario = nombre_usuario
    usuario.rol = rol

    try:
        return actualizar_usuario(
            db=db,
            usuario=usuario,
        )

    except IntegrityError as error:
        db.rollback()

        raise ErrorUsuario(
            "El nombre de usuario ya esta "
            "registrado."
        ) from error


def cambiar_estado_usuario(
    db: Session,
    usuario_id: int,
    activo: bool,
    administrador_id: int,
) -> Usuario:
    usuario = buscar_por_id(
        db=db,
        usuario_id=usuario_id,
    )

    if usuario is None:
        raise ErrorUsuario(
            "El usuario no existe."
        )

    if (
        usuario.id == administrador_id
        and not activo
    ):
        raise ErrorUsuario(
            "No puedes desactivar tu propio usuario."
        )

    if (
        usuario.rol == Roles.ADMIN
        and usuario.activo
        and not activo
    ):
        total_administradores = (
            contar_administradores_activos(
                db=db
            )
        )

        if total_administradores <= 1:
            raise ErrorUsuario(
                "No se puede desactivar al ultimo "
                "administrador activo."
            )

    usuario.activo = activo

    return actualizar_usuario(
        db=db,
        usuario=usuario,
    )