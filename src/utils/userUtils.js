/**
 * Utilidades para gestión de usuarios en localStorage
 * 
 * Ejecutar en la consola del navegador:
 * - Para ver usuarios: console.table(JSON.parse(localStorage.getItem('huerto_users_v1')))
 * - Para limpiar: localStorage.removeItem('huerto_users_v1')
 * - Para resetear: (copiar código completo de este archivo)
 */

// Clave de localStorage
const STORAGE_KEY = 'huerto_users_v1';

/**
 * Ver todos los usuarios actuales
 */
export function verUsuarios() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        console.log('No hay usuarios registrados');
        return [];
    }
    const users = JSON.parse(raw);
    console.table(users);
    return users;
}

/**
 * Limpiar todos los usuarios
 */
export function limpiarUsuarios() {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ Usuarios eliminados. Recarga la página para ver cambios.');
}

/**
 * Resetear a usuarios por defecto
 */
export function resetearUsuarios() {
    const defaultUsers = [
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
            rol: "Cliente",
            estado: "Activo",
            fechaRegistro: "2024-01-15"
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            password: "password456",
            rol: "Cliente",
            estado: "Activo",
            fechaRegistro: "2024-02-20"
        },
        {
            id: 3,
            name: "Admin User",
            email: "admin@example.com",
            password: "admin123",
            rol: "Administrador",
            estado: "Activo",
            fechaRegistro: "2024-01-01"
        }
    ];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    console.log('✅ Usuarios reseteados a valores por defecto. Recarga la página.');
    console.table(defaultUsers);
}

/**
 * Agregar usuario de prueba
 */
export function agregarUsuarioPrueba(nombre = 'Usuario Prueba') {
    const raw = localStorage.getItem(STORAGE_KEY);
    const users = raw ? JSON.parse(raw) : [];
    const maxId = users.reduce((max, u) => Math.max(max, u.id), 0);
    
    const newUser = {
        id: maxId + 1,
        name: nombre,
        email: `usuario${maxId + 1}@test.com`,
        password: 'test123',
        rol: 'Cliente',
        estado: 'Activo',
        fechaRegistro: new Date().toISOString().split('T')[0]
    };
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    console.log('✅ Usuario agregado:', newUser);
    return newUser;
}

/**
 * Exportar usuarios a JSON (para backup)
 */
export function exportarUsuarios() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        console.log('No hay usuarios para exportar');
        return;
    }
    
    const users = JSON.parse(raw);
    const dataStr = JSON.stringify(users, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `usuarios_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    console.log('✅ Archivo exportado');
}

/**
 * Importar usuarios desde JSON
 * @param {File} file - Archivo JSON con usuarios
 */
export function importarUsuarios(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const users = JSON.parse(e.target.result);
            if (!Array.isArray(users)) {
                console.error('❌ El archivo no contiene un array de usuarios');
                return;
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
            console.log('✅ Usuarios importados correctamente. Recarga la página.');
            console.table(users);
        } catch (error) {
            console.error('❌ Error al importar usuarios:', error);
        }
    };
    reader.readAsText(file);
}

/**
 * Estadísticas de usuarios
 */
export function estadisticasUsuarios() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        console.log('No hay usuarios registrados');
        return;
    }
    
    const users = JSON.parse(raw);
    const stats = {
        total: users.length,
        activos: users.filter(u => u.estado === 'Activo').length,
        inactivos: users.filter(u => u.estado === 'Inactivo').length,
        clientes: users.filter(u => u.rol === 'Cliente').length,
        administradores: users.filter(u => u.rol === 'Administrador').length
    };
    
    console.log('📊 Estadísticas de Usuarios:');
    console.table(stats);
    return stats;
}

// Hacer disponibles en window para uso en consola
if (typeof window !== 'undefined') {
    window.userUtils = {
        verUsuarios,
        limpiarUsuarios,
        resetearUsuarios,
        agregarUsuarioPrueba,
        exportarUsuarios,
        importarUsuarios,
        estadisticasUsuarios
    };
    
    console.log(`
    🔧 Utilidades de Usuario Cargadas
    ================================
    
    Usa estas funciones en la consola:
    
    - userUtils.verUsuarios()          Ver todos los usuarios
    - userUtils.estadisticasUsuarios() Ver estadísticas
    - userUtils.limpiarUsuarios()      Eliminar todos
    - userUtils.resetearUsuarios()     Resetear a valores por defecto
    - userUtils.agregarUsuarioPrueba() Agregar usuario de prueba
    - userUtils.exportarUsuarios()     Descargar backup JSON
    
    Ejemplo:
    > userUtils.verUsuarios()
    > userUtils.agregarUsuarioPrueba('Test User')
    `);
}
