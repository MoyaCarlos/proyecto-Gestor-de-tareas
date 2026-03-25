/**
 * Módulo para las llamadas a la API
 */

import CONFIG from './config.js';

class APIClient {
    constructor() {
        this.baseUrl = CONFIG.API_BASE_URL;
    }

    /**
     * Obtiene el token del localStorage
     */
    getToken() {
        return localStorage.getItem(CONFIG.TOKENS.ACCESS);
    }

    /**
     * Configura los headers para poder hacer una petición
     */
    getHeaders(isMultipart = false) {
        const headers = {};
        
        if (!isMultipart) {
            headers['Content-Type'] = 'application/json';
        }

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    /**
     * Maneja errores de la API de forma centralizada
     */
    async handleResponse(response) {
        if (!response.ok) {
            let errorMessage = 'Error en la solicitud';
            
            try {
                const data = await response.json();
                errorMessage = data.detail || data.message || errorMessage;
            } catch (e) {
                // Si no es JSON, usa el statusText
                errorMessage = response.statusText || errorMessage;
            }

            throw new Error(errorMessage);
        }

        try {
            return await response.json();
        } catch (e) {
            return null;
        }
    }

    /**
     * GET
     */
    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'GET',
                headers: this.getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('No se pudo conectar con el servidor. Intenta más tarde.');
            }
            throw error;
        }
    }

    /**
     * POST
     */
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            return await this.handleResponse(response);
        } catch (error) {
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('No se pudo conectar con el servidor. Intenta más tarde.');
            }
            throw error;
        }
    }

    /**
     * PUT
     */
    async put(endpoint, data) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            return await this.handleResponse(response);
        } catch (error) {
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('No se pudo conectar con el servidor. Intenta más tarde.');
            }
            throw error;
        }
    }

    /**
     * DELETE
     */
    async delete(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('No se pudo conectar con el servidor. Intenta más tarde.');
            }
            throw error;
        }
    }

    // ==================== AUTH ENDPOINTS ====================

    /**
     * POST /login - Básicamente es donde se inicia sesión
     */
    async login(username, password) {
        return this.post('/login', {
            username,
            password
        });
    }

    /**
     * POST /register - Registra un nuevo usuario en caso de no tenerlo
     */
    async register(username, email, password, nombre) {
        return this.post('/register', {
            username,
            email,
            password,
            nombre
        });
    }

    /**
     * GET /me - Obtiene datos del usuario actual
     */
    async getCurrentUser() {
        return this.get('/me');
    }

    // ==================== BOARDS ENDPOINTS ====================

    /**
     * GET /boards - Obtiene todos los tableros del usuario en cuestión
     */
    async getBoards() {
        return this.get('/boards');
    }

    /**
     * POST /boards - Crea un nuevo tablero
     */
    async createBoard(nombre, descripcion = '') {
        return this.post('/boards', {
            nombre,
            descripcion
        });
    }

    /**
     * GET /boards/{id} - Obtiene un tablero específico
     */
    async getBoard(boardId) {
        return this.get(`/boards/${boardId}`);
    }

    /**
     * PUT /boards/{id} - Actualiza un tablero
     */
    async updateBoard(boardId, nombre, descripcion = '') {
        return this.put(`/boards/${boardId}`, {
            nombre,
            descripcion
        });
    }

    /**
     * DELETE /boards/{id} - Elimina un tablero
     */
    async deleteBoard(boardId) {
        return this.delete(`/boards/${boardId}`);
    }

    // ==================== TASKS ENDPOINTS ====================

    /**
     * GET /tasks?board_id={id} - Obtiene tareas de un tablero
     */
    async getTasks(boardId) {
        return this.get(`/tasks?board_id=${boardId}`);
    }

    /**
     * POST /tasks - Crea una nueva tarea
     */
    async createTask(titulo, descripcion, boardId, prioridad = 'media', fechaVencimiento = null) {
        return this.post('/tasks', {
            titulo,
            descripcion,
            board_id: boardId,
            prioridad,
            fecha_vencimiento: fechaVencimiento
        });
    }

    /**
     * GET /tasks/{id} - Obtiene una tarea específica
     */
    async getTask(taskId) {
        return this.get(`/tasks/${taskId}`);
    }

    /**
     * PUT /tasks/{id} - Actualiza una tarea
     */
    async updateTask(taskId, tareaData) {
        return this.put(`/tasks/${taskId}`, tareaData);
    }

    /**
     * DELETE /tasks/{id} - Elimina una tarea
     */
    async deleteTask(taskId) {
        return this.delete(`/tasks/${taskId}`);
    }

    /**
     * PUT /tasks/{id}/status - Cambia el estado de una tarea
     */
    async updateTaskStatus(taskId, estado) {
        return this.put(`/tasks/${taskId}/status`, {
            estado
        });
    }
}

// Instancia global del cliente
export const apiClient = new APIClient();
export default apiClient;
