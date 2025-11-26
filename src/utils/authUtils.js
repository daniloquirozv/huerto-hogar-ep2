/**
 * Utilidades para gestión de autenticación y localStorage de usuarios
 */

const USER_STORAGE_KEY = 'huertoHogarUser';

/**
 * Guardar usuario en localStorage
 * @param {Object} user - Objeto del usuario a guardar
 */
export function saveUser(user) {
    try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        console.log('Usuario guardado en localStorage:', user);
    } catch (error) {
        console.error('Error al guardar usuario en localStorage:', error);
    }
}

/**
 * Obtener usuario desde localStorage
 * @returns {Object|null} - Usuario guardado o null si no existe
 */
export function getUser() {
    try {
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);
        return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
        console.error('Error al obtener usuario desde localStorage:', error);
        return null;
    }
}

/**
 * Eliminar usuario de localStorage (logout)
 */
export function removeUser() {
    try {
        localStorage.removeItem(USER_STORAGE_KEY);
        console.log('Usuario eliminado de localStorage');
    } catch (error) {
        console.error('Error al eliminar usuario de localStorage:', error);
    }
}

/**
 * Verificar si el usuario tiene rol de administrador
 * @param {Object} user - Objeto del usuario
 * @returns {boolean} - true si es administrador, false en caso contrario
 */
export function isAdmin(user) {
    return user?.rol?.id_rol === 1;
}

/**
 * Verificar si el usuario tiene rol de administrador (desde localStorage)
 * @returns {boolean} - true si es administrador, false en caso contrario
 */
export function isAdminFromStorage() {
    const user = getUser();
    return isAdmin(user);
}

/**
 * Verificar si hay un usuario autenticado
 * @returns {boolean} - true si hay usuario, false en caso contrario
 */
export function isAuthenticated() {
    const user = getUser();
    return user !== null;
}

/**
 * Obtener el token del usuario actual
 * @returns {string|null} - Token JWT o null si no existe
 */
export function getToken() {
    const user = getUser();
    return user?.token || null;
}

/**
 * Obtener información del usuario desde el token JWT
 * @returns {Object|null} - Información extraída del token o null
 */
export function getUserFromToken() {
    const token = getToken();
    if (!token) return null;

    try {
        // Importar dinámicamente para evitar problemas de circular dependency
        const jwtUtils = require('./jwtUtils');
        return jwtUtils.extractUserFromToken(token);
    } catch (error) {
        console.error('Error al extraer usuario del token:', error);
        return null;
    }
}

/**
 * Verificar si el token existe
 * @returns {boolean} - true si existe token, false en caso contrario
 */
export function hasToken() {
    return getToken() !== null;
}

/**
 * Validar que el usuario tiene sesión válida con token
 * @returns {boolean} - true si tiene sesión válida, false en caso contrario
 */
export function hasValidSession() {
    const user = getUser();
    // Verificar que exista usuario y tenga ID
    return !!(user && (user.id || user.id_usuario));
}

/**
 * Obtener nombre del usuario o "Invitado" si no está autenticado
 * @returns {string} - Nombre del usuario o "Invitado"
 */
export function getUserName() {
    const user = getUser();
    return user?.name || 'Invitado';
}

/**
 * Ver información del usuario actual en consola
 */
export function debugUser() {
    const user = getUser();
    if (user) {
        console.log('👤 Usuario actual:');
        console.table({
            'ID': user.id || user.id_usuario,
            'Nombre': user.name || user.nombre,
            'Email': user.email || user.correo,
            'Rol ID': user.rol?.id_rol,
            'Rol Nombre': user.rol?.nombre_rol,
            'Estado': user.estado?.nombre_estado,
            'Tiene Token': user.token ? '✅ Sí' : '❌ No'
        });
        console.log('🔐 Validaciones:');
        console.table({
            'Es Administrador': isAdmin(user) ? '✅ Sí' : '❌ No',
            'Sesión Válida': hasValidSession() ? '✅ Sí' : '❌ No',
            'Autenticado': isAuthenticated() ? '✅ Sí' : '❌ No',
            'Tiene Token': hasToken() ? '✅ Sí' : '❌ No'
        });

        // Si tiene token, decodificarlo y mostrar info
        if (user.token) {
            try {
                const jwtUtils = require('./jwtUtils');
                console.log('\n🔓 Información del Token JWT:');
                jwtUtils.debugToken(user.token);
            } catch (error) {
                console.warn('⚠️ No se pudo decodificar el token:', error);
            }
        }
    } else {
        console.log('❌ No hay usuario autenticado');
    }
}

/**
 * Exportar funciones para usar en consola del navegador
 */
if (typeof window !== 'undefined') {
    window.debugAuth = {
        verUsuario: debugUser,
        esAdmin: isAdminFromStorage,
        obtenerToken: getToken,
        obtenerUsuarioDeToken: getUserFromToken,
        sesionValida: hasValidSession,
        limpiarSesion: removeUser
    };
    
    console.log('🔧 Debug Auth cargado. Usa window.debugAuth para debugging');
    console.log('📝 Comandos disponibles:');
    console.log('  • window.debugAuth.verUsuario()');
    console.log('  • window.debugAuth.esAdmin()');
    console.log('  • window.debugAuth.obtenerToken()');
    console.log('  • window.debugAuth.obtenerUsuarioDeToken()');
    console.log('  • window.debugAuth.sesionValida()');
    console.log('  • window.debugAuth.limpiarSesion()');
}
