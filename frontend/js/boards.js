/**
 * Tableros
 */

import { apiClient } from './api.js';
import { showError, hideError, showAlert, clearForm } from './utils.js';

class BoardsModule {
    constructor() {
        this.boards = [];
        this.currentBoard = null;
    }

    /**
     * Obtiene todos los tableros
     */
    async fetchBoards() {
        try {
            this.boards = await apiClient.getBoards();
            return this.boards;
        } catch (error) {
            console.error('Error al obtener tableros:', error);
            throw error;
        }
    }

    /**
     * Crea uno nuevo
     */
    async createBoard(nombre, descripcion = '') {
        try {
            if (!nombre) {
                throw new Error('El nombre del tablero es requerido');
            }

            const newBoard = await apiClient.createBoard(nombre, descripcion);
            this.boards.push(newBoard);
            return newBoard;
        } catch (error) {
            console.error('Error al crear tablero:', error);
            throw error;
        }
    }

    /**
     * Obtiene uno específico
     */
    async getBoard(boardId) {
        try {
            const board = await apiClient.getBoard(boardId);
            this.currentBoard = board;
            return board;
        } catch (error) {
            console.error('Error al obtener tablero:', error);
            throw error;
        }
    }

    /**
     * Actualiza un tablero
     */
    async updateBoard(boardId, nombre, descripcion = '') {
        try {
            const updated = await apiClient.updateBoard(boardId, nombre, descripcion);
            const index = this.boards.findIndex(b => b.id === boardId);
            if (index !== -1) {
                this.boards[index] = updated;
            }
            return updated;
        } catch (error) {
            console.error('Error al actualizar tablero:', error);
            throw error;
        }
    }

    /**
     * Elimina un tablero
     */
    async deleteBoard(boardId) {
        try {
            await apiClient.deleteBoard(boardId);
            this.boards = this.boards.filter(b => b.id !== boardId);
            return true;
        } catch (error) {
            console.error('Error al eliminar tablero:', error);
            throw error;
        }
    }

    /**
     * Renderiza la lista de tableros en el DOM
     */
    renderBoardsList(containerId = 'boards-list') {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (this.boards.length === 0) {
            container.innerHTML = '<p>No tienes tableros aún. Crea uno para empezar.</p>';
            return;
        }

        container.innerHTML = this.boards.map(board => `
            <div class="board-card" data-board-id="${board.id}">
                <h3>${board.nombre}</h3>
                <p>${board.descripcion || 'Sin descripción'}</p>
                <div class="board-actions">
                    <button class="btn-view" data-id="${board.id}">Ver</button>
                    <button class="btn-edit" data-id="${board.id}">Editar</button>
                    <button class="btn-delete" data-id="${board.id}">Eliminar</button>
                </div>
            </div>
        `).join('');

        // Agrega event listeners
        this.attachBoardsListeners();
    }

    /**
     * Agrega event listeners a los botones de tableros
     */
    attachBoardsListeners() {
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const boardId = e.target.dataset.id;
                window.location.hash = `#/board/${boardId}`;
            });
        });

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const boardId = e.target.dataset.id;
                // Modal de edición
                console.log('Editar tablero:', boardId);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const boardId = e.target.dataset.id;
                if (confirm('¿Estás seguro de que deseas eliminar este tablero?')) {
                    try {
                        await this.deleteBoard(boardId);
                        showAlert('Tablero eliminado', 'success');
                        await this.fetchBoards();
                        this.renderBoardsList();
                    } catch (error) {
                        showAlert(error.message, 'error');
                    }
                }
            });
        });
    }

    /**
     * Inicializa el formulario para crear tableros
     */
    initCreateBoardForm() {
        const form = document.getElementById('create-board-form');
        if (!form) return;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nombre = document.getElementById('board-nombre').value;
            const descripcion = document.getElementById('board-descripcion').value;

            hideError('board-mensaje');

            try {
                await this.createBoard(nombre, descripcion);
                showAlert('Tablero creado exitosamente', 'success');
                clearForm('create-board-form');
                
                await this.fetchBoards();
                this.renderBoardsList();
            } catch (error) {
                showError('board-mensaje', error.message);
            }
        });
    }
}

export const boardsModule = new BoardsModule();
export default boardsModule;
