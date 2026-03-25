/**
 * Punto de entrada principal
 * Inicializa módulos y router
 */

import { router } from './router.js';
import { authModule } from './auth.js';

/**
 * Inicializa la aplicación
 */
async function initApp() {
    try {
        // Verifica si hay una sesión activa
        await authModule.init();

        // Inicializa el router
        router.init();

    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        window.location.hash = '#/login';
    }
}

// Inicia la aplicación cuando el DOM está listo
document.addEventListener('DOMContentLoaded', initApp);

// También iniciar si el DOM ya está listo (en caso de que este script cargue después)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
