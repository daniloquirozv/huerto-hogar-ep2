import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addUser, getUsers } from '../src/data/user.js';
import {
    verUsuarios,
    limpiarUsuarios,
    resetearUsuarios,
    agregarUsuarioPrueba,
    estadisticasUsuarios
} from '../src/utils/userUtils.js';

describe('User Data Module', () => {
    // Mock de localStorage
    const localStorageMock = (() => {
        let store = {};
        return {
            getItem: vi.fn((key) => store[key] || null),
            setItem: vi.fn((key, value) => {
                store[key] = value.toString();
            }),
            removeItem: vi.fn((key) => {
                delete store[key];
            }),
            clear: vi.fn(() => {
                store = {};
            })
        };
    })();

    beforeEach(() => {
        // Resetear el mock de localStorage antes de cada prueba
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
            writable: true
        });
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    describe('addUser', () => {
        it('debe agregar un nuevo usuario con los datos proporcionados', () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'test123'
            };

            const newUser = addUser(userData);

            expect(newUser).toBeDefined();
            expect(newUser.name).toBe(userData.name);
            expect(newUser.email).toBe(userData.email);
            expect(newUser.password).toBe(userData.password);
        });

        it('debe asignar un ID incremental automáticamente', () => {
            const user1 = addUser({
                name: 'User 1',
                email: 'user1@test.com',
                password: 'pass1'
            });

            const user2 = addUser({
                name: 'User 2',
                email: 'user2@test.com',
                password: 'pass2'
            });

            expect(user1.id).toBeDefined();
            expect(user2.id).toBeDefined();
            expect(user2.id).toBeGreaterThan(user1.id);
        });

        it('debe asignar rol "Cliente" por defecto', () => {
            const user = addUser({
                name: 'Test User',
                email: 'test@example.com',
                password: 'test123'
            });

            expect(user.rol).toBe('Cliente');
        });

        it('debe asignar estado "Activo" por defecto', () => {
            const user = addUser({
                name: 'Test User',
                email: 'test@example.com',
                password: 'test123'
            });

            expect(user.estado).toBe('Activo');
        });

        it('debe asignar una fecha de registro', () => {
            const user = addUser({
                name: 'Test User',
                email: 'test@example.com',
                password: 'test123'
            });

            expect(user.fechaRegistro).toBeDefined();
            expect(typeof user.fechaRegistro).toBe('string');
            // Verificar formato de fecha (YYYY-MM-DD)
            expect(user.fechaRegistro).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });

        it('debe persistir el usuario en localStorage', () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'test123'
            };

            addUser(userData);

            expect(localStorageMock.setItem).toHaveBeenCalled();
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'huerto_users_v1',
                expect.any(String)
            );
        });

        it('debe agregar múltiples usuarios correctamente', () => {
            const users = [
                { name: 'User 1', email: 'user1@test.com', password: 'pass1' },
                { name: 'User 2', email: 'user2@test.com', password: 'pass2' },
                { name: 'User 3', email: 'user3@test.com', password: 'pass3' }
            ];

            const addedUsers = users.map(userData => addUser(userData));

            expect(addedUsers).toHaveLength(3);
            addedUsers.forEach((user, index) => {
                expect(user.name).toBe(users[index].name);
                expect(user.email).toBe(users[index].email);
            });
        });
    });

    describe('getUsers', () => {
        it('debe devolver un array de usuarios', () => {
            const users = getUsers();

            expect(Array.isArray(users)).toBe(true);
        });

        it('debe incluir usuarios agregados previamente', () => {
            const initialCount = getUsers().length;

            addUser({
                name: 'New User',
                email: 'new@example.com',
                password: 'newpass'
            });

            const users = getUsers();
            expect(users.length).toBe(initialCount + 1);
        });

        it('debe devolver usuarios con todas las propiedades requeridas', () => {
            addUser({
                name: 'Test User',
                email: 'test@example.com',
                password: 'test123'
            });

            const users = getUsers();
            const lastUser = users[users.length - 1];

            expect(lastUser).toHaveProperty('id');
            expect(lastUser).toHaveProperty('name');
            expect(lastUser).toHaveProperty('email');
            expect(lastUser).toHaveProperty('password');
            expect(lastUser).toHaveProperty('rol');
            expect(lastUser).toHaveProperty('estado');
            expect(lastUser).toHaveProperty('fechaRegistro');
        });
    });
});

describe('User Utilities Module', () => {
    const STORAGE_KEY = 'huerto_users_v1';
    
    // Mock de localStorage
    const localStorageMock = (() => {
        let store = {};
        return {
            getItem: vi.fn((key) => store[key] || null),
            setItem: vi.fn((key, value) => {
                store[key] = value.toString();
            }),
            removeItem: vi.fn((key) => {
                delete store[key];
            }),
            clear: vi.fn(() => {
                store = {};
            })
        };
    })();

    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
            writable: true
        });
        localStorageMock.clear();
        vi.clearAllMocks();
        
        // Mock de console.log y console.table
        vi.spyOn(console, 'log').mockImplementation(() => {});
        vi.spyOn(console, 'table').mockImplementation(() => {});
    });

    describe('verUsuarios', () => {
        it('debe devolver un array vacío si no hay usuarios', () => {
            const users = verUsuarios();

            expect(Array.isArray(users)).toBe(true);
            expect(users).toHaveLength(0);
            expect(console.log).toHaveBeenCalledWith('No hay usuarios registrados');
        });

        it('debe devolver los usuarios almacenados en localStorage', () => {
            const mockUsers = [
                { id: 1, name: 'User 1', email: 'user1@test.com' },
                { id: 2, name: 'User 2', email: 'user2@test.com' }
            ];
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUsers));

            const users = verUsuarios();

            expect(users).toHaveLength(2);
            expect(users).toEqual(mockUsers);
            expect(console.table).toHaveBeenCalledWith(mockUsers);
        });

        it('debe mostrar los usuarios en formato tabla', () => {
            const mockUsers = [
                { id: 1, name: 'User 1', email: 'user1@test.com' }
            ];
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUsers));

            verUsuarios();

            expect(console.table).toHaveBeenCalled();
        });
    });

    describe('limpiarUsuarios', () => {
        it('debe eliminar todos los usuarios de localStorage', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: 1 }]));

            limpiarUsuarios();

            expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
        });

        it('debe mostrar mensaje de confirmación', () => {
            limpiarUsuarios();

            expect(console.log).toHaveBeenCalledWith(
                expect.stringContaining('Usuarios eliminados')
            );
        });
    });

    describe('resetearUsuarios', () => {
        it('debe establecer usuarios por defecto en localStorage', () => {
            resetearUsuarios();

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                STORAGE_KEY,
                expect.any(String)
            );
        });

        it('debe crear exactamente 3 usuarios por defecto', () => {
            resetearUsuarios();

            const savedData = localStorageMock.setItem.mock.calls[0][1];
            const users = JSON.parse(savedData);

            expect(users).toHaveLength(3);
        });

        it('debe incluir un usuario administrador', () => {
            resetearUsuarios();

            const savedData = localStorageMock.setItem.mock.calls[0][1];
            const users = JSON.parse(savedData);

            const adminUser = users.find(u => u.rol === 'Administrador');
            expect(adminUser).toBeDefined();
            expect(adminUser.email).toBe('admin@example.com');
        });

        it('debe incluir usuarios cliente', () => {
            resetearUsuarios();

            const savedData = localStorageMock.setItem.mock.calls[0][1];
            const users = JSON.parse(savedData);

            const clientUsers = users.filter(u => u.rol === 'Cliente');
            expect(clientUsers.length).toBeGreaterThan(0);
        });

        it('todos los usuarios por defecto deben estar activos', () => {
            resetearUsuarios();

            const savedData = localStorageMock.setItem.mock.calls[0][1];
            const users = JSON.parse(savedData);

            users.forEach(user => {
                expect(user.estado).toBe('Activo');
            });
        });

        it('debe mostrar mensaje de confirmación y tabla', () => {
            resetearUsuarios();

            expect(console.log).toHaveBeenCalled();
            expect(console.table).toHaveBeenCalled();
        });
    });

    describe('agregarUsuarioPrueba', () => {
        it('debe agregar un usuario de prueba con nombre por defecto', () => {
            const newUser = agregarUsuarioPrueba();

            expect(newUser).toBeDefined();
            expect(newUser.name).toBe('Usuario Prueba');
        });

        it('debe agregar un usuario con nombre personalizado', () => {
            const customName = 'Usuario Personalizado';
            const newUser = agregarUsuarioPrueba(customName);

            expect(newUser.name).toBe(customName);
        });

        it('debe asignar un ID único incremental', () => {
            const user1 = agregarUsuarioPrueba('User 1');
            const user2 = agregarUsuarioPrueba('User 2');

            expect(user2.id).toBe(user1.id + 1);
        });

        it('debe generar un email único basado en el ID', () => {
            const user = agregarUsuarioPrueba();

            expect(user.email).toMatch(/^usuario\d+@test\.com$/);
        });

        it('debe asignar password de prueba', () => {
            const user = agregarUsuarioPrueba();

            expect(user.password).toBe('test123');
        });

        it('debe asignar rol "Cliente" por defecto', () => {
            const user = agregarUsuarioPrueba();

            expect(user.rol).toBe('Cliente');
        });

        it('debe asignar estado "Activo" por defecto', () => {
            const user = agregarUsuarioPrueba();

            expect(user.estado).toBe('Activo');
        });

        it('debe asignar la fecha actual de registro', () => {
            const user = agregarUsuarioPrueba();
            const today = new Date().toISOString().split('T')[0];

            expect(user.fechaRegistro).toBe(today);
        });

        it('debe persistir el usuario en localStorage', () => {
            agregarUsuarioPrueba();

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                STORAGE_KEY,
                expect.any(String)
            );
        });

        it('debe agregar el usuario al array existente', () => {
            const existingUsers = [
                { id: 1, name: 'Existing User' }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(existingUsers));

            agregarUsuarioPrueba();

            // Obtener la última llamada a setItem (la del agregarUsuarioPrueba)
            const lastCallIndex = localStorageMock.setItem.mock.calls.length - 1;
            const savedData = localStorageMock.setItem.mock.calls[lastCallIndex][1];
            const users = JSON.parse(savedData);

            expect(users).toHaveLength(2);
        });

        it('debe mostrar mensaje de confirmación con el usuario agregado', () => {
            agregarUsuarioPrueba();

            expect(console.log).toHaveBeenCalledWith(
                '✅ Usuario agregado:',
                expect.any(Object)
            );
        });
    });

    describe('estadisticasUsuarios', () => {
        it('debe mostrar mensaje si no hay usuarios', () => {
            estadisticasUsuarios();

            expect(console.log).toHaveBeenCalledWith('No hay usuarios registrados');
        });

        it('debe devolver estadísticas correctas con usuarios', () => {
            const mockUsers = [
                { id: 1, rol: 'Cliente', estado: 'Activo' },
                { id: 2, rol: 'Cliente', estado: 'Activo' },
                { id: 3, rol: 'Administrador', estado: 'Activo' },
                { id: 4, rol: 'Cliente', estado: 'Inactivo' }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUsers));

            const stats = estadisticasUsuarios();

            expect(stats).toEqual({
                total: 4,
                activos: 3,
                inactivos: 1,
                clientes: 3,
                administradores: 1
            });
        });

        it('debe contar correctamente usuarios activos e inactivos', () => {
            const mockUsers = [
                { id: 1, rol: 'Cliente', estado: 'Activo' },
                { id: 2, rol: 'Cliente', estado: 'Inactivo' },
                { id: 3, rol: 'Cliente', estado: 'Inactivo' }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUsers));

            const stats = estadisticasUsuarios();

            expect(stats.activos).toBe(1);
            expect(stats.inactivos).toBe(2);
        });

        it('debe contar correctamente clientes y administradores', () => {
            const mockUsers = [
                { id: 1, rol: 'Cliente', estado: 'Activo' },
                { id: 2, rol: 'Administrador', estado: 'Activo' },
                { id: 3, rol: 'Administrador', estado: 'Activo' }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUsers));

            const stats = estadisticasUsuarios();

            expect(stats.clientes).toBe(1);
            expect(stats.administradores).toBe(2);
        });

        it('debe mostrar las estadísticas en consola', () => {
            const mockUsers = [
                { id: 1, rol: 'Cliente', estado: 'Activo' }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUsers));

            estadisticasUsuarios();

            expect(console.log).toHaveBeenCalled();
            expect(console.table).toHaveBeenCalled();
        });

        it('debe retornar el total correcto de usuarios', () => {
            const mockUsers = [
                { id: 1, rol: 'Cliente', estado: 'Activo' },
                { id: 2, rol: 'Cliente', estado: 'Activo' },
                { id: 3, rol: 'Cliente', estado: 'Activo' }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUsers));

            const stats = estadisticasUsuarios();

            expect(stats.total).toBe(3);
        });

        it('debe manejar un array vacío de usuarios', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([]));

            const stats = estadisticasUsuarios();

            expect(stats).toEqual({
                total: 0,
                activos: 0,
                inactivos: 0,
                clientes: 0,
                administradores: 0
            });
        });
    });

    describe('Integración de funciones de utilidades', () => {
        it('debe poder resetear y luego ver usuarios', () => {
            resetearUsuarios();
            const users = verUsuarios();

            expect(users).toHaveLength(3);
        });

        it('debe poder agregar usuarios de prueba y ver estadísticas', () => {
            resetearUsuarios();
            agregarUsuarioPrueba('Test 1');
            agregarUsuarioPrueba('Test 2');

            const stats = estadisticasUsuarios();

            expect(stats.total).toBe(5); // 3 por defecto + 2 de prueba
        });

        it('debe poder limpiar y verificar que no hay usuarios', () => {
            resetearUsuarios();
            limpiarUsuarios();
            const users = verUsuarios();

            expect(users).toHaveLength(0);
        });
    });
});
