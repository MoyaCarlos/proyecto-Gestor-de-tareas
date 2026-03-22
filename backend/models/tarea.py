from sqlalchemy import Column, Integer, String, Enum, DateTime
from datetime import datetime, timezone
import enum
from .base import Base

class EstadoTarea(enum.Enum):
    pendiente = "pendiente"
    en_progreso = "en_progreso"
    completada = "completada"
    cancelada = "cancelada"

class Tarea(Base):
    __tablename__ = "tarea"

    idTarea = Column(Integer, primary_key=True)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(String(255), nullable=True)
    fecha_creacion = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    estado = Column(Enum(EstadoTarea), default=EstadoTarea.pendiente)