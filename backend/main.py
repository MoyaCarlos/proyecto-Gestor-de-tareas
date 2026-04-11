from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from database import engine

app = FastAPI(title="API - Gestor de Tareas")

#Agrego middleware de CORS para permitir solicitudes desde el frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.get("/")
def root():
    return {"mensaje": "Gestor de Tareas funcionando"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/db-check")
def db_check():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"db": "ok"}