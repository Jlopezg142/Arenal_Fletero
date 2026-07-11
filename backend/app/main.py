from fastapi import FastAPI

app = FastAPI(title="Arenal Fletero")

@app.get("/")
def root():
    return {
        "mensaje": "Arenal Fletero funcionando correctamente"
    }