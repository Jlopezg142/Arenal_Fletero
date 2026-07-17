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
    UsuarioActualizarRequest,
    UsuarioAdminResponse,
    UsuarioCrearRequest,
    UsuarioEstadoRequest,
    UsuarioPasswordRequest,
)
from app.services.usuario_service import (
    ErrorUsuario,
    cambiar_estado_usuario,
    crear_nuevo_usuario,
    modificar_usuario,
    obtener_fleteros_activos,
    obtener_usuarios,
    restablecer_password_usuario,
)


router = APIRouter(
    prefix="/admin/usuarios",
    tags=["Usuarios"],
)


@router.get(
    "",
    response_model=list[UsuarioAdminResponse],
    status_code=status.HTTP_200_OK,
)
def consultar_usuarios(
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(
        obtener_administrador
    ),
):
    return obtener_usuarios(
        db=db
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


@router.put(
    "/{usuario_id}",
    response_model=UsuarioAdminResponse,
    status_code=status.HTTP_200_OK,
)
def actualizar_usuario(
    usuario_id: int,
    datos: UsuarioActualizarRequest,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(
        obtener_administrador
    ),
):
    try:
        return modificar_usuario(
            db=db,
            usuario_id=usuario_id,
            nombre=datos.nombre,
            nombre_usuario=datos.usuario,
            rol=datos.rol,
            administrador_id=administrador.id,
        )

    except ErrorUsuario as error:
        mensaje = str(error)

        if "no existe" in mensaje.lower():
            codigo = status.HTTP_404_NOT_FOUND

        elif "propio rol" in mensaje.lower():
            codigo = status.HTTP_403_FORBIDDEN

        else:
            codigo = status.HTTP_409_CONFLICT

        raise HTTPException(
            status_code=codigo,
            detail=mensaje,
        ) from error


@router.patch(
    "/{usuario_id}/estado",
    response_model=UsuarioAdminResponse,
    status_code=status.HTTP_200_OK,
)
def actualizar_estado_usuario(
    usuario_id: int,
    datos: UsuarioEstadoRequest,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(
        obtener_administrador
    ),
):
    try:
        return cambiar_estado_usuario(
            db=db,
            usuario_id=usuario_id,
            activo=datos.activo,
            administrador_id=administrador.id,
        )

    except ErrorUsuario as error:
        mensaje = str(error)

        if "no existe" in mensaje.lower():
            codigo = status.HTTP_404_NOT_FOUND

        elif (
            "propio usuario" in mensaje.lower()
            or "ultimo administrador" in mensaje.lower()
        ):
            codigo = status.HTTP_403_FORBIDDEN

        else:
            codigo = status.HTTP_409_CONFLICT

        raise HTTPException(
            status_code=codigo,
            detail=mensaje,
        ) from error
    
@router.patch(
    "/{usuario_id}/password",
    response_model=UsuarioAdminResponse,
    status_code=status.HTTP_200_OK,
)
def restablecer_password(
    usuario_id: int,
    datos: UsuarioPasswordRequest,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(
        obtener_administrador
    ),
):
    try:
        return restablecer_password_usuario(
            db=db,
            usuario_id=usuario_id,
            password=datos.password,
        )

    except ErrorUsuario as error:
        mensaje = str(error)

        codigo = (
            status.HTTP_404_NOT_FOUND
            if "no existe" in mensaje.lower()
            else status.HTTP_409_CONFLICT
        )

        raise HTTPException(
            status_code=codigo,
            detail=mensaje,
        ) from error    