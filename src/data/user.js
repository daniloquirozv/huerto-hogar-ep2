// Usuarios iniciales por defecto
const initialUsers = [
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
    }
];

const STORAGE_KEY = 'huerto_users_v1';

// Cargamos users desde localStorage si existen; sino usamos initialUsers
let users = (function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [...initialUsers];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        return [...initialUsers];
    } catch (err) {
        console.warn('No se pudo leer usuarios desde localStorage, usando por defecto', err);
        return [...initialUsers];
    }
})();

function persist() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (err) {
        console.warn('No se pudo persistir usuarios en localStorage', err);
    }
}

/**
 * addUser({ name, email, password }) -> nuevo usuario añadido y devuelto
 * - asigna un id incremental
 * - persiste en localStorage
 */
export function addUser({ name, email, password }) {
    const nextId = users.reduce((max, u) => Math.max(max, u.id || 0), 0) + 1;
    const user = { 
        id: nextId, 
        name, 
        email, 
        password,
        rol: 'Cliente', // Por defecto los nuevos usuarios son clientes
        estado: 'Activo', // Por defecto activos
        fechaRegistro: new Date().toISOString().split('T')[0] // Fecha actual
    };
    users.push(user);
    persist();
    return user;
}

export function getUsers() {
    return users;
}

// Mantener export por defecto (compatibilidad con imports existentes)
export default users;