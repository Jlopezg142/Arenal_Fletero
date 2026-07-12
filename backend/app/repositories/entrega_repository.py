from datetime import date, datetime, time

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.agencia import Agencia
from app.models.entrega import Entrega
from app.models.usuario import Usuario


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


def listar_entregas_con_detalle(
    db: Session,
    usuario_actual_id: int,
    es_administrador: bool,
    fecha_inicio: date | None = None,
    fecha_fin: date | None = None,
    agencia_id: int | None = None,
    usuario_id: int | None = None,
    envio: int | None = None
) -> list[tuple[Entrega, Usuario, Agencia]]:
    consulta = (
        select(
            Entrega,
            Usuario,
            Agencia
        )
        .join(
            Usuario,
            Usuario.id == Entrega.usuario_id
        )
        .join(
            Agencia,
            Agencia.id == Entrega.agencia_id
        )
    )

    if not es_administrador:
        consulta = consulta.where(
            Entrega.usuario_id == usuario_actual_id
        )

    elif usuario_id is not None:
        consulta = consulta.where(
            Entrega.usuario_id == usuario_id
        )

    if fecha_inicio is not None:
        inicio = datetime.combine(
            fecha_inicio,
            time.min
        )

        consulta = consulta.where(
            Entrega.fecha_envio >= inicio
        )

    if fecha_fin is not None:
        fin = datetime.combine(
            fecha_fin,
            time.max
        )

        consulta = consulta.where(
            Entrega.fecha_envio <= fin
        )

    if agencia_id is not None:
        consulta = consulta.where(
            Entrega.agencia_id == agencia_id
        )

    if envio is not None:
        consulta = consulta.where(
            Entrega.envio == envio
        )

    consulta = consulta.order_by(
        Entrega.fecha_envio.desc()
    )

    resultados = db.execute(consulta).all()

    return [
        (
            fila.Entrega,
            fila.Usuario,
            fila.Agencia
        )
        for fila in resultados
    ]


def buscar_entrega_con_detalle(
    db: Session,
    entrega_id: int
) -> tuple[Entrega, Usuario, Agencia] | None:
    consulta = (
        select(
            Entrega,
            Usuario,
            Agencia
        )
        .join(
            Usuario,
            Usuario.id == Entrega.usuario_id
        )
        .join(
            Agencia,
            Agencia.id == Entrega.agencia_id
        )
        .where(
            Entrega.id == entrega_id
        )
    )

    resultado = db.execute(consulta).first()

    if resultado is None:
        return None

    return (
        resultado.Entrega,
        resultado.Usuario,
        resultado.Agencia
    )