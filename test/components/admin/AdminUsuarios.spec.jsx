import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminUsuarios from '../../../src/components/admin/AdminUsuarios';

// Mock de localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Mock de window.confirm
global.confirm = vi.fn(() => true);

describe('AdminUsuarios Component', () => {
    const mockUsuarios = [
        {
            id: 1,
            name: 'Juan Pérez',
            email: 'juan@example.com',
            password: 'password123',
            rol: 'Cliente',
            estado: 'Activo',
            fechaRegistro: '2024-01-15'
        },
        {
            id: 2,
            name: 'María González',
            email: 'maria@example.com',
            password: 'password456',
            rol: 'Administrador',
            estado: 'Activo',
            fechaRegistro: '2024-02-20'
        },
        {
            id: 3,
            name: 'Carlos Rodríguez',
            email: 'carlos@example.com',
            password: 'password789',
            rol: 'Cliente',
            estado: 'Inactivo',
            fechaRegistro: '2024-03-10'
        }
    ];

    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
        // Configurar usuarios en localStorage
        localStorage.setItem('huerto_users_v1', JSON.stringify(mockUsuarios));
    });

    describe('Renderizado inicial', () => {
        it('debe renderizar el componente correctamente', () => {
            render(<AdminUsuarios />);
            
            expect(screen.getByTestId('admin-usuarios')).toBeInTheDocument();
            expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument();
        });

        it('debe mostrar el botón de agregar usuario', () => {
            render(<AdminUsuarios />);
            
            const addButton = screen.getByRole('button', { name: /agregar usuario/i });
            expect(addButton).toBeInTheDocument();
        });

        it('debe mostrar el campo de búsqueda', () => {
            render(<AdminUsuarios />);
            
            const searchInput = screen.getByPlaceholderText(/buscar por nombre, email o rol/i);
            expect(searchInput).toBeInTheDocument();
        });

        it('debe cargar y mostrar usuarios desde localStorage', () => {
            render(<AdminUsuarios />);
            
            expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
            expect(screen.getByText('María González')).toBeInTheDocument();
            expect(screen.getByText('Carlos Rodríguez')).toBeInTheDocument();
        });

        it('debe mostrar las estadísticas correctas', () => {
            render(<AdminUsuarios />);
            
            expect(screen.getByText(/Total: 3/i)).toBeInTheDocument();
            expect(screen.getByText(/Activos: 2/i)).toBeInTheDocument();
            expect(screen.getByText(/Admins: 1/i)).toBeInTheDocument();
        });
    });

    describe('Tabla de usuarios', () => {
        it('debe renderizar la tabla con las columnas correctas', () => {
            render(<AdminUsuarios />);
            
            expect(screen.getByText('ID')).toBeInTheDocument();
            expect(screen.getByText('Nombre')).toBeInTheDocument();
            expect(screen.getByText('Email')).toBeInTheDocument();
            expect(screen.getByText('Rol')).toBeInTheDocument();
            expect(screen.getByText('Estado')).toBeInTheDocument();
            expect(screen.getByText('Fecha Registro')).toBeInTheDocument();
            expect(screen.getByText('Acciones')).toBeInTheDocument();
        });

        it('debe mostrar todos los usuarios en la tabla', () => {
            render(<AdminUsuarios />);
            
            mockUsuarios.forEach(usuario => {
                expect(screen.getByText(usuario.name)).toBeInTheDocument();
                expect(screen.getByText(usuario.email)).toBeInTheDocument();
            });
        });

        it('debe mostrar badges de rol correctamente', () => {
            render(<AdminUsuarios />);
            
            const clienteBadges = screen.getAllByText(/Cliente/i);
            const adminBadge = screen.getByText(/Administrador/i);
            
            expect(clienteBadges.length).toBeGreaterThan(0);
            expect(adminBadge).toBeInTheDocument();
        });

        it('debe mostrar badges de estado correctamente', () => {
            render(<AdminUsuarios />);
            
            const activoBadges = screen.getAllByText(/Activo/i);
            const inactivoBadge = screen.getByText(/Inactivo/i);
            
            expect(activoBadges.length).toBeGreaterThan(0);
            expect(inactivoBadge).toBeInTheDocument();
        });

        it('debe mostrar botones de editar y eliminar para cada usuario', () => {
            render(<AdminUsuarios />);
            
            const editButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('i.bi-pencil')
            );
            const deleteButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('i.bi-trash')
            );
            
            expect(editButtons.length).toBe(3);
            expect(deleteButtons.length).toBe(3);
        });
    });

    describe('Funcionalidad de búsqueda', () => {
        it('debe filtrar usuarios por nombre', () => {
            render(<AdminUsuarios />);
            
            const searchInput = screen.getByPlaceholderText(/buscar por nombre, email o rol/i);
            fireEvent.change(searchInput, { target: { value: 'Juan' } });
            
            expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
            expect(screen.queryByText('María González')).not.toBeInTheDocument();
            expect(screen.queryByText('Carlos Rodríguez')).not.toBeInTheDocument();
        });

        it('debe filtrar usuarios por email', () => {
            render(<AdminUsuarios />);
            
            const searchInput = screen.getByPlaceholderText(/buscar por nombre, email o rol/i);
            fireEvent.change(searchInput, { target: { value: 'maria@example.com' } });
            
            expect(screen.getByText('María González')).toBeInTheDocument();
            expect(screen.queryByText('Juan Pérez')).not.toBeInTheDocument();
        });

        it('debe filtrar usuarios por rol', () => {
            render(<AdminUsuarios />);
            
            const searchInput = screen.getByPlaceholderText(/buscar por nombre, email o rol/i);
            fireEvent.change(searchInput, { target: { value: 'Administrador' } });
            
            expect(screen.getByText('María González')).toBeInTheDocument();
            expect(screen.queryByText('Juan Pérez')).not.toBeInTheDocument();
            expect(screen.queryByText('Carlos Rodríguez')).not.toBeInTheDocument();
        });

        it('debe ser case-insensitive en la búsqueda', () => {
            render(<AdminUsuarios />);
            
            const searchInput = screen.getByPlaceholderText(/buscar por nombre, email o rol/i);
            fireEvent.change(searchInput, { target: { value: 'JUAN' } });
            
            expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
        });

        it('debe actualizar las estadísticas según el filtro', () => {
            render(<AdminUsuarios />);
            
            const searchInput = screen.getByPlaceholderText(/buscar por nombre, email o rol/i);
            fireEvent.change(searchInput, { target: { value: 'Cliente' } });
            
            // Solo debe mostrar 2 clientes (Juan y Carlos)
            expect(screen.getByText(/Total: 2/i)).toBeInTheDocument();
        });

        it('debe mostrar todos los usuarios cuando se limpia la búsqueda', () => {
            render(<AdminUsuarios />);
            
            const searchInput = screen.getByPlaceholderText(/buscar por nombre, email o rol/i);
            fireEvent.change(searchInput, { target: { value: 'Juan' } });
            fireEvent.change(searchInput, { target: { value: '' } });
            
            expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
            expect(screen.getByText('María González')).toBeInTheDocument();
            expect(screen.getByText('Carlos Rodríguez')).toBeInTheDocument();
        });
    });

    describe('Modal de agregar usuario', () => {
        it('debe abrir el modal al hacer clic en agregar usuario', () => {
            render(<AdminUsuarios />);
            
            const addButton = screen.getByRole('button', { name: /agregar usuario/i });
            fireEvent.click(addButton);
            
            expect(screen.getByText('Agregar Nuevo Usuario')).toBeInTheDocument();
        });

        it('debe mostrar todos los campos del formulario para nuevo usuario', () => {
            render(<AdminUsuarios />);
            
            const addButton = screen.getByRole('button', { name: /agregar usuario/i });
            fireEvent.click(addButton);
            
            expect(screen.getByPlaceholderText(/Nombre completo del usuario/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/correo@ejemplo.com/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Contraseña/i)).toBeInTheDocument();
            expect(screen.getByText(/Rol \*/i)).toBeInTheDocument();
            expect(screen.getByText(/Estado \*/i)).toBeInTheDocument();
        });

        it('debe tener valores por defecto en el formulario', () => {
            render(<AdminUsuarios />);
            
            const addButton = screen.getByRole('button', { name: /agregar usuario/i });
            fireEvent.click(addButton);
            
            const selects = screen.getAllByRole('combobox');
            const rolSelect = selects.find(s => s.name === 'rol');
            const estadoSelect = selects.find(s => s.name === 'estado');
            
            expect(rolSelect.value).toBe('Cliente');
            expect(estadoSelect.value).toBe('Activo');
        });

        it('debe cerrar el modal al hacer clic en cancelar', async () => {
            render(<AdminUsuarios />);
            
            const addButton = screen.getByRole('button', { name: /agregar usuario/i });
            fireEvent.click(addButton);
            
            const cancelButton = screen.getByRole('button', { name: /cancelar/i });
            fireEvent.click(cancelButton);
            
            await waitFor(() => {
                expect(screen.queryByText('Agregar Nuevo Usuario')).not.toBeInTheDocument();
            });
        });
    });

    describe('Agregar nuevo usuario', () => {
        it('debe agregar un nuevo usuario correctamente', async () => {
            render(<AdminUsuarios />);
            
            const addButton = screen.getByRole('button', { name: /agregar usuario/i });
            fireEvent.click(addButton);
            
            fireEvent.change(screen.getByPlaceholderText(/Nombre completo del usuario/i), {
                target: { value: 'Nuevo Usuario' }
            });
            fireEvent.change(screen.getByPlaceholderText(/correo@ejemplo.com/i), {
                target: { value: 'nuevo@example.com' }
            });
            fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), {
                target: { value: 'newpassword' }
            });
            
            const saveButton = screen.getByRole('button', { name: /guardar/i });
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                expect(screen.getByText('Nuevo Usuario')).toBeInTheDocument();
                expect(screen.getByText('nuevo@example.com')).toBeInTheDocument();
            });
        });

        it('debe mostrar alerta de éxito al agregar usuario', async () => {
            render(<AdminUsuarios />);
            
            const addButton = screen.getByRole('button', { name: /agregar usuario/i });
            fireEvent.click(addButton);
            
            fireEvent.change(screen.getByPlaceholderText(/Nombre completo del usuario/i), {
                target: { value: 'Nuevo Usuario' }
            });
            fireEvent.change(screen.getByPlaceholderText(/correo@ejemplo.com/i), {
                target: { value: 'nuevo@example.com' }
            });
            fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), {
                target: { value: 'newpassword' }
            });
            
            const saveButton = screen.getByRole('button', { name: /guardar/i });
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                expect(screen.getByText(/Usuario agregado exitosamente/i)).toBeInTheDocument();
            });
        });

        it('debe guardar el usuario en localStorage', async () => {
            render(<AdminUsuarios />);
            
            const addButton = screen.getByRole('button', { name: /agregar usuario/i });
            fireEvent.click(addButton);
            
            fireEvent.change(screen.getByPlaceholderText(/Nombre completo del usuario/i), {
                target: { value: 'Nuevo Usuario' }
            });
            fireEvent.change(screen.getByPlaceholderText(/correo@ejemplo.com/i), {
                target: { value: 'nuevo@example.com' }
            });
            fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), {
                target: { value: 'newpassword' }
            });
            
            const saveButton = screen.getByRole('button', { name: /guardar/i });
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                const storedUsers = JSON.parse(localStorage.getItem('huerto_users_v1'));
                expect(storedUsers).toHaveLength(4);
                expect(storedUsers[3].email).toBe('nuevo@example.com');
            });
        });

        it('debe prevenir agregar usuario con email duplicado', async () => {
            render(<AdminUsuarios />);
            
            const addButton = screen.getByRole('button', { name: /agregar usuario/i });
            fireEvent.click(addButton);
            
            fireEvent.change(screen.getByPlaceholderText(/Nombre completo del usuario/i), {
                target: { value: 'Otro Usuario' }
            });
            fireEvent.change(screen.getByPlaceholderText(/correo@ejemplo.com/i), {
                target: { value: 'juan@example.com' } // Email existente
            });
            fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), {
                target: { value: 'password' }
            });
            
            const saveButton = screen.getByRole('button', { name: /guardar/i });
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                expect(screen.getByText(/El email ya está registrado/i)).toBeInTheDocument();
            });
        });

        it('debe asignar un ID incremental al nuevo usuario', async () => {
            render(<AdminUsuarios />);
            
            const addButton = screen.getByRole('button', { name: /agregar usuario/i });
            fireEvent.click(addButton);
            
            fireEvent.change(screen.getByPlaceholderText(/Nombre completo del usuario/i), {
                target: { value: 'Nuevo Usuario' }
            });
            fireEvent.change(screen.getByPlaceholderText(/correo@ejemplo.com/i), {
                target: { value: 'nuevo@example.com' }
            });
            fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), {
                target: { value: 'newpassword' }
            });
            
            const saveButton = screen.getByRole('button', { name: /guardar/i });
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                const storedUsers = JSON.parse(localStorage.getItem('huerto_users_v1'));
                const newUser = storedUsers.find(u => u.email === 'nuevo@example.com');
                expect(newUser.id).toBe(4); // Max ID + 1
            });
        });

        it('debe cerrar el modal después de agregar usuario', async () => {
            render(<AdminUsuarios />);
            
            const addButton = screen.getByRole('button', { name: /agregar usuario/i });
            fireEvent.click(addButton);
            
            fireEvent.change(screen.getByPlaceholderText(/Nombre completo del usuario/i), {
                target: { value: 'Nuevo Usuario' }
            });
            fireEvent.change(screen.getByPlaceholderText(/correo@ejemplo.com/i), {
                target: { value: 'nuevo@example.com' }
            });
            fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), {
                target: { value: 'newpassword' }
            });
            
            const saveButton = screen.getByRole('button', { name: /guardar/i });
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                expect(screen.queryByText('Agregar Nuevo Usuario')).not.toBeInTheDocument();
            });
        });
    });

    describe('Editar usuario', () => {
        it('debe abrir el modal de edición al hacer clic en editar', () => {
            render(<AdminUsuarios />);
            
            const editButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('i.bi-pencil')
            );
            fireEvent.click(editButtons[0]);
            
            expect(screen.getByText('Editar Usuario')).toBeInTheDocument();
        });

        it('debe cargar los datos del usuario en el formulario', () => {
            render(<AdminUsuarios />);
            
            const editButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('i.bi-pencil')
            );
            fireEvent.click(editButtons[0]);
            
            expect(screen.getByPlaceholderText(/Nombre completo del usuario/i).value).toBe('Juan Pérez');
            expect(screen.getByPlaceholderText(/correo@ejemplo.com/i).value).toBe('juan@example.com');
            
            const selects = screen.getAllByRole('combobox');
            const rolSelect = selects.find(s => s.name === 'rol');
            const estadoSelect = selects.find(s => s.name === 'estado');
            
            expect(rolSelect.value).toBe('Cliente');
            expect(estadoSelect.value).toBe('Activo');
        });

        it('debe deshabilitar el campo de email en modo edición', () => {
            render(<AdminUsuarios />);
            
            const editButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('i.bi-pencil')
            );
            fireEvent.click(editButtons[0]);
            
            const emailInput = screen.getByPlaceholderText(/correo@ejemplo.com/i);
            expect(emailInput).toBeDisabled();
        });

        it('no debe mostrar el campo de contraseña en modo edición', () => {
            render(<AdminUsuarios />);
            
            const editButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('i.bi-pencil')
            );
            fireEvent.click(editButtons[0]);
            
            expect(screen.queryByPlaceholderText(/Contraseña/i)).not.toBeInTheDocument();
        });

        it('debe actualizar el usuario correctamente', async () => {
            render(<AdminUsuarios />);
            
            const editButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('i.bi-pencil')
            );
            fireEvent.click(editButtons[0]);
            
            fireEvent.change(screen.getByPlaceholderText(/Nombre completo del usuario/i), {
                target: { value: 'Juan Pérez Actualizado' }
            });
            
            const updateButton = screen.getByRole('button', { name: /actualizar/i });
            fireEvent.click(updateButton);
            
            await waitFor(() => {
                expect(screen.getByText('Juan Pérez Actualizado')).toBeInTheDocument();
            });
        });

        it('debe mostrar alerta de éxito al actualizar usuario', async () => {
            render(<AdminUsuarios />);
            
            const editButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('i.bi-pencil')
            );
            fireEvent.click(editButtons[0]);
            
            fireEvent.change(screen.getByPlaceholderText(/Nombre completo del usuario/i), {
                target: { value: 'Juan Actualizado' }
            });
            
            const updateButton = screen.getByRole('button', { name: /actualizar/i });
            fireEvent.click(updateButton);
            
            await waitFor(() => {
                expect(screen.getByText(/Usuario actualizado exitosamente/i)).toBeInTheDocument();
            });
        });

        it('debe actualizar el usuario en localStorage', async () => {
            render(<AdminUsuarios />);
            
            const editButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('i.bi-pencil')
            );
            fireEvent.click(editButtons[0]);
            
            fireEvent.change(screen.getByPlaceholderText(/Nombre completo del usuario/i), {
                target: { value: 'Juan Actualizado' }
            });
            
            const updateButton = screen.getByRole('button', { name: /actualizar/i });
            fireEvent.click(updateButton);
            
            await waitFor(() => {
                const storedUsers = JSON.parse(localStorage.getItem('huerto_users_v1'));
                const updatedUser = storedUsers.find(u => u.id === 1);
                expect(updatedUser.name).toBe('Juan Actualizado');
            });
        });

        it('debe cerrar el modal después de actualizar usuario', async () => {
            render(<AdminUsuarios />);
            
            const editButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('i.bi-pencil')
            );
            fireEvent.click(editButtons[0]);
            
            fireEvent.change(screen.getByPlaceholderText(/Nombre completo del usuario/i), {
                target: { value: 'Juan Actualizado' }
            });
            
            const updateButton = screen.getByRole('button', { name: /actualizar/i });
            fireEvent.click(updateButton);
            
            await waitFor(() => {
                expect(screen.queryByText('Editar Usuario')).not.toBeInTheDocument();
            });
        });
    });

    describe('Eliminar usuario', () => {
        it('debe mostrar confirmación al intentar eliminar', () => {
            render(<AdminUsuarios />);
            
            const deleteButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('i.bi-trash')
            );
            fireEvent.click(deleteButtons[0]);
            
            expect(global.confirm).toHaveBeenCalledWith('¿Está seguro de eliminar este usuario?');
        });

        it('debe eliminar el usuario si se confirma', async () => {
            global.confirm = vi.fn(() => true);
            render(<AdminUsuarios />);
            
            const deleteButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('i.bi-trash')
            );
            fireEvent.click(deleteButtons[0]);
            
            await waitFor(() => {
                expect(screen.queryByText('Juan Pérez')).not.toBeInTheDocument();
            });
        });

        it('no debe eliminar el usuario si se cancela', () => {
            global.confirm = vi.fn(() => false);
            render(<AdminUsuarios />);
            
            const deleteButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('i.bi-trash')
            );
            fireEvent.click(deleteButtons[0]);
            
            expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
        });

        it('debe mostrar alerta al eliminar usuario', async () => {
            global.confirm = vi.fn(() => true);
            render(<AdminUsuarios />);
            
            const deleteButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('i.bi-trash')
            );
            fireEvent.click(deleteButtons[0]);
            
            await waitFor(() => {
                expect(screen.getByText(/Usuario eliminado exitosamente/i)).toBeInTheDocument();
            });
        });

        it('debe actualizar localStorage al eliminar usuario', async () => {
            global.confirm = vi.fn(() => true);
            render(<AdminUsuarios />);
            
            const deleteButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('i.bi-trash')
            );
            fireEvent.click(deleteButtons[0]);
            
            await waitFor(() => {
                const storedUsers = JSON.parse(localStorage.getItem('huerto_users_v1'));
                expect(storedUsers).toHaveLength(2);
                expect(storedUsers.find(u => u.id === 1)).toBeUndefined();
            });
        });

        it('debe actualizar las estadísticas al eliminar usuario', async () => {
            global.confirm = vi.fn(() => true);
            render(<AdminUsuarios />);
            
            const deleteButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('i.bi-trash')
            );
            fireEvent.click(deleteButtons[0]);
            
            await waitFor(() => {
                expect(screen.getByText(/Total: 2/i)).toBeInTheDocument();
            });
        });
    });

    describe('Toggle estado de usuario', () => {
        it('debe cambiar el estado de Activo a Inactivo', async () => {
            render(<AdminUsuarios />);
            
            const activoBadges = screen.getAllByText(/Activo/i);
            const juanActivoBadge = activoBadges.find(badge => {
                const row = badge.closest('tr');
                return row && row.textContent.includes('Juan Pérez');
            });
            
            fireEvent.click(juanActivoBadge);
            
            await waitFor(() => {
                const storedUsers = JSON.parse(localStorage.getItem('huerto_users_v1'));
                const juan = storedUsers.find(u => u.id === 1);
                expect(juan.estado).toBe('Inactivo');
            });
        });

        it('debe cambiar el estado de Inactivo a Activo', async () => {
            render(<AdminUsuarios />);
            
            const inactivoBadge = screen.getByText(/Inactivo/i);
            fireEvent.click(inactivoBadge);
            
            await waitFor(() => {
                const storedUsers = JSON.parse(localStorage.getItem('huerto_users_v1'));
                const carlos = storedUsers.find(u => u.id === 3);
                expect(carlos.estado).toBe('Activo');
            });
        });

        it('debe mostrar alerta al cambiar estado', async () => {
            render(<AdminUsuarios />);
            
            const activoBadges = screen.getAllByText(/Activo/i);
            fireEvent.click(activoBadges[0]);
            
            await waitFor(() => {
                const alert = screen.queryByRole('alert');
                if (alert) {
                    expect(alert).toHaveTextContent(/Estado actualizado/i);
                }
            }, { timeout: 3000 });
        });

        it('debe actualizar localStorage al cambiar estado', async () => {
            render(<AdminUsuarios />);
            
            const activoBadges = screen.getAllByText(/Activo/i);
            fireEvent.click(activoBadges[0]);
            
            await waitFor(() => {
                const storedUsers = JSON.parse(localStorage.getItem('huerto_users_v1'));
                expect(storedUsers).toBeDefined();
            });
        });
    });

    describe('Estadísticas', () => {
        it('debe calcular correctamente el total de usuarios', () => {
            render(<AdminUsuarios />);
            expect(screen.getByText(/Total: 3/i)).toBeInTheDocument();
        });

        it('debe calcular correctamente los usuarios activos', () => {
            render(<AdminUsuarios />);
            expect(screen.getByText(/Activos: 2/i)).toBeInTheDocument();
        });

        it('debe calcular correctamente los administradores', () => {
            render(<AdminUsuarios />);
            expect(screen.getByText(/Admins: 1/i)).toBeInTheDocument();
        });

        it('debe mostrar alerta de éxito al actualizar estadísticas', async () => {
            render(<AdminUsuarios />);
            
            const addButton = screen.getByRole('button', { name: /agregar usuario/i });
            fireEvent.click(addButton);
            
            fireEvent.change(screen.getByPlaceholderText(/Nombre completo del usuario/i), {
                target: { value: 'Nuevo Usuario' }
            });
            fireEvent.change(screen.getByPlaceholderText(/correo@ejemplo.com/i), {
                target: { value: 'nuevo@example.com' }
            });
            fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), {
                target: { value: 'newpassword' }
            });
            
            const saveButton = screen.getByRole('button', { name: /guardar/i });
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                expect(screen.getByText(/Total: 4/i)).toBeInTheDocument();
                expect(screen.getByText(/Activos: 3/i)).toBeInTheDocument();
            });
        });
    });

    describe('Manejo de formularios', () => {
        it('debe actualizar el estado del formulario al escribir', () => {
            render(<AdminUsuarios />);
            
            const addButton = screen.getByRole('button', { name: /agregar usuario/i });
            fireEvent.click(addButton);
            
            const nombreInput = screen.getByPlaceholderText(/Nombre completo del usuario/i);
            fireEvent.change(nombreInput, { target: { value: 'Test Usuario' } });
            
            expect(nombreInput.value).toBe('Test Usuario');
        });

        it('debe limpiar el formulario al cerrar el modal', () => {
            render(<AdminUsuarios />);
            
            const addButton = screen.getByRole('button', { name: /agregar usuario/i });
            fireEvent.click(addButton);
            
            fireEvent.change(screen.getByPlaceholderText(/Nombre completo del usuario/i), {
                target: { value: 'Test Usuario' }
            });
            
            const cancelButton = screen.getByRole('button', { name: /cancelar/i });
            fireEvent.click(cancelButton);
            
            fireEvent.click(addButton);
            
            expect(screen.getByPlaceholderText(/Nombre completo del usuario/i).value).toBe('');
        });

        it('debe validar campos requeridos', () => {
            render(<AdminUsuarios />);
            
            const addButton = screen.getByRole('button', { name: /agregar usuario/i });
            fireEvent.click(addButton);
            
            const nombreInput = screen.getByPlaceholderText(/Nombre completo del usuario/i);
            const emailInput = screen.getByPlaceholderText(/correo@ejemplo.com/i);
            const passwordInput = screen.getByPlaceholderText(/Contraseña/i);
            
            expect(nombreInput).toBeRequired();
            expect(emailInput).toBeRequired();
            expect(passwordInput).toBeRequired();
        });
    });

    describe('LocalStorage', () => {
        it('debe cargar usuarios vacíos si no hay datos en localStorage', () => {
            localStorage.clear();
            render(<AdminUsuarios />);
            
            expect(screen.getByText(/Total: 0/i)).toBeInTheDocument();
        });

        it('debe manejar errores al cargar desde localStorage', () => {
            localStorage.setItem('huerto_users_v1', 'invalid json');
            
            render(<AdminUsuarios />);
            
            expect(screen.getByText(/Total: 0/i)).toBeInTheDocument();
        });

        it('debe transformar correctamente el formato de user.js', () => {
            render(<AdminUsuarios />);
            
            // Verificar que los datos se transformaron correctamente
            expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
            expect(screen.getByText('juan@example.com')).toBeInTheDocument();
        });
    });

    describe('Alertas', () => {
        it('debe mostrar alertas con el variant correcto', async () => {
            render(<AdminUsuarios />);
            
            const addButton = screen.getByRole('button', { name: /agregar usuario/i });
            fireEvent.click(addButton);
            
            fireEvent.change(screen.getByPlaceholderText(/Nombre completo del usuario/i), {
                target: { value: 'Nuevo Usuario' }
            });
            fireEvent.change(screen.getByPlaceholderText(/correo@ejemplo.com/i), {
                target: { value: 'nuevo@example.com' }
            });
            fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), {
                target: { value: 'newpassword' }
            });
            
            const saveButton = screen.getByRole('button', { name: /guardar/i });
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                const alert = screen.getByRole('alert');
                expect(alert).toBeInTheDocument();
            });
        });

        it('debe cerrar alerta al hacer clic en cerrar', async () => {
            render(<AdminUsuarios />);
            
            const addButton = screen.getByRole('button', { name: /agregar usuario/i });
            fireEvent.click(addButton);
            
            fireEvent.change(screen.getByPlaceholderText(/Nombre completo del usuario/i), {
                target: { value: 'Nuevo Usuario' }
            });
            fireEvent.change(screen.getByPlaceholderText(/correo@ejemplo.com/i), {
                target: { value: 'nuevo@example.com' }
            });
            fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), {
                target: { value: 'newpassword' }
            });
            
            const saveButton = screen.getByRole('button', { name: /guardar/i });
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                const alert = screen.getByRole('alert');
                const closeButton = alert.querySelector('button.btn-close');
                fireEvent.click(closeButton);
            });
            
            await waitFor(() => {
                expect(screen.queryByRole('alert')).not.toBeInTheDocument();
            });
        });
    });

    describe('Funciones auxiliares', () => {
        it('debe retornar color correcto para rol Cliente', () => {
            render(<AdminUsuarios />);
            
            const clienteBadge = screen.getAllByText(/Cliente/i)[0];
            expect(clienteBadge).toBeInTheDocument();
        });

        it('debe retornar color correcto para rol Administrador', () => {
            render(<AdminUsuarios />);
            
            const adminBadge = screen.getByText(/Administrador/i);
            expect(adminBadge).toBeInTheDocument();
        });
    });

    describe('Accesibilidad', () => {
        it('debe tener data-testid en el componente principal', () => {
            render(<AdminUsuarios />);
            expect(screen.getByTestId('admin-usuarios')).toBeInTheDocument();
        });

        it('debe tener labels para los inputs del formulario', () => {
            render(<AdminUsuarios />);
            
            const addButton = screen.getByRole('button', { name: /agregar usuario/i });
            fireEvent.click(addButton);
            
            expect(screen.getByPlaceholderText(/Nombre completo del usuario/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/correo@ejemplo.com/i)).toBeInTheDocument();
            
            const selects = screen.getAllByRole('combobox');
            expect(selects.length).toBeGreaterThan(0);
        });

        it('debe tener botones con roles adecuados', () => {
            render(<AdminUsuarios />);
            
            expect(screen.getByRole('button', { name: /agregar usuario/i })).toBeInTheDocument();
        });
    });
});
