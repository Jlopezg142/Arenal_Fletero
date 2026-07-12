from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.api.dependencies import obtener_administrador
from app.database import get_db
from app.models.usuario import Usuario
from app.schemas.agencia_schema import (
    AgenciaActualizarRequest,
    AgenciaCrearRequest,
    AgenciaEstadoRequest,
    AgenciaResponse,
)
from app.services.agencia_service import (
    ErrorAgencia,
    cambiar_estado_agencia,
    crear_nueva_agencia,
    modificar_agencia,
    obtener_agencia_por_id,
    obtener_agencias,
)


router = APIRouter(
    prefix="/admin/agencias",
    tags=["Agencias"]
)


@router.post(
    "",
    response_model=AgenciaResponse,
    status_code=status.HTTP_201_CREATED
)
def crear_agencia(
    datos: AgenciaCrearRequest,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(
        obtener_administrador
    )
):
    try:
        return crear_nueva_agencia(
            db=db,
            nombre=datos.nombre
        )

    except ErrorAgencia as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error)
        ) from error


@router.get(
    "",
    response_model=list[AgenciaResponse],
    status_code=status.HTTP_200_OK
)
def consultar_agencias(
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(
        obtener_administrador
    )
):
    return obtener_agencias(db)


@router.get(
    "/{agencia_id}",
    response_model=AgenciaResponse,
    status_code=status.HTTP_200_OK
)
def consultar_agencia(
    agencia_id: int,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(
        obtener_administrador
    )
):
    try:
        return obtener_agencia_por_id(
            db=db,
            agencia_id=agencia_id
        )

    except ErrorAgencia as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        ) from error


@router.put(
    "/{agencia_id}",
    response_model=AgenciaResponse,
    status_code=status.HTTP_200_OK
)
def actualizar_agencia(
    agencia_id: int,
    datos: AgenciaActualizarRequest,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(
        obtener_administrador
    )
):
    try:
        return modificar_agencia(
            db=db,
            agencia_id=agencia_id,
            nombre=datos.nombre
        )

    except ErrorAgencia as error:
        mensaje = str(error)

        codigo = (
            status.HTTP_404_NOT_FOUND
            if "no existe" in mensaje.lower()
            else status.HTTP_409_CONFLICT
        )

        raise HTTPException(
            status_code=codigo,
            detail=mensaje
        ) from error


@router.patch(
    "/{agencia_id}/estado",
    response_model=AgenciaResponse,
    status_code=status.HTTP_200_OK
)
def actualizar_estado_agencia(
    agencia_id: int,
    datos: AgenciaEstadoRequest,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(
        obtener_administrador
    )
):
    try:
        return cambiar_estado_agencia(
            db=db,
            agencia_id=agencia_id,
            activa=datos.activa
        )

    except ErrorAgencia as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        ) from error