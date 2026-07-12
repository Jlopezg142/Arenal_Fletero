from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile


# Carpeta backend/uploads
UPLOADS_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"

FOTO_ENVIO_DIR = UPLOADS_DIR / "foto_envio"
FOTO_LUGAR_DIR = UPLOADS_DIR / "foto_lugar"


def preparar_carpetas() -> None:
    """Crea las carpetas locales necesarias si todavía no existen."""
    FOTO_ENVIO_DIR.mkdir(parents=True, exist_ok=True)
    FOTO_LUGAR_DIR.mkdir(parents=True, exist_ok=True)


def generar_nombre_archivo(
    envio: int,
    tipo_foto: str,
    nombre_original: str | None
) -> str:
    """Genera un nombre único para evitar sobrescribir fotografías."""
    extension = ".jpg"

    if nombre_original:
        extension_original = Path(nombre_original).suffix.lower()

        if extension_original in {".jpg", ".jpeg", ".png", ".webp"}:
            extension = extension_original

    identificador = uuid4().hex

    return f"envio_{envio}_{tipo_foto}_{identificador}{extension}"


async def guardar_foto_local(
    archivo: UploadFile,
    envio: int,
    tipo_foto: str
) -> str:
    """
    Guarda una fotografía localmente y devuelve su ruta relativa.

    tipo_foto debe ser:
    - foto_envio
    - foto_lugar
    """
    preparar_carpetas()

    if tipo_foto == "foto_envio":
        carpeta_destino = FOTO_ENVIO_DIR
    elif tipo_foto == "foto_lugar":
        carpeta_destino = FOTO_LUGAR_DIR
    else:
        raise ValueError("Tipo de fotografía no válido.")

    nombre_archivo = generar_nombre_archivo(
        envio=envio,
        tipo_foto=tipo_foto,
        nombre_original=archivo.filename
    )

    ruta_destino = carpeta_destino / nombre_archivo

    contenido = await archivo.read()

    with ruta_destino.open("wb") as destino:
        destino.write(contenido)

    return f"/uploads/{tipo_foto}/{nombre_archivo}"