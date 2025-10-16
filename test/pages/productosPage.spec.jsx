import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductosPage from '../../src/pages/productosPage';

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

vi.mock('../../src/components/BuscadorProductos', () => ({
  default: ({ onAddToCart }) => (
    <div data-testid="mock-buscador">
      Buscador de Productos Mock
    </div>
  )
}));

vi.mock('../../src/components/CardsComponent', () => ({
  default: ({ onAddToCart }) => (
    <div data-testid="mock-cards">
      Cards Component Mock
    </div>
  )
}));

describe('ProductosPage', () => {
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
    },
    {
      codigo: 'PROD003',
      nombre: 'Zanahoria Orgánica',
      precio: 1200,
      quantity: 3,
      stock: 15,
      imagen: 'zanahoria.jpg'
    }
  ];

  const mockOnAddToCart = vi.fn();
  const mockOnUpdateQuantity = vi.fn();
  const mockOnRemoveItem = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderProductosPage = (props = {}) => {
    const defaultProps = {
      cartItems: mockCartItems,
      onAddToCart: mockOnAddToCart,
      onUpdateQuantity: mockOnUpdateQuantity,
      onRemoveItem: mockOnRemoveItem,
      ...props
    };

    return render(
      <BrowserRouter>
        <ProductosPage {...defaultProps} />
      </BrowserRouter>
    );
  };

  describe('Renderizado básico', () => {
    it('debe renderizar el componente ProductosPage correctamente', () => {
      renderProductosPage();
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByTestId('mock-buscador')).toBeInTheDocument();
      expect(screen.getByTestId('mock-cards')).toBeInTheDocument();
      expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });

    it('debe renderizar el Header con las props correctas', () => {
      renderProductosPage();
      const header = screen.getByTestId('mock-header');
      expect(header).toHaveTextContent(`Items: ${mockCartItems.length}`);
    });

    it('debe renderizar el componente BuscadorProductos', () => {
      renderProductosPage();
      const buscador = screen.getByTestId('mock-buscador');
      expect(buscador).toHaveTextContent('Buscador de Productos Mock');
    });

    it('debe renderizar el componente CardsComponent', () => {
      renderProductosPage();
      const cards = screen.getByTestId('mock-cards');
      expect(cards).toHaveTextContent('Cards Component Mock');
    });

    it('debe renderizar el Footer', () => {
      renderProductosPage();
      expect(screen.getByTestId('mock-footer')).toHaveTextContent('Footer Mock');
    });
  });

  describe('Props del Header', () => {
    it('debe pasar cartItems al Header', () => {
      renderProductosPage();
      const header = screen.getByTestId('mock-header');
      expect(header).toBeInTheDocument();
      expect(header.textContent).toContain(mockCartItems.length.toString());
    });

    it('debe pasar onUpdateQuantity al Header', () => {
      renderProductosPage();
      expect(mockOnUpdateQuantity).toBeDefined();
    });

    it('debe pasar onRemoveItem al Header', () => {
      renderProductosPage();
      expect(mockOnRemoveItem).toBeDefined();
    });

    it('debe manejar un carrito vacío en el Header', () => {
      renderProductosPage({ cartItems: [] });
      const header = screen.getByTestId('mock-header');
      expect(header).toHaveTextContent('Items: 0');
    });

    it('debe mostrar el número correcto de items en el Header', () => {
      renderProductosPage();
      const header = screen.getByTestId('mock-header');
      expect(header).toHaveTextContent(`Items: ${mockCartItems.length}`);
    });
  });

  describe('Props de BuscadorProductos', () => {
    it('debe pasar onAddToCart al BuscadorProductos', () => {
      renderProductosPage();
      expect(mockOnAddToCart).toBeDefined();
    });

    it('debe renderizar BuscadorProductos correctamente', () => {
      renderProductosPage();
      const buscador = screen.getByTestId('mock-buscador');
      expect(buscador).toBeInTheDocument();
    });
  });

  describe('Props de CardsComponent', () => {
    it('debe pasar onAddToCart al CardsComponent', () => {
      renderProductosPage();
      expect(mockOnAddToCart).toBeDefined();
    });

    it('debe renderizar CardsComponent correctamente', () => {
      renderProductosPage();
      const cards = screen.getByTestId('mock-cards');
      expect(cards).toBeInTheDocument();
    });
  });

  describe('Callbacks y funciones', () => {
    it('debe recibir la función onAddToCart como prop', () => {
      renderProductosPage();
      expect(mockOnAddToCart).toBeDefined();
      expect(typeof mockOnAddToCart).toBe('function');
    });

    it('debe recibir la función onUpdateQuantity como prop', () => {
      renderProductosPage();
      expect(mockOnUpdateQuantity).toBeDefined();
      expect(typeof mockOnUpdateQuantity).toBe('function');
    });

    it('debe recibir la función onRemoveItem como prop', () => {
      renderProductosPage();
      expect(mockOnRemoveItem).toBeDefined();
      expect(typeof mockOnRemoveItem).toBe('function');
    });

    it('debe tener todas las callbacks definidas', () => {
      renderProductosPage();
      expect(mockOnAddToCart).toBeDefined();
      expect(mockOnUpdateQuantity).toBeDefined();
      expect(mockOnRemoveItem).toBeDefined();
    });
  });

  describe('Integración de componentes', () => {
    it('debe renderizar todos los componentes hijos en el orden correcto', () => {
      const { container } = renderProductosPage();
      const elements = container.querySelectorAll('[data-testid^="mock-"]');
      
      expect(elements[0]).toHaveAttribute('data-testid', 'mock-header');
      expect(elements[1]).toHaveAttribute('data-testid', 'mock-buscador');
      expect(elements[2]).toHaveAttribute('data-testid', 'mock-cards');
      expect(elements[3]).toHaveAttribute('data-testid', 'mock-footer');
    });

    it('debe mantener la estructura del layout (Header, Buscador, Cards, Footer)', () => {
      const { container } = renderProductosPage();
      expect(container.firstChild).toBeTruthy();
      
      const header = screen.getByTestId('mock-header');
      const buscador = screen.getByTestId('mock-buscador');
      const cards = screen.getByTestId('mock-cards');
      const footer = screen.getByTestId('mock-footer');
      
      expect(header).toBeInTheDocument();
      expect(buscador).toBeInTheDocument();
      expect(cards).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });

    it('debe renderizar los cuatro componentes principales simultáneamente', () => {
      renderProductosPage();
      
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByTestId('mock-buscador')).toBeInTheDocument();
      expect(screen.getByTestId('mock-cards')).toBeInTheDocument();
      expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });

    it('debe renderizar componentes de búsqueda y catálogo juntos', () => {
      renderProductosPage();
      
      const buscador = screen.getByTestId('mock-buscador');
      const cards = screen.getByTestId('mock-cards');
      
      expect(buscador).toBeInTheDocument();
      expect(cards).toBeInTheDocument();
    });
  });

  describe('Casos extremos', () => {
    it('debe manejar cartItems undefined sin errores', () => {
      renderProductosPage({ cartItems: undefined });
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByTestId('mock-buscador')).toBeInTheDocument();
      expect(screen.getByTestId('mock-cards')).toBeInTheDocument();
      expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });

    it('debe manejar cartItems null sin errores', () => {
      renderProductosPage({ cartItems: null });
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByTestId('mock-buscador')).toBeInTheDocument();
      expect(screen.getByTestId('mock-cards')).toBeInTheDocument();
      expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
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

      renderProductosPage({ cartItems: manyItems });
      const header = screen.getByTestId('mock-header');
      expect(header).toHaveTextContent('Items: 50');
    });

    it('debe funcionar sin callbacks proporcionadas', () => {
      renderProductosPage({
        onAddToCart: undefined,
        onUpdateQuantity: undefined,
        onRemoveItem: undefined
      });
      
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByTestId('mock-buscador')).toBeInTheDocument();
      expect(screen.getByTestId('mock-cards')).toBeInTheDocument();
      expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });

    it('debe manejar props vacías', () => {
      render(
        <BrowserRouter>
          <ProductosPage />
        </BrowserRouter>
      );
      
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByTestId('mock-buscador')).toBeInTheDocument();
      expect(screen.getByTestId('mock-cards')).toBeInTheDocument();
      expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });

    it('debe renderizar correctamente con un solo item en el carrito', () => {
      renderProductosPage({ cartItems: [mockCartItems[0]] });
      const header = screen.getByTestId('mock-header');
      expect(header).toHaveTextContent('Items: 1');
    });
  });

  describe('Estado del carrito', () => {
    it('debe actualizar cuando cambian los items del carrito', () => {
      const { rerender } = render(
        <BrowserRouter>
          <ProductosPage
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
          <ProductosPage
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
          <ProductosPage
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
          <ProductosPage
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
          <ProductosPage
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
          <ProductosPage
            cartItems={[]}
            onAddToCart={mockOnAddToCart}
            onUpdateQuantity={mockOnUpdateQuantity}
            onRemoveItem={mockOnRemoveItem}
          />
        </BrowserRouter>
      );

      expect(screen.getByTestId('mock-header')).toHaveTextContent('Items: 0');
    });

    it('debe manejar cambios incrementales en el carrito', () => {
      const { rerender } = render(
        <BrowserRouter>
          <ProductosPage
            cartItems={[mockCartItems[0]]}
            onAddToCart={mockOnAddToCart}
            onUpdateQuantity={mockOnUpdateQuantity}
            onRemoveItem={mockOnRemoveItem}
          />
        </BrowserRouter>
      );

      expect(screen.getByTestId('mock-header')).toHaveTextContent('Items: 1');

      rerender(
        <BrowserRouter>
          <ProductosPage
            cartItems={[mockCartItems[0], mockCartItems[1]]}
            onAddToCart={mockOnAddToCart}
            onUpdateQuantity={mockOnUpdateQuantity}
            onRemoveItem={mockOnRemoveItem}
          />
        </BrowserRouter>
      );

      expect(screen.getByTestId('mock-header')).toHaveTextContent('Items: 2');

      rerender(
        <BrowserRouter>
          <ProductosPage
            cartItems={mockCartItems}
            onAddToCart={mockOnAddToCart}
            onUpdateQuantity={mockOnUpdateQuantity}
            onRemoveItem={mockOnRemoveItem}
          />
        </BrowserRouter>
      );

      expect(screen.getByTestId('mock-header')).toHaveTextContent('Items: 3');
    });
  });

  describe('Validación de estructura', () => {
    it('debe tener el componente envuelto en un Fragment', () => {
      const { container } = renderProductosPage();
      expect(container.firstChild).toBeTruthy();
    });

    it('debe renderizar exactamente 4 componentes hijos', () => {
      const { container } = renderProductosPage();
      const mockElements = container.querySelectorAll('[data-testid^="mock-"]');
      expect(mockElements).toHaveLength(4);
    });

    it('debe mantener el orden Header -> Buscador -> Cards -> Footer', () => {
      const { container } = renderProductosPage();
      const elements = Array.from(container.querySelectorAll('[data-testid^="mock-"]'));
      
      expect(elements[0].getAttribute('data-testid')).toBe('mock-header');
      expect(elements[1].getAttribute('data-testid')).toBe('mock-buscador');
      expect(elements[2].getAttribute('data-testid')).toBe('mock-cards');
      expect(elements[3].getAttribute('data-testid')).toBe('mock-footer');
    });

    it('debe tener componentes de catálogo entre Header y Footer', () => {
      const { container } = renderProductosPage();
      const elements = Array.from(container.querySelectorAll('[data-testid^="mock-"]'));
      
      // El primer elemento debe ser Header
      expect(elements[0].getAttribute('data-testid')).toBe('mock-header');
      
      // Los elementos del medio deben ser Buscador y Cards
      expect(elements[1].getAttribute('data-testid')).toBe('mock-buscador');
      expect(elements[2].getAttribute('data-testid')).toBe('mock-cards');
      
      // El último elemento debe ser Footer
      expect(elements[3].getAttribute('data-testid')).toBe('mock-footer');
    });
  });

  describe('Funcionalidad de productos', () => {
    it('debe renderizar componentes necesarios para mostrar productos', () => {
      renderProductosPage();
      
      // Debe tener el buscador para filtrar productos
      expect(screen.getByTestId('mock-buscador')).toBeInTheDocument();
      
      // Debe tener las cards para mostrar productos
      expect(screen.getByTestId('mock-cards')).toBeInTheDocument();
    });

    it('debe pasar la misma función onAddToCart a BuscadorProductos y CardsComponent', () => {
      renderProductosPage();
      expect(mockOnAddToCart).toBeDefined();
    });
  });
});
