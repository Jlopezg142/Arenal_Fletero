from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine
from app.models.agencia import Agencia
from app.models.entrega import Entrega
from app.models.usuario import Usuario
from app.services.usuario_service import (
    crear_administrador_inicial,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Ejecuta las tareas necesarias al iniciar la aplicación.
    """

    # Crear tablas que todavía no existan
    Base.metadata.create_all(bind=engine)

    # Crear el administrador inicial si no existe
    crear_administrador_inicial()

    yield


app = FastAPI(
    title="Arenal Fletero",
    version="0.3.0",
    lifespan=lifespan
)


# Fotografías locales durante el desarrollo
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


@app.get("/")
def root():
    return {
        "mensaje": "Arenal Fletero funcionando correctamente"
    }