from fastapi import APIRouter, Depends

from app.api.dependencies import obtener_administrador
from app.models.usuario import Usuario


router = APIRouter(
    prefix="/admin",
    tags=["Administración"]
)


@router.get("/verificar-acceso")
def verificar_acceso_administrador(
    usuario_actual: Usuario = Depends(
        obtener_administrador
    )
):
    return {
        "mensaje": "Acceso de administrador autorizado.",
        "usuario": usuario_actual.usuario,
        "rol": usuario_actual.rol
    }