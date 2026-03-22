from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from datetime import datetime, timezone
from .base import Base

class Tablero(Base):
    __tablename__ = "tablero"

    idTablero = Column(Integer, primary_key=True)
    nombre = Column(String(255), nullable=False)
    dueno = Column(Integer, ForeignKey("usuarios.idUsuario"), nullable=False)
    fecha_creacion = Column(DateTime, default=lambda: datetime.now(timezone.utc)
)