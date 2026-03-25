# Frontend - Gestor de Tareas

## Estructura Modular

El frontend está organizado en módulos independientes para facilitar el mantenimiento y escalabilidad.

### Archivos Principales

```
frontend/
├── index.html              # HTML principal (simple, solo contenedor)
├── app.js                  # Punto de entrada ANTERIOR (deprecated)
├── css/
│   └── styles.css         # Estilos CSS (vacío, se rellenará después)
└── js/
    ├── main.js            # Punto de entrada principal (inicializa la app)
    ├── config.js          # Configuración global (URLs, tokens, rutas)
    ├── utils.js           # Funciones utilitarias (validación, DOM, etc.)
    ├── api.js             # Cliente HTTP centralizado para la API
    ├── auth.js            # Módulo de autenticación (login/registro)
    ├── boards.js          # Módulo de tableros (CRUD + renderizado)
    ├── tasks.js           # Módulo de tareas (CRUD + renderizado)
    └── router.js          # Router SPA (maneja navegación entre vistas)
```

## Flujo de Inicialización

1. **index.html** carga `js/main.js` como módulo ES6
2. **main.js** inicializa:
   - `authModule` - Verifica si hay sesión activa
   - `router` - Inicia el sistema de enrutamiento
3. **router** renderiza la vista correspondiente según el hash URL

## Conceptos Importantes

### SPA (Single Page Application)
La app usa hash-based routing (`#/login`, `#/boards`, `#/board/:id`)
- No requiere recargas de página
- Mantiene el estado en memoria

### Módulos
Cada módulo tiene responsabilidades específicas:
- **api.js**: Comunicación con el backend (centralizada)
- **auth.js**: Lógica de autenticación y sesión
- **boards.js**: CRUD de tableros y renderizado
- **tasks.js**: CRUD de tareas y renderizado
- **router.js**: Navegación entre vistas

### Validación
- **Client-side**: En `utils.js` (email, password, username)
- **Server-side**: En el backend (Python/FastAPI)

## Rutas Disponibles

| Ruta | Tipo | Descripción |
|------|------|-------------|
| `#/login` | Pública | Formulario de inicio de sesión |
| `#/register` | Pública | Formulario de registro |
| `#/boards` | Privada | Lista de tableros |
| `#/board/:id` | Privada | Detalle de tablero y tareas |
| `#/profile` | Privada | Perfil de usuario |

## Token de Autenticación

- Se guarda en `localStorage` con clave `token`
- Se envía en header `Authorization: Bearer {token}`
- Se valida en cada petición del cliente
- Si es inválido, redirige a login

## Integración con Backend

El cliente espera estos endpoints:

### Auth
- `POST /login` → `{ access_token, user }`
- `POST /register` → `{ id, nombre, username, email }`
- `GET /me` → `{ id, nombre, username, email, rol }`

### Boards
- `GET /boards` → `[{ id, nombre, descripcion, ... }]`
- `POST /boards` → `{ id, nombre, descripcion }`
- `GET /boards/:id` → `{ id, nombre, descripcion }`
- `PUT /boards/:id` → `{ id, nombre, descripcion }`
- `DELETE /boards/:id` → `{}`

### Tasks
- `GET /tasks?board_id=:id` → `[{ id, titulo, estado, ... }]`
- `POST /tasks` → `{ id, titulo, descripcion, estado }`
- `GET /tasks/:id` → `{ id, titulo, descripcion, estado }`
- `PUT /tasks/:id` → `{ id, titulo, descripcion, estado }`
- `DELETE /tasks/:id` → `{}`
- `PUT /tasks/:id/status` → `{ id, estado }`

## Uso de Módulos

### Desde otro módulo

```javascript
import { authModule } from './auth.js';
import { boardsModule } from './boards.js';

// Usar
await authModule.login(username, password);
await boardsModule.fetchBoards();
```

### Cliente HTTP

```javascript
import { apiClient } from './api.js';

// Llamadas directas a la API
const user = await apiClient.login(username, password);
const boards = await apiClient.getBoards();
```

## Próximas Tareas

- [ ] Agregar estilos CSS
- [ ] Implementar modales para edición
- [ ] Agregar drag-and-drop Kanban
- [ ] Notificaciones en tiempo real (WebSocket/Redis Pub/Sub)
- [ ] Búsqueda y filtros advanced
- [ ] Tests unitarios
