from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.usuario import Usuario


def buscar_por_usuario(
    db: Session,
    nombre_usuario: str
) -> Usuario | None:
    """Busca un usuario ignorando mayúsculas y minúsculas."""

    consulta = (
        select(Usuario)
        .where(
            func.lower(Usuario.usuario)
            == nombre_usuario.lower()
        )
    )

    return db.scalar(consulta)


def buscar_por_id(
    db: Session,
    usuario_id: int
) -> Usuario | None:
    """Busca un usuario por su identificador."""

    consulta = select(Usuario).where(
        Usuario.id == usuario_id
    )

    return db.scalar(consulta)


def crear_usuario(
    db: Session,
    usuario: Usuario
) -> Usuario:
    """Guarda un usuario nuevo."""

    db.add(usuario)
    db.commit()
    db.refresh(usuario)

    return usuario