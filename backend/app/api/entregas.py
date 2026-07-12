from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.api.dependencies import (
    obtener_fletero_o_administrador,
)
from app.database import get_db
from app.models.usuario import Usuario
from app.schemas.entrega_schema import (
    EntregaCrearRequest,
    EntregaResponse,
    ValidacionEnvioResponse,
)
from app.services.entrega_service import (
    ErrorEntrega,
    registrar_entrega,
    verificar_disponibilidad_envio,
)


router = APIRouter(
    prefix="/entregas",
    tags=["Entregas"]
)


@router.get(
    "/validar-envio/{envio}",
    response_model=ValidacionEnvioResponse,
    status_code=status.HTTP_200_OK
)
def validar_envio(
    envio: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(
        obtener_fletero_o_administrador
    )
):
    if envio <= 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="El número de envío debe ser mayor que cero."
        )

    disponible = verificar_disponibilidad_envio(
        db=db,
        envio=envio
    )

    mensaje = (
        "El número de envío está disponible."
        if disponible
        else f"El número de envío {envio} ya fue registrado."
    )

    return {
        "envio": envio,
        "disponible": disponible,
        "mensaje": mensaje
    }


@router.post(
    "",
    response_model=EntregaResponse,
    status_code=status.HTTP_201_CREATED
)
def crear_entrega(
    datos: EntregaCrearRequest,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(
        obtener_fletero_o_administrador
    )
):
    try:
        return registrar_entrega(
            db=db,
            usuario_actual=usuario_actual,
            agencia_id=datos.agencia_id,
            envio=datos.envio,
            comentario=datos.comentario
        )

    except ErrorEntrega as error:
        mensaje = str(error)

        if "no existe" in mensaje.lower():
            codigo = status.HTTP_404_NOT_FOUND
        elif "inactiva" in mensaje.lower():
            codigo = status.HTTP_409_CONFLICT
        else:
            codigo = status.HTTP_409_CONFLICT

        raise HTTPException(
            status_code=codigo,
            detail=mensaje
        ) from error