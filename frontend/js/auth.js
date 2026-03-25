/**
 * Autenticación
 */

import { apiClient } from './api.js';
import { 
    showError, 
    hideError, 
    clearForm, 
    showAlert,
    isValidEmail,
    isValidUsername,
    isValidPassword
} from './utils.js';
import CONFIG from './config.js';

class AuthModule {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
    }

    /**
     * Inicializa el módulo verificando si hay sesión activa
     */
    async init() {
        const token = localStorage.getItem(CONFIG.TOKENS.ACCESS);
        if (token) {
            try {
                this.currentUser = await apiClient.getCurrentUser();
                this.isLoggedIn = true;
                return true;
            } catch (error) {
                // Token inválido o expirado (incorrecto o por tiempo)
                this.logout();
                return false;
            }
        }
        return false;
    }

    /**
     * Realiza el login
     */
    async login(username, password) {
        try {
            // Validación básica
            if (!username || !password) {
                throw new Error('Usuario y contraseña son requeridos');
            }

            const response = await apiClient.login(username, password);
            
            // Guarda el token
            localStorage.setItem(CONFIG.TOKENS.ACCESS, response.access_token);
            
            // Obtiene datos del usuario
            this.currentUser = await apiClient.getCurrentUser();
            this.isLoggedIn = true;

            return {
                success: true,
                user: this.currentUser
            };
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    /**
     * Realiza el registro
     */
    async register(username, email, password, nombre, confirmPassword) {
        try {
            // Validaciones
            if (!username || !email || !password || !nombre) {
                throw new Error('Todos los campos son requeridos');
            }

            if (!isValidUsername(username)) {
                throw new Error('Usuario debe tener mínimo 3 caracteres (letras, números, _)');
            }

            if (!isValidEmail(email)) {
                throw new Error('Email no válido');
            }

            if (!isValidPassword(password)) {
                throw new Error('Contraseña debe tener mínimo 6 caracteres con mayúscula, minúscula y número');
            }

            if (password !== confirmPassword) {
                throw new Error('Las contraseñas no coinciden');
            }

            const response = await apiClient.register(username, email, password, nombre);
            
            return {
                success: true,
                message: 'Registro exitoso. Por favor inicia sesión.',
                data: response
            };
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    }

    /**
     * Cierra la sesión
     */
    logout() {
        localStorage.removeItem(CONFIG.TOKENS.ACCESS);
        localStorage.removeItem(CONFIG.TOKENS.REFRESH);
        this.currentUser = null;
        this.isLoggedIn = false;
    }

    /**
     * Obtiene el usuario actual
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Verifica si el usuario está logueado
     */
    isAuthenticated() {
        return this.isLoggedIn && !!localStorage.getItem(CONFIG.TOKENS.ACCESS);
    }

    /**
     * Inicializa los event listeners del login
     */
    initLoginForm() {
        const loginForm = document.getElementById('login-form');
        if (!loginForm) return;

        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            hideError('login-mensaje');

            try {
                const result = await this.login(username, password);
                showAlert(`¡Bienvenido ${result.user.nombre}!`, 'success');
                clearForm('login-form');
                
                // Redirige a tableros (cuando esté implementado)
                window.location.hash = '#/boards';
            } catch (error) {
                showError('login-mensaje', error.message);
            }
        });
    }

    /**
     * Inicializa los event listeners del registro
     */
    initRegisterForm() {
        const registerForm = document.getElementById('register-form');
        if (!registerForm) return;

        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const nombre = document.getElementById('reg-nombre').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            hideError('register-mensaje');

            try {
                const result = await this.register(username, email, password, nombre, confirmPassword);
                showAlert(result.message, 'success');
                clearForm('register-form');
                
                // Redirige a login
                window.location.hash = '#/login';
            } catch (error) {
                showError('register-mensaje', error.message);
            }
        });
    }
}

export const authModule = new AuthModule();
export default authModule;
