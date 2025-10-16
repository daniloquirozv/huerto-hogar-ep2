import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PrincipalPage from '../../src/pages/principalPage';

// Mock de los componentes hijos
vi.mock('../../src/components/layout/header', () => ({
  default: ({ cartItems, onUpdateQuantity, onRemoveItem }) => (
    <div data-testid="mock-header">
      Header Mock - Items: {cartItems?.length || 0}
    </div>
  )
}));

vi.mock('../../src/components/layout/body', () => ({
  default: ({ onAddToCart }) => (
    <div data-testid="mock-body">
      Body Mock
    </div>
  )
}));

vi.mock('../../src/components/layout/footer', () => ({
  default: () => <div data-testid="mock-footer">Footer Mock</div>
}));

describe('PrincipalPage', () => {
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

  const mockOnAddToCart = vi.fn();
  const mockOnUpdateQuantity = vi.fn();
  const mockOnRemoveItem = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPrincipalPage = (props = {}) => {
    const defaultProps = {
      cartItems: mockCartItems,
      onAddToCart: mockOnAddToCart,
      onUpdateQuantity: mockOnUpdateQuantity,
      onRemoveItem: mockOnRemoveItem,
      ...props
    };

    return render(
      <BrowserRouter>
        <PrincipalPage {...defaultProps} />
      </BrowserRouter>
    );
  };

  describe('Renderizado básico', () => {
    it('debe renderizar el componente PrincipalPage correctamente', () => {
      renderPrincipalPage();
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByTestId('mock-body')).toBeInTheDocument();
      expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });

    it('debe renderizar el Header con las props correctas', () => {
      renderPrincipalPage();
      const header = screen.getByTestId('mock-header');
      expect(header).toHaveTextContent(`Items: ${mockCartItems.length}`);
    });

    it('debe renderizar el componente Body', () => {
      renderPrincipalPage();
      const body = screen.getByTestId('mock-body');
      expect(body).toHaveTextContent('Body Mock');
    });

    it('debe renderizar el Footer', () => {
      renderPrincipalPage();
      expect(screen.getByTestId('mock-footer')).toHaveTextContent('Footer Mock');
    });
  });

  describe('Props del Header', () => {
    it('debe pasar cartItems al Header', () => {
      renderPrincipalPage();
      const header = screen.getByTestId('mock-header');
      expect(header).toBeInTheDocument();
      expect(header.textContent).toContain(mockCartItems.length.toString());
    });

    it('debe pasar onUpdateQuantity al Header', () => {
      renderPrincipalPage();
      expect(mockOnUpdateQuantity).toBeDefined();
    });

    it('debe pasar onRemoveItem al Header', () => {
      renderPrincipalPage();
      expect(mockOnRemoveItem).toBeDefined();
    });

    it('debe manejar un carrito vacío en el Header', () => {
      renderPrincipalPage({ cartItems: [] });
      const header = screen.getByTestId('mock-header');
      expect(header).toHaveTextContent('Items: 0');
    });
  });

  describe('Props del Body', () => {
    it('debe pasar onAddToCart al Body', () => {
      renderPrincipalPage();
      expect(mockOnAddToCart).toBeDefined();
    });

    it('debe renderizar Body correctamente', () => {
      renderPrincipalPage();
      const body = screen.getByTestId('mock-body');
      expect(body).toBeInTheDocument();
    });
  });

  describe('Callbacks y funciones', () => {
    it('debe recibir la función onAddToCart como prop', () => {
      renderPrincipalPage();
      expect(mockOnAddToCart).toBeDefined();
      expect(typeof mockOnAddToCart).toBe('function');
    });

    it('debe recibir la función onUpdateQuantity como prop', () => {
      renderPrincipalPage();
      expect(mockOnUpdateQuantity).toBeDefined();
      expect(typeof mockOnUpdateQuantity).toBe('function');
    });

    it('debe recibir la función onRemoveItem como prop', () => {
      renderPrincipalPage();
      expect(mockOnRemoveItem).toBeDefined();
      expect(typeof mockOnRemoveItem).toBe('function');
    });
  });

  describe('Integración de componentes', () => {
    it('debe renderizar todos los componentes hijos en el orden correcto', () => {
      const { container } = renderPrincipalPage();
      const elements = container.querySelectorAll('[data-testid^="mock-"]');
      
      expect(elements[0]).toHaveAttribute('data-testid', 'mock-header');
      expect(elements[1]).toHaveAttribute('data-testid', 'mock-body');
      expect(elements[2]).toHaveAttribute('data-testid', 'mock-footer');
    });

    it('debe mantener la estructura del layout (Header, Body, Footer)', () => {
      const { container } = renderPrincipalPage();
      expect(container.firstChild).toBeTruthy();
      
      const header = screen.getByTestId('mock-header');
      const body = screen.getByTestId('mock-body');
      const footer = screen.getByTestId('mock-footer');
      
      expect(header).toBeInTheDocument();
      expect(body).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });

    it('debe renderizar los tres componentes principales simultáneamente', () => {
      renderPrincipalPage();
      
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByTestId('mock-body')).toBeInTheDocument();
      expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });
  });

  describe('Casos extremos', () => {
    it('debe manejar cartItems undefined sin errores', () => {
      renderPrincipalPage({ cartItems: undefined });
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByTestId('mock-body')).toBeInTheDocument();
      expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });

    it('debe manejar cartItems null sin errores', () => {
      renderPrincipalPage({ cartItems: null });
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByTestId('mock-body')).toBeInTheDocument();
      expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });

    it('debe manejar un carrito con muchos items', () => {
      const manyItems = Array.from({ length: 100 }, (_, i) => ({
        codigo: `PROD${i}`,
        nombre: `Producto ${i}`,
        precio: 1000 + i * 100,
        quantity: 1,
        stock: 10,
        imagen: `producto${i}.jpg`
      }));

      renderPrincipalPage({ cartItems: manyItems });
      const header = screen.getByTestId('mock-header');
      expect(header).toHaveTextContent('Items: 100');
    });

    it('debe funcionar sin callbacks proporcionadas', () => {
      renderPrincipalPage({
        onAddToCart: undefined,
        onUpdateQuantity: undefined,
        onRemoveItem: undefined
      });
      
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByTestId('mock-body')).toBeInTheDocument();
      expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });

    it('debe manejar props vacías', () => {
      render(
        <BrowserRouter>
          <PrincipalPage />
        </BrowserRouter>
      );
      
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByTestId('mock-body')).toBeInTheDocument();
      expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });
  });

  describe('Estado del carrito', () => {
    it('debe actualizar cuando cambian los items del carrito', () => {
      const { rerender } = render(
        <BrowserRouter>
          <PrincipalPage
            cartItems={mockCartItems}
            onAddToCart={mockOnAddToCart}
            onUpdateQuantity={mockOnUpdateQuantity}
            onRemoveItem={mockOnRemoveItem}
          />
        </BrowserRouter>
      );

      const newCartItems = [mockCartItems[0]];
      
      rerender(
        <BrowserRouter>
          <PrincipalPage
            cartItems={newCartItems}
            onAddToCart={mockOnAddToCart}
            onUpdateQuantity={mockOnUpdateQuantity}
            onRemoveItem={mockOnRemoveItem}
          />
        </BrowserRouter>
      );

      const header = screen.getByTestId('mock-header');
      expect(header).toHaveTextContent('Items: 1');
    });

    it('debe pasar de carrito vacío a carrito con items', () => {
      const { rerender } = render(
        <BrowserRouter>
          <PrincipalPage
            cartItems={[]}
            onAddToCart={mockOnAddToCart}
            onUpdateQuantity={mockOnUpdateQuantity}
            onRemoveItem={mockOnRemoveItem}
          />
        </BrowserRouter>
      );

      expect(screen.getByTestId('mock-header')).toHaveTextContent('Items: 0');

      rerender(
        <BrowserRouter>
          <PrincipalPage
            cartItems={mockCartItems}
            onAddToCart={mockOnAddToCart}
            onUpdateQuantity={mockOnUpdateQuantity}
            onRemoveItem={mockOnRemoveItem}
          />
        </BrowserRouter>
      );

      expect(screen.getByTestId('mock-header')).toHaveTextContent(`Items: ${mockCartItems.length}`);
    });

    it('debe pasar de carrito con items a carrito vacío', () => {
      const { rerender } = render(
        <BrowserRouter>
          <PrincipalPage
            cartItems={mockCartItems}
            onAddToCart={mockOnAddToCart}
            onUpdateQuantity={mockOnUpdateQuantity}
            onRemoveItem={mockOnRemoveItem}
          />
        </BrowserRouter>
      );

      expect(screen.getByTestId('mock-header')).toHaveTextContent(`Items: ${mockCartItems.length}`);

      rerender(
        <BrowserRouter>
          <PrincipalPage
            cartItems={[]}
            onAddToCart={mockOnAddToCart}
            onUpdateQuantity={mockOnUpdateQuantity}
            onRemoveItem={mockOnRemoveItem}
          />
        </BrowserRouter>
      );

      expect(screen.getByTestId('mock-header')).toHaveTextContent('Items: 0');
    });
  });

  describe('Validación de estructura', () => {
    it('debe tener el componente envuelto en un Fragment', () => {
      const { container } = renderPrincipalPage();
      expect(container.firstChild).toBeTruthy();
    });

    it('debe renderizar exactamente 3 componentes hijos', () => {
      const { container } = renderPrincipalPage();
      const mockElements = container.querySelectorAll('[data-testid^="mock-"]');
      expect(mockElements).toHaveLength(3);
    });

    it('debe mantener el orden Header -> Body -> Footer', () => {
      const { container } = renderPrincipalPage();
      const elements = Array.from(container.querySelectorAll('[data-testid^="mock-"]'));
      
      expect(elements[0].getAttribute('data-testid')).toBe('mock-header');
      expect(elements[1].getAttribute('data-testid')).toBe('mock-body');
      expect(elements[2].getAttribute('data-testid')).toBe('mock-footer');
    });
  });
});
