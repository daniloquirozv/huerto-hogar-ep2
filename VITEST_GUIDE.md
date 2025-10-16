# Configuración de Vitest

## Instalación Completada ✅

Este proyecto ya tiene Vitest configurado y listo para usar.

## Scripts Disponibles

```bash
# Ejecutar tests en modo watch (se ejecutan automáticamente al cambiar archivos)
npm test

# Ejecutar tests una sola vez
npm run test:run

# Ejecutar tests con interfaz gráfica
npm run test:ui

# Ejecutar tests con reporte de cobertura
npm run test:coverage
```

## Configuración

La configuración de Vitest se encuentra en `vite.config.js`:

- **globals: true** - Permite usar funciones como `describe`, `it`, `expect` sin importarlas
- **environment: 'jsdom'** - Simula un navegador para testear componentes React
- **setupFiles** - Archivo de configuración inicial (`src/setupTests.js`)
- **css: true** - Soporta importación de archivos CSS en los tests
- **coverage** - Configuración de reportes de cobertura de código

## Escribir Tests

### Estructura básica de un test:

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MiComponente from './MiComponente';

describe('MiComponente', () => {
  it('debe renderizar correctamente', () => {
    render(<MiComponente />);
    expect(screen.getByText('Hola Mundo')).toBeInTheDocument();
  });
});
```

### Para componentes con React Router:

```javascript
import { BrowserRouter } from 'react-router-dom';

render(
  <BrowserRouter>
    <MiComponente />
  </BrowserRouter>
);
```

## Utilidades de Testing Library

- `render()` - Renderiza un componente
- `screen.getByText()` - Busca elementos por texto
- `screen.getByRole()` - Busca elementos por rol ARIA
- `screen.getByTestId()` - Busca elementos por data-testid
- `fireEvent.click()` - Simula eventos del usuario
- `userEvent` - Simula interacciones más realistas del usuario

## Matchers Comunes

```javascript
expect(elemento).toBeInTheDocument();
expect(elemento).toHaveTextContent('texto');
expect(elemento).toBeVisible();
expect(elemento).toBeDisabled();
expect(elemento).toHaveClass('mi-clase');
expect(array).toHaveLength(5);
expect(valor).toBe('esperado');
expect(objeto).toEqual({ key: 'value' });
```

## Ejemplo de Test Completo

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import MiFormulario from './MiFormulario';

describe('MiFormulario', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <MiFormulario />
      </BrowserRouter>
    );
  });

  it('debe mostrar el título', () => {
    expect(screen.getByText('Formulario')).toBeInTheDocument();
  });

  it('debe permitir escribir en el input', async () => {
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Texto de prueba');
    expect(input).toHaveValue('Texto de prueba');
  });

  it('debe enviar el formulario', async () => {
    const button = screen.getByRole('button', { name: /enviar/i });
    await userEvent.click(button);
    expect(screen.getByText('Enviado')).toBeInTheDocument();
  });
});
```

## Recursos Adiciales

- [Documentación de Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [User Event](https://testing-library.com/docs/user-event/intro)
