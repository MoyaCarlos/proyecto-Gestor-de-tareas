from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone

from .base import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    idUsuario = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    rol = Column(String, nullable=False)
    mail = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    fecha_creacion = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
