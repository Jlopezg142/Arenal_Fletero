from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.agencia import Agencia


def buscar_por_id(
    db: Session,
    agencia_id: int
) -> Agencia | None:
    consulta = select(Agencia).where(
        Agencia.id == agencia_id
    )

    return db.scalar(consulta)


def buscar_por_nombre(
    db: Session,
    nombre: str
) -> Agencia | None:
    consulta = (
        select(Agencia)
        .where(
            func.lower(Agencia.nombre)
            == nombre.strip().lower()
        )
    )

    return db.scalar(consulta)


def listar_agencias(
    db: Session
) -> list[Agencia]:
    consulta = (
        select(Agencia)
        .order_by(
            Agencia.nombre.asc()
        )
    )

    return list(
        db.scalars(consulta).all()
    )


def crear_agencia(
    db: Session,
    agencia: Agencia
) -> Agencia:
    db.add(agencia)
    db.commit()
    db.refresh(agencia)

    return agencia


def actualizar_agencia(
    db: Session,
    agencia: Agencia
) -> Agencia:
    db.commit()
    db.refresh(agencia)

    return agencia