# Gestor de Tareas Colaborativo

Sistema web para gestión de tareas en equipo. Permite crear tableros, asignar tareas, gestionar estados y recibir notificaciones en tiempo real.

---

## Descripción

Una aplicación multiusuario donde los equipos pueden organizar su trabajo en tableros, crear tareas con prioridad y fecha de vencimiento, asignarlas a miembros del equipo y llevar un historial de cambios. Las sesiones de usuario se gestionan con Redis y las notificaciones se envían a través de Redis Pub/Sub.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Python + FastAPI |
| Base de datos | PostgreSQL |
| Cache y sesiones | Redis |
| Autenticación | JWT (`python-jose`) |
| Frontend | HTML + JavaScript |
| Gestor de paquetes | uv |
| Tests | unittest + TestClient (FastAPI) |
| Entorno | Docker Compose |

## Dependencias principales

fastapi — el framework web con el que van a construir la API REST
uvicorn — el servidor que corre FastAPI, es el equivalente a un Apache/Nginx pero liviano para desarrollo
psycopg2-binary — el conector entre Python y PostgreSQL, sin esto no pueden hablar con la base de datos
redis — el cliente de Redis para Python, para manejar sesiones y Pub/Sub
python-jose — maneja la creación y validación de tokens JWT para la autenticación
passlib — para hashear contraseñas antes de guardarlas en la base de datos, nunca se guarda la contraseña en texto plano
python-dotenv — lee el archivo .env y carga las variables de entorno (la URL de la base de datos, la clave secreta, etc.)
alembic — maneja las migraciones de la base de datos, es decir, los cambios que van haciendo en las tablas a lo largo del tiempo de forma ordenada y versionada

Dependencia de desarrollo

httpx — es un cliente HTTP que usa el TestClient de FastAPI internamente para simular requests en los tests, no se usa en producción

---

## Funcionalidades

- Registro e inicio de sesión con JWT
- Creación y gestión de tableros por equipo
- Tareas con título, descripción, prioridad, fecha de vencimiento y estado
- Asignación de tareas a miembros del equipo
- Historial de cambios por tarea
- Sesiones de usuario gestionadas con Redis
- Notificaciones en tiempo real con Redis Pub/Sub

---

## Estructura del proyecto

```
gestor-tareas/
├── backend/
│   ├── main.py
│   ├── routers/
│   │   ├── auth.py
│   │   ├── boards.py
│   │   └── tasks.py
│   ├── models/
│   ├── schemas/
│   ├── database.py
│   ├── tests/
│   │   ├── test_models.py
│   │   ├── test_endpoints.py
│   │   └── test_integration.py
│   └── pyproject.toml
├── frontend/
│   ├── index.html
│   └── app.js
├── docker-compose.yml
└── README.md
```

---

## Requisitos previos

- Docker y Docker Compose instalados
- [uv](https://docs.astral.sh/uv/) instalado (gestor de paquetes moderno para Python)

---

## Instalación y uso

### Instalar uv

```bash
# Linux / macOS
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### Instalar dependencias del proyecto

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd gestor-tareas/backend

# Instalar dependencias definidas en pyproject.toml
uv sync
```

### Agregar nuevas dependencias

```bash
uv add nombre-del-paquete
```

### Correr el proyecto sin Docker

```bash
uv run uvicorn main:app --reload
```

### Correr el proyecto con Docker

```bash
docker compose up --build
```

La API estará disponible en `http://localhost:8000`  
La documentación automática de FastAPI en `http://localhost:8000/docs`

---

## Servicios de Docker

| Servicio | Puerto | Descripción |
|---|---|---|
| FastAPI | 8000 | Backend y API REST |
| PostgreSQL | 5432 | Base de datos principal |
| Redis | 6379 | Cache y sesiones |
| pgAdmin | 5050 | Interfaz visual de PostgreSQL |
| Redis Commander | 8081 | Interfaz visual de Redis |

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=password
POSTGRES_DB=gestor_tareas
REDIS_URL=redis://redis:6379
SECRET_KEY=tu_clave_secreta_jwt
```

---

## Equipo

| Persona | Responsabilidad | Tests |
|---|---|---|
| Persona 1 (exp.) | Base de datos, migraciones con Alembic, Docker Compose | `test_models.py` — modelos y operaciones en PostgreSQL |
| Persona 2 (exp.) | Estructura FastAPI, endpoints, JWT, Redis | `test_endpoints.py` — cada endpoint con TestClient |
| Persona 3 | Frontend: login, tableros, tareas, consumo de API | — |
| Persona 4 | Apoyo general, documentación de endpoints en README | `test_integration.py` — flujos completos con setUp/tearDown |

---

## Herramientas recomendadas

- **pgAdmin** — explorar y consultar PostgreSQL visualmente
- **Redis Commander** — inspeccionar claves y valores en Redis
- **Postman / Insomnia** — probar los endpoints de la API
- **FastAPI /docs** — documentación automática e interactiva de la API

---

## Tests

Los tests están escritos con `unittest` y se ubican en `backend/tests/`.

| Archivo | Qué testea |
|---|---|
| `test_models.py` | Creación, lectura y eliminación de modelos en PostgreSQL |
| `test_endpoints.py` | Endpoints de la API con `TestClient` de FastAPI |
| `test_integration.py` | Flujos completos: registro → tablero → tarea → cambio de estado |

### Correr los tests

```bash
# Todos los tests
uv run python -m unittest discover -s tests

# Un archivo específico
uv run python -m unittest tests.test_endpoints
```

Los tests de integración usan una base de datos separada definida en `.env` para no afectar los datos reales. Cada test limpia su estado con `setUp` y `tearDown`.