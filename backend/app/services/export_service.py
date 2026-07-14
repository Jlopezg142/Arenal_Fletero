import csv
from io import StringIO
from typing import Any


ENCABEZADOS_CSV = [
    "Fecha y hora",
    "Numero de envio",
    "Agencia",
    "Fletero",
    "Usuario",
    "Comentario",
    "Latitud",
    "Longitud",
    "Fotografia del envio",
    "Fotografia del lugar",
]


def obtener_valor_anidado(
    datos: dict[str, Any],
    clave_principal: str,
    clave_secundaria: str,
) -> str:
    objeto = datos.get(
        clave_principal
    )

    if not isinstance(
        objeto,
        dict,
    ):
        return ""

    valor = objeto.get(
        clave_secundaria
    )

    if valor is None:
        return ""

    return str(valor)


def completar_url(
    base_url: str,
    ruta: str | None,
) -> str:
    if not ruta:
        return ""

    if ruta.startswith(
        ("http://", "https://")
    ):
        return ruta

    return (
        base_url.rstrip("/")
        + "/"
        + ruta.lstrip("/")
    )


def generar_csv_entregas(
    entregas: list[dict],
    base_url: str,
) -> str:
    archivo = StringIO(
        newline=""
    )

    escritor = csv.writer(
        archivo,
        delimiter=",",
        quotechar='"',
        quoting=csv.QUOTE_MINIMAL,
        lineterminator="\n",
    )

    escritor.writerow(
        ENCABEZADOS_CSV
    )

    for entrega in entregas:
        escritor.writerow(
            [
                entrega.get(
                    "fecha_envio",
                    "",
                ),
                entrega.get(
                    "envio",
                    "",
                ),
                obtener_valor_anidado(
                    entrega,
                    "agencia",
                    "nombre",
                ),
                obtener_valor_anidado(
                    entrega,
                    "usuario",
                    "nombre",
                ),
                obtener_valor_anidado(
                    entrega,
                    "usuario",
                    "usuario",
                ),
                entrega.get(
                    "comentario",
                    "",
                )
                or "",
                entrega.get(
                    "latitud",
                    "",
                )
                or "",
                entrega.get(
                    "longitud",
                    "",
                )
                or "",
                completar_url(
                    base_url=base_url,
                    ruta=entrega.get(
                        "foto_envio"
                    ),
                ),
                completar_url(
                    base_url=base_url,
                    ruta=entrega.get(
                        "foto_lugar"
                    ),
                ),
            ]
        )

    contenido = archivo.getvalue()

    archivo.close()

    return contenido