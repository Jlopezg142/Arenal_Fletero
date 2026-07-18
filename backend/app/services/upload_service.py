from datetime import datetime
from pathlib import Path
from uuid import uuid4

import boto3
from botocore.exceptions import (
    BotoCoreError,
    ClientError,
)
from fastapi import UploadFile
from starlette.concurrency import run_in_threadpool

from app.core.config import settings


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


def _usar_r2() -> bool:
    return (
        settings.STORAGE_TYPE
        .strip()
        .lower()
        == "r2"
    )


def _validar_configuracion_r2() -> None:
    variables_requeridas = {
        "R2_ACCOUNT_ID": settings.R2_ACCOUNT_ID,
        "R2_ACCESS_KEY_ID": settings.R2_ACCESS_KEY_ID,
        "R2_SECRET_ACCESS_KEY": (
            settings.R2_SECRET_ACCESS_KEY
        ),
        "R2_BUCKET_NAME": settings.R2_BUCKET_NAME,
        "R2_PUBLIC_URL": settings.R2_PUBLIC_URL,
    }

    variables_faltantes = [
        nombre
        for nombre, valor
        in variables_requeridas.items()
        if not valor.strip()
    ]

    if variables_faltantes:
        raise ErrorArchivoEntrega(
            "La configuración del almacenamiento "
            "R2 está incompleta: "
            + ", ".join(variables_faltantes)
            + "."
        )


def _crear_cliente_r2():
    _validar_configuracion_r2()

    endpoint_url = (
        "https://"
        f"{settings.R2_ACCOUNT_ID.strip()}"
        ".r2.cloudflarestorage.com"
    )

    return boto3.client(
        "s3",
        endpoint_url=endpoint_url,
        aws_access_key_id=(
            settings.R2_ACCESS_KEY_ID.strip()
        ),
        aws_secret_access_key=(
            settings.R2_SECRET_ACCESS_KEY.strip()
        ),
        region_name="auto",
    )


def _subir_foto_r2(
    contenido: bytes,
    clave_objeto: str,
    tipo_contenido: str,
) -> str:
    try:
        cliente = _crear_cliente_r2()

        cliente.put_object(
            Bucket=settings.R2_BUCKET_NAME.strip(),
            Key=clave_objeto,
            Body=contenido,
            ContentType=tipo_contenido,
        )

    except (
        BotoCoreError,
        ClientError,
    ) as error:
        raise ErrorArchivoEntrega(
            "No fue posible guardar la fotografía "
            "en el almacenamiento R2."
        ) from error

    url_publica = (
        settings.R2_PUBLIC_URL
        .strip()
        .rstrip("/")
    )

    return (
        f"{url_publica}/{clave_objeto}"
    )


def _guardar_foto_local(
    contenido: bytes,
    clave_objeto: str,
) -> str:
    ruta_archivo = (
        UPLOADS_DIR
        / Path(clave_objeto)
    )

    try:
        ruta_archivo.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        ruta_archivo.write_bytes(
            contenido
        )

    except OSError as error:
        raise ErrorArchivoEntrega(
            "No fue posible guardar "
            "la fotografía."
        ) from error

    return (
        "/uploads/"
        + clave_objeto
    )


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

    nombre_archivo = (
        f"{uuid4().hex}{extension}"
    )

    clave_objeto = (
        "entregas/"
        f"{fecha_actual.year}/"
        f"{fecha_actual.month:02d}/"
        f"{nombre_archivo}"
    )

    if _usar_r2():
        return await run_in_threadpool(
            _subir_foto_r2,
            contenido,
            clave_objeto,
            foto.content_type,
        )

    return await run_in_threadpool(
        _guardar_foto_local,
        contenido,
        clave_objeto,
    )


def _obtener_clave_desde_url_r2(
    foto_url: str,
) -> str | None:
    url_publica = (
        settings.R2_PUBLIC_URL
        .strip()
        .rstrip("/")
    )

    prefijo = f"{url_publica}/"

    if not foto_url.startswith(prefijo):
        return None

    clave_objeto = foto_url.removeprefix(
        prefijo
    )

    return clave_objeto or None


def _eliminar_foto_r2(
    foto_url: str,
) -> None:
    clave_objeto = (
        _obtener_clave_desde_url_r2(
            foto_url
        )
    )

    if not clave_objeto:
        return

    try:
        cliente = _crear_cliente_r2()

        cliente.delete_object(
            Bucket=settings.R2_BUCKET_NAME.strip(),
            Key=clave_objeto,
        )

    except (
        BotoCoreError,
        ClientError,
        ErrorArchivoEntrega,
    ):
        # Es una limpieza secundaria.
        # No debe ocultar el error principal.
        pass


def _eliminar_foto_local(
    foto_url: str,
) -> None:
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
        pass


def eliminar_foto_entrega(
    foto_url: str | None,
) -> None:
    if not foto_url:
        return

    if _usar_r2():
        _eliminar_foto_r2(
            foto_url
        )
        return

    _eliminar_foto_local(
        foto_url
    )