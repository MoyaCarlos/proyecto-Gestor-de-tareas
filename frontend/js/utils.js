/**
 * Utilidades y funciones comunes
 */

/**
 * Valida que un email sea válido
 */
export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Valida que una contraseña cumpla requisitos mínimos
 */
export function isValidPassword(password) {
    // Mínimo 6 caracteres, al menos una mayúscula, una minúscula y un número
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(password);
}

/**
 * Valida un nombre de usuario
 */
export function isValidUsername(username) {
    // Mínimo 3 caracteres, solo letras, números y guiones bajos
    const regex = /^[a-zA-Z0-9_]{3,}$/;
    return username.length >= 3 && regex.test(username);
}

/**
 * Muestra un mensaje de error en rojo
 */
export function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerText = message;
        element.style.display = 'block';
        element.style.color = '#d32f2f';
        element.style.fontWeight = 'bold';
    }
}

/**
 * Oculta un mensaje de error
 */
export function hideError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
        element.innerText = '';
    }
}

/**
 * Muestra una alerta personalizada
 */
export function showAlert(message, type = 'info') {
    // Temporalmente usamos alert, pero se puede mejorar con un toast
    alert(`[${type.toUpperCase()}] ${message}`);
}

/**
 * Limpia un formulario
 */
export function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

/**
 * Obtiene los datos de un formulario como objeto
 */
export function getFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return null;
    
    const formData = new FormData(form);
    return Object.fromEntries(formData);
}

/**
 * Desabilita/habilita un botón
 */
export function setButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = isLoading;
        button.innerText = isLoading ? 'Cargando...' : 'Ingresar';
    }
}

/**
 * Crea un elemento DOM con clases
 */
export function createElement(tag, text = '', classes = []) {
    const element = document.createElement(tag);
    if (text) element.innerText = text;
    element.className = classes.join(' ');
    return element;
}
