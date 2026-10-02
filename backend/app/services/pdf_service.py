from __future__ import annotations

from datetime import date, datetime
from html import escape
from io import BytesIO
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    LongTable,
    PageTemplate,
    Paragraph,
    Spacer,
    TableStyle,
)


ZONA_HORARIA_GUATEMALA = ZoneInfo("America/Guatemala")
LIMITE_COMENTARIO = 34

MARGEN_HORIZONTAL = 10 * mm
MARGEN_INFERIOR = 14 * mm
MARGEN_SUPERIOR = 47 * mm

ANCHOS_COLUMNAS = [
    9 * mm,
    38 * mm,
    17 * mm,
    33 * mm,
    25 * mm,
    25 * mm,
    20 * mm,
    20 * mm,
]


class CanvasNumerado(canvas.Canvas):
    """Agrega el total real a la numeración de páginas."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._estados_paginas: list[dict[str, Any]] = []

    def showPage(self) -> None:
        self._estados_paginas.append(dict(self.__dict__))
        self._startPage()

    def save(self) -> None:
        total_paginas = len(self._estados_paginas)

        for estado in self._estados_paginas:
            self.__dict__.update(estado)
            self._dibujar_numero_pagina(total_paginas)
            super().showPage()

        super().save()

    def _dibujar_numero_pagina(self, total_paginas: int) -> None:
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#555555"))
        self.drawRightString(
            letter[0] - MARGEN_HORIZONTAL,
            8 * mm,
            f"Página {self._pageNumber} de {total_paginas}",
        )
        self.restoreState()


def obtener_ruta_logo() -> Path:
    """Localiza el mismo logo en desarrollo y en Docker."""

    archivo_actual = Path(__file__).resolve()
    candidatos = (
        archivo_actual.parents[3]
        / "frontend"
        / "images"
        / "logo-arenal.png",
        archivo_actual.parents[2]
        / "frontend"
        / "images"
        / "logo-arenal.png",
    )

    for candidato in candidatos:
        if candidato.is_file():
            return candidato

    raise FileNotFoundError(
        "No se encontró el logo de El Arenal."
    )


def formatear_fecha_filtro(valor: date | None) -> str:
    if valor is None:
        return "No especificada"

    return valor.strftime("%d/%m/%Y")


def formatear_fecha_hora(valor: datetime | str | None) -> str:
    if valor is None:
        return "-"

    if not isinstance(valor, datetime):
        return str(valor)

    fecha = valor

    # Los registros actuales se guardan como UTC sin zona y el
    # frontend los presenta como hora local sin conversión. Se
    # conserva ese comportamiento visual. Si llega una fecha con
    # zona explícita, sí se convierte a la zona de Guatemala.
    if fecha.tzinfo is not None:
        fecha = fecha.astimezone(ZONA_HORARIA_GUATEMALA)

    hora = fecha.strftime("%I:%M").lstrip("0")
    periodo = "a. m." if fecha.hour < 12 else "p. m."

    return f"{fecha.strftime('%d/%m/%Y')} {hora} {periodo}"


def normalizar_comentario(comentario: str | None) -> str:
    texto = " ".join((comentario or "").split())

    if not texto:
        return "-"

    if len(texto) <= LIMITE_COMENTARIO:
        return texto

    return texto[: LIMITE_COMENTARIO - 3].rstrip() + "..."


def formatear_coordenada(valor: Any) -> str:
    if valor is None or valor == "":
        return "-"

    return str(valor)


def formatear_existencia_foto(valor: Any) -> str:
    return "Sí" if valor else "No"


def _dibujar_encabezado(
    lienzo: canvas.Canvas,
    documento: BaseDocTemplate,
    filtros: dict[str, str],
    ruta_logo: Path,
) -> None:
    del documento

    ancho, alto = letter
    lienzo.saveState()
    lienzo.drawImage(
        str(ruta_logo),
        ancho - MARGEN_HORIZONTAL - 25 * mm,
        alto - 25 * mm,
        width=25 * mm,
        height=16.25 * mm,
        preserveAspectRatio=True,
        mask="auto",
    )

    limite_texto = ancho - MARGEN_HORIZONTAL - 32 * mm
    centro_x = (
        MARGEN_HORIZONTAL + limite_texto
    ) / 2
    lienzo.setFillColor(colors.HexColor("#163A5F"))
    lienzo.setFont("Helvetica-Bold", 13)
    lienzo.drawCentredString(centro_x, alto - 14 * mm, "Arenal Fletero")
    lienzo.setFont("Helvetica", 9)
    lienzo.drawCentredString(
        centro_x,
        alto - 20 * mm,
        "Administración de entregas",
    )
    lienzo.setFont("Helvetica-Bold", 11)
    lienzo.drawCentredString(
        centro_x,
        alto - 27 * mm,
        "Reporte de entregas",
    )

    lienzo.setStrokeColor(colors.HexColor("#A8B7C7"))
    lienzo.line(
        MARGEN_HORIZONTAL,
        alto - 30 * mm,
        ancho - MARGEN_HORIZONTAL,
        alto - 30 * mm,
    )
    lienzo.setFillColor(colors.black)
    lienzo.setFont("Helvetica", 7.5)
    lienzo.drawString(
        MARGEN_HORIZONTAL,
        alto - 35 * mm,
        f"Fecha inicial: {filtros['fecha_inicio']}",
    )
    lienzo.drawString(
        MARGEN_HORIZONTAL,
        alto - 40 * mm,
        f"Agencia: {filtros['agencia']}",
    )
    lienzo.drawString(
        ancho / 2,
        alto - 35 * mm,
        f"Fecha final: {filtros['fecha_fin']}",
    )
    lienzo.drawString(
        ancho / 2,
        alto - 40 * mm,
        f"Fletero: {filtros['fletero']}",
    )
    lienzo.restoreState()


def _crear_tabla(entregas: list[dict[str, Any]]) -> LongTable:
    estilos = getSampleStyleSheet()
    estilo_encabezado = ParagraphStyle(
        "EncabezadoTabla",
        parent=estilos["Normal"],
        fontName="Helvetica-Bold",
        fontSize=6.5,
        leading=7.5,
        alignment=TA_CENTER,
        textColor=colors.white,
    )
    estilo_celda = ParagraphStyle(
        "CeldaTabla",
        parent=estilos["Normal"],
        fontName="Helvetica",
        fontSize=6.5,
        leading=7.5,
        alignment=TA_LEFT,
    )
    estilo_centro = ParagraphStyle(
        "CeldaCentrada",
        parent=estilo_celda,
        alignment=TA_CENTER,
    )

    encabezados = [
        "No.",
        "Fecha y hora",
        "No. envío",
        "Comentario",
        "Latitud",
        "Longitud",
        "Foto envío",
        "Foto lugar",
    ]
    datos: list[list[Paragraph]] = [
        [Paragraph(escape(valor), estilo_encabezado) for valor in encabezados]
    ]

    for correlativo, entrega in enumerate(entregas, start=1):
        fecha = formatear_fecha_hora(entrega.get("fecha_envio"))
        datos.append(
            [
                Paragraph(str(correlativo), estilo_centro),
                Paragraph(escape(fecha), estilo_centro),
                Paragraph(
                    escape(str(entrega.get("envio", ""))),
                    estilo_centro,
                ),
                Paragraph(
                    escape(normalizar_comentario(entrega.get("comentario"))),
                    estilo_celda,
                ),
                Paragraph(
                    escape(
                        formatear_coordenada(
                            entrega.get("latitud")
                        )
                    ),
                    estilo_centro,
                ),
                Paragraph(
                    escape(
                        formatear_coordenada(
                            entrega.get("longitud")
                        )
                    ),
                    estilo_centro,
                ),
                Paragraph(
                    formatear_existencia_foto(
                        entrega.get("foto_envio")
                    ),
                    estilo_centro,
                ),
                Paragraph(
                    formatear_existencia_foto(
                        entrega.get("foto_lugar")
                    ),
                    estilo_centro,
                ),
            ]
        )

    tabla = LongTable(
        datos,
        colWidths=ANCHOS_COLUMNAS,
        repeatRows=1,
        splitByRow=1,
        hAlign="LEFT",
    )
    tabla.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#163A5F")),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#A8B7C7")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 2),
                ("RIGHTPADDING", (0, 0), (-1, -1), 2),
                ("TOPPADDING", (0, 0), (-1, -1), 2.5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5),
                (
                    "ROWBACKGROUNDS",
                    (0, 1),
                    (-1, -1),
                    [colors.white, colors.HexColor("#F3F6F8")],
                ),
            ]
        )
    )
    return tabla


def _crear_resumen(
    total: int,
    usuario: str,
    fecha_impresion: datetime,
) -> KeepTogether:
    estilos = getSampleStyleSheet()
    estilo_texto = ParagraphStyle(
        "TextoResumen",
        parent=estilos["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        alignment=TA_RIGHT,
    )
    contenido = [
        Paragraph(
            f"<b>Cantidad de viajes:</b> {total}",
            estilo_texto,
        ),
        Paragraph(
            f"<b>Usuario:</b> {escape(usuario)}",
            estilo_texto,
        ),
        Paragraph(
            "<b>Fecha y hora de impresión:</b> "
            + escape(formatear_fecha_hora(fecha_impresion)),
            estilo_texto,
        ),
    ]
    return KeepTogether(
        [
            Spacer(1, 7 * mm),
            *contenido,
        ]
    )


def generar_pdf_entregas(
    entregas: list[dict[str, Any]],
    fecha_inicio: date | None,
    fecha_fin: date | None,
    agencia: str,
    fletero: str,
    usuario_generador: str,
    fecha_impresion: datetime | None = None,
) -> bytes:
    """Construye el reporte en memoria sin acceder a datos externos."""

    salida = BytesIO()
    ruta_logo = obtener_ruta_logo()
    filtros = {
        "fecha_inicio": formatear_fecha_filtro(fecha_inicio),
        "fecha_fin": formatear_fecha_filtro(fecha_fin),
        "agencia": agencia,
        "fletero": fletero,
    }
    fecha_reporte = fecha_impresion or datetime.now(
        ZONA_HORARIA_GUATEMALA
    )
    documento = BaseDocTemplate(
        salida,
        pagesize=letter,
        leftMargin=MARGEN_HORIZONTAL,
        rightMargin=MARGEN_HORIZONTAL,
        topMargin=MARGEN_SUPERIOR,
        bottomMargin=MARGEN_INFERIOR,
        title="Reporte de entregas",
        author="Arenal Fletero",
    )
    marco = Frame(
        documento.leftMargin,
        documento.bottomMargin,
        documento.width,
        documento.height,
        id="contenido",
    )
    documento.addPageTemplates(
        [
            PageTemplate(
                id="reporte",
                frames=[marco],
                onPage=lambda lienzo, doc: _dibujar_encabezado(
                    lienzo,
                    doc,
                    filtros,
                    ruta_logo,
                ),
            )
        ]
    )

    elementos = [
        _crear_tabla(entregas),
        _crear_resumen(
            total=len(entregas),
            usuario=usuario_generador,
            fecha_impresion=fecha_reporte,
        ),
    ]
    documento.build(elementos, canvasmaker=CanvasNumerado)

    contenido = salida.getvalue()
    salida.close()
    return contenido
