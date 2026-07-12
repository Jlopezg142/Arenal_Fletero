from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.entrega import Entrega
from app.models.usuario import Usuario
from app.repositories.agencia_repository import (
    buscar_por_id as buscar_agencia_por_id,
)
from app.repositories.entrega_repository import (
    buscar_por_envio,
    crear_entrega,
)


class ErrorEntrega(Exception):
    """Error controlado del módulo de entregas."""


def verificar_disponibilidad_envio(
    db: Session,
    envio: int
) -> bool:
    entrega_existente = buscar_por_envio(
        db=db,
        envio=envio
    )

    return entrega_existente is None


def registrar_entrega(
    db: Session,
    usuario_actual: Usuario,
    agencia_id: int,
    envio: int,
    comentario: str | None
) -> Entrega:
    agencia = buscar_agencia_por_id(
        db=db,
        agencia_id=agencia_id
    )

    if agencia is None:
        raise ErrorEntrega(
            "La agencia seleccionada no existe."
        )

    if not agencia.activa:
        raise ErrorEntrega(
            "La agencia seleccionada está inactiva."
        )

    envio_existente = buscar_por_envio(
        db=db,
        envio=envio
    )

    if envio_existente is not None:
        raise ErrorEntrega(
            f"El número de envío {envio} ya fue registrado."
        )

    nueva_entrega = Entrega(
        usuario_id=usuario_actual.id,
        agencia_id=agencia_id,
        envio=envio,
        comentario=comentario,
        foto_envio=None,
        foto_lugar=None,
        latitud=None,
        longitud=None
    )

    try:
        return crear_entrega(
            db=db,
            entrega=nueva_entrega
        )

    except IntegrityError as error:
        db.rollback()

        raise ErrorEntrega(
            f"El número de envío {envio} ya fue registrado."
        ) from error