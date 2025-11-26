/**
 * Utilidades para decodificar y manejar JWT (JSON Web Tokens)
 */

/**
 * Decodificar un JWT sin verificar la firma
 * NOTA: Esto es solo para leer el payload, NO para validar el token
 * La validación debe hacerse en el backend
 * 
 * @param {string} token - Token JWT
 * @returns {Object|null} - Payload decodificado o null si falla
 */
export function decodeJWT(token) {
    if (!token || typeof token !== 'string') {
        console.warn('⚠️ Token inválido o vacío');
        return null;
    }

    try {
        // Un JWT tiene 3 partes separadas por puntos: header.payload.signature
        const parts = token.split('.');
        
        if (parts.length !== 3) {
            console.error('❌ Token JWT mal formado');
            return null;
        }

        // El payload es la segunda parte (índice 1)
        const payload = parts[1];
        
        // Decodificar de Base64URL a string
        const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        
        // Parsear el JSON
        const parsedPayload = JSON.parse(decodedPayload);
        
        console.log('✅ Token JWT decodificado exitosamente');
        return parsedPayload;
    } catch (error) {
        console.error('❌ Error al decodificar JWT:', error);
        return null;
    }
}

/**
 * Extraer información del usuario desde el token JWT
 * @param {string} token - Token JWT
 * @returns {Object} - Información del usuario extraída del token
 */
export function extractUserFromToken(token) {
    const payload = decodeJWT(token);
    
    if (!payload) {
        return null;
    }

    // Determinar el rol desde diferentes formatos
    let id_rol = null;
    let nombre_rol = null;

    // CASO 1: roles como string "ROLE_Administrador" o "ROLE_Cliente"
    if (payload.roles && typeof payload.roles === 'string') {
        if (payload.roles.includes('Administrador') || payload.roles.includes('ADMIN')) {
            id_rol = 1;
            nombre_rol = 'Administrador';
        } else if (payload.roles.includes('Cliente') || payload.roles.includes('USER')) {
            id_rol = 2;
            nombre_rol = 'Cliente';
        } else {
            // Intentar extraer el nombre después de ROLE_
            nombre_rol = payload.roles.replace('ROLE_', '');
            id_rol = nombre_rol === 'Administrador' ? 1 : 2;
        }
    }
    // CASO 2: rol_id o id_rol como número
    else if (payload.rol_id || payload.id_rol || payload.role) {
        id_rol = payload.rol_id || payload.id_rol || payload.role;
        nombre_rol = id_rol === 1 ? 'Administrador' : 'Cliente';
    }
    // CASO 3: authorities array (Spring Security)
    else if (payload.authorities && Array.isArray(payload.authorities)) {
        const hasAdminRole = payload.authorities.some(auth => 
            auth.includes('Administrador') || auth.includes('ADMIN')
        );
        id_rol = hasAdminRole ? 1 : 2;
        nombre_rol = hasAdminRole ? 'Administrador' : 'Cliente';
    }

    // Estructura común de JWT puede incluir diferentes nombres de campos
    const userInfo = {
        // ID del usuario - priorizar sub (estándar JWT)
        id: payload.sub || payload.id || payload.userId || payload.id_usuario,
        
        // Nombre - puede venir del email o de otros campos
        name: payload.name || payload.nombre || payload.username || (payload.sub ? payload.sub.split('@')[0] : null),
        
        // Email - priorizar sub si es email, sino buscar campo email
        email: payload.sub?.includes('@') ? payload.sub : (payload.email || payload.correo || payload.sub),
        
        // Rol con la estructura esperada
        rol: {
            id_rol: id_rol,
            nombre_rol: nombre_rol
        },
        
        // Otros campos comunes en JWT
        iat: payload.iat, // Issued At (fecha de creación)
        exp: payload.exp, // Expiration (fecha de expiración)
    };

    console.log('👤 Usuario extraído del token:', userInfo);
    return userInfo;
}

/**
 * Verificar si el token ha expirado
 * @param {string} token - Token JWT
 * @returns {boolean} - true si está expirado, false si sigue válido
 */
export function isTokenExpired(token) {
    const payload = decodeJWT(token);
    
    if (!payload || !payload.exp) {
        return true; // Si no tiene exp, consideramos que está expirado
    }

    // exp viene en segundos, Date.now() viene en milisegundos
    const expirationDate = payload.exp * 1000;
    const now = Date.now();
    
    const isExpired = now >= expirationDate;
    
    if (isExpired) {
        console.warn('⚠️ Token expirado');
    }
    
    return isExpired;
}

/**
 * Obtener tiempo restante hasta que expire el token
 * @param {string} token - Token JWT
 * @returns {number} - Segundos restantes o 0 si está expirado
 */
export function getTokenTimeRemaining(token) {
    const payload = decodeJWT(token);
    
    if (!payload || !payload.exp) {
        return 0;
    }

    const expirationDate = payload.exp * 1000;
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((expirationDate - now) / 1000));
    
    return remaining;
}

/**
 * Formatear tiempo restante en formato legible
 * @param {number} seconds - Segundos
 * @returns {string} - Formato "Xh Ym Zs"
 */
export function formatTimeRemaining(seconds) {
    if (seconds <= 0) return 'Expirado';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

/**
 * Debug completo del token en consola
 * @param {string} token - Token JWT
 */
export function debugToken(token) {
    console.log('🔐 Análisis del Token JWT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (!token) {
        console.log('❌ No hay token');
        return;
    }

    console.log('📝 Token:', token.substring(0, 50) + '...');
    
    const payload = decodeJWT(token);
    if (!payload) {
        console.log('❌ No se pudo decodificar el token');
        return;
    }

    console.log('\n📦 Payload completo:');
    console.table(payload);
    
    const userInfo = extractUserFromToken(token);
    if (userInfo) {
        console.log('\n👤 Usuario extraído:');
        console.table({
            'ID': userInfo.id,
            'Nombre': userInfo.name || 'No disponible',
            'Email': userInfo.email || 'No disponible',
            'Rol ID': userInfo.rol?.id_rol || 'No detectado',
            'Rol Nombre': userInfo.rol?.nombre_rol || 'No detectado',
            'Es Admin': userInfo.rol?.id_rol === 1 ? '✅ SÍ' : '❌ NO'
        });
    }

    const isExpired = isTokenExpired(token);
    const timeRemaining = getTokenTimeRemaining(token);
    
    console.log('\n⏱️ Estado del token:');
    console.table({
        'Expirado': isExpired ? '❌ Sí' : '✅ No',
        'Tiempo restante': formatTimeRemaining(timeRemaining),
        'Fecha creación': payload.iat ? new Date(payload.iat * 1000).toLocaleString() : 'N/A',
        'Fecha expiración': payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'N/A'
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

/**
 * Detectar tipo de estructura JWT del backend
 * @param {string} token - Token JWT
 * @returns {string} - Tipo detectado
 */
export function detectBackendType(token) {
    const payload = decodeJWT(token);
    
    if (!payload) return 'Desconocido';
    
    if (payload.roles && typeof payload.roles === 'string' && payload.roles.startsWith('ROLE_')) {
        return 'Spring Boot / Spring Security';
    } else if (payload.authorities && Array.isArray(payload.authorities)) {
        return 'Spring Security (authorities)';
    } else if (payload.rol_id || payload.id_rol) {
        return 'Backend Personalizado (rol_id)';
    } else if (payload.role) {
        return 'Backend Estándar (role)';
    }
    
    return 'Estructura no estándar';
}

/**
 * Exportar para uso en consola del navegador
 */
if (typeof window !== 'undefined') {
    window.debugJWT = {
        decode: decodeJWT,
        extractUser: extractUserFromToken,
        isExpired: isTokenExpired,
        timeRemaining: getTokenTimeRemaining,
        debug: debugToken,
        detectBackend: detectBackendType
    };
    
    console.log('🔐 Debug JWT cargado. Usa window.debugJWT para debugging');
}
