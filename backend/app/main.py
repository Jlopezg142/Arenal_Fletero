from fastapi import FastAPI

from app.database import Base, engine

# Importar los modelos para que SQLAlchemy los registre
from app.models.usuario import Usuario
from app.models.agencia import Agencia
from app.models.entrega import Entrega


# Crear las tablas si no existen
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Arenal Fletero",
    version="0.2.0"
)


@app.get("/")
def root():
    return {
        "mensaje": "Arenal Fletero funcionando correctamente"
    }