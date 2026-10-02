from datetime import date
from pathlib import Path
from types import SimpleNamespace
import sys
import unittest
from unittest.mock import patch


ROOT_DIR = Path(__file__).resolve().parents[1]
BACKEND_DIR = ROOT_DIR / "backend"
sys.path.insert(0, str(BACKEND_DIR))

from fastapi import HTTPException  # noqa: E402

from app.api.admin import exportar_entregas_pdf  # noqa: E402
from app.services.export_service import generar_csv_entregas  # noqa: E402


class AdminPdfTests(unittest.TestCase):
    def setUp(self):
        self.administrador = SimpleNamespace(
            id=1,
            usuario="admin_seguro",
            rol="ADMIN",
        )
        self.entregas = [
            {
                "envio": 123,
                "comentario": "Entregado",
                "latitud": "14.6",
                "longitud": "-90.5",
                "foto_envio": "foto-1",
                "foto_lugar": None,
                "fecha_envio": None,
                "agencia": {"nombre": "Central"},
                "usuario": {
                    "nombre": "Fletero Uno",
                    "usuario": "fletero1",
                },
            }
        ]

    @patch("app.api.admin.generar_pdf_entregas", return_value=b"%PDF-prueba")
    @patch("app.api.admin.buscar_usuario_por_id")
    @patch("app.api.admin.buscar_agencia_por_id")
    @patch("app.api.admin.consultar_entregas")
    def test_endpoint_reutiliza_filtros_y_usuario_autenticado(
        self,
        consultar,
        buscar_agencia,
        buscar_usuario,
        generar_pdf,
    ):
        consultar.return_value = self.entregas
        buscar_agencia.return_value = SimpleNamespace(nombre="Central")
        buscar_usuario.return_value = SimpleNamespace(nombre="Fletero Uno")
        inicio = date(2026, 10, 1)
        fin = date(2026, 10, 2)
        db = object()

        respuesta = exportar_entregas_pdf(
            fecha_inicio=inicio,
            fecha_fin=fin,
            agencia_id=2,
            usuario_id=3,
            db=db,
            administrador=self.administrador,
        )

        consultar.assert_called_once_with(
            db=db,
            usuario_actual=self.administrador,
            fecha_inicio=inicio,
            fecha_fin=fin,
            agencia_id=2,
            usuario_id=3,
        )
        self.assertEqual(
            generar_pdf.call_args.kwargs["usuario_generador"],
            "admin_seguro",
        )
        self.assertEqual(respuesta.media_type, "application/pdf")
        self.assertTrue(respuesta.body.startswith(b"%PDF"))
        self.assertIn(
            "attachment; filename=\"arenal_entregas_",
            respuesta.headers["content-disposition"],
        )
        self.assertEqual(respuesta.headers["cache-control"], "no-store")
        self.assertEqual(
            respuesta.headers["x-content-type-options"],
            "nosniff",
        )

    @patch("app.api.admin.consultar_entregas", return_value=[])
    def test_endpoint_no_genera_pdf_sin_resultados(self, consultar):
        with self.assertRaises(HTTPException) as contexto:
            exportar_entregas_pdf(
                fecha_inicio=None,
                fecha_fin=None,
                agencia_id=None,
                usuario_id=None,
                db=object(),
                administrador=self.administrador,
            )

        self.assertEqual(contexto.exception.status_code, 404)
        self.assertIn("No se encontraron", contexto.exception.detail)

    def test_csv_conserva_sus_encabezados(self):
        contenido = generar_csv_entregas(
            entregas=self.entregas,
            base_url="https://example.test/",
        )

        self.assertTrue(
            contenido.startswith(
                "Fecha y hora,Numero de envio,Agencia,Fletero,Usuario,"
            )
        )


if __name__ == "__main__":
    unittest.main()
