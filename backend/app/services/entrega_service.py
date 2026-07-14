from datetime import date
from decimal import Decimal

from fastapi import UploadFile
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.constants import Roles
from app.models.entrega import Entrega
from app.models.usuario import Usuario
from app.repositories.agencia_repository import (
    buscar_por_id as buscar_agencia_por_id,
)
from app.repositories.entrega_repository import (
    buscar_entrega_con_detalle,
    buscar_por_envio,
    crear_entrega,
    listar_entregas_con_detalle,
)
from app.services.upload_service import (
    ErrorArchivoEntrega,
    eliminar_foto_entrega,
    guardar_foto_entrega,
)


class ErrorEntrega(Exception):
    """Error controlado del módulo de entregas."""


def verificar_disponibilidad_envio(
    db: Session,
    envio: int,
) -> bool:
    entrega_existente = buscar_por_envio(
        db=db,
        envio=envio,
    )

    return entrega_existente is None


def limpiar_comentario(
    comentario: str | None,
) -> str | None:
    if comentario is None:
        return None

    comentario_limpio = comentario.strip()

    if not comentario_limpio:
        return None

    if len(comentario_limpio) > 1000:
        raise ErrorEntrega(
            "El comentario no puede superar "
            "los 1000 caracteres."
        )

    return comentario_limpio


def validar_coordenadas(
    latitud: Decimal,
    longitud: Decimal,
) -> None:
    if latitud < Decimal("-90") or latitud > Decimal("90"):
        raise ErrorEntrega(
            "La latitud debe estar entre -90 y 90."
        )

    if (
        longitud < Decimal("-180")
        or longitud > Decimal("180")
    ):
        raise ErrorEntrega(
            "La longitud debe estar entre "
            "-180 y 180."
        )


async def registrar_entrega(
    db: Session,
    usuario_actual: Usuario,
    agencia_id: int,
    envio: int,
    comentario: str | None,
    latitud: Decimal,
    longitud: Decimal,
    foto_envio: UploadFile,
) -> Entrega:
    agencia = buscar_agencia_por_id(
        db=db,
        agencia_id=agencia_id,
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
        envio=envio,
    )

    if envio_existente is not None:
        raise ErrorEntrega(
            f"El número de envío {envio} "
            "ya fue registrado."
        )

    comentario_limpio = limpiar_comentario(
        comentario
    )

    validar_coordenadas(
        latitud=latitud,
        longitud=longitud,
    )

    ruta_foto_envio: str | None = None

    try:
        ruta_foto_envio = (
            await guardar_foto_entrega(
                foto=foto_envio,
            )
        )

    except ErrorArchivoEntrega as error:
        raise ErrorEntrega(
            str(error)
        ) from error

    nueva_entrega = Entrega(
        usuario_id=usuario_actual.id,
        agencia_id=agencia_id,
        envio=envio,
        comentario=comentario_limpio,
        foto_envio=ruta_foto_envio,
        foto_lugar=None,
        latitud=latitud,
        longitud=longitud,
    )

    try:
        return crear_entrega(
            db=db,
            entrega=nueva_entrega,
        )

    except IntegrityError as error:
        db.rollback()

        eliminar_foto_entrega(
            ruta_foto_envio
        )

        raise ErrorEntrega(
            f"El número de envío {envio} "
            "ya fue registrado."
        ) from error

    except Exception as error:
        db.rollback()

        eliminar_foto_entrega(
            ruta_foto_envio
        )

        raise ErrorEntrega(
            "No fue posible registrar "
            "la entrega."
        ) from error


def convertir_entrega_detalle(
    entrega: Entrega,
    usuario: Usuario,
    agencia,
) -> dict:
    return {
        "id": entrega.id,
        "envio": entrega.envio,
        "comentario": entrega.comentario,
        "foto_envio": entrega.foto_envio,
        "foto_lugar": entrega.foto_lugar,
        "latitud": entrega.latitud,
        "longitud": entrega.longitud,
        "fecha_envio": entrega.fecha_envio,
        "usuario": {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "usuario": usuario.usuario,
        },
        "agencia": {
            "id": agencia.id,
            "nombre": agencia.nombre,
        },
    }


def consultar_entregas(
    db: Session,
    usuario_actual: Usuario,
    fecha_inicio: date | None = None,
    fecha_fin: date | None = None,
    agencia_id: int | None = None,
    usuario_id: int | None = None,
    envio: int | None = None,
) -> list[dict]:
    if (
        fecha_inicio is not None
        and fecha_fin is not None
        and fecha_fin < fecha_inicio
    ):
        raise ErrorEntrega(
            "La fecha final no puede ser menor "
            "que la fecha inicial."
        )

    es_administrador = (
        usuario_actual.rol == Roles.ADMIN
    )

    if (
        not es_administrador
        and usuario_id is not None
        and usuario_id != usuario_actual.id
    ):
        raise ErrorEntrega(
            "No tiene permisos para consultar "
            "entregas de otro usuario."
        )

    resultados = listar_entregas_con_detalle(
        db=db,
        usuario_actual_id=usuario_actual.id,
        es_administrador=es_administrador,
        fecha_inicio=fecha_inicio,
        fecha_fin=fecha_fin,
        agencia_id=agencia_id,
        usuario_id=usuario_id,
        envio=envio,
    )

    return [
        convertir_entrega_detalle(
            entrega=entrega,
            usuario=usuario,
            agencia=agencia,
        )
        for entrega, usuario, agencia in resultados
    ]


def consultar_entrega_por_id(
    db: Session,
    usuario_actual: Usuario,
    entrega_id: int,
) -> dict:
    resultado = buscar_entrega_con_detalle(
        db=db,
        entrega_id=entrega_id,
    )

    if resultado is None:
        raise ErrorEntrega(
            "La entrega solicitada no existe."
        )

    entrega, usuario, agencia = resultado

    es_administrador = (
        usuario_actual.rol == Roles.ADMIN
    )

    es_propietario = (
        entrega.usuario_id == usuario_actual.id
    )

    if (
        not es_administrador
        and not es_propietario
    ):
        raise ErrorEntrega(
            "No tiene permisos para consultar "
            "esta entrega."
        )

    return convertir_entrega_detalle(
        entrega=entrega,
        usuario=usuario,
        agencia=agencia,
    )