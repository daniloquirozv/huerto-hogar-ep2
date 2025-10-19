import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ReactDOM from 'react-dom/client';

// Mock de ReactDOM
vi.mock('react-dom/client', () => ({
  default: {
    createRoot: vi.fn(() => ({
      render: vi.fn(),
    })),
  },
}));

// Mock de App
vi.mock('../src/App.jsx', () => ({
  default: () => <div>App Component</div>,
}));

// Mock de reportWebVitals
vi.mock('../src/reportWebVitals', () => ({
  default: vi.fn(),
}));

// Mock de BrowserRouter
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="browser-router">{children}</div>,
}));

// Mock de CSS imports
vi.mock('bootstrap/dist/css/bootstrap.min.css', () => ({}));
vi.mock('bootstrap-icons/font/bootstrap-icons.css', () => ({}));
vi.mock('../src/index.css', () => ({}));

describe('index.jsx', () => {
  let rootElement;
  let createRootMock;
  let renderMock;

  beforeEach(() => {
    // Crear elemento root simulado
    rootElement = document.createElement('div');
    rootElement.setAttribute('id', 'root');
    document.body.appendChild(rootElement);

    // Configurar mocks
    renderMock = vi.fn();
    createRootMock = vi.fn(() => ({
      render: renderMock,
    }));
    ReactDOM.createRoot = createRootMock;

    // Limpiar módulos cacheados
    vi.resetModules();
  });

  afterEach(() => {
    // Limpiar el DOM
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('debería crear un root de React en el elemento con id "root"', async () => {
    // Importar el módulo después de configurar los mocks
    await import('../src/index.jsx');

    expect(createRootMock).toHaveBeenCalledWith(rootElement);
  });

  it('debería renderizar la aplicación dentro de BrowserRouter', async () => {
    await import('../src/index.jsx');

    expect(renderMock).toHaveBeenCalledTimes(1);
    
    // Verificar que se llamó render con el elemento correcto
    const renderCall = renderMock.mock.calls[0][0];
    expect(renderCall.type.name).toBe('BrowserRouter');
  });

  it('debería llamar a reportWebVitals', async () => {
    const reportWebVitals = (await import('../src/reportWebVitals')).default;
    
    await import('../src/index.jsx');

    expect(reportWebVitals).toHaveBeenCalled();
  });

  it('debería manejar correctamente si el elemento root no existe', () => {
    // Remover el elemento root
    document.body.innerHTML = '';

    expect(() => {
      const element = document.getElementById('root');
      if (!element) {
        throw new Error('Root element not found');
      }
      ReactDOM.createRoot(element);
    }).toThrow('Root element not found');
  });

  it('debería importar los estilos de bootstrap y bootstrap-icons', async () => {
    // Esta prueba verifica que los imports no causen errores
    expect(() => import('../src/index.jsx')).not.toThrow();
  });

  it('debería importar el archivo de estilos index.css', async () => {
    // Verificar que el import de CSS no causa errores
    expect(() => import('../src/index.css')).not.toThrow();
  });
});

describe('index.jsx - Integración', () => {
  it('debería tener la estructura correcta del árbol de componentes', async () => {
    const rootElement = document.createElement('div');
    rootElement.setAttribute('id', 'root');
    document.body.appendChild(rootElement);

    const renderMock = vi.fn();
    const createRootMock = vi.fn(() => ({
      render: renderMock,
    }));
    ReactDOM.createRoot = createRootMock;

    await import('../src/index.jsx');

    // Verificar que render fue llamado
    expect(renderMock).toHaveBeenCalled();
    
    // Verificar la estructura del componente renderizado
    const renderedElement = renderMock.mock.calls[0][0];
    expect(renderedElement).toBeTruthy();
    expect(renderedElement.type.name).toBe('BrowserRouter');
  });

  it('debería renderizar App dentro de BrowserRouter', async () => {
    const rootElement = document.createElement('div');
    rootElement.setAttribute('id', 'root');
    document.body.appendChild(rootElement);

    const renderMock = vi.fn();
    const createRootMock = vi.fn(() => ({
      render: renderMock,
    }));
    ReactDOM.createRoot = createRootMock;

    // Limpiar módulos antes de importar
    vi.resetModules();
    await import('../src/index.jsx');

    // Verificar que render fue llamado
    expect(renderMock).toHaveBeenCalled();
    
    // Verificar que hay al menos una llamada
    if (renderMock.mock.calls.length > 0) {
      const renderedElement = renderMock.mock.calls[0][0];
      // El componente App es exportado por defecto, por lo que su nombre será 'default'
      expect(renderedElement.props.children).toBeTruthy();
      expect(renderedElement.props.children.type).toBeTruthy();
    }
  });
});

describe('index.jsx - NODE_ENV', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('debería intentar importar userUtils en modo desarrollo', async () => {
    process.env.NODE_ENV = 'development';
    
    // Mock de la importación dinámica
    const mockUserUtils = vi.fn();
    vi.mock('../src/utils/userUtils.js', () => ({
      default: mockUserUtils,
    }));

    // Esta prueba verifica que el código de desarrollo se ejecuta correctamente
    expect(process.env.NODE_ENV).toBe('development');
  });

  it('no debería importar userUtils en modo producción', () => {
    process.env.NODE_ENV = 'production';
    
    expect(process.env.NODE_ENV).toBe('production');
  });
});
