from datetime import date
from decimal import Decimal

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.api.dependencies import (
    obtener_fletero,
    obtener_fletero_o_administrador,
)
from app.database import get_db
from app.models.usuario import Usuario
from app.schemas.entrega_schema import (
    EntregaDetalleResponse,
    EntregaResponse,
    ValidacionEnvioResponse,
)
from app.services.entrega_service import (
    ErrorEntrega,
    consultar_entrega_por_id,
    consultar_entregas,
    registrar_entrega,
    verificar_disponibilidad_envio,
)


router = APIRouter(
    prefix="/entregas",
    tags=["Entregas"],
)


def obtener_codigo_error(
    mensaje: str,
) -> int:
    mensaje_minusculas = mensaje.lower()

    if "no existe" in mensaje_minusculas:
        return status.HTTP_404_NOT_FOUND

    if "permisos" in mensaje_minusculas:
        return status.HTTP_403_FORBIDDEN

    if "ya fue registrado" in mensaje_minusculas:
        return status.HTTP_409_CONFLICT

    if "no fue posible" in mensaje_minusculas:
        return status.HTTP_500_INTERNAL_SERVER_ERROR

    return status.HTTP_422_UNPROCESSABLE_ENTITY


@router.get(
    "/validar-envio/{envio}",
    response_model=ValidacionEnvioResponse,
    status_code=status.HTTP_200_OK,
)
def validar_envio(
    envio: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(
        obtener_fletero_o_administrador
    ),
):
    if envio <= 0:
        raise HTTPException(
            status_code=(
                status.HTTP_422_UNPROCESSABLE_ENTITY
            ),
            detail=(
                "El número de envío debe ser "
                "mayor que cero."
            ),
        )

    disponible = verificar_disponibilidad_envio(
        db=db,
        envio=envio,
    )

    mensaje = (
        "El número de envío está disponible."
        if disponible
        else (
            f"El número de envío {envio} "
            "ya fue registrado."
        )
    )

    return {
        "envio": envio,
        "disponible": disponible,
        "mensaje": mensaje,
    }


@router.get(
    "",
    response_model=list[EntregaDetalleResponse],
    status_code=status.HTTP_200_OK,
)
def listar_entregas(
    fecha_inicio: date | None = Query(
        default=None,
    ),
    fecha_fin: date | None = Query(
        default=None,
    ),
    agencia_id: int | None = Query(
        default=None,
        gt=0,
    ),
    usuario_id: int | None = Query(
        default=None,
        gt=0,
    ),
    envio: int | None = Query(
        default=None,
        gt=0,
    ),
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(
        obtener_fletero_o_administrador
    ),
):
    try:
        return consultar_entregas(
            db=db,
            usuario_actual=usuario_actual,
            fecha_inicio=fecha_inicio,
            fecha_fin=fecha_fin,
            agencia_id=agencia_id,
            usuario_id=usuario_id,
            envio=envio,
        )

    except ErrorEntrega as error:
        mensaje = str(error)

        raise HTTPException(
            status_code=obtener_codigo_error(
                mensaje
            ),
            detail=mensaje,
        ) from error


@router.get(
    "/{entrega_id}",
    response_model=EntregaDetalleResponse,
    status_code=status.HTTP_200_OK,
)
def obtener_entrega(
    entrega_id: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(
        obtener_fletero_o_administrador
    ),
):
    try:
        return consultar_entrega_por_id(
            db=db,
            usuario_actual=usuario_actual,
            entrega_id=entrega_id,
        )

    except ErrorEntrega as error:
        mensaje = str(error)

        raise HTTPException(
            status_code=obtener_codigo_error(
                mensaje
            ),
            detail=mensaje,
        ) from error


@router.post(
    "",
    response_model=EntregaResponse,
    status_code=status.HTTP_201_CREATED,
)
async def crear_entrega(
    agencia_id: int = Form(
        ...,
        gt=0,
    ),
    envio: int = Form(
        ...,
        gt=0,
    ),
    comentario: str | None = Form(
        default=None,
        max_length=1000,
    ),
    latitud: Decimal = Form(
        ...,
        ge=Decimal("-90"),
        le=Decimal("90"),
        description=(
            "Latitud actual del dispositivo. "
            "Debe estar entre -90 y 90."
        ),
    ),
    longitud: Decimal = Form(
        ...,
        ge=Decimal("-180"),
        le=Decimal("180"),
        description=(
            "Longitud actual del dispositivo. "
            "Debe estar entre -180 y 180."
        ),
    ),
    foto_envio: UploadFile = File(
        ...,
        description=(
            "Fotografía obligatoria del envío. "
            "Formatos permitidos: JPG, JPEG y PNG."
        ),
    ),
    foto_lugar: UploadFile = File(
        ...,
        description=(
            "Fotografía obligatoria del lugar "
            "de entrega. Formatos permitidos: "
            "JPG, JPEG y PNG."
        ),
    ),
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(
        obtener_fletero
    ),
):
    try:
        return await registrar_entrega(
            db=db,
            usuario_actual=usuario_actual,
            agencia_id=agencia_id,
            envio=envio,
            comentario=comentario,
            latitud=latitud,
            longitud=longitud,
            foto_envio=foto_envio,
            foto_lugar=foto_lugar,
        )

    except ErrorEntrega as error:
        mensaje = str(error)

        raise HTTPException(
            status_code=obtener_codigo_error(
                mensaje
            ),
            detail=mensaje,
        ) from error