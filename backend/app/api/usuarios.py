from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.api.dependencies import (
    obtener_administrador,
)
from app.database import get_db
from app.models.usuario import Usuario
from app.schemas.usuario_schema import (
    UsuarioAdminResponse,
    UsuarioCrearRequest,
)
from app.services.usuario_service import (
    ErrorUsuario,
    crear_nuevo_usuario,
    obtener_fleteros_activos,
)


router = APIRouter(
    prefix="/admin/usuarios",
    tags=["Usuarios"],
)


@router.get(
    "/fleteros",
    response_model=list[UsuarioAdminResponse],
    status_code=status.HTTP_200_OK,
)
def consultar_fleteros_activos(
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(
        obtener_administrador
    ),
):
    return obtener_fleteros_activos(
        db=db
    )


@router.post(
    "",
    response_model=UsuarioAdminResponse,
    status_code=status.HTTP_201_CREATED,
)
def crear_usuario(
    datos: UsuarioCrearRequest,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(
        obtener_administrador
    ),
):
    try:
        return crear_nuevo_usuario(
            db=db,
            nombre=datos.nombre,
            nombre_usuario=datos.usuario,
            password=datos.password,
            rol=datos.rol,
        )

    except ErrorUsuario as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error