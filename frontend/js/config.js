/**
 * Configuración global
 */

const CONFIG = {
    API_BASE_URL: 'http://localhost:8000',
    TOKENS: {
        ACCESS: 'token',
        REFRESH: 'refresh_token'
    },
    ROUTES: {
        LOGIN: '/login',
        REGISTER: '/register',
        BOARDS: '/boards',
        TASKS: '/tasks',
        PROFILE: '/profile'
    }
};

export default CONFIG;
