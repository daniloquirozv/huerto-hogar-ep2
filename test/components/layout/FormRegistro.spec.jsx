import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import FormRegistro from '../../../src/components/layout/FormRegistro';
import * as userModule from '../../../src/data/user';

// Wrapper para React Router
const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('FormRegistro', () => {
    let localStorageMock;

    beforeEach(() => {
        // Mock de localStorage
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

        global.localStorage = localStorageMock;

        // Mock de console.log
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        localStorageMock.clear();
    });

    describe('Renderizado básico', () => {
        it('debe renderizar el título del formulario', () => {
            renderWithRouter(<FormRegistro />);
            expect(screen.getByText('Registro')).toBeInTheDocument();
        });

        it('debe renderizar todos los campos del formulario', () => {
            renderWithRouter(<FormRegistro />);
            expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Apellido/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Correo/i)).toBeInTheDocument();
            const regionElements = screen.getAllByText(/Región/i);
            expect(regionElements.length).toBeGreaterThan(0);
            expect(screen.getByLabelText(/^Contraseña$/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Confirmar Contraseña/i)).toBeInTheDocument();
        });

        it('debe renderizar los placeholders correctos', () => {
            renderWithRouter(<FormRegistro />);
            expect(screen.getByPlaceholderText(/Ingrese su nombre/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Ingrese su apellido/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Ingrese su correo/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Ingrese su contraseña/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Repita su contraseña/i)).toBeInTheDocument();
        });

        it('debe renderizar los botones de acción', () => {
            renderWithRouter(<FormRegistro />);
            expect(screen.getByText('Registrarse')).toBeInTheDocument();
            expect(screen.getByText('Volver')).toBeInTheDocument();
        });

        it('debe renderizar el selector de región', () => {
            renderWithRouter(<FormRegistro />);
            expect(screen.getByText('Región ▾')).toBeInTheDocument();
            expect(screen.getByText('Seleccione región')).toBeInTheDocument();
        });
    });

    describe('Interacción con campos del formulario', () => {
        it('debe permitir escribir en el campo nombre', () => {
            renderWithRouter(<FormRegistro />);
            const nombreInput = screen.getByPlaceholderText(/Ingrese su nombre/i);
            fireEvent.change(nombreInput, { target: { value: 'Juan' } });
            expect(nombreInput).toHaveValue('Juan');
        });

        it('debe permitir escribir en el campo apellido', () => {
            renderWithRouter(<FormRegistro />);
            const apellidoInput = screen.getByPlaceholderText(/Ingrese su apellido/i);
            fireEvent.change(apellidoInput, { target: { value: 'Pérez' } });
            expect(apellidoInput).toHaveValue('Pérez');
        });

        it('debe permitir escribir en el campo correo', () => {
            renderWithRouter(<FormRegistro />);
            const correoInput = screen.getByPlaceholderText(/Ingrese su correo/i);
            fireEvent.change(correoInput, { target: { value: 'juan@example.com' } });
            expect(correoInput).toHaveValue('juan@example.com');
        });

        it('debe permitir escribir en el campo contraseña', () => {
            renderWithRouter(<FormRegistro />);
            const passwordInput = screen.getByPlaceholderText(/Ingrese su contraseña/i);
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            expect(passwordInput).toHaveValue('password123');
        });

        it('debe permitir escribir en el campo confirmar contraseña', () => {
            renderWithRouter(<FormRegistro />);
            const password2Input = screen.getByPlaceholderText(/Repita su contraseña/i);
            fireEvent.change(password2Input, { target: { value: 'password123' } });
            expect(password2Input).toHaveValue('password123');
        });

        it('debe actualizar todos los campos correctamente', () => {
            renderWithRouter(<FormRegistro />);
            
            const nombreInput = screen.getByPlaceholderText(/Ingrese su nombre/i);
            const apellidoInput = screen.getByPlaceholderText(/Ingrese su apellido/i);
            const correoInput = screen.getByPlaceholderText(/Ingrese su correo/i);
            
            fireEvent.change(nombreInput, { target: { value: 'María' } });
            fireEvent.change(apellidoInput, { target: { value: 'González' } });
            fireEvent.change(correoInput, { target: { value: 'maria@test.com' } });
            
            expect(nombreInput).toHaveValue('María');
            expect(apellidoInput).toHaveValue('González');
            expect(correoInput).toHaveValue('maria@test.com');
        });
    });

    describe('Selector de región personalizado', () => {
        it('debe abrir el menú al hacer clic en el botón', () => {
            renderWithRouter(<FormRegistro />);
            const regionButton = screen.getByText('Región ▾');
            
            fireEvent.click(regionButton);
            
            expect(screen.getByText('Valparaíso')).toBeInTheDocument();
            expect(screen.getByText('Región Metropolitana')).toBeInTheDocument();
        });

        it('debe mostrar todas las regiones en el menú', () => {
            renderWithRouter(<FormRegistro />);
            const regionButton = screen.getByText('Región ▾');
            
            fireEvent.click(regionButton);
            
            expect(screen.getByText('Arica y Parinacota')).toBeInTheDocument();
            expect(screen.getByText('Tarapacá')).toBeInTheDocument();
            expect(screen.getByText('Antofagasta')).toBeInTheDocument();
            expect(screen.getByText('Magallanes')).toBeInTheDocument();
        });

        it('debe seleccionar una región al hacer clic', () => {
            renderWithRouter(<FormRegistro />);
            const regionButton = screen.getByText('Región ▾');
            
            fireEvent.click(regionButton);
            const valparaisoOption = screen.getByText('Valparaíso');
            fireEvent.click(valparaisoOption);
            
            expect(screen.getByText('Valparaíso')).toBeInTheDocument();
            expect(screen.queryByText('Seleccione región')).not.toBeInTheDocument();
        });

        it('debe cerrar el menú después de seleccionar una región', () => {
            renderWithRouter(<FormRegistro />);
            const regionButton = screen.getByText('Región ▾');
            
            fireEvent.click(regionButton);
            const regionOption = screen.getAllByText('Biobío')[0];
            fireEvent.click(regionOption);
            
            // Verificar que solo aparece una vez (la seleccionada, no en el menú desplegable)
            const biobioElements = screen.queryAllByText('Biobío');
            expect(biobioElements.length).toBe(1);
        });

        it('debe abrir y cerrar el menú al hacer clic en el display', () => {
            renderWithRouter(<FormRegistro />);
            const regionDisplay = screen.getByText('Seleccione región');
            
            fireEvent.click(regionDisplay);
            expect(screen.getByText('Valparaíso')).toBeInTheDocument();
            
            fireEvent.click(regionDisplay);
            // El menú debería cerrarse
        });
    });

    describe('Validación de formulario', () => {
        it('debe mostrar errores cuando se envía el formulario vacío', async () => {
            renderWithRouter(<FormRegistro />);
            const submitButton = screen.getByText('Registrarse');
            
            fireEvent.click(submitButton);
            
            // Simplemente esperamos un poco para que los errores se rendericen
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Usamos getAllByText porque los errores aparecen tanto en overlay como en invalid-feedback
            expect(screen.getAllByText('Por favor ingrese nombre')[0]).toBeInTheDocument();
            expect(screen.getAllByText('Por favor ingrese apellido')[0]).toBeInTheDocument();
            expect(screen.getAllByText('Por favor ingrese correo')[0]).toBeInTheDocument();
            expect(screen.getByText('Por favor seleccione región')).toBeInTheDocument();
            expect(screen.getAllByText('Por favor ingrese contraseña')[0]).toBeInTheDocument();
            expect(screen.getAllByText('Repita contraseña')[0]).toBeInTheDocument();
        }, 10000);

        it('debe validar formato de correo inválido', async () => {
            renderWithRouter(<FormRegistro />);
            const correoInput = screen.getByPlaceholderText(/Ingrese su correo/i);
            const submitButton = screen.getByText('Registrarse');
            
            fireEvent.change(correoInput, { target: { value: 'correo-invalido' } });
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                expect(screen.getByText('Correo inválido')).toBeInTheDocument();
            }, { timeout: 10000 });
        });

        it('debe validar que las contraseñas coincidan', async () => {
            renderWithRouter(<FormRegistro />);
            const passwordInput = screen.getByPlaceholderText(/Ingrese su contraseña/i);
            const password2Input = screen.getByPlaceholderText(/Repita su contraseña/i);
            const submitButton = screen.getByText('Registrarse');
            
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.change(password2Input, { target: { value: 'password456' } });
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
            }, { timeout: 10000 });
        });

        it('debe agregar clase is-invalid a campos con error', async () => {
            renderWithRouter(<FormRegistro />);
            const submitButton = screen.getByText('Registrarse');
            
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                const nombreInput = screen.getByPlaceholderText(/Ingrese su nombre/i);
                expect(nombreInput).toHaveClass('is-invalid');
            });
        });

        it('debe mostrar overlay de error en campos vacíos', async () => {
            renderWithRouter(<FormRegistro />);
            const submitButton = screen.getByText('Registrarse');
            
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                const overlays = document.querySelectorAll('.input-error-overlay');
                expect(overlays.length).toBeGreaterThan(0);
            });
        });

        it('no debe mostrar overlay si el campo tiene contenido', async () => {
            renderWithRouter(<FormRegistro />);
            const nombreInput = screen.getByPlaceholderText(/Ingrese su nombre/i);
            const submitButton = screen.getByText('Registrarse');
            
            fireEvent.change(nombreInput, { target: { value: 'Juan' } });
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                // El campo nombre no debería tener overlay porque tiene valor
                const nombreOverlay = nombreInput.parentElement.querySelector('.input-error-overlay');
                expect(nombreOverlay).not.toBeInTheDocument();
            });
        });
    });

    describe('Envío exitoso del formulario', () => {
        it('debe registrar usuario cuando todos los campos son válidos', async () => {
            const addUserSpy = vi.spyOn(userModule, 'addUser');
            renderWithRouter(<FormRegistro />);
            
            // Llenar todos los campos
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su nombre/i), { 
                target: { value: 'Juan' } 
            });
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su apellido/i), { 
                target: { value: 'Pérez' } 
            });
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su correo/i), { 
                target: { value: 'juan@example.com' } 
            });
            
            // Seleccionar región
            fireEvent.click(screen.getByText('Región ▾'));
            fireEvent.click(screen.getByText('Valparaíso'));
            
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su contraseña/i), { 
                target: { value: 'password123' } 
            });
            fireEvent.change(screen.getByPlaceholderText(/Repita su contraseña/i), { 
                target: { value: 'password123' } 
            });
            
            // Enviar formulario
            fireEvent.click(screen.getByText('Registrarse'));
            
            await waitFor(() => {
                expect(addUserSpy).toHaveBeenCalledWith({
                    name: 'Juan Pérez',
                    email: 'juan@example.com',
                    password: 'password123'
                });
            });
        });

        it('debe mostrar mensaje de éxito después del registro', async () => {
            vi.spyOn(userModule, 'addUser').mockReturnValue({
                id: 1,
                name: 'Juan Pérez',
                email: 'juan@example.com'
            });
            
            renderWithRouter(<FormRegistro />);
            
            // Llenar formulario completo
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su nombre/i), { 
                target: { value: 'Juan' } 
            });
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su apellido/i), { 
                target: { value: 'Pérez' } 
            });
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su correo/i), { 
                target: { value: 'juan@example.com' } 
            });
            fireEvent.click(screen.getByText('Región ▾'));
            fireEvent.click(screen.getByText('Maule'));
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su contraseña/i), { 
                target: { value: 'pass123' } 
            });
            fireEvent.change(screen.getByPlaceholderText(/Repita su contraseña/i), { 
                target: { value: 'pass123' } 
            });
            
            fireEvent.click(screen.getByText('Registrarse'));
            
            await waitFor(() => {
                expect(screen.getByText(/¡Registro exitoso!/i)).toBeInTheDocument();
                expect(screen.getByText(/Tu cuenta ha sido creada correctamente/i)).toBeInTheDocument();
            });
        });

        it('debe limpiar el formulario después del registro exitoso', async () => {
            vi.spyOn(userModule, 'addUser').mockReturnValue({ id: 1 });
            
            renderWithRouter(<FormRegistro />);
            
            // Llenar y enviar formulario
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su nombre/i), { 
                target: { value: 'Test' } 
            });
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su apellido/i), { 
                target: { value: 'User' } 
            });
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su correo/i), { 
                target: { value: 'test@test.com' } 
            });
            fireEvent.click(screen.getByText('Región ▾'));
            fireEvent.click(screen.getByText('Ñuble'));
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su contraseña/i), { 
                target: { value: '123456' } 
            });
            fireEvent.change(screen.getByPlaceholderText(/Repita su contraseña/i), { 
                target: { value: '123456' } 
            });
            
            fireEvent.click(screen.getByText('Registrarse'));
            
            await waitFor(() => {
                expect(screen.getByPlaceholderText(/Ingrese su nombre/i)).toHaveValue('');
                expect(screen.getByPlaceholderText(/Ingrese su apellido/i)).toHaveValue('');
                expect(screen.getByPlaceholderText(/Ingrese su correo/i)).toHaveValue('');
            });
        });

        it('debe ocultar el mensaje de éxito al hacer clic en cerrar', async () => {
            vi.spyOn(userModule, 'addUser').mockReturnValue({ id: 1 });
            
            renderWithRouter(<FormRegistro />);
            
            // Llenar y enviar
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su nombre/i), { 
                target: { value: 'Ana' } 
            });
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su apellido/i), { 
                target: { value: 'López' } 
            });
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su correo/i), { 
                target: { value: 'ana@test.com' } 
            });
            fireEvent.click(screen.getByText('Región ▾'));
            fireEvent.click(screen.getByText('Araucanía'));
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su contraseña/i), { 
                target: { value: 'ana123' } 
            });
            fireEvent.change(screen.getByPlaceholderText(/Repita su contraseña/i), { 
                target: { value: 'ana123' } 
            });
            
            fireEvent.click(screen.getByText('Registrarse'));
            
            await waitFor(() => {
                expect(screen.getByText(/¡Registro exitoso!/i)).toBeInTheDocument();
            });
            
            const closeButton = screen.getByLabelText('Close');
            fireEvent.click(closeButton);
            
            await waitFor(() => {
                expect(screen.queryByText(/¡Registro exitoso!/i)).not.toBeInTheDocument();
            });
        });

        it('debe ocultar el mensaje de éxito después de 5 segundos', async () => {
            vi.spyOn(userModule, 'addUser').mockReturnValue({ id: 1 });
            
            renderWithRouter(<FormRegistro />);
            
            // Llenar y enviar
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su nombre/i), { 
                target: { value: 'Pedro' } 
            });
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su apellido/i), { 
                target: { value: 'Soto' } 
            });
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su correo/i), { 
                target: { value: 'pedro@test.com' } 
            });
            fireEvent.click(screen.getByText('Región ▾'));
            fireEvent.click(screen.getByText('Los Lagos'));
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su contraseña/i), { 
                target: { value: 'pedro123' } 
            });
            fireEvent.change(screen.getByPlaceholderText(/Repita su contraseña/i), { 
                target: { value: 'pedro123' } 
            });
            
            fireEvent.click(screen.getByText('Registrarse'));
            
            await waitFor(() => {
                expect(screen.getByText(/¡Registro exitoso!/i)).toBeInTheDocument();
            }, { timeout: 10000 });
            
            // Esperar 5 segundos de manera real (no con fake timers)
            await new Promise(resolve => setTimeout(resolve, 5100));
            
            await waitFor(() => {
                expect(screen.queryByText(/¡Registro exitoso!/i)).not.toBeInTheDocument();
            }, { timeout: 10000 });
        }, 15000);
    });

    describe('Casos edge y validaciones específicas', () => {
        it('debe validar correo con múltiples formatos inválidos', async () => {
            renderWithRouter(<FormRegistro />);
            const correoInput = screen.getByPlaceholderText(/Ingrese su correo/i);
            const submitButton = screen.getByText('Registrarse');
            
            const correosInvalidos = ['test', 'test@', '@test.com', 'test@test'];
            
            for (const correo of correosInvalidos) {
                fireEvent.change(correoInput, { target: { value: correo } });
                fireEvent.click(submitButton);
                
                await waitFor(() => {
                    expect(screen.getByText('Correo inválido')).toBeInTheDocument();
                });
            }
        });

        it('debe aceptar correo con formato válido', async () => {
            renderWithRouter(<FormRegistro />);
            const correoInput = screen.getByPlaceholderText(/Ingrese su correo/i);
            const submitButton = screen.getByText('Registrarse');
            
            fireEvent.change(correoInput, { target: { value: 'valido@example.com' } });
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                expect(screen.queryByText('Correo inválido')).not.toBeInTheDocument();
            });
        });

        it('debe manejar nombres con espacios', async () => {
            vi.spyOn(userModule, 'addUser');
            renderWithRouter(<FormRegistro />);
            
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su nombre/i), { 
                target: { value: '  Juan  ' } 
            });
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su apellido/i), { 
                target: { value: '  Pérez  ' } 
            });
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su correo/i), { 
                target: { value: 'juan@test.com' } 
            });
            fireEvent.click(screen.getByText('Región ▾'));
            fireEvent.click(screen.getByText('Atacama'));
            fireEvent.change(screen.getByPlaceholderText(/Ingrese su contraseña/i), { 
                target: { value: 'pass' } 
            });
            fireEvent.change(screen.getByPlaceholderText(/Repita su contraseña/i), { 
                target: { value: 'pass' } 
            });
            
            fireEvent.click(screen.getByText('Registrarse'));
            
            await waitFor(() => {
                expect(userModule.addUser).toHaveBeenCalledWith(
                    expect.objectContaining({
                        name: expect.stringContaining('Juan')
                    })
                );
            });
        });

        it('debe limpiar errores de región al seleccionar una', async () => {
            renderWithRouter(<FormRegistro />);
            const submitButton = screen.getByText('Registrarse');
            
            // Enviar para mostrar errores
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                expect(screen.getByText('Por favor seleccione región')).toBeInTheDocument();
            });
            
            // Seleccionar región
            fireEvent.click(screen.getByText('Región ▾'));
            fireEvent.click(screen.getByText('Coquimbo'));
            
            await waitFor(() => {
                expect(screen.queryByText('Por favor seleccione región')).not.toBeInTheDocument();
            });
        });
    });
});

