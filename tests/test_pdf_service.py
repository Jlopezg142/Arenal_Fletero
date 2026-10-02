from datetime import date, datetime, timezone
from pathlib import Path
import sys
import unittest
from unittest.mock import patch

from reportlab.lib.units import mm
from reportlab.platypus import LongTable, PageBreak


ROOT_DIR = Path(__file__).resolve().parents[1]
BACKEND_DIR = ROOT_DIR / "backend"
sys.path.insert(0, str(BACKEND_DIR))

from app.services.pdf_service import (  # noqa: E402
    ANCHOS_COLUMNAS,
    _crear_resumen,
    _crear_tabla,
    formatear_coordenada,
    formatear_existencia_foto,
    formatear_fecha_hora,
    generar_pdf_entregas,
    normalizar_comentario,
    obtener_ruta_logo,
)


class PdfServiceTests(unittest.TestCase):
    def crear_entrega(self, indice: int) -> dict:
        return {
            "envio": 1000 + indice,
            "comentario": "Comentario de prueba",
            "latitud": "14.63491500",
            "longitud": "-90.50688200",
            "foto_envio": "/uploads/envio.jpg",
            "foto_lugar": None,
            "fecha_envio": datetime(2026, 10, 2, 9, 30),
        }

    def test_genera_pdf_letter_vertical(self):
        contenido = generar_pdf_entregas(
            entregas=[self.crear_entrega(1)],
            fecha_inicio=date(2026, 10, 1),
            fecha_fin=date(2026, 10, 2),
            agencia="Agencia Central",
            fletero="Juan López",
            usuario_generador="admin",
            fecha_impresion=datetime(
                2026,
                10,
                2,
                9,
                30,
                tzinfo=timezone.utc,
            ),
        )

        self.assertTrue(contenido.startswith(b"%PDF"))
        self.assertIn(b"/MediaBox [ 0 0 612 792 ]", contenido)

    def test_genera_pdf_valido_con_distintas_cantidades(self):
        for cantidad in (1, 50, 51, 101, 199):
            with self.subTest(cantidad=cantidad):
                contenido = generar_pdf_entregas(
                    entregas=[
                        self.crear_entrega(i)
                        for i in range(cantidad)
                    ],
                    fecha_inicio=None,
                    fecha_fin=None,
                    agencia="Todas",
                    fletero="Todos",
                    usuario_generador="admin",
                )

                self.assertTrue(contenido.startswith(b"%PDF"))
                self.assertGreater(len(contenido), 1000)

    def test_usa_una_tabla_continua_sin_pagebreak_artificial(self):
        entregas = [self.crear_entrega(i) for i in range(199)]
        elementos = []

        def capturar_build(documento, story, **kwargs):
            del documento, kwargs
            elementos.extend(story)

        with patch(
            "app.services.pdf_service.BaseDocTemplate.build",
            autospec=True,
            side_effect=capturar_build,
        ):
            generar_pdf_entregas(
                entregas=entregas,
                fecha_inicio=None,
                fecha_fin=None,
                agencia="Todas",
                fletero="Todos",
                usuario_generador="admin",
            )

        tablas = [
            elemento
            for elemento in elementos
            if isinstance(elemento, LongTable)
        ]
        self.assertEqual(len(tablas), 1)
        self.assertFalse(
            any(
                isinstance(elemento, PageBreak)
                for elemento in elementos
            )
        )
        self.assertEqual(tablas[0].repeatRows, 1)
        self.assertEqual(tablas[0].splitByRow, 1)
        self.assertEqual(len(tablas[0]._cellvalues), 200)

    def test_correlativo_general_en_orden_hasta_199(self):
        tabla = _crear_tabla([self.crear_entrega(i) for i in range(199)])
        correlativos = [
            fila[0].getPlainText()
            for fila in tabla._cellvalues[1:]
        ]
        numeros_envio = [
            fila[2].getPlainText()
            for fila in tabla._cellvalues[1:]
        ]

        self.assertEqual(tabla._cellvalues[0][0].getPlainText(), "No.")
        self.assertEqual(
            correlativos,
            [str(indice) for indice in range(1, 200)],
        )
        self.assertEqual(
            numeros_envio,
            [str(1000 + indice) for indice in range(199)],
        )

    def test_un_registro_inicia_correlativo_en_uno(self):
        tabla = _crear_tabla([self.crear_entrega(1)])

        self.assertEqual(tabla._cellvalues[1][0].getPlainText(), "1")

    def test_comentario_se_normaliza_sin_modificar_origen(self):
        original = "  Comentario\ncon   demasiados espacios " * 3
        resultado = normalizar_comentario(original)

        self.assertEqual(len(resultado), 34)
        self.assertTrue(resultado.endswith("..."))
        self.assertIn("\n", original)

    def test_fecha_ingenua_conserva_la_hora_visual(self):
        resultado = formatear_fecha_hora(
            datetime(2026, 10, 2, 9, 30)
        )

        self.assertEqual(
            resultado,
            "02/10/2026 9:30 a. m.",
        )

    def test_logo_y_anchos_disponibles(self):
        self.assertTrue(obtener_ruta_logo().is_file())
        self.assertLessEqual(sum(ANCHOS_COLUMNAS), 192 * 2.8347)
        self.assertEqual(
            ANCHOS_COLUMNAS,
            [
                9 * mm,
                38 * mm,
                17 * mm,
                33 * mm,
                25 * mm,
                25 * mm,
                20 * mm,
                20 * mm,
            ],
        )

    def test_coordenada_cero_no_se_pierde(self):
        self.assertEqual(formatear_coordenada(0), "0")
        self.assertEqual(formatear_coordenada(None), "-")

    def test_fotografias_se_representan_sin_url(self):
        self.assertEqual(formatear_existencia_foto("https://r2/foto"), "Sí")
        self.assertEqual(formatear_existencia_foto(None), "No")

    def test_fecha_se_mantiene_en_una_sola_linea(self):
        tabla = _crear_tabla([self.crear_entrega(1)])
        celda_fecha = tabla._cellvalues[1][1]

        self.assertNotIn("<br", celda_fecha.text.lower())
        self.assertIn("02/10/2026 9:30 a. m.", celda_fecha.text)

    def test_resumen_es_texto_sin_titulo_ni_tabla(self):
        resumen = _crear_resumen(
            total=3,
            usuario="admin",
            fecha_impresion=datetime(2026, 10, 2, 9, 30),
        )
        textos = [
            getattr(elemento, "text", "")
            for elemento in resumen._content
        ]

        self.assertFalse(any("Resumen final" in texto for texto in textos))
        self.assertTrue(any("Cantidad de viajes" in texto for texto in textos))

    def test_resumen_de_199_aparece_una_sola_vez(self):
        resumen = _crear_resumen(
            total=199,
            usuario="admin",
            fecha_impresion=datetime(2026, 10, 2, 9, 30),
        )
        textos = [
            getattr(elemento, "text", "")
            for elemento in resumen._content
        ]

        coincidencias = [
            texto for texto in textos
            if "Cantidad de viajes:</b> 199" in texto
        ]
        self.assertEqual(len(coincidencias), 1)


if __name__ == "__main__":
    unittest.main()
