import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
    verUsuarios,
    limpiarUsuarios,
    resetearUsuarios,
    agregarUsuarioPrueba,
    estadisticasUsuarios
} from '../../src/utils/userUtils';

const STORAGE_KEY = 'huerto_users_v1';

describe('userUtils', () => {
    // Mock de localStorage
    let localStorageMock;

    beforeEach(() => {
        // Crear un mock de localStorage
        localStorageMock = {
            data: {},
            getItem(key) {
                return this.data[key] || null;
            },
            setItem(key, value) {
                this.data[key] = value;
            },
            removeItem(key) {
                delete this.data[key];
            },
            clear() {
                this.data = {};
            }
        };

        // Reemplaza localStorage global
        global.localStorage = localStorageMock;

        // Mock de console.log, console.table
        vi.spyOn(console, 'log').mockImplementation(() => {});
        vi.spyOn(console, 'table').mockImplementation(() => {});
    });

    afterEach(() => {
        // Limpiar mocks
        vi.restoreAllMocks();
        localStorageMock.clear();
    });

    describe('verUsuarios', () => {
        it('debe retornar un array vacío si no hay usuarios', () => {
            const resultado = verUsuarios();
            expect(resultado).toEqual([]);
            expect(console.log).toHaveBeenCalledWith('No hay usuarios registrados');
        });

        it('debe retornar y mostrar los usuarios existentes', () => {
            const usuariosMock = [
                {
                    id: 1,
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'test123',
                    rol: 'Cliente',
                    estado: 'Activo',
                    fechaRegistro: '2024-01-01'
                }
            ];

            localStorage.setItem(STORAGE_KEY, JSON.stringify(usuariosMock));

            const resultado = verUsuarios();
            expect(resultado).toEqual(usuariosMock);
            expect(console.table).toHaveBeenCalledWith(usuariosMock);
        });

        it('debe parsear correctamente múltiples usuarios', () => {
            const usuariosMock = [
                { id: 1, name: 'User 1', email: 'user1@test.com', rol: 'Cliente' },
                { id: 2, name: 'User 2', email: 'user2@test.com', rol: 'Administrador' }
            ];

            localStorage.setItem(STORAGE_KEY, JSON.stringify(usuariosMock));

            const resultado = verUsuarios();
            expect(resultado).toHaveLength(2);
            expect(resultado[0].name).toBe('User 1');
            expect(resultado[1].name).toBe('User 2');
        });
    });

    describe('limpiarUsuarios', () => {
        it('debe eliminar todos los usuarios del localStorage', () => {
            const usuariosMock = [{ id: 1, name: 'Test' }];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(usuariosMock));

            expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();

            limpiarUsuarios();

            expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
            expect(console.log).toHaveBeenCalledWith(
                '✅ Usuarios eliminados. Recarga la página para ver cambios.'
            );
        });

        it('debe funcionar aunque no haya usuarios', () => {
            limpiarUsuarios();
            expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
        });
    });

    describe('resetearUsuarios', () => {
        it('debe crear 3 usuarios por defecto', () => {
            resetearUsuarios();

            const usuarios = JSON.parse(localStorage.getItem(STORAGE_KEY));
            expect(usuarios).toHaveLength(3);
        });

        it('debe crear usuarios con la estructura correcta', () => {
            resetearUsuarios();

            const usuarios = JSON.parse(localStorage.getItem(STORAGE_KEY));
            usuarios.forEach(usuario => {
                expect(usuario).toHaveProperty('id');
                expect(usuario).toHaveProperty('name');
                expect(usuario).toHaveProperty('email');
                expect(usuario).toHaveProperty('password');
                expect(usuario).toHaveProperty('rol');
                expect(usuario).toHaveProperty('estado');
                expect(usuario).toHaveProperty('fechaRegistro');
            });
        });

        it('debe incluir un administrador entre los usuarios por defecto', () => {
            resetearUsuarios();

            const usuarios = JSON.parse(localStorage.getItem(STORAGE_KEY));
            const admin = usuarios.find(u => u.rol === 'Administrador');
            
            expect(admin).toBeDefined();
            expect(admin.email).toBe('admin@example.com');
        });

        it('debe sobrescribir usuarios existentes', () => {
            const usuarioExistente = [{ id: 999, name: 'Usuario Viejo' }];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarioExistente));

            resetearUsuarios();

            const usuarios = JSON.parse(localStorage.getItem(STORAGE_KEY));
            expect(usuarios).toHaveLength(3);
            expect(usuarios.find(u => u.id === 999)).toBeUndefined();
        });

        it('debe mostrar mensaje de confirmación', () => {
            resetearUsuarios();

            expect(console.log).toHaveBeenCalledWith(
                '✅ Usuarios reseteados a valores por defecto. Recarga la página.'
            );
        });
    });

    describe('agregarUsuarioPrueba', () => {
        it('debe agregar un usuario cuando no hay usuarios existentes', () => {
            const nuevoUsuario = agregarUsuarioPrueba();

            expect(nuevoUsuario.id).toBe(1);
            expect(nuevoUsuario.name).toBe('Usuario Prueba');
            expect(nuevoUsuario.email).toBe('usuario1@test.com');
        });

        it('debe agregar un usuario con nombre personalizado', () => {
            const nombreCustom = 'Test Custom User';
            const nuevoUsuario = agregarUsuarioPrueba(nombreCustom);

            expect(nuevoUsuario.name).toBe(nombreCustom);
        });

        it('debe asignar un ID secuencial correcto', () => {
            const usuariosExistentes = [
                { id: 1, name: 'User 1' },
                { id: 3, name: 'User 3' },
                { id: 5, name: 'User 5' }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(usuariosExistentes));

            const nuevoUsuario = agregarUsuarioPrueba();

            expect(nuevoUsuario.id).toBe(6); // max(1,3,5) + 1
        });

        it('debe crear un usuario con rol Cliente y estado Activo', () => {
            const nuevoUsuario = agregarUsuarioPrueba();

            expect(nuevoUsuario.rol).toBe('Cliente');
            expect(nuevoUsuario.estado).toBe('Activo');
        });

        it('debe asignar una fecha de registro válida', () => {
            const nuevoUsuario = agregarUsuarioPrueba();

            // Verificar que la fecha tiene formato YYYY-MM-DD
            expect(nuevoUsuario.fechaRegistro).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });

        it('debe persistir el usuario en localStorage', () => {
            agregarUsuarioPrueba('Test User');

            const usuarios = JSON.parse(localStorage.getItem(STORAGE_KEY));
            expect(usuarios).toHaveLength(1);
            expect(usuarios[0].name).toBe('Test User');
        });

        it('debe agregar múltiples usuarios correctamente', () => {
            agregarUsuarioPrueba('Usuario 1');
            agregarUsuarioPrueba('Usuario 2');
            agregarUsuarioPrueba('Usuario 3');

            const usuarios = JSON.parse(localStorage.getItem(STORAGE_KEY));
            expect(usuarios).toHaveLength(3);
            expect(usuarios[0].id).toBe(1);
            expect(usuarios[1].id).toBe(2);
            expect(usuarios[2].id).toBe(3);
        });
    });

    describe('estadisticasUsuarios', () => {
        it('debe mostrar mensaje si no hay usuarios', () => {
            const resultado = estadisticasUsuarios();

            expect(resultado).toBeUndefined();
            expect(console.log).toHaveBeenCalledWith('No hay usuarios registrados');
        });

        it('debe calcular estadísticas correctamente con usuarios variados', () => {
            const usuariosMock = [
                { id: 1, rol: 'Cliente', estado: 'Activo' },
                { id: 2, rol: 'Cliente', estado: 'Activo' },
                { id: 3, rol: 'Administrador', estado: 'Activo' },
                { id: 4, rol: 'Cliente', estado: 'Inactivo' }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(usuariosMock));

            const stats = estadisticasUsuarios();

            expect(stats.total).toBe(4);
            expect(stats.activos).toBe(3);
            expect(stats.inactivos).toBe(1);
            expect(stats.clientes).toBe(3);
            expect(stats.administradores).toBe(1);
        });

        it('debe retornar ceros cuando todos los usuarios son del mismo tipo', () => {
            const usuariosMock = [
                { id: 1, rol: 'Cliente', estado: 'Activo' },
                { id: 2, rol: 'Cliente', estado: 'Activo' }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(usuariosMock));

            const stats = estadisticasUsuarios();

            expect(stats.total).toBe(2);
            expect(stats.activos).toBe(2);
            expect(stats.inactivos).toBe(0);
            expect(stats.clientes).toBe(2);
            expect(stats.administradores).toBe(0);
        });

        it('debe contar correctamente solo administradores', () => {
            const usuariosMock = [
                { id: 1, rol: 'Administrador', estado: 'Activo' },
                { id: 2, rol: 'Administrador', estado: 'Inactivo' }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(usuariosMock));

            const stats = estadisticasUsuarios();

            expect(stats.total).toBe(2);
            expect(stats.administradores).toBe(2);
            expect(stats.clientes).toBe(0);
        });

        it('debe mostrar el título de estadísticas', () => {
            const usuariosMock = [{ id: 1, rol: 'Cliente', estado: 'Activo' }];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(usuariosMock));

            estadisticasUsuarios();

            expect(console.log).toHaveBeenCalledWith('📊 Estadísticas de Usuarios:');
        });
    });
});
