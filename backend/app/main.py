from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.api.admin import router as admin_router
from app.api.agencias import router as agencias_router
from app.api.auth import router as auth_router
from app.api.usuarios import router as usuarios_router
from app.database import Base, engine
from app.models.agencia import Agencia
from app.models.entrega import Entrega
from app.models.usuario import Usuario
from app.services.usuario_service import (
    crear_administrador_inicial,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)

    crear_administrador_inicial()

    yield


app = FastAPI(
    title="Arenal Fletero",
    version="0.7.0",
    lifespan=lifespan
)


app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(usuarios_router)
app.include_router(agencias_router)


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