/**
 * Router - Maneja la navegación entre vistas (SPA)
 */

import CONFIG from './config.js';
import { authModule } from './auth.js';
import { boardsModule } from './boards.js';
import { tasksModule } from './tasks.js';

class Router {
    constructor() {
        this.currentRoute = null;
        this.routes = {};
        this.setupRoutes();
    }

    /**
     * Configura las rutas
     */
    setupRoutes() {
        // Rutas públicas
        this.routes['/login'] = {
            public: true,
            render: () => this.renderLogin()
        };

        this.routes['/register'] = {
            public: true,
            render: () => this.renderRegister()
        };

        // Rutas privadas
        this.routes['/boards'] = {
            public: false,
            render: () => this.renderBoards()
        };

        this.routes['/board/:id'] = {
            public: false,
            render: (params) => this.renderBoardDetail(params.id)
        };

        this.routes['/profile'] = {
            public: false,
            render: () => this.renderProfile()
        };

        // Ruta por defecto
        this.routes['*'] = {
            public: true,
            render: () => this.renderLogin()
        };
    }

    /**
     * Inicia el router
     */
    init() {
        window.addEventListener('hashchange', () => this.navigate());
        this.navigate();
    }

    /**
     * Navega a una ruta
     */
    navigate() {
        const hash = window.location.hash.slice(1) || '/login';
        const [path, ...queryParts] = hash.split('?');
        
        this.currentRoute = path;
        this.render(path);
    }

    /**
     * Renderiza la ruta actual
     */
    async render(path) {
        // Determina si la ruta es protegida
        const route = this.findRoute(path);
        
        if (!route) {
            this.renderNotFound();
            return;
        }

        // Verifica autenticación
        if (!route.public && !authModule.isAuthenticated()) {
            window.location.hash = '#/login';
            return;
        }

        // Si es login/register y ya está autenticado, redirige a tableros
        if ((path === '/login' || path === '/register') && authModule.isAuthenticated()) {
            window.location.hash = '#/boards';
            return;
        }

        // Extrae parámetros de la ruta
        const params = this.extractParams(path);

        try {
            await route.render(params);
        } catch (error) {
            console.error('Error al renderizar ruta:', error);
            this.renderError(error.message);
        }
    }

    /**
     * Encuentra una ruta que coincida con el patrón
     */
    findRoute(path) {
        // Primero que nada intenta match exacto
        if (this.routes[path]) {
            return this.routes[path];
        }

        // Intenta match con parámetros
        for (const [pattern] of Object.entries(this.routes)) {
            if (pattern === '*') continue;
            
            const regex = this.patternToRegex(pattern);
            if (regex.test(path)) {
                return this.routes[pattern];
            }
        }

        // Fallback a ruta por defecto
        return this.routes['*'];
    }

    /**
     * Convierte un patrón de ruta a regex
     */
    patternToRegex(pattern) {
        const regexPattern = pattern
            .replace(/\//g, '\\/')
            .replace(/:[a-zA-Z]+/g, '[^/]+');
        return new RegExp(`^${regexPattern}$`);
    }

    /**
     * Extrae parámetros de la ruta
     */
    extractParams(path) {
        const params = {};
        const parts = path.split('/').filter(Boolean);

        // Busca patrones con parámetros
        for (const [pattern] of Object.entries(this.routes)) {
            if (pattern === '*') continue;

            const patternParts = pattern.split('/').filter(Boolean);
            if (patternParts.length !== parts.length) continue;

            let matches = true;
            patternParts.forEach((part, index) => {
                if (part.startsWith(':')) {
                    const paramName = part.slice(1);
                    params[paramName] = parts[index];
                } else if (part !== parts[index]) {
                    matches = false;
                }
            });

            if (matches) break;
        }

        return params;
    }

    // ==================== VISTAS ====================

    /**
     * Renderiza la vista de login
     */
    async renderLogin() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="auth-container">
                <div class="auth-form">
                    <h1>Gestor de Tareas</h1>
                    <h2>Iniciar Sesión</h2>
                    
                    <form id="login-form">
                        <div class="form-group">
                            <label for="username">Usuario:</label>
                            <input type="text" id="username" name="username" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="password">Contraseña:</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">Ingresar</button>
                    </form>
                    
                    <p id="login-mensaje" class="error-message"></p>
                    
                    <p class="auth-link">
                        ¿No tienes cuenta? <a href="#/register">Regístrate aquí</a>
                    </p>
                </div>
            </div>
        `;

        authModule.initLoginForm();
    }

    /**
     * Renderiza la vista de registro
     */
    async renderRegister() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="auth-container">
                <div class="auth-form">
                    <h1>Gestor de Tareas</h1>
                    <h2>Crear Cuenta</h2>
                    
                    <form id="register-form">
                        <div class="form-group">
                            <label for="reg-nombre">Nombre:</label>
                            <input type="text" id="reg-nombre" name="nombre" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="reg-username">Usuario:</label>
                            <input type="text" id="reg-username" name="username" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="reg-email">Email:</label>
                            <input type="email" id="reg-email" name="email" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="reg-password">Contraseña:</label>
                            <input type="password" id="reg-password" name="password" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="reg-confirm-password">Confirmar Contraseña:</label>
                            <input type="password" id="reg-confirm-password" name="confirmPassword" required>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">Crear Cuenta</button>
                    </form>
                    
                    <p id="register-mensaje" class="error-message"></p>
                    
                    <p class="auth-link">
                        ¿Ya tienes cuenta? <a href="#/login">Inicia sesión aquí</a>
                    </p>
                </div>
            </div>
        `;

        authModule.initRegisterForm();
    }

    /**
     * Renderiza la vista de tableros
     */
    async renderBoards() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="main-container">
                <nav class="navbar">
                    <h1>Gestor de Tareas</h1>
                    <div class="nav-links">
                        <span id="username">${authModule.getCurrentUser()?.nombre || 'Usuario'}</span>
                        <button id="logout-btn" class="btn btn-secondary">Cerrar Sesión</button>
                    </div>
                </nav>

                <div class="content">
                    <div class="boards-header">
                        <h2>Mis Tableros</h2>
                        <button id="new-board-btn" class="btn btn-primary">+ Nuevo Tablero</button>
                    </div>

                    <div id="create-board-section" class="form-section" style="display: none;">
                        <h3>Crear Nuevo Tablero</h3>
                        <form id="create-board-form">
                            <div class="form-group">
                                <label for="board-nombre">Nombre:</label>
                                <input type="text" id="board-nombre" name="nombre" required>
                            </div>
                            <div class="form-group">
                                <label for="board-descripcion">Descripción:</label>
                                <textarea id="board-descripcion" name="descripcion"></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Crear</button>
                            <button type="button" id="cancel-board-btn" class="btn btn-secondary">Cancelar</button>
                        </form>
                        <p id="board-mensaje" class="error-message"></p>
                    </div>

                    <div id="boards-list" class="boards-grid">
                        <!-- Los tableros se cargarán aquí -->
                    </div>
                </div>
            </div>
        `;

        // Cargar tableros
        try {
            await boardsModule.fetchBoards();
            boardsModule.renderBoardsList();
        } catch (error) {
            console.error('Error al cargar tableros:', error);
        }

        // Event listeners
        document.getElementById('logout-btn').addEventListener('click', () => {
            authModule.logout();
            window.location.hash = '#/login';
        });

        document.getElementById('new-board-btn').addEventListener('click', () => {
            const section = document.getElementById('create-board-section');
            section.style.display = section.style.display === 'none' ? 'block' : 'none';
        });

        document.getElementById('cancel-board-btn').addEventListener('click', () => {
            document.getElementById('create-board-section').style.display = 'none';
        });

        boardsModule.initCreateBoardForm();
    }

    /**
     * Renderiza la vista de detalle de un tablero
     */
    async renderBoardDetail(boardId) {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="main-container">
                <nav class="navbar">
                    <h1>Gestor de Tareas</h1>
                    <div class="nav-links">
                        <a href="#/boards" class="btn btn-secondary">← Volver</a>
                        <button id="logout-btn" class="btn btn-secondary">Cerrar Sesión</button>
                    </div>
                </nav>

                <div class="content">
                    <div class="board-header">
                        <h2 id="board-title">Cargando...</h2>
                    </div>

                    <div class="tasks-header">
                        <h3>Tareas</h3>
                        <button id="new-task-btn" class="btn btn-primary">+ Nueva Tarea</button>
                    </div>

                    <div id="create-task-section" class="form-section" style="display: none;">
                        <h3>Crear Nueva Tarea</h3>
                        <form id="create-task-form">
                            <div class="form-group">
                                <label for="task-titulo">Título:</label>
                                <input type="text" id="task-titulo" name="titulo" required>
                            </div>
                            <div class="form-group">
                                <label for="task-descripcion">Descripción:</label>
                                <textarea id="task-descripcion" name="descripcion"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="task-prioridad">Prioridad:</label>
                                <select id="task-prioridad" name="prioridad">
                                    <option value="baja">Baja</option>
                                    <option value="media" selected>Media</option>
                                    <option value="alta">Alta</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="task-fecha">Fecha de Vencimiento:</label>
                                <input type="date" id="task-fecha" name="fecha">
                            </div>
                            <button type="submit" class="btn btn-primary">Crear</button>
                            <button type="button" id="cancel-task-btn" class="btn btn-secondary">Cancelar</button>
                        </form>
                        <p id="task-mensaje" class="error-message"></p>
                    </div>

                    <div id="tasks-list" class="tasks-list">
                        <!-- Las tareas se cargarán aquí -->
                    </div>
                </div>
            </div>
        `;

        // Cargar datos
        try {
            const board = await boardsModule.getBoard(boardId);
            document.getElementById('board-title').innerText = board.nombre;

            await tasksModule.fetchTasks(boardId);
            tasksModule.renderTasksList();
        } catch (error) {
            console.error('Error al cargar tablero:', error);
            this.renderError(error.message);
        }

        // Event listeners
        document.getElementById('logout-btn').addEventListener('click', () => {
            authModule.logout();
            window.location.hash = '#/login';
        });

        document.getElementById('new-task-btn').addEventListener('click', () => {
            const section = document.getElementById('create-task-section');
            section.style.display = section.style.display === 'none' ? 'block' : 'none';
        });

        document.getElementById('cancel-task-btn').addEventListener('click', () => {
            document.getElementById('create-task-section').style.display = 'none';
        });

        tasksModule.initCreateTaskForm(boardId);
    }

    /**
     * Renderiza la vista de perfil
     */
    async renderProfile() {
        const app = document.getElementById('app');
        const user = authModule.getCurrentUser();
        
        app.innerHTML = `
            <div class="main-container">
                <nav class="navbar">
                    <h1>Gestor de Tareas</h1>
                    <div class="nav-links">
                        <a href="#/boards" class="btn btn-secondary">← Volver</a>
                        <button id="logout-btn" class="btn btn-secondary">Cerrar Sesión</button>
                    </div>
                </nav>

                <div class="content">
                    <div class="profile-container">
                        <h2>Mi Perfil</h2>
                        <div class="profile-info">
                            <p><strong>Nombre:</strong> ${user?.nombre || 'N/A'}</p>
                            <p><strong>Usuario:</strong> ${user?.username || 'N/A'}</p>
                            <p><strong>Email:</strong> ${user?.email || 'N/A'}</p>
                            <p><strong>Rol:</strong> ${user?.rol || 'Usuario'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('logout-btn').addEventListener('click', () => {
            authModule.logout();
            window.location.hash = '#/login';
        });
    }

    /**
     * Renderiza página de error 404
     */
    renderNotFound() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="error-container">
                <h1>404 - Página no encontrada</h1>
                <p>La página que buscas no existe.</p>
                <a href="#/login" class="btn btn-primary">Volver al inicio</a>
            </div>
        `;
    }

    /**
     * Renderiza página de error genérico
     */
    renderError(message) {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="error-container">
                <h1>Error</h1>
                <p>${message}</p>
                <a href="#/login" class="btn btn-primary">Volver al inicio</a>
            </div>
        `;
    }
}

export const router = new Router();
export default router;
