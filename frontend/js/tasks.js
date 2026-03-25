/**
 * Tareas
 */

import { apiClient } from './api.js';
import { showError, hideError, showAlert, clearForm } from './utils.js';

class TasksModule {
    constructor() {
        this.tasks = [];
        this.currentBoardId = null;
    }

    /**
     * Obtiene todas las tareas de un tablero
     */
    async fetchTasks(boardId) {
        try {
            this.currentBoardId = boardId;
            this.tasks = await apiClient.getTasks(boardId);
            return this.tasks;
        } catch (error) {
            console.error('Error al obtener tareas:', error);
            throw error;
        }
    }

    /**
     * Crea una nueva tarea
     */
    async createTask(titulo, descripcion, boardId, prioridad = 'media', fechaVencimiento = null) {
        try {
            if (!titulo || !boardId) {
                throw new Error('Título y tablero son requeridos');
            }

            const newTask = await apiClient.createTask(titulo, descripcion, boardId, prioridad, fechaVencimiento);
            this.tasks.push(newTask);
            return newTask;
        } catch (error) {
            console.error('Error al crear tarea:', error);
            throw error;
        }
    }

    /**
     * Actualiza una tarea
     */
    async updateTask(taskId, tareaData) {
        try {
            const updated = await apiClient.updateTask(taskId, tareaData);
            const index = this.tasks.findIndex(t => t.id === taskId);
            if (index !== -1) {
                this.tasks[index] = updated;
            }
            return updated;
        } catch (error) {
            console.error('Error al actualizar tarea:', error);
            throw error;
        }
    }

    /**
     * Cambia el estado de una tarea
     */
    async updateTaskStatus(taskId, estado) {
        try {
            const updated = await apiClient.updateTaskStatus(taskId, estado);
            const index = this.tasks.findIndex(t => t.id === taskId);
            if (index !== -1) {
                this.tasks[index] = updated;
            }
            return updated;
        } catch (error) {
            console.error('Error al actualizar estado de tarea:', error);
            throw error;
        }
    }

    /**
     * Elimina una tarea
     */
    async deleteTask(taskId) {
        try {
            await apiClient.deleteTask(taskId);
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            return true;
        } catch (error) {
            console.error('Error al eliminar tarea:', error);
            throw error;
        }
    }

    /**
     * Agrupa tareas por estado
     */
    getTasksByStatus() {
        const grouped = {
            'pendiente': [],
            'en_progreso': [],
            'completada': []
        };

        this.tasks.forEach(task => {
            const status = task.estado || 'pendiente';
            if (grouped[status]) {
                grouped[status].push(task);
            }
        });

        return grouped;
    }

    /**
     * Renderiza las tareas en formato Kanban
     */
    renderTasksKanban(containerId = 'tasks-kanban') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const tasksByStatus = this.getTasksByStatus();

        const kanban = document.createElement('div');
        kanban.className = 'kanban-board';

        Object.entries(tasksByStatus).forEach(([status, tasks]) => {
            const column = document.createElement('div');
            column.className = 'kanban-column';
            column.setAttribute('data-status', status);

            column.innerHTML = `
                <h3>${this.formatStatusLabel(status)}</h3>
                <div class="tasks-container">
                    ${tasks.map(task => `
                        <div class="task-card" data-task-id="${task.id}">
                            <h4>${task.nombre}</h4>
                            <p>${task.descripcion || 'Sin descripción'}</p>
                            <div class="task-meta">
                                <span class="priority priority-${task.prioridad}">${task.prioridad}</span>
                                ${task.fecha_vencimiento ? `<span class="due-date">${task.fecha_vencimiento}</span>` : ''}
                            </div>
                            <div class="task-actions">
                                <button class="btn-edit-task" data-id="${task.id}">Editar</button>
                                <button class="btn-delete-task" data-id="${task.id}">Eliminar</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            kanban.appendChild(column);
        });

        container.innerHTML = '';
        container.appendChild(kanban);

        this.attachTasksListeners();
    }

    /**
     * Renderiza una lista simple de tareas
     */
    renderTasksList(containerId = 'tasks-list') {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (this.tasks.length === 0) {
            container.innerHTML = '<p>No hay tareas aún.</p>';
            return;
        }

        container.innerHTML = this.tasks.map(task => `
            <div class="task-item" data-task-id="${task.id}">
                <div class="task-info">
                    <h4>${task.nombre}</h4>
                    <p>${task.descripcion || 'Sin descripción'}</p>
                    <span class="task-status">${this.formatStatusLabel(task.estado)}</span>
                </div>
                <div class="task-actions">
                    <select class="task-status-select" data-task-id="${task.id}">
                        <option value="pendiente" ${task.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="en_progreso" ${task.estado === 'en_progreso' ? 'selected' : ''}>En Progreso</option>
                        <option value="completada" ${task.estado === 'completada' ? 'selected' : ''}>Completada</option>
                    </select>
                    <button class="btn-edit-task" data-id="${task.id}">Editar</button>
                    <button class="btn-delete-task" data-id="${task.id}">Eliminar</button>
                </div>
            </div>
        `).join('');

        this.attachTasksListeners();
    }

    /**
     * Agrega event listeners a las tareas
     */
    attachTasksListeners() {
        document.querySelectorAll('.task-status-select').forEach(select => {
            select.addEventListener('change', async (e) => {
                const taskId = e.target.dataset.taskId;
                const newStatus = e.target.value;
                try {
                    await this.updateTaskStatus(taskId, newStatus);
                    showAlert('Tarea actualizada', 'success');
                    this.renderTasksList();
                } catch (error) {
                    showAlert(error.message, 'error');
                }
            });
        });

        document.querySelectorAll('.btn-delete-task').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const taskId = e.target.dataset.id;
                if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
                    try {
                        await this.deleteTask(taskId);
                        showAlert('Tarea eliminada', 'success');
                        this.renderTasksList();
                    } catch (error) {
                        showAlert(error.message, 'error');
                    }
                }
            });
        });

        document.querySelectorAll('.btn-edit-task').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.dataset.id;
                console.log('Editar tarea:', taskId);
                // Implementar modal de edición
            });
        });
    }

    /**
     * Inicializa el formulario de creación de tareas
     */
    initCreateTaskForm(boardId) {
        const form = document.getElementById('create-task-form');
        if (!form) return;

        this.currentBoardId = boardId;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const titulo = document.getElementById('task-titulo').value;
            const descripcion = document.getElementById('task-descripcion').value;
            const prioridad = document.getElementById('task-prioridad').value;
            const fechaVencimiento = document.getElementById('task-fecha').value;

            hideError('task-mensaje');

            try {
                await this.createTask(titulo, descripcion, boardId, prioridad, fechaVencimiento);
                showAlert('Tarea creada exitosamente', 'success');
                clearForm('create-task-form');
                
                await this.fetchTasks(boardId);
                this.renderTasksList();
            } catch (error) {
                showError('task-mensaje', error.message);
            }
        });
    }

    /**
     * Formatea el label de un estado
     */
    formatStatusLabel(status) {
        const labels = {
            'pendiente': 'Pendiente',
            'en_progreso': 'En Progreso',
            'completada': 'Completada'
        };
        return labels[status] || status;
    }
}

export const tasksModule = new TasksModule();
export default tasksModule;
