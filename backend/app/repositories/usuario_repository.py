from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.constants import Roles
from app.models.usuario import Usuario


def buscar_por_usuario(
    db: Session,
    nombre_usuario: str,
) -> Usuario | None:
    consulta = (
        select(Usuario)
        .where(
            func.lower(Usuario.usuario)
            == nombre_usuario.lower()
        )
    )

    return db.scalar(consulta)


def buscar_por_usuario_excluyendo_id(
    db: Session,
    nombre_usuario: str,
    usuario_id: int,
) -> Usuario | None:
    consulta = (
        select(Usuario)
        .where(
            func.lower(Usuario.usuario)
            == nombre_usuario.lower(),
            Usuario.id != usuario_id,
        )
    )

    return db.scalar(consulta)


def buscar_por_id(
    db: Session,
    usuario_id: int,
) -> Usuario | None:
    consulta = select(Usuario).where(
        Usuario.id == usuario_id
    )

    return db.scalar(consulta)


def listar_usuarios(
    db: Session,
) -> list[Usuario]:
    consulta = (
        select(Usuario)
        .order_by(
            Usuario.nombre.asc(),
            Usuario.id.asc(),
        )
    )

    return list(
        db.scalars(consulta).all()
    )


def listar_fleteros_activos(
    db: Session,
) -> list[Usuario]:
    consulta = (
        select(Usuario)
        .where(
            Usuario.rol == Roles.FLETERO,
            Usuario.activo.is_(True),
        )
        .order_by(
            Usuario.nombre.asc()
        )
    )

    return list(
        db.scalars(consulta).all()
    )


def contar_administradores_activos(
    db: Session,
) -> int:
    consulta = (
        select(
            func.count(Usuario.id)
        )
        .where(
            Usuario.rol == Roles.ADMIN,
            Usuario.activo.is_(True),
        )
    )

    return int(
        db.scalar(consulta) or 0
    )


def crear_usuario(
    db: Session,
    usuario: Usuario,
) -> Usuario:
    db.add(usuario)
    db.commit()
    db.refresh(usuario)

    return usuario


def actualizar_usuario(
    db: Session,
    usuario: Usuario,
) -> Usuario:
    db.commit()
    db.refresh(usuario)

    return usuario