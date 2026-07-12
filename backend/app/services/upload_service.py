from datetime import datetime
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile


class ErrorArchivoEntrega(Exception):
    """Error controlado al procesar una fotografía."""


EXTENSIONES_PERMITIDAS = {
    ".jpg",
    ".jpeg",
    ".png",
}

TIPOS_PERMITIDOS = {
    "image/jpeg",
    "image/png",
}

TAMANO_MAXIMO = 5 * 1024 * 1024

APP_DIR = Path(__file__).resolve().parent.parent
UPLOADS_DIR = APP_DIR / "uploads"
ENTREGAS_DIR = UPLOADS_DIR / "entregas"


async def guardar_foto_entrega(
    foto: UploadFile,
) -> str:
    nombre_original = foto.filename or ""

    extension = Path(
        nombre_original
    ).suffix.lower()

    if extension not in EXTENSIONES_PERMITIDAS:
        raise ErrorArchivoEntrega(
            "Solo se permiten fotografías "
            "JPG, JPEG o PNG."
        )

    if foto.content_type not in TIPOS_PERMITIDOS:
        raise ErrorArchivoEntrega(
            "El archivo seleccionado no es "
            "una imagen válida."
        )

    try:
        contenido = await foto.read()

    finally:
        await foto.close()

    if not contenido:
        raise ErrorArchivoEntrega(
            "La fotografía está vacía."
        )

    if len(contenido) > TAMANO_MAXIMO:
        raise ErrorArchivoEntrega(
            "La fotografía no puede superar "
            "los 5 MB."
        )

    fecha_actual = datetime.now()

    carpeta_destino = (
        ENTREGAS_DIR
        / str(fecha_actual.year)
        / f"{fecha_actual.month:02d}"
    )

    carpeta_destino.mkdir(
        parents=True,
        exist_ok=True,
    )

    nombre_archivo = (
        f"{uuid4().hex}{extension}"
    )

    ruta_archivo = (
        carpeta_destino
        / nombre_archivo
    )

    try:
        ruta_archivo.write_bytes(
            contenido
        )

    except OSError as error:
        raise ErrorArchivoEntrega(
            "No fue posible guardar "
            "la fotografía."
        ) from error

    ruta_relativa = (
        Path("entregas")
        / str(fecha_actual.year)
        / f"{fecha_actual.month:02d}"
        / nombre_archivo
    )

    return (
        "/uploads/"
        + ruta_relativa.as_posix()
    )


def eliminar_foto_entrega(
    foto_url: str | None,
) -> None:
    if not foto_url:
        return

    prefijo = "/uploads/"

    if not foto_url.startswith(prefijo):
        return

    ruta_relativa = foto_url.removeprefix(
        prefijo
    )

    ruta_archivo = (
        UPLOADS_DIR
        / ruta_relativa
    )

    try:
        if ruta_archivo.exists():
            ruta_archivo.unlink()

    except OSError:
        # La eliminación es un procedimiento
        # de limpieza. No debe ocultar el error
        # principal del registro.
        pass