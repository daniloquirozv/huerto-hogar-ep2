import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BarraMenu from '../../src/components/barraMenu';

describe('BarraMenu Component', () => {
    let mockOnHide;
    let mockOnShowLogin;
    let mockOnShowCart;

    beforeEach(() => {
        mockOnHide = vi.fn();
        mockOnShowLogin = vi.fn();
        mockOnShowCart = vi.fn();
        
        // Mock de scrollTo
        window.scrollTo = vi.fn();
        
        // Mock de getElementById
        document.getElementById = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (show = true) => {
        return render(
            <BrowserRouter>
                <BarraMenu 
                    show={show}
                    onHide={mockOnHide}
                    onShowLogin={mockOnShowLogin}
                    onShowCart={mockOnShowCart}
                />
            </BrowserRouter>
        );
    };

    describe('Renderizado', () => {
        it('debe renderizar el componente cuando show es true', () => {
            renderComponent(true);
            expect(screen.getByText('Tienda Online')).toBeInTheDocument();
        });

        it('debe renderizar el logotipo', () => {
            renderComponent();
            const logo = screen.getByAltText('LogoTipo');
            expect(logo).toBeInTheDocument();
            expect(logo).toHaveAttribute('width', '110');
        });

        it('debe renderizar la descripción de la tienda', () => {
            renderComponent();
            expect(screen.getByText('Todo lo que necesitas para tu despensa, ¡y más!')).toBeInTheDocument();
        });

        it('debe renderizar la sección de productos', () => {
            renderComponent();
            expect(screen.getByText('Productos')).toBeInTheDocument();
            expect(screen.getByText('Miles de productos a tu alcance...')).toBeInTheDocument();
        });
    });

    describe('Sección de accesos', () => {
        it('debe renderizar el enlace "Mi perfil"', () => {
            renderComponent();
            expect(screen.getByText('Mi perfil')).toBeInTheDocument();
        });

        it('debe renderizar el enlace "Mi carrito"', () => {
            renderComponent();
            expect(screen.getByText('Mi carrito')).toBeInTheDocument();
        });

        it('debe renderizar el enlace "Configuración"', () => {
            renderComponent();
            expect(screen.getByText('Configuración')).toBeInTheDocument();
        });

        it('debe renderizar el enlace "Ofertas"', () => {
            renderComponent();
            expect(screen.getByText('Ofertas')).toBeInTheDocument();
        });

        it('debe llamar a onShowLogin y onHide cuando se hace clic en "Mi perfil"', () => {
            renderComponent();
            const miPerfilButton = screen.getByText('Mi perfil');
            fireEvent.click(miPerfilButton);
            
            expect(mockOnShowLogin).toHaveBeenCalledTimes(1);
            expect(mockOnHide).toHaveBeenCalledTimes(1);
        });

        it('debe llamar a onShowCart y onHide cuando se hace clic en "Mi carrito"', () => {
            renderComponent();
            const miCarritoButton = screen.getByText('Mi carrito');
            fireEvent.click(miCarritoButton);
            
            expect(mockOnShowCart).toHaveBeenCalledTimes(1);
            expect(mockOnHide).toHaveBeenCalledTimes(1);
        });
    });

    describe('Sección de ayuda y navegación', () => {
        it('debe renderizar el enlace "Blog"', () => {
            renderComponent();
            const blogLink = screen.getByText('Blog');
            expect(blogLink).toBeInTheDocument();
            expect(blogLink.closest('a')).toHaveAttribute('href', '/blog');
        });

        it('debe renderizar el enlace "Contacto"', () => {
            renderComponent();
            expect(screen.getByText('Contacto')).toBeInTheDocument();
        });

        it('debe renderizar el enlace "Ayuda"', () => {
            renderComponent();
            expect(screen.getByText('Ayuda')).toBeInTheDocument();
        });

        it('debe llamar a onHide cuando se hace clic en el enlace "Blog"', () => {
            renderComponent();
            const blogLink = screen.getByText('Blog');
            fireEvent.click(blogLink);
            
            expect(mockOnHide).toHaveBeenCalledTimes(1);
        });
    });

    describe('Funcionalidad de scroll a Contacto', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('debe llamar a onHide cuando se hace clic en "Contacto"', () => {
            renderComponent();
            const contactoButton = screen.getByText('Contacto');
            fireEvent.click(contactoButton);
            
            expect(mockOnHide).toHaveBeenCalledTimes(1);
        });

        it('debe hacer scroll al elemento contacto después de cerrar el menú', () => {
            const mockContactoElement = {
                offsetTop: 1000
            };
            
            document.getElementById = vi.fn().mockReturnValue(mockContactoElement);
            
            renderComponent();
            const contactoButton = screen.getByText('Contacto');
            fireEvent.click(contactoButton);
            
            // Avanzar el temporizador
            vi.advanceTimersByTime(300);
            
            expect(document.getElementById).toHaveBeenCalledWith('contacto');
            expect(window.scrollTo).toHaveBeenCalledWith({
                top: 980, // offsetTop - 20
                behavior: 'smooth'
            });
        });

        it('no debe hacer scroll si el elemento contacto no existe', () => {
            document.getElementById = vi.fn().mockReturnValue(null);
            
            renderComponent();
            const contactoButton = screen.getByText('Contacto');
            fireEvent.click(contactoButton);
            
            // Avanzar el temporizador
            vi.advanceTimersByTime(300);
            
            expect(document.getElementById).toHaveBeenCalledWith('contacto');
            expect(window.scrollTo).not.toHaveBeenCalled();
        });
    });

    describe('Botón de inicio de sesión', () => {
        it('debe renderizar el botón de inicio de sesión/registro', () => {
            renderComponent();
            const button = screen.getByText('Iniciar sesión o crea una cuenta');
            expect(button).toBeInTheDocument();
        });

        it('el botón debe ser un enlace a /login', () => {
            renderComponent();
            const button = screen.getByText('Iniciar sesión o crea una cuenta');
            expect(button.closest('a')).toHaveAttribute('href', '/login');
        });

        it('el botón debe tener la clase variant success', () => {
            renderComponent();
            const button = screen.getByText('Iniciar sesión o crea una cuenta');
            expect(button).toHaveClass('btn-success');
        });
    });

    describe('Manejo de body scroll', () => {
        it('debe agregar clase non-scroll al body cuando show es true', () => {
            renderComponent(true);
            expect(document.body.classList.contains('non-scroll')).toBe(true);
        });

        it('debe remover clase non-scroll al body cuando el componente se desmonta', () => {
            const { unmount } = renderComponent(true);
            unmount();
            expect(document.body.classList.contains('non-scroll')).toBe(false);
        });

        it('debe remover clase non-scroll cuando show cambia a false', () => {
            const { rerender } = render(
                <BrowserRouter>
                    <BarraMenu 
                        show={true}
                        onHide={mockOnHide}
                        onShowLogin={mockOnShowLogin}
                        onShowCart={mockOnShowCart}
                    />
                </BrowserRouter>
            );
            
            expect(document.body.classList.contains('non-scroll')).toBe(true);
            
            rerender(
                <BrowserRouter>
                    <BarraMenu 
                        show={false}
                        onHide={mockOnHide}
                        onShowLogin={mockOnShowLogin}
                        onShowCart={mockOnShowCart}
                    />
                </BrowserRouter>
            );
            
            expect(document.body.classList.contains('non-scroll')).toBe(false);
        });
    });

    describe('Iconos', () => {
        it('debe renderizar el icono de persona para "Mi perfil"', () => {
            renderComponent();
            const container = screen.getByText('Mi perfil').parentElement;
            const icon = container.querySelector('i.bi-person');
            expect(icon).toBeInTheDocument();
        });

        it('debe renderizar el icono de carrito para "Mi carrito"', () => {
            renderComponent();
            const container = screen.getByText('Mi carrito').parentElement;
            const icon = container.querySelector('i.bi-cart3');
            expect(icon).toBeInTheDocument();
        });

        it('debe renderizar el icono de configuración', () => {
            renderComponent();
            const container = screen.getByText('Configuración').parentElement;
            const icon = container.querySelector('i.bi-gear');
            expect(icon).toBeInTheDocument();
        });

        it('debe renderizar el icono de etiqueta para "Ofertas"', () => {
            renderComponent();
            const container = screen.getByText('Ofertas').parentElement;
            const icon = container.querySelector('i.bi-tag');
            expect(icon).toBeInTheDocument();
        });

        it('debe renderizar el icono de chat para "Blog"', () => {
            renderComponent();
            const container = screen.getByText('Blog').closest('a');
            const icon = container.querySelector('i.bi-chat');
            expect(icon).toBeInTheDocument();
        });

        it('debe renderizar el icono de teléfono para "Contacto"', () => {
            renderComponent();
            const container = screen.getByText('Contacto').parentElement;
            const icon = container.querySelector('i.bi-telephone');
            expect(icon).toBeInTheDocument();
        });

        it('debe renderizar el icono de ayuda', () => {
            renderComponent();
            const container = screen.getByText('Ayuda').parentElement;
            const icon = container.querySelector('i.bi-question-circle');
            expect(icon).toBeInTheDocument();
        });

        it('debe renderizar el icono chevron para "Contacto"', () => {
            renderComponent();
            const container = screen.getByText('Contacto').parentElement;
            const chevron = container.querySelector('i.bi-chevron-right');
            expect(chevron).toBeInTheDocument();
        });
    });

    describe('Estilos', () => {
        it('debe aplicar estilos correctos al contenedor de productos', () => {
            renderComponent();
            const productosContainer = screen.getByText('Productos').parentElement;
            expect(productosContainer).toHaveStyle({
                fontSize: '0.97rem',
                background: '#f2f8ff',
                borderRadius: '6px'
            });
        });

        it('debe aplicar cursor pointer a elementos interactivos', () => {
            renderComponent();
            const miPerfilContainer = screen.getByText('Mi perfil').parentElement;
            expect(miPerfilContainer).toHaveStyle({ cursor: 'pointer' });
        });

        it('debe aplicar estilos correctos al botón de inicio de sesión', () => {
            renderComponent();
            const button = screen.getByText('Iniciar sesión o crea una cuenta');
            expect(button).toHaveStyle({
                fontWeight: '600',
                fontSize: '1rem',
                borderRadius: '22px'
            });
        });
    });

    describe('Integración con Offcanvas', () => {
        it('debe renderizar el Offcanvas cuando show es true', () => {
            renderComponent(true);
            expect(screen.getByText('Tienda Online')).toBeInTheDocument();
            expect(screen.getByText('Mi perfil')).toBeInTheDocument();
        });

        it('debe renderizar el título con el logotipo', () => {
            renderComponent(true);
            const logo = screen.getByAltText('LogoTipo');
            expect(logo).toBeInTheDocument();
        });

        it('debe tener todas las secciones del menú', () => {
            renderComponent(true);
            expect(screen.getByText('Mi perfil')).toBeInTheDocument();
            expect(screen.getByText('Mi carrito')).toBeInTheDocument();
            expect(screen.getByText('Blog')).toBeInTheDocument();
            expect(screen.getByText('Contacto')).toBeInTheDocument();
        });

        it('debe renderizar el botón de inicio de sesión', () => {
            renderComponent(true);
            expect(screen.getByText('Iniciar sesión o crea una cuenta')).toBeInTheDocument();
        });
    });
});
