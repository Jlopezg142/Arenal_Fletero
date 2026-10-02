from datetime import date, datetime, timezone
from pathlib import Path
import sys
import unittest


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

    def test_genera_multiples_bloques(self):
        contenido = generar_pdf_entregas(
            entregas=[self.crear_entrega(i) for i in range(51)],
            fecha_inicio=None,
            fecha_fin=None,
            agencia="Todas",
            fletero="Todos",
            usuario_generador="admin",
        )

        self.assertTrue(contenido.startswith(b"%PDF"))
        self.assertGreater(len(contenido), 10000)

    def test_genera_cincuenta_y_mas_de_cien_registros(self):
        for cantidad in (50, 101):
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
                self.assertGreater(len(contenido), 10000)

    def test_comentario_se_normaliza_sin_modificar_origen(self):
        original = "  Comentario\ncon   demasiados espacios " * 3
        resultado = normalizar_comentario(original)

        self.assertEqual(len(resultado), 42)
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

    def test_coordenada_cero_no_se_pierde(self):
        self.assertEqual(formatear_coordenada(0), "0")
        self.assertEqual(formatear_coordenada(None), "-")

    def test_fotografias_se_representan_sin_url(self):
        self.assertEqual(formatear_existencia_foto("https://r2/foto"), "Sí")
        self.assertEqual(formatear_existencia_foto(None), "No")

    def test_fecha_se_mantiene_en_una_sola_linea(self):
        tabla = _crear_tabla([self.crear_entrega(1)])
        celda_fecha = tabla._cellvalues[1][0]

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


if __name__ == "__main__":
    unittest.main()
