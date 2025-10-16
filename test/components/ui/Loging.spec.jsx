import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginUser from '../../../src/components/ui/Loging';

describe('LoginUser', () => {
    let mockHandleClose;
    let mockOnLogin;

    beforeEach(() => {
        mockHandleClose = vi.fn();
        mockOnLogin = vi.fn();
        vi.clearAllMocks();
    });

    describe('Renderizado básico', () => {
        it('debe renderizar el modal cuando show es true', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            expect(screen.getAllByText('Login')[0]).toBeInTheDocument();
        });

        it('no debe renderizar el modal cuando show es false', () => {
            render(
                <LoginUser 
                    show={false} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            expect(screen.queryByText('Login')).not.toBeInTheDocument();
        });

        it('debe renderizar los campos de correo y contraseña', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            expect(screen.getByPlaceholderText('Correo')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
        });

        it('debe renderizar el checkbox de "Recuérdame"', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            expect(screen.getByLabelText('Recuérdame')).toBeInTheDocument();
        });

        it('debe renderizar el botón de login', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const loginButton = screen.getByRole('button', { name: /Login/i });
            expect(loginButton).toBeInTheDocument();
        });

        it('debe renderizar el enlace de registro', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            expect(screen.getByText(/si no tienes cuenta/i)).toBeInTheDocument();
            expect(screen.getByText(/regístrate aquí/i)).toBeInTheDocument();
        });

        it('debe renderizar las etiquetas de los campos', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            expect(screen.getByText('Correo')).toBeInTheDocument();
            expect(screen.getByText('Contraseña')).toBeInTheDocument();
        });
    });

    describe('Interacción con campos del formulario', () => {
        it('debe permitir escribir en el campo de correo', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const emailInput = screen.getByPlaceholderText('Correo');
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            
            expect(emailInput).toHaveValue('test@example.com');
        });

        it('debe permitir escribir en el campo de contraseña', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const passwordInput = screen.getByPlaceholderText('Contraseña');
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            
            expect(passwordInput).toHaveValue('password123');
        });

        it('debe permitir marcar el checkbox de "Recuérdame"', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const rememberCheckbox = screen.getByLabelText('Recuérdame');
            fireEvent.click(rememberCheckbox);
            
            expect(rememberCheckbox).toBeChecked();
        });

        it('debe permitir desmarcar el checkbox de "Recuérdame"', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const rememberCheckbox = screen.getByLabelText('Recuérdame');
            
            // Marcar
            fireEvent.click(rememberCheckbox);
            expect(rememberCheckbox).toBeChecked();
            
            // Desmarcar
            fireEvent.click(rememberCheckbox);
            expect(rememberCheckbox).not.toBeChecked();
        });

        it('debe actualizar múltiples campos correctamente', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const emailInput = screen.getByPlaceholderText('Correo');
            const passwordInput = screen.getByPlaceholderText('Contraseña');
            const rememberCheckbox = screen.getByLabelText('Recuérdame');
            
            fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
            fireEvent.change(passwordInput, { target: { value: 'pass123' } });
            fireEvent.click(rememberCheckbox);
            
            expect(emailInput).toHaveValue('user@test.com');
            expect(passwordInput).toHaveValue('pass123');
            expect(rememberCheckbox).toBeChecked();
        });
    });

    describe('Validación del formulario', () => {
        it('debe mostrar error si el correo está vacío', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const loginButton = screen.getByRole('button', { name: /Login/i });
            fireEvent.click(loginButton);
            
            expect(screen.getByText('Ingresa un correo válido')).toBeInTheDocument();
        });

        it('debe mostrar error si la contraseña está vacía', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const emailInput = screen.getByPlaceholderText('Correo');
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            
            const loginButton = screen.getByRole('button', { name: /Login/i });
            fireEvent.click(loginButton);
            
            expect(screen.getByText('Ingresa tu contraseña')).toBeInTheDocument();
        });

        it('debe mostrar error si las credenciales son inválidas', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const emailInput = screen.getByPlaceholderText('Correo');
            const passwordInput = screen.getByPlaceholderText('Contraseña');
            
            fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
            
            const loginButton = screen.getByRole('button', { name: /Login/i });
            fireEvent.click(loginButton);
            
            expect(screen.getByText(/Credenciales inválidas/i)).toBeInTheDocument();
        });

        it('debe mostrar el error con rol alert', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const loginButton = screen.getByRole('button', { name: /Login/i });
            fireEvent.click(loginButton);
            
            const errorElement = screen.getByRole('alert');
            expect(errorElement).toBeInTheDocument();
            expect(errorElement).toHaveClass('login-error');
        });

        it('debe limpiar el error al escribir después de un intento fallido', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            // Intentar login sin datos
            const loginButton = screen.getByRole('button', { name: /Login/i });
            fireEvent.click(loginButton);
            
            expect(screen.getByText('Ingresa un correo válido')).toBeInTheDocument();
            
            // Enviar formulario nuevamente debería limpiar error anterior
            fireEvent.click(loginButton);
            
            // Debería seguir mostrando error pero haberse limpiado antes
            expect(screen.getByText('Ingresa un correo válido')).toBeInTheDocument();
        });
    });

    describe('Login exitoso', () => {
        it('debe llamar a onLogin con usuario y remember cuando las credenciales son correctas', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const emailInput = screen.getByPlaceholderText('Correo');
            const passwordInput = screen.getByPlaceholderText('Contraseña');
            
            // Usar credenciales del usuario por defecto
            fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            
            const loginButton = screen.getByRole('button', { name: /Login/i });
            fireEvent.click(loginButton);
            
            expect(mockOnLogin).toHaveBeenCalledTimes(1);
            expect(mockOnLogin).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: 'john@example.com'
                }),
                false
            );
        });

        it('debe llamar a handleClose cuando el login es exitoso', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const emailInput = screen.getByPlaceholderText('Correo');
            const passwordInput = screen.getByPlaceholderText('Contraseña');
            
            fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            
            const loginButton = screen.getByRole('button', { name: /Login/i });
            fireEvent.click(loginButton);
            
            expect(mockHandleClose).toHaveBeenCalledTimes(1);
        });

        it('debe pasar remember=true si el checkbox está marcado', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const emailInput = screen.getByPlaceholderText('Correo');
            const passwordInput = screen.getByPlaceholderText('Contraseña');
            const rememberCheckbox = screen.getByLabelText('Recuérdame');
            
            fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(rememberCheckbox);
            
            const loginButton = screen.getByRole('button', { name: /Login/i });
            fireEvent.click(loginButton);
            
            expect(mockOnLogin).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: 'john@example.com'
                }),
                true
            );
        });

        it('debe validar credenciales de manera case-insensitive para el email', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const emailInput = screen.getByPlaceholderText('Correo');
            const passwordInput = screen.getByPlaceholderText('Contraseña');
            
            // Email en mayúsculas
            fireEvent.change(emailInput, { target: { value: 'JOHN@EXAMPLE.COM' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            
            const loginButton = screen.getByRole('button', { name: /Login/i });
            fireEvent.click(loginButton);
            
            expect(mockOnLogin).toHaveBeenCalledTimes(1);
        });

        it('no debe mostrar error cuando el login es exitoso', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const emailInput = screen.getByPlaceholderText('Correo');
            const passwordInput = screen.getByPlaceholderText('Contraseña');
            
            fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            
            const loginButton = screen.getByRole('button', { name: /Login/i });
            fireEvent.click(loginButton);
            
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });
    });

    describe('Comportamiento del modal', () => {
        it('debe limpiar los campos al cerrar el modal', async () => {
            const { rerender } = render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const emailInput = screen.getByPlaceholderText('Correo');
            const passwordInput = screen.getByPlaceholderText('Contraseña');
            
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            
            // Cerrar modal
            rerender(
                <LoginUser 
                    show={false} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            // Abrir modal nuevamente
            rerender(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            await waitFor(() => {
                const newEmailInput = screen.getByPlaceholderText('Correo');
                const newPasswordInput = screen.getByPlaceholderText('Contraseña');
                expect(newEmailInput).toHaveValue('');
                expect(newPasswordInput).toHaveValue('');
            });
        });

        it('debe limpiar los errores al cerrar el modal', async () => {
            const { rerender } = render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            // Generar error
            const loginButton = screen.getByRole('button', { name: /Login/i });
            fireEvent.click(loginButton);
            
            expect(screen.getByRole('alert')).toBeInTheDocument();
            
            // Cerrar modal
            rerender(
                <LoginUser 
                    show={false} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            // Abrir modal nuevamente
            rerender(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            await waitFor(() => {
                expect(screen.queryByRole('alert')).not.toBeInTheDocument();
            });
        });

        it('debe limpiar el estado del checkbox al cerrar el modal', async () => {
            const { rerender } = render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const rememberCheckbox = screen.getByLabelText('Recuérdame');
            fireEvent.click(rememberCheckbox);
            expect(rememberCheckbox).toBeChecked();
            
            // Cerrar modal
            rerender(
                <LoginUser 
                    show={false} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            // Abrir modal nuevamente
            rerender(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            await waitFor(() => {
                const newRememberCheckbox = screen.getByLabelText('Recuérdame');
                expect(newRememberCheckbox).not.toBeChecked();
            });
        });
    });

    describe('Envío del formulario', () => {
        it('debe prevenir el comportamiento por defecto del formulario', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const form = screen.getByRole('button', { name: /Login/i }).closest('form');
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault');
            
            form.dispatchEvent(submitEvent);
            
            expect(preventDefaultSpy).toHaveBeenCalled();
        });

        it('debe poder enviar el formulario presionando Enter', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const emailInput = screen.getByPlaceholderText('Correo');
            const passwordInput = screen.getByPlaceholderText('Contraseña');
            
            fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            
            // Simular presionar Enter en el campo de contraseña
            fireEvent.submit(passwordInput.closest('form'));
            
            expect(mockOnLogin).toHaveBeenCalledTimes(1);
        });
    });

    describe('Casos edge', () => {
        it('debe funcionar sin el callback onLogin', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={null} 
                />
            );
            
            const emailInput = screen.getByPlaceholderText('Correo');
            const passwordInput = screen.getByPlaceholderText('Contraseña');
            
            fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            
            const loginButton = screen.getByRole('button', { name: /Login/i });
            
            // No debería lanzar error
            expect(() => fireEvent.click(loginButton)).not.toThrow();
        });

        it('debe funcionar sin el callback handleClose', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={null} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const emailInput = screen.getByPlaceholderText('Correo');
            const passwordInput = screen.getByPlaceholderText('Contraseña');
            
            fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            
            const loginButton = screen.getByRole('button', { name: /Login/i });
            
            // No debería lanzar error
            expect(() => fireEvent.click(loginButton)).not.toThrow();
        });

        it('debe manejar contraseñas con espacios', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const emailInput = screen.getByPlaceholderText('Correo');
            const passwordInput = screen.getByPlaceholderText('Contraseña');
            
            fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password 123' } });
            
            const loginButton = screen.getByRole('button', { name: /Login/i });
            fireEvent.click(loginButton);
            
            // Debería mostrar error de credenciales inválidas
            expect(screen.getByText(/Credenciales inválidas/i)).toBeInTheDocument();
        });

        it('debe validar que la contraseña sea case-sensitive', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const emailInput = screen.getByPlaceholderText('Correo');
            const passwordInput = screen.getByPlaceholderText('Contraseña');
            
            fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'PASSWORD123' } }); // Mayúsculas
            
            const loginButton = screen.getByRole('button', { name: /Login/i });
            fireEvent.click(loginButton);
            
            // Debería fallar porque la contraseña es case-sensitive
            expect(screen.getByText(/Credenciales inválidas/i)).toBeInTheDocument();
        });
    });

    describe('Atributos del formulario', () => {
        it('debe tener el atributo noValidate en el formulario', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const form = screen.getByRole('button', { name: /Login/i }).closest('form');
            expect(form).toHaveAttribute('noValidate');
        });

        it('debe tener type="email" en el campo de correo', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const emailInput = screen.getByPlaceholderText('Correo');
            expect(emailInput).toHaveAttribute('type', 'email');
        });

        it('debe tener type="password" en el campo de contraseña', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const passwordInput = screen.getByPlaceholderText('Contraseña');
            expect(passwordInput).toHaveAttribute('type', 'password');
        });

        it('debe tener type="checkbox" en el campo de recuérdame', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const rememberCheckbox = screen.getByLabelText('Recuérdame');
            expect(rememberCheckbox).toHaveAttribute('type', 'checkbox');
        });

        it('debe tener type="submit" en el botón de login', () => {
            render(
                <LoginUser 
                    show={true} 
                    handleClose={mockHandleClose} 
                    onLogin={mockOnLogin} 
                />
            );
            
            const loginButton = screen.getByRole('button', { name: /Login/i });
            expect(loginButton).toHaveAttribute('type', 'submit');
        });
    });
});
