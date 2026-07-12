from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.entrega import Entrega


def buscar_por_envio(
    db: Session,
    envio: int
) -> Entrega | None:
    consulta = select(Entrega).where(
        Entrega.envio == envio
    )

    return db.scalar(consulta)


def buscar_por_id(
    db: Session,
    entrega_id: int
) -> Entrega | None:
    consulta = select(Entrega).where(
        Entrega.id == entrega_id
    )

    return db.scalar(consulta)


def crear_entrega(
    db: Session,
    entrega: Entrega
) -> Entrega:
    db.add(entrega)
    db.commit()
    db.refresh(entrega)

    return entrega