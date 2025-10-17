import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../../src/components/layout/header';

// Mock de los componentes hijos
vi.mock('../../../src/components/carritoMenu', () => ({
    default: ({ show, handleClose, carritoItems }) => (
        show ? (
            <div data-testid="carrito-menu">
                <button onClick={handleClose}>Cerrar Carrito</button>
                <span data-testid="carrito-items-count">{carritoItems.length}</span>
            </div>
        ) : null
    )
}));

vi.mock('../../../src/components/loginModal', () => ({
    default: ({ show, handleClose }) => (
        show ? (
            <div data-testid="login-modal">
                <button onClick={handleClose}>Cerrar Login</button>
            </div>
        ) : null
    )
}));

vi.mock('../../../src/components/barraMenu', () => ({
    default: ({ show, onHide, onShowLogin, onShowCart }) => (
        show ? (
            <div data-testid="barra-menu">
                <button onClick={onHide}>Cerrar Menu</button>
                <button onClick={onShowLogin}>Abrir Login</button>
                <button onClick={onShowCart}>Abrir Carrito</button>
            </div>
        ) : null
    )
}));

// Mock de la imagen
vi.mock('../../../src/assets/images/principal/LogoTipo.png', () => ({
    default: 'logo-mock.png'
}));

const renderHeader = (props = {}) => {
    const defaultProps = {
        cartItems: [],
        onUpdateQuantity: vi.fn(),
        onRemoveItem: vi.fn(),
        ...props
    };

    return render(
        <BrowserRouter>
            <Header {...defaultProps} />
        </BrowserRouter>
    );
};

describe('Header Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Renderizado inicial', () => {
        it('debe renderizar el componente correctamente', () => {
            renderHeader();
            expect(screen.getByRole('navigation')).toBeInTheDocument();
        });

        it('debe mostrar el logotipo', () => {
            renderHeader();
            const logo = screen.getByAltText('LogoTipo');
            expect(logo).toBeInTheDocument();
            expect(logo).toHaveAttribute('width', '100');
        });

        it('debe mostrar el botón de menú móvil', () => {
            renderHeader();
            const menuBtn = screen.getByRole('button', { name: /abrir menú/i });
            expect(menuBtn).toBeInTheDocument();
        });

        it('debe mostrar los enlaces de navegación en el menú desktop', () => {
            renderHeader();
            expect(screen.getByText('Inicio')).toBeInTheDocument();
            expect(screen.getByText('Productos')).toBeInTheDocument();
            expect(screen.getByText('Blog')).toBeInTheDocument();
            expect(screen.getByText('Carrito')).toBeInTheDocument();
            expect(screen.getByText('Contacto')).toBeInTheDocument();
        });

        it('debe mostrar el icono de usuario', () => {
            renderHeader();
            const userIcon = document.querySelector('.bi-person-circle');
            expect(userIcon).toBeInTheDocument();
        });

        it('debe mostrar el icono del carrito', () => {
            renderHeader();
            const cartIcon = document.querySelector('.bi-cart3');
            expect(cartIcon).toBeInTheDocument();
        });
    });

    describe('Contador del carrito', () => {
        it('debe mostrar 0 cuando no hay items en el carrito', () => {
            renderHeader({ cartItems: [] });
            const badge = screen.getByText('0');
            expect(badge).toBeInTheDocument();
        });

        it('debe mostrar el número correcto de items en el carrito', () => {
            const items = [
                { id: 1, nombre: 'Producto 1', cantidad: 2 },
                { id: 2, nombre: 'Producto 2', cantidad: 1 },
                { id: 3, nombre: 'Producto 3', cantidad: 1 }
            ];
            renderHeader({ cartItems: items });
            const badge = screen.getByText('3');
            expect(badge).toBeInTheDocument();
        });

        it('debe actualizar el contador cuando cambian los items del carrito', () => {
            const { rerender } = renderHeader({ cartItems: [] });
            expect(screen.getByText('0')).toBeInTheDocument();

            const newItems = [{ id: 1, nombre: 'Producto 1', cantidad: 1 }];
            rerender(
                <BrowserRouter>
                    <Header cartItems={newItems} onUpdateQuantity={vi.fn()} onRemoveItem={vi.fn()} />
                </BrowserRouter>
            );
            expect(screen.getByText('1')).toBeInTheDocument();
        });
    });

    describe('Funcionalidad del menú móvil', () => {
        it('debe abrir el menú móvil al hacer clic en el botón', () => {
            renderHeader();
            const menuBtn = screen.getByRole('button', { name: /abrir menú/i });
            
            fireEvent.click(menuBtn);
            
            expect(screen.getByTestId('barra-menu')).toBeInTheDocument();
        });

        it('debe cerrar el menú móvil al hacer clic en cerrar', () => {
            renderHeader();
            const menuBtn = screen.getByRole('button', { name: /abrir menú/i });
            
            fireEvent.click(menuBtn);
            expect(screen.getByTestId('barra-menu')).toBeInTheDocument();
            
            const closeBtn = screen.getByText('Cerrar Menu');
            fireEvent.click(closeBtn);
            
            expect(screen.queryByTestId('barra-menu')).not.toBeInTheDocument();
        });

        it('debe abrir el login desde el menú móvil', () => {
            renderHeader();
            const menuBtn = screen.getByRole('button', { name: /abrir menú/i });
            
            fireEvent.click(menuBtn);
            
            const loginBtn = screen.getByText('Abrir Login');
            fireEvent.click(loginBtn);
            
            expect(screen.getByTestId('login-modal')).toBeInTheDocument();
        });

        it('debe abrir el carrito desde el menú móvil', () => {
            renderHeader();
            const menuBtn = screen.getByRole('button', { name: /abrir menú/i });
            
            fireEvent.click(menuBtn);
            
            const cartBtn = screen.getByText('Abrir Carrito');
            fireEvent.click(cartBtn);
            
            expect(screen.getByTestId('carrito-menu')).toBeInTheDocument();
        });
    });

    describe('Funcionalidad del modal de login', () => {
        it('debe abrir el modal de login al hacer clic en el icono de usuario', () => {
            renderHeader();
            const userLinks = screen.getAllByRole('button');
            const userIcon = userLinks.find(link => link.querySelector('.bi-person-circle'));
            
            fireEvent.click(userIcon);
            
            expect(screen.getByTestId('login-modal')).toBeInTheDocument();
        });

        it('debe cerrar el modal de login al hacer clic en cerrar', () => {
            renderHeader();
            const userLinks = screen.getAllByRole('button');
            const userIcon = userLinks.find(link => link.querySelector('.bi-person-circle'));
            
            fireEvent.click(userIcon);
            expect(screen.getByTestId('login-modal')).toBeInTheDocument();
            
            const closeBtn = screen.getByText('Cerrar Login');
            fireEvent.click(closeBtn);
            
            expect(screen.queryByTestId('login-modal')).not.toBeInTheDocument();
        });
    });

    describe('Funcionalidad del carrito', () => {
        it('debe abrir el menú del carrito al hacer clic en el icono', () => {
            renderHeader();
            const cartButtons = screen.getAllByRole('button');
            const cartLink = cartButtons.find(btn => btn.querySelector('.bi-cart3'));
            
            fireEvent.click(cartLink);
            
            expect(screen.getByTestId('carrito-menu')).toBeInTheDocument();
        });

        it('debe cerrar el menú del carrito al hacer clic en cerrar', () => {
            renderHeader();
            const cartButtons = screen.getAllByRole('button');
            const cartLink = cartButtons.find(btn => btn.querySelector('.bi-cart3'));
            
            fireEvent.click(cartLink);
            expect(screen.getByTestId('carrito-menu')).toBeInTheDocument();
            
            const closeBtn = screen.getByText('Cerrar Carrito');
            fireEvent.click(closeBtn);
            
            expect(screen.queryByTestId('carrito-menu')).not.toBeInTheDocument();
        });

        it('debe pasar los items del carrito al componente CarritoMenu', () => {
            const items = [
                { id: 1, nombre: 'Producto 1', cantidad: 2 },
                { id: 2, nombre: 'Producto 2', cantidad: 1 }
            ];
            renderHeader({ cartItems: items });
            
            const cartButtons = screen.getAllByRole('button');
            const cartLink = cartButtons.find(btn => btn.querySelector('.bi-cart3'));
            fireEvent.click(cartLink);
            
            expect(screen.getByTestId('carrito-items-count')).toHaveTextContent('2');
        });

        it('debe pasar las funciones de callback al CarritoMenu', () => {
            const onUpdateQuantity = vi.fn();
            const onRemoveItem = vi.fn();
            
            renderHeader({ 
                cartItems: [{ id: 1, nombre: 'Producto 1', cantidad: 1 }],
                onUpdateQuantity,
                onRemoveItem 
            });
            
            const cartButtons = screen.getAllByRole('button');
            const cartLink = cartButtons.find(btn => btn.querySelector('.bi-cart3'));
            fireEvent.click(cartLink);
            
            expect(screen.getByTestId('carrito-menu')).toBeInTheDocument();
        });
    });

    describe('Navegación', () => {
        it('debe tener un enlace correcto a la página de inicio', () => {
            renderHeader();
            const inicioLink = screen.getByText('Inicio');
            expect(inicioLink.closest('a')).toHaveAttribute('href', '/');
        });

        it('debe tener un enlace correcto a la página de productos', () => {
            renderHeader();
            const productosLink = screen.getByText('Productos');
            expect(productosLink.closest('a')).toHaveAttribute('href', '/productos');
        });

        it('debe tener un enlace correcto a la página de blog', () => {
            renderHeader();
            const blogLink = screen.getByText('Blog');
            expect(blogLink.closest('a')).toHaveAttribute('href', '/blog');
        });

        it('debe tener un enlace correcto a la página de carrito', () => {
            renderHeader();
            const carritoLink = screen.getByText('Carrito');
            expect(carritoLink.closest('a')).toHaveAttribute('href', '/carrito');
        });

        it('debe tener un enlace al contacto con scroll', () => {
            renderHeader();
            const contactoLink = screen.getByText('Contacto');
            expect(contactoLink.closest('a')).toHaveAttribute('href', '#contacto');
        });
    });

    describe('Funcionalidad de scroll al contacto', () => {
        beforeEach(() => {
            // Mock del scrollTo
            window.scrollTo = vi.fn();
            
            // Mock del elemento contacto en el DOM
            const mockElement = document.createElement('div');
            mockElement.id = 'contacto';
            Object.defineProperty(mockElement, 'offsetTop', {
                value: 1000,
                writable: true
            });
            document.body.appendChild(mockElement);
        });

        it('debe hacer scroll al elemento de contacto al hacer clic', async () => {
            renderHeader();
            const contactoLink = screen.getByText('Contacto');
            
            fireEvent.click(contactoLink);
            
            await waitFor(() => {
                expect(window.scrollTo).toHaveBeenCalledWith({
                    top: 980, // offsetTop (1000) - 20
                    behavior: 'smooth'
                });
            }, { timeout: 200 });
        });

        it('debe prevenir el comportamiento por defecto del enlace de contacto', () => {
            renderHeader();
            const contactoLink = screen.getByText('Contacto');
            
            const event = new MouseEvent('click', { bubbles: true, cancelable: true });
            const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
            
            contactoLink.closest('a').dispatchEvent(event);
            
            expect(preventDefaultSpy).toHaveBeenCalled();
        });
    });

    describe('Estilos y clases CSS', () => {
        it('debe tener la clase de navegación de Bootstrap', () => {
            renderHeader();
            const navbar = screen.getByRole('navigation');
            expect(navbar).toHaveClass('navbar');
        });

        it('debe tener el tema oscuro (variant="dark")', () => {
            renderHeader();
            const navbar = screen.getByRole('navigation');
            expect(navbar).toHaveClass('navbar-dark');
        });

        it('debe tener el fondo verde (bg="success")', () => {
            renderHeader();
            const navbar = screen.getByRole('navigation');
            expect(navbar).toHaveClass('bg-success');
        });

        it('debe tener la clase shadow', () => {
            renderHeader();
            const navbar = screen.getByRole('navigation');
            expect(navbar).toHaveClass('shadow');
        });

        it('debe aplicar estilos inline al botón de menú móvil', () => {
            renderHeader();
            const menuBtn = screen.getByRole('button', { name: /abrir menú/i });
            
            const styles = window.getComputedStyle(menuBtn);
            expect(menuBtn).toHaveStyle('font-size: 2rem');
            expect(menuBtn).toHaveStyle('margin-right: 12px');
        });
    });

    describe('Props por defecto', () => {
        it('debe usar un array vacío como valor por defecto para cartItems', () => {
            render(
                <BrowserRouter>
                    <Header onUpdateQuantity={vi.fn()} onRemoveItem={vi.fn()} />
                </BrowserRouter>
            );
            
            const badge = screen.getByText('0');
            expect(badge).toBeInTheDocument();
        });
    });

    describe('Interacción entre modales', () => {
        it('debe poder abrir y cerrar múltiples modales secuencialmente', () => {
            renderHeader();
            
            // Abrir login
            const allButtons = screen.getAllByRole('button');
            const userIcon = allButtons.find(btn => btn.querySelector('.bi-person-circle'));
            fireEvent.click(userIcon);
            expect(screen.getByTestId('login-modal')).toBeInTheDocument();
            
            // Cerrar login
            fireEvent.click(screen.getByText('Cerrar Login'));
            expect(screen.queryByTestId('login-modal')).not.toBeInTheDocument();
            
            // Abrir carrito
            const buttons = screen.getAllByRole('button');
            const cartLink = buttons.find(btn => btn.querySelector('.bi-cart3'));
            fireEvent.click(cartLink);
            expect(screen.getByTestId('carrito-menu')).toBeInTheDocument();
            
            // Cerrar carrito
            fireEvent.click(screen.getByText('Cerrar Carrito'));
            expect(screen.queryByTestId('carrito-menu')).not.toBeInTheDocument();
        });

        it('debe poder tener el login y el carrito abiertos al mismo tiempo', () => {
            renderHeader();
            
            // Abrir login
            const allButtons = screen.getAllByRole('button');
            const userIcon = allButtons.find(btn => btn.querySelector('.bi-person-circle'));
            fireEvent.click(userIcon);
            
            // Abrir carrito
            const buttons = screen.getAllByRole('button');
            const cartLink = buttons.find(btn => btn.querySelector('.bi-cart3'));
            fireEvent.click(cartLink);
            
            // Ambos deben estar visibles
            expect(screen.getByTestId('login-modal')).toBeInTheDocument();
            expect(screen.getByTestId('carrito-menu')).toBeInTheDocument();
        });
    });

    describe('Accesibilidad', () => {
        it('debe tener un aria-label en el botón de menú móvil', () => {
            renderHeader();
            const menuBtn = screen.getByRole('button', { name: /abrir menú/i });
            expect(menuBtn).toHaveAttribute('aria-label', 'Abrir menú');
        });

        it('debe tener un alt text en el logotipo', () => {
            renderHeader();
            const logo = screen.getByAltText('LogoTipo');
            expect(logo).toHaveAttribute('title', 'HuertoHogar');
        });
    });
});
