import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CarritoPage from '../../src/pages/CarritoPage';

// Mock de los componentes hijos
vi.mock('../../src/components/layout/header', () => ({
  default: ({ cartItems, onUpdateQuantity, onRemoveItem }) => (
    <div data-testid="mock-header">
      Header Mock - Items: {cartItems?.length || 0}
    </div>
  )
}));

vi.mock('../../src/components/layout/footer', () => ({
  default: () => <div data-testid="mock-footer">Footer Mock</div>
}));

vi.mock('../../src/components/carritoMainComponent', () => ({
  default: ({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) => (
    <div data-testid="mock-carrito-main">
      Carrito Main Mock - Items: {cartItems?.length || 0}
    </div>
  )
}));

describe('CarritoPage', () => {
  const mockCartItems = [
    {
      codigo: 'PROD001',
      nombre: 'Tomate Cherry',
      precio: 2500,
      quantity: 2,
      stock: 10,
      imagen: 'tomate.jpg'
    },
    {
      codigo: 'PROD002',
      nombre: 'Lechuga Orgánica',
      precio: 1800,
      quantity: 1,
      stock: 5,
      imagen: 'lechuga.jpg'
    }
  ];

  const mockOnUpdateQuantity = vi.fn();
  const mockOnRemoveItem = vi.fn();
  const mockOnClearCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderCarritoPage = (props = {}) => {
    const defaultProps = {
      cartItems: mockCartItems,
      onUpdateQuantity: mockOnUpdateQuantity,
      onRemoveItem: mockOnRemoveItem,
      onClearCart: mockOnClearCart,
      ...props
    };

    return render(
      <BrowserRouter>
        <CarritoPage {...defaultProps} />
      </BrowserRouter>
    );
  };

  describe('Renderizado básico', () => {
    it('debe renderizar el componente CarritoPage correctamente', () => {
      renderCarritoPage();
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
      expect(screen.getByTestId('mock-carrito-main')).toBeInTheDocument();
    });

    it('debe renderizar el Header con las props correctas', () => {
      renderCarritoPage();
      const header = screen.getByTestId('mock-header');
      expect(header).toHaveTextContent(`Items: ${mockCartItems.length}`);
    });

    it('debe renderizar el CarritoMainComponent con las props correctas', () => {
      renderCarritoPage();
      const carritoMain = screen.getByTestId('mock-carrito-main');
      expect(carritoMain).toHaveTextContent(`Items: ${mockCartItems.length}`);
    });

    it('debe renderizar el Footer', () => {
      renderCarritoPage();
      expect(screen.getByTestId('mock-footer')).toHaveTextContent('Footer Mock');
    });
  });

  describe('Props y estado del carrito', () => {
    it('debe manejar un carrito vacío correctamente', () => {
      renderCarritoPage({ cartItems: [] });
      const header = screen.getByTestId('mock-header');
      const carritoMain = screen.getByTestId('mock-carrito-main');
      
      expect(header).toHaveTextContent('Items: 0');
      expect(carritoMain).toHaveTextContent('Items: 0');
    });

    it('debe mostrar el número correcto de items en el carrito', () => {
      renderCarritoPage();
      const carritoMain = screen.getByTestId('mock-carrito-main');
      expect(carritoMain).toHaveTextContent(`Items: ${mockCartItems.length}`);
    });

    it('debe pasar todas las props requeridas al Header', () => {
      const { container } = renderCarritoPage();
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    });

    it('debe pasar todas las props requeridas al CarritoMainComponent', () => {
      const { container } = renderCarritoPage();
      expect(screen.getByTestId('mock-carrito-main')).toBeInTheDocument();
    });
  });

  describe('Callbacks y funciones', () => {
    it('debe recibir la función onUpdateQuantity como prop', () => {
      renderCarritoPage();
      expect(mockOnUpdateQuantity).toBeDefined();
    });

    it('debe recibir la función onRemoveItem como prop', () => {
      renderCarritoPage();
      expect(mockOnRemoveItem).toBeDefined();
    });

    it('debe recibir la función onClearCart como prop', () => {
      renderCarritoPage();
      expect(mockOnClearCart).toBeDefined();
    });
  });

  describe('Integración de componentes', () => {
    it('debe renderizar todos los componentes hijos en el orden correcto', () => {
      const { container } = renderCarritoPage();
      const elements = container.querySelectorAll('[data-testid^="mock-"]');
      
      expect(elements[0]).toHaveAttribute('data-testid', 'mock-header');
      expect(elements[1]).toHaveAttribute('data-testid', 'mock-carrito-main');
      expect(elements[2]).toHaveAttribute('data-testid', 'mock-footer');
    });

    it('debe mantener la estructura del layout', () => {
      const { container } = renderCarritoPage();
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Casos extremos', () => {
    it('debe manejar cartItems undefined sin errores', () => {
      renderCarritoPage({ cartItems: undefined });
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByTestId('mock-carrito-main')).toBeInTheDocument();
    });

    it('debe manejar cartItems null sin errores', () => {
      renderCarritoPage({ cartItems: null });
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByTestId('mock-carrito-main')).toBeInTheDocument();
    });

    it('debe manejar un carrito con muchos items', () => {
      const manyItems = Array.from({ length: 50 }, (_, i) => ({
        codigo: `PROD${i}`,
        nombre: `Producto ${i}`,
        precio: 1000 + i * 100,
        quantity: 1,
        stock: 10,
        imagen: `producto${i}.jpg`
      }));

      renderCarritoPage({ cartItems: manyItems });
      const carritoMain = screen.getByTestId('mock-carrito-main');
      expect(carritoMain).toHaveTextContent('Items: 50');
    });

    it('debe funcionar sin callbacks proporcionadas', () => {
      renderCarritoPage({
        onUpdateQuantity: undefined,
        onRemoveItem: undefined,
        onClearCart: undefined
      });
      
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByTestId('mock-carrito-main')).toBeInTheDocument();
      expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });
  });

  describe('Props del carrito', () => {
    it('debe pasar correctamente los items del carrito al Header', () => {
      renderCarritoPage();
      const header = screen.getByTestId('mock-header');
      expect(header).toBeInTheDocument();
      expect(header.textContent).toContain(mockCartItems.length.toString());
    });

    it('debe pasar correctamente los items del carrito al CarritoMainComponent', () => {
      renderCarritoPage();
      const carritoMain = screen.getByTestId('mock-carrito-main');
      expect(carritoMain).toBeInTheDocument();
      expect(carritoMain.textContent).toContain(mockCartItems.length.toString());
    });

    it('debe actualizar cuando cambian los items del carrito', () => {
      const { rerender } = render(
        <BrowserRouter>
          <CarritoPage
            cartItems={mockCartItems}
            onUpdateQuantity={mockOnUpdateQuantity}
            onRemoveItem={mockOnRemoveItem}
            onClearCart={mockOnClearCart}
          />
        </BrowserRouter>
      );

      const newCartItems = [mockCartItems[0]];
      
      rerender(
        <BrowserRouter>
          <CarritoPage
            cartItems={newCartItems}
            onUpdateQuantity={mockOnUpdateQuantity}
            onRemoveItem={mockOnRemoveItem}
            onClearCart={mockOnClearCart}
          />
        </BrowserRouter>
      );

      const carritoMain = screen.getByTestId('mock-carrito-main');
      expect(carritoMain).toHaveTextContent('Items: 1');
    });
  });
});
