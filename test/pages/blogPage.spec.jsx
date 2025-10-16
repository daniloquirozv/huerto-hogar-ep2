import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BlogPage from '../../src/pages/blogPage';

// Mock de los componentes layout
vi.mock('../../src/components/layout/header', () => ({
    default: ({ cartItems = [], onUpdateQuantity, onRemoveItem }) => (
        <div data-testid="header-component">
            Header Component
            <span data-testid="cart-count">{cartItems.length}</span>
        </div>
    )
}));

vi.mock('../../src/components/layout/blog', () => ({
    default: () => <div data-testid="blog-component">Blog Component</div>
}));

vi.mock('../../src/components/layout/footer', () => ({
    default: () => <div data-testid="footer-component">Footer Component</div>
}));

// Helper para renderizar con router
const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('BlogPage', () => {
    const mockCartItems = [
        { id: 1, nombre: 'Producto 1', precio: 100, cantidad: 2 },
        { id: 2, nombre: 'Producto 2', precio: 200, cantidad: 1 }
    ];

    const mockOnUpdateQuantity = vi.fn();
    const mockOnRemoveItem = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Renderizado inicial', () => {
        it('debe renderizar correctamente la página del blog', () => {
            renderWithRouter(
                <BlogPage
                    cartItems={[]}
                    onUpdateQuantity={mockOnUpdateQuantity}
                    onRemoveItem={mockOnRemoveItem}
                />
            );

            expect(screen.getByTestId('header-component')).toBeInTheDocument();
            expect(screen.getByTestId('blog-component')).toBeInTheDocument();
            expect(screen.getByTestId('footer-component')).toBeInTheDocument();
        });

        it('debe renderizar todos los componentes en el orden correcto', () => {
            renderWithRouter(
                <BlogPage
                    cartItems={[]}
                    onUpdateQuantity={mockOnUpdateQuantity}
                    onRemoveItem={mockOnRemoveItem}
                />
            );

            // Verificar que los componentes principales existan
            expect(screen.getByTestId('header-component')).toBeInTheDocument();
            expect(screen.getByTestId('blog-component')).toBeInTheDocument();
            expect(screen.getByTestId('footer-component')).toBeInTheDocument();
        });
    });

    describe('Integración con Header', () => {
        it('debe pasar las props correctas al componente Header', () => {
            renderWithRouter(
                <BlogPage
                    cartItems={mockCartItems}
                    onUpdateQuantity={mockOnUpdateQuantity}
                    onRemoveItem={mockOnRemoveItem}
                />
            );

            const header = screen.getByTestId('header-component');
            expect(header).toBeInTheDocument();
            expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
        });

        it('debe renderizar Header con carrito vacío', () => {
            renderWithRouter(
                <BlogPage
                    cartItems={[]}
                    onUpdateQuantity={mockOnUpdateQuantity}
                    onRemoveItem={mockOnRemoveItem}
                />
            );

            expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
        });

        it('debe pasar la función onUpdateQuantity al Header', () => {
            renderWithRouter(
                <BlogPage
                    cartItems={mockCartItems}
                    onUpdateQuantity={mockOnUpdateQuantity}
                    onRemoveItem={mockOnRemoveItem}
                />
            );

            expect(screen.getByTestId('header-component')).toBeInTheDocument();
        });

        it('debe pasar la función onRemoveItem al Header', () => {
            renderWithRouter(
                <BlogPage
                    cartItems={mockCartItems}
                    onUpdateQuantity={mockOnUpdateQuantity}
                    onRemoveItem={mockOnRemoveItem}
                />
            );

            expect(screen.getByTestId('header-component')).toBeInTheDocument();
        });
    });

    describe('Integración con Blog', () => {
        it('debe renderizar el componente Blog', () => {
            renderWithRouter(
                <BlogPage
                    cartItems={[]}
                    onUpdateQuantity={mockOnUpdateQuantity}
                    onRemoveItem={mockOnRemoveItem}
                />
            );

            const blogComponent = screen.getByTestId('blog-component');
            expect(blogComponent).toBeInTheDocument();
            expect(blogComponent).toHaveTextContent('Blog Component');
        });

        it('debe renderizar Blog independientemente del estado del carrito', () => {
            renderWithRouter(
                <BlogPage
                    cartItems={mockCartItems}
                    onUpdateQuantity={mockOnUpdateQuantity}
                    onRemoveItem={mockOnRemoveItem}
                />
            );

            expect(screen.getByTestId('blog-component')).toBeInTheDocument();
        });
    });

    describe('Integración con Footer', () => {
        it('debe renderizar el componente Footer', () => {
            renderWithRouter(
                <BlogPage
                    cartItems={[]}
                    onUpdateQuantity={mockOnUpdateQuantity}
                    onRemoveItem={mockOnRemoveItem}
                />
            );

            const footerComponent = screen.getByTestId('footer-component');
            expect(footerComponent).toBeInTheDocument();
            expect(footerComponent).toHaveTextContent('Footer Component');
        });

        it('debe renderizar Footer al final de la página', () => {
            const { container } = renderWithRouter(
                <BlogPage
                    cartItems={[]}
                    onUpdateQuantity={mockOnUpdateQuantity}
                    onRemoveItem={mockOnRemoveItem}
                />
            );

            const components = container.querySelectorAll('[data-testid]');
            const lastComponent = components[components.length - 1];
            expect(lastComponent).toHaveAttribute('data-testid', 'footer-component');
        });
    });

    describe('Props opcionales y valores por defecto', () => {
        it('debe manejar cartItems vacío correctamente', () => {
            renderWithRouter(
                <BlogPage
                    cartItems={[]}
                    onUpdateQuantity={mockOnUpdateQuantity}
                    onRemoveItem={mockOnRemoveItem}
                />
            );

            expect(screen.getByTestId('header-component')).toBeInTheDocument();
            expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
        });

        it('debe renderizar correctamente sin items en el carrito', () => {
            renderWithRouter(
                <BlogPage
                    cartItems={[]}
                    onUpdateQuantity={mockOnUpdateQuantity}
                    onRemoveItem={mockOnRemoveItem}
                />
            );

            expect(screen.getByTestId('header-component')).toBeInTheDocument();
            expect(screen.getByTestId('blog-component')).toBeInTheDocument();
            expect(screen.getByTestId('footer-component')).toBeInTheDocument();
        });
    });

    describe('Estructura de la página', () => {
        it('debe renderizar la página con la estructura correcta', () => {
            const { container } = renderWithRouter(
                <BlogPage
                    cartItems={[]}
                    onUpdateQuantity={mockOnUpdateQuantity}
                    onRemoveItem={mockOnRemoveItem}
                />
            );

            // Verificar que el contenedor existe
            expect(container.firstChild).toBeInTheDocument();
        });

        it('debe tener exactamente tres componentes principales', () => {
            renderWithRouter(
                <BlogPage
                    cartItems={[]}
                    onUpdateQuantity={mockOnUpdateQuantity}
                    onRemoveItem={mockOnRemoveItem}
                />
            );

            expect(screen.getByTestId('header-component')).toBeInTheDocument();
            expect(screen.getByTestId('blog-component')).toBeInTheDocument();
            expect(screen.getByTestId('footer-component')).toBeInTheDocument();
        });
    });

    describe('Manejo de carrito con múltiples items', () => {
        it('debe manejar correctamente un carrito con varios productos', () => {
            const largeCart = [
                { id: 1, nombre: 'Producto 1', precio: 100, cantidad: 1 },
                { id: 2, nombre: 'Producto 2', precio: 200, cantidad: 2 },
                { id: 3, nombre: 'Producto 3', precio: 150, cantidad: 3 },
                { id: 4, nombre: 'Producto 4', precio: 300, cantidad: 1 },
            ];

            renderWithRouter(
                <BlogPage
                    cartItems={largeCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                    onRemoveItem={mockOnRemoveItem}
                />
            );

            expect(screen.getByTestId('cart-count')).toHaveTextContent('4');
        });

        it('debe actualizar correctamente cuando cambian los items del carrito', () => {
            const { rerender } = renderWithRouter(
                <BlogPage
                    cartItems={[mockCartItems[0]]}
                    onUpdateQuantity={mockOnUpdateQuantity}
                    onRemoveItem={mockOnRemoveItem}
                />
            );

            expect(screen.getByTestId('cart-count')).toHaveTextContent('1');

            rerender(
                <BrowserRouter>
                    <BlogPage
                        cartItems={mockCartItems}
                        onUpdateQuantity={mockOnUpdateQuantity}
                        onRemoveItem={mockOnRemoveItem}
                    />
                </BrowserRouter>
            );

            expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
        });
    });

    describe('Accesibilidad y semántica', () => {
        it('debe renderizar todos los componentes sin errores de consola', () => {
            const consoleSpy = vi.spyOn(console, 'error');

            renderWithRouter(
                <BlogPage
                    cartItems={mockCartItems}
                    onUpdateQuantity={mockOnUpdateQuantity}
                    onRemoveItem={mockOnRemoveItem}
                />
            );

            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it('debe mantener la estructura HTML válida', () => {
            const { container } = renderWithRouter(
                <BlogPage
                    cartItems={[]}
                    onUpdateQuantity={mockOnUpdateQuantity}
                    onRemoveItem={mockOnRemoveItem}
                />
            );

            expect(container.firstChild).toBeInTheDocument();
            expect(container.querySelector('[data-testid="header-component"]')).toBeInTheDocument();
            expect(container.querySelector('[data-testid="blog-component"]')).toBeInTheDocument();
            expect(container.querySelector('[data-testid="footer-component"]')).toBeInTheDocument();
        });
    });

    describe('Re-renderizado', () => {
        it('debe manejar múltiples re-renderizados sin problemas', () => {
            const { rerender } = renderWithRouter(
                <BlogPage
                    cartItems={[]}
                    onUpdateQuantity={mockOnUpdateQuantity}
                    onRemoveItem={mockOnRemoveItem}
                />
            );

            expect(screen.getByTestId('blog-component')).toBeInTheDocument();

            rerender(
                <BrowserRouter>
                    <BlogPage
                        cartItems={mockCartItems}
                        onUpdateQuantity={mockOnUpdateQuantity}
                        onRemoveItem={mockOnRemoveItem}
                    />
                </BrowserRouter>
            );

            expect(screen.getByTestId('blog-component')).toBeInTheDocument();
            expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
        });
    });
});
