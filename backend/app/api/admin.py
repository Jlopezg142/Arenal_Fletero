from datetime import date, datetime

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    Request,
    status,
)
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.api.dependencies import (
    obtener_administrador,
)
from app.database import get_db
from app.models.usuario import Usuario
from app.services.entrega_service import (
    ErrorEntrega,
    consultar_entregas,
)
from app.services.export_service import (
    generar_csv_entregas,
)


router = APIRouter(
    prefix="/admin",
    tags=["Administración"],
)


@router.get(
    "/verificar-acceso",
    status_code=status.HTTP_200_OK,
)
def verificar_acceso_administrador(
    usuario_actual: Usuario = Depends(
        obtener_administrador
    ),
):
    return {
        "mensaje": (
            "Acceso de administrador autorizado."
        ),
        "usuario": usuario_actual.usuario,
        "rol": usuario_actual.rol,
    }


@router.get(
    "/exportar-entregas.csv",
    status_code=status.HTTP_200_OK,
)
def exportar_entregas_csv(
    request: Request,
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
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(
        obtener_administrador
    ),
):
    try:
        entregas = consultar_entregas(
            db=db,
            usuario_actual=administrador,
            fecha_inicio=fecha_inicio,
            fecha_fin=fecha_fin,
            agencia_id=agencia_id,
            usuario_id=usuario_id,
        )

    except ErrorEntrega as error:
        raise HTTPException(
            status_code=(
                status.HTTP_422_UNPROCESSABLE_ENTITY
            ),
            detail=str(error),
        ) from error

    base_url = str(
        request.base_url
    )

    contenido_csv = generar_csv_entregas(
        entregas=entregas,
        base_url=base_url,
    )

    fecha_archivo = datetime.now().strftime(
        "%Y%m%d_%H%M%S"
    )

    nombre_archivo = (
        "arenal_entregas_"
        f"{fecha_archivo}.csv"
    )

    contenido_con_bom = (
        "\ufeff"
        + contenido_csv
    )

    return Response(
        content=contenido_con_bom,
        media_type=(
            "text/csv; charset=utf-8"
        ),
        headers={
            "Content-Disposition": (
                f'attachment; filename="{nombre_archivo}"'
            ),
            "Cache-Control": "no-store",
        },
    )