from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.usuario import Usuario


def buscar_por_usuario(
    db: Session,
    nombre_usuario: str
) -> Usuario | None:
    """
    Busca un usuario por su nombre de acceso.
    Devuelve None cuando no existe.
    """
    consulta = select(Usuario).where(
        Usuario.usuario == nombre_usuario
    )

    return db.scalar(consulta)


def crear_usuario(
    db: Session,
    usuario: Usuario
) -> Usuario:
    """
    Guarda un nuevo usuario en PostgreSQL.
    """
    db.add(usuario)
    db.commit()
    db.refresh(usuario)

    return usuario