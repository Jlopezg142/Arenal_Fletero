from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.agencia import Agencia
from app.repositories.agencia_repository import (
    actualizar_agencia,
    buscar_por_id,
    buscar_por_nombre,
    crear_agencia,
    listar_agencias,
)


class ErrorAgencia(Exception):
    """Error controlado del módulo de agencias."""


def obtener_agencias(
    db: Session
) -> list[Agencia]:
    return listar_agencias(db)


def obtener_agencia_por_id(
    db: Session,
    agencia_id: int
) -> Agencia:
    agencia = buscar_por_id(
        db=db,
        agencia_id=agencia_id
    )

    if agencia is None:
        raise ErrorAgencia(
            "La agencia solicitada no existe."
        )

    return agencia


def crear_nueva_agencia(
    db: Session,
    nombre: str
) -> Agencia:
    nombre_limpio = " ".join(
        nombre.strip().split()
    )

    agencia_existente = buscar_por_nombre(
        db=db,
        nombre=nombre_limpio
    )

    if agencia_existente is not None:
        raise ErrorAgencia(
            "Ya existe una agencia con ese nombre."
        )

    nueva_agencia = Agencia(
        nombre=nombre_limpio,
        activa=True
    )

    try:
        return crear_agencia(
            db=db,
            agencia=nueva_agencia
        )

    except IntegrityError as error:
        db.rollback()

        raise ErrorAgencia(
            "Ya existe una agencia con ese nombre."
        ) from error


def modificar_agencia(
    db: Session,
    agencia_id: int,
    nombre: str
) -> Agencia:
    agencia = obtener_agencia_por_id(
        db=db,
        agencia_id=agencia_id
    )

    nombre_limpio = " ".join(
        nombre.strip().split()
    )

    agencia_con_mismo_nombre = buscar_por_nombre(
        db=db,
        nombre=nombre_limpio
    )

    if (
        agencia_con_mismo_nombre is not None
        and agencia_con_mismo_nombre.id != agencia.id
    ):
        raise ErrorAgencia(
            "Ya existe una agencia con ese nombre."
        )

    agencia.nombre = nombre_limpio

    try:
        return actualizar_agencia(
            db=db,
            agencia=agencia
        )

    except IntegrityError as error:
        db.rollback()

        raise ErrorAgencia(
            "Ya existe una agencia con ese nombre."
        ) from error


def cambiar_estado_agencia(
    db: Session,
    agencia_id: int,
    activa: bool
) -> Agencia:
    agencia = obtener_agencia_por_id(
        db=db,
        agencia_id=agencia_id
    )

    agencia.activa = activa

    return actualizar_agencia(
        db=db,
        agencia=agencia
    )