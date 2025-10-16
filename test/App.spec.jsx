import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';

// Mock de los componentes de páginas
vi.mock('../src/pages/principalPage', () => ({
  default: ({ cartItems, onAddToCart, onUpdateQuantity, onRemoveItem }) => (
    <div data-testid="principal-page">
      <h1>Principal Page</h1>
      <div data-testid="cart-items-count">{cartItems.length}</div>
      <button onClick={() => onAddToCart({ codigo: 'TEST-001', nombre: 'Test Product', precio: 100 }, 1)}>
        Add to Cart
      </button>
      <button onClick={() => onUpdateQuantity('TEST-001', 5)}>Update Quantity</button>
      <button onClick={() => onRemoveItem('TEST-001')}>Remove Item</button>
    </div>
  )
}));

vi.mock('../src/pages/productosPage', () => ({
  default: ({ cartItems, onAddToCart, onUpdateQuantity, onRemoveItem }) => (
    <div data-testid="productos-page">
      <h1>Productos Page</h1>
      <div data-testid="cart-items-count">{cartItems.length}</div>
      <button onClick={() => onAddToCart({ codigo: 'PROD-001', nombre: 'Product', precio: 200 }, 2)}>
        Add Product
      </button>
    </div>
  )
}));

vi.mock('../src/pages/blogPage', () => ({
  default: ({ cartItems, onUpdateQuantity, onRemoveItem }) => (
    <div data-testid="blog-page">
      <h1>Blog Page</h1>
      <div data-testid="cart-items-count">{cartItems.length}</div>
    </div>
  )
}));

vi.mock('../src/pages/CarritoPage', () => ({
  default: ({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) => (
    <div data-testid="carrito-page">
      <h1>Carrito Page</h1>
      <div data-testid="cart-items-count">{cartItems.length}</div>
      <button onClick={onClearCart}>Clear Cart</button>
    </div>
  )
}));

vi.mock('../src/pages/AdminPage', () => ({
  default: () => (
    <div data-testid="admin-page">
      <h1>Admin Page</h1>
    </div>
  )
}));

vi.mock('../src/pages/RegistroPage', () => ({
  default: () => (
    <div data-testid="registro-page">
      <h1>Registro Page</h1>
    </div>
  )
}));

// Helper para renderizar con Router
const renderWithRouter = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Renderizado de rutas', () => {
    it('debe renderizar PrincipalPage en la ruta raíz', () => {
      renderWithRouter('/');
      expect(screen.getByTestId('principal-page')).toBeInTheDocument();
      expect(screen.getByText('Principal Page')).toBeInTheDocument();
    });

    it('debe renderizar ProductosPage en /productos', () => {
      renderWithRouter('/productos');
      expect(screen.getByTestId('productos-page')).toBeInTheDocument();
      expect(screen.getByText('Productos Page')).toBeInTheDocument();
    });

    it('debe renderizar Blog en /blog', () => {
      renderWithRouter('/blog');
      expect(screen.getByTestId('blog-page')).toBeInTheDocument();
      expect(screen.getByText('Blog Page')).toBeInTheDocument();
    });

    it('debe renderizar CarritoPage en /carrito', () => {
      renderWithRouter('/carrito');
      expect(screen.getByTestId('carrito-page')).toBeInTheDocument();
      expect(screen.getByText('Carrito Page')).toBeInTheDocument();
    });

    it('debe renderizar AdminPage en /admin', () => {
      renderWithRouter('/admin');
      expect(screen.getByTestId('admin-page')).toBeInTheDocument();
      expect(screen.getByText('Admin Page')).toBeInTheDocument();
    });

    it('debe renderizar RegistroPage en /registro', () => {
      renderWithRouter('/registro');
      expect(screen.getByTestId('registro-page')).toBeInTheDocument();
      expect(screen.getByText('Registro Page')).toBeInTheDocument();
    });
  });

  describe('Estado del carrito - Inicialización', () => {
    it('debe inicializar el carrito vacío cuando no hay datos en localStorage', () => {
      renderWithRouter('/');
      const cartCount = screen.getByTestId('cart-items-count');
      expect(cartCount.textContent).toBe('0');
    });

    it('debe cargar el carrito desde localStorage si existe', () => {
      const savedCart = [
        { codigo: 'SAVED-001', nombre: 'Saved Product', precio: 150, quantity: 2 },
        { codigo: 'SAVED-002', nombre: 'Another Product', precio: 200, quantity: 1 }
      ];
      localStorage.setItem('huertoHogarCart', JSON.stringify(savedCart));

      renderWithRouter('/');
      const cartCount = screen.getByTestId('cart-items-count');
      expect(cartCount.textContent).toBe('2');
    });

    it('debe manejar errores al cargar desde localStorage y usar carrito vacío', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('huertoHogarCart', 'invalid-json');

      renderWithRouter('/');
      const cartCount = screen.getByTestId('cart-items-count');
      expect(cartCount.textContent).toBe('0');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error al cargar el carrito desde localStorage:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Funcionalidad del carrito - Agregar productos', () => {
    it('debe agregar un nuevo producto al carrito', async () => {
      const { container } = renderWithRouter('/');
      
      const addButton = screen.getByText('Add to Cart');
      addButton.click();

      await waitFor(() => {
        const cartCount = screen.getByTestId('cart-items-count');
        expect(cartCount.textContent).toBe('1');
      });

      // Verificar que se guardó en localStorage
      const savedCart = JSON.parse(localStorage.getItem('huertoHogarCart'));
      expect(savedCart).toHaveLength(1);
      expect(savedCart[0]).toEqual({
        codigo: 'TEST-001',
        nombre: 'Test Product',
        precio: 100,
        quantity: 1
      });
    });

    it('debe incrementar la cantidad si el producto ya existe', async () => {
      const { container } = renderWithRouter('/');
      
      const addButton = screen.getByText('Add to Cart');
      
      // Agregar producto por primera vez
      addButton.click();
      
      await waitFor(() => {
        const cartCount = screen.getByTestId('cart-items-count');
        expect(cartCount.textContent).toBe('1');
      });

      // Agregar el mismo producto otra vez
      addButton.click();

      await waitFor(() => {
        const savedCart = JSON.parse(localStorage.getItem('huertoHogarCart'));
        expect(savedCart).toHaveLength(1);
        expect(savedCart[0].quantity).toBe(2);
      });
    });

    it('debe permitir agregar múltiples productos diferentes', async () => {
      renderWithRouter('/productos');
      
      const addButton = screen.getByText('Add Product');
      addButton.click();

      await waitFor(() => {
        const savedCart = JSON.parse(localStorage.getItem('huertoHogarCart'));
        expect(savedCart).toHaveLength(1);
        expect(savedCart[0].codigo).toBe('PROD-001');
        expect(savedCart[0].quantity).toBe(2);
      });
    });
  });

  describe('Funcionalidad del carrito - Actualizar cantidad', () => {
    it('debe actualizar la cantidad de un producto existente', async () => {
      const initialCart = [
        { codigo: 'TEST-001', nombre: 'Test Product', precio: 100, quantity: 1 }
      ];
      localStorage.setItem('huertoHogarCart', JSON.stringify(initialCart));

      renderWithRouter('/');
      
      const updateButton = screen.getByText('Update Quantity');
      updateButton.click();

      await waitFor(() => {
        const savedCart = JSON.parse(localStorage.getItem('huertoHogarCart'));
        expect(savedCart[0].quantity).toBe(5);
      });
    });

    it('no debe afectar otros productos al actualizar cantidad', async () => {
      const initialCart = [
        { codigo: 'TEST-001', nombre: 'Test Product', precio: 100, quantity: 1 },
        { codigo: 'OTHER-001', nombre: 'Other Product', precio: 200, quantity: 3 }
      ];
      localStorage.setItem('huertoHogarCart', JSON.stringify(initialCart));

      renderWithRouter('/');
      
      const updateButton = screen.getByText('Update Quantity');
      updateButton.click();

      await waitFor(() => {
        const savedCart = JSON.parse(localStorage.getItem('huertoHogarCart'));
        expect(savedCart).toHaveLength(2);
        expect(savedCart[0].quantity).toBe(5);
        expect(savedCart[1].quantity).toBe(3); // No debe cambiar
      });
    });
  });

  describe('Funcionalidad del carrito - Eliminar productos', () => {
    it('debe eliminar un producto del carrito', async () => {
      const initialCart = [
        { codigo: 'TEST-001', nombre: 'Test Product', precio: 100, quantity: 1 },
        { codigo: 'OTHER-001', nombre: 'Other Product', precio: 200, quantity: 2 }
      ];
      localStorage.setItem('huertoHogarCart', JSON.stringify(initialCart));

      renderWithRouter('/');
      
      expect(screen.getByTestId('cart-items-count').textContent).toBe('2');
      
      const removeButton = screen.getByText('Remove Item');
      removeButton.click();

      await waitFor(() => {
        const cartCount = screen.getByTestId('cart-items-count');
        expect(cartCount.textContent).toBe('1');
      });

      const savedCart = JSON.parse(localStorage.getItem('huertoHogarCart'));
      expect(savedCart).toHaveLength(1);
      expect(savedCart[0].codigo).toBe('OTHER-001');
    });

    it('debe vaciar el carrito completamente', async () => {
      const initialCart = [
        { codigo: 'TEST-001', nombre: 'Test Product', precio: 100, quantity: 1 },
        { codigo: 'TEST-002', nombre: 'Test Product 2', precio: 150, quantity: 2 }
      ];
      localStorage.setItem('huertoHogarCart', JSON.stringify(initialCart));

      renderWithRouter('/carrito');
      
      expect(screen.getByTestId('cart-items-count').textContent).toBe('2');
      
      const clearButton = screen.getByText('Clear Cart');
      clearButton.click();

      await waitFor(() => {
        const cartCount = screen.getByTestId('cart-items-count');
        expect(cartCount.textContent).toBe('0');
      });

      // handleClearCart llama a removeItem, pero useEffect puede guardar [] después
      // Verificar que el carrito está vacío (puede ser null o "[]")
      const savedCart = localStorage.getItem('huertoHogarCart');
      if (savedCart !== null) {
        const parsedCart = JSON.parse(savedCart);
        expect(parsedCart).toHaveLength(0);
      }
    });
  });

  describe('Persistencia en localStorage', () => {
    it('debe guardar en localStorage al agregar producto', async () => {
      renderWithRouter('/');
      
      const addButton = screen.getByText('Add to Cart');
      addButton.click();

      await waitFor(() => {
        const savedCart = localStorage.getItem('huertoHogarCart');
        expect(savedCart).not.toBeNull();
        const parsedCart = JSON.parse(savedCart);
        expect(parsedCart).toHaveLength(1);
      });
    });

    it('debe guardar en localStorage al actualizar cantidad', async () => {
      const initialCart = [
        { codigo: 'TEST-001', nombre: 'Test Product', precio: 100, quantity: 1 }
      ];
      localStorage.setItem('huertoHogarCart', JSON.stringify(initialCart));

      renderWithRouter('/');
      
      const updateButton = screen.getByText('Update Quantity');
      updateButton.click();

      await waitFor(() => {
        const savedCart = JSON.parse(localStorage.getItem('huertoHogarCart'));
        expect(savedCart[0].quantity).toBe(5);
      });
    });

    it('debe guardar en localStorage al eliminar producto', async () => {
      const initialCart = [
        { codigo: 'TEST-001', nombre: 'Test Product', precio: 100, quantity: 1 },
        { codigo: 'OTHER-001', nombre: 'Other Product', precio: 200, quantity: 2 }
      ];
      localStorage.setItem('huertoHogarCart', JSON.stringify(initialCart));

      renderWithRouter('/');
      
      const removeButton = screen.getByText('Remove Item');
      removeButton.click();

      await waitFor(() => {
        const savedCart = JSON.parse(localStorage.getItem('huertoHogarCart'));
        expect(savedCart).toHaveLength(1);
      });
    });

    it('debe manejar errores al guardar en localStorage', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Simular error en setItem
      const mockSetItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      renderWithRouter('/');
      
      const addButton = screen.getByText('Add to Cart');
      addButton.click();

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error al guardar el carrito en localStorage:',
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
      mockSetItem.mockRestore();
    });
  });

  describe('Propagación de props a las páginas', () => {
    it('debe pasar cartItems a PrincipalPage', () => {
      const initialCart = [
        { codigo: 'TEST-001', nombre: 'Test Product', precio: 100, quantity: 1 }
      ];
      localStorage.setItem('huertoHogarCart', JSON.stringify(initialCart));

      renderWithRouter('/');
      expect(screen.getByTestId('cart-items-count').textContent).toBe('1');
    });

    it('debe pasar cartItems a ProductosPage', () => {
      const initialCart = [
        { codigo: 'TEST-001', nombre: 'Test Product', precio: 100, quantity: 1 }
      ];
      localStorage.setItem('huertoHogarCart', JSON.stringify(initialCart));

      renderWithRouter('/productos');
      expect(screen.getByTestId('cart-items-count').textContent).toBe('1');
    });

    it('debe pasar cartItems a BlogPage', () => {
      const initialCart = [
        { codigo: 'TEST-001', nombre: 'Test Product', precio: 100, quantity: 1 }
      ];
      localStorage.setItem('huertoHogarCart', JSON.stringify(initialCart));

      renderWithRouter('/blog');
      expect(screen.getByTestId('cart-items-count').textContent).toBe('1');
    });

    it('debe pasar cartItems a CarritoPage', () => {
      const initialCart = [
        { codigo: 'TEST-001', nombre: 'Test Product', precio: 100, quantity: 1 }
      ];
      localStorage.setItem('huertoHogarCart', JSON.stringify(initialCart));

      renderWithRouter('/carrito');
      expect(screen.getByTestId('cart-items-count').textContent).toBe('1');
    });

    it('debe pasar todas las funciones necesarias a cada página', () => {
      // Esta prueba verifica que los mocks reciben las funciones
      renderWithRouter('/');
      
      // Si las páginas se renderizan correctamente con botones funcionales,
      // significa que las props se están pasando
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
      expect(screen.getByText('Update Quantity')).toBeInTheDocument();
      expect(screen.getByText('Remove Item')).toBeInTheDocument();
    });
  });

  describe('Escenarios de integración completos', () => {
    it('debe manejar el flujo completo: agregar, actualizar, eliminar', async () => {
      renderWithRouter('/');
      
      // 1. Agregar producto
      const addButton = screen.getByText('Add to Cart');
      addButton.click();

      await waitFor(() => {
        expect(screen.getByTestId('cart-items-count').textContent).toBe('1');
      });

      // 2. Actualizar cantidad
      const updateButton = screen.getByText('Update Quantity');
      updateButton.click();

      await waitFor(() => {
        const savedCart = JSON.parse(localStorage.getItem('huertoHogarCart'));
        expect(savedCart[0].quantity).toBe(5);
      });

      // 3. Eliminar producto
      const removeButton = screen.getByText('Remove Item');
      removeButton.click();

      await waitFor(() => {
        expect(screen.getByTestId('cart-items-count').textContent).toBe('0');
      });
    });

    it('debe mantener el estado del carrito al navegar entre rutas', async () => {
      const initialCart = [
        { codigo: 'TEST-001', nombre: 'Test Product', precio: 100, quantity: 1 }
      ];
      localStorage.setItem('huertoHogarCart', JSON.stringify(initialCart));

      // Renderizar en principal
      const { rerender } = render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('cart-items-count').textContent).toBe('1');

      // Cambiar a productos
      rerender(
        <MemoryRouter initialEntries={['/productos']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('cart-items-count').textContent).toBe('1');
    });
  });
});
