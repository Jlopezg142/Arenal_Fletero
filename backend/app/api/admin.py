from datetime import date, datetime
from zoneinfo import ZoneInfo

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
from app.repositories.agencia_repository import (
    buscar_por_id as buscar_agencia_por_id,
)
from app.repositories.usuario_repository import (
    buscar_por_id as buscar_usuario_por_id,
)
from app.services.entrega_service import (
    ErrorEntrega,
    consultar_entregas,
)
from app.services.export_service import (
    generar_csv_entregas,
)
from app.services.pdf_service import generar_pdf_entregas


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


@router.get(
    "/exportar-entregas.pdf",
    status_code=status.HTTP_200_OK,
)
def exportar_entregas_pdf(
    fecha_inicio: date | None = Query(default=None),
    fecha_fin: date | None = Query(default=None),
    agencia_id: int | None = Query(default=None, gt=0),
    usuario_id: int | None = Query(default=None, gt=0),
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador),
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
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error

    if not entregas:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "No se encontraron entregas para "
                "los filtros seleccionados."
            ),
        )

    nombre_agencia = "Todas"
    if agencia_id is not None:
        agencia = buscar_agencia_por_id(
            db=db,
            agencia_id=agencia_id,
        )
        nombre_agencia = (
            agencia.nombre
            if agencia is not None
            else "No disponible"
        )

    nombre_fletero = "Todos"
    if usuario_id is not None:
        fletero = buscar_usuario_por_id(
            db=db,
            usuario_id=usuario_id,
        )
        nombre_fletero = (
            fletero.nombre
            if fletero is not None
            else "No disponible"
        )

    fecha_generacion = datetime.now(
        ZoneInfo("America/Guatemala")
    )
    contenido_pdf = generar_pdf_entregas(
        entregas=entregas,
        fecha_inicio=fecha_inicio,
        fecha_fin=fecha_fin,
        agencia=nombre_agencia,
        fletero=nombre_fletero,
        usuario_generador=administrador.usuario,
        fecha_impresion=fecha_generacion,
    )
    nombre_archivo = (
        "arenal_entregas_"
        f"{fecha_generacion.strftime('%Y%m%d_%H%M%S')}"
        ".pdf"
    )

    return Response(
        content=contenido_pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition": (
                f'attachment; filename="{nombre_archivo}"'
            ),
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
        },
    )
