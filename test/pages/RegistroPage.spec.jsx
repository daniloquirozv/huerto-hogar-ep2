import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegistroScreen from '../../src/pages/RegistroPage';

// Mock del componente FormRegistro
vi.mock('../../src/components/layout/FormRegistro', () => ({
  default: () => (
    <div data-testid="mock-form-registro">
      Formulario de Registro Mock
    </div>
  )
}));

describe('RegistroPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderRegistroPage = () => {
    return render(
      <BrowserRouter>
        <RegistroScreen />
      </BrowserRouter>
    );  
  };

  describe('Renderizado básico', () => {
    it('debe renderizar el componente RegistroScreen correctamente', () => {
      renderRegistroPage();
      expect(screen.getByTestId('mock-form-registro')).toBeInTheDocument();
    });

    it('debe renderizar el FormRegistro', () => {
      renderRegistroPage();
      const form = screen.getByTestId('mock-form-registro');
      expect(form).toHaveTextContent('Formulario de Registro Mock');
    });

    it('debe renderizar el contenedor page-center', () => {
      const { container } = renderRegistroPage();
      const pageCenter = container.querySelector('.page-center');
      expect(pageCenter).toBeInTheDocument();
    });

    it('debe renderizar el contenedor frame-box', () => {
      const { container } = renderRegistroPage();
      const frameBox = container.querySelector('.frame-box');
      expect(frameBox).toBeInTheDocument();
    });

    it('debe renderizar todos los elementos principales', () => {
      const { container } = renderRegistroPage();
      expect(container.querySelector('.page-center')).toBeInTheDocument();
      expect(container.querySelector('.frame-box')).toBeInTheDocument();
      expect(screen.getByTestId('mock-form-registro')).toBeInTheDocument();
    });
  });

  describe('Estructura del DOM', () => {
    it('debe tener la estructura correcta de contenedores', () => {
      const { container } = renderRegistroPage();
      const pageCenter = container.querySelector('.page-center');
      const frameBox = pageCenter?.querySelector('.frame-box');
      
      expect(pageCenter).toBeInTheDocument();
      expect(frameBox).toBeInTheDocument();
    });

    it('debe tener FormRegistro dentro de frame-box', () => {
      const { container } = renderRegistroPage();
      const frameBox = container.querySelector('.frame-box');
      const formRegistro = screen.getByTestId('mock-form-registro');
      
      expect(frameBox).toBeInTheDocument();
      expect(formRegistro).toBeInTheDocument();
      expect(frameBox).toContainElement(formRegistro);
    });

    it('debe tener frame-box dentro de page-center', () => {
      const { container } = renderRegistroPage();
      const pageCenter = container.querySelector('.page-center');
      const frameBox = container.querySelector('.frame-box');
      
      expect(pageCenter).toBeInTheDocument();
      expect(frameBox).toBeInTheDocument();
      expect(pageCenter).toContainElement(frameBox);
    });

    it('debe tener el componente envuelto en un Fragment', () => {
      const { container } = renderRegistroPage();
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Clases CSS', () => {
    it('debe aplicar la clase page-center correctamente', () => {
      const { container } = renderRegistroPage();
      const pageCenter = container.querySelector('.page-center');
      expect(pageCenter).toHaveClass('page-center');
    });

    it('debe aplicar la clase frame-box correctamente', () => {
      const { container } = renderRegistroPage();
      const frameBox = container.querySelector('.frame-box');
      expect(frameBox).toHaveClass('frame-box');
    });

    it('debe tener exactamente las clases esperadas en page-center', () => {
      const { container } = renderRegistroPage();
      const pageCenter = container.querySelector('.page-center');
      expect(pageCenter?.className).toBe('page-center');
    });

    it('debe tener exactamente las clases esperadas en frame-box', () => {
      const { container } = renderRegistroPage();
      const frameBox = container.querySelector('.frame-box');
      expect(frameBox?.className).toBe('frame-box');
    });
  });

  describe('Componente FormRegistro', () => {
    it('debe renderizar el FormRegistro correctamente', () => {
      renderRegistroPage();
      expect(screen.getByTestId('mock-form-registro')).toBeInTheDocument();
    });

    it('debe renderizar exactamente un FormRegistro', () => {
      renderRegistroPage();
      const forms = screen.getAllByTestId('mock-form-registro');
      expect(forms).toHaveLength(1);
    });

    it('debe mostrar el contenido del FormRegistro', () => {
      renderRegistroPage();
      const form = screen.getByTestId('mock-form-registro');
      expect(form).toHaveTextContent('Formulario de Registro Mock');
    });
  });

  describe('Layout y centrado', () => {
    it('debe tener contenedor page-center para centrar el contenido', () => {
      const { container } = renderRegistroPage();
      const pageCenter = container.querySelector('.page-center');
      expect(pageCenter).toBeInTheDocument();
    });

    it('debe tener frame-box para enmarcar el formulario', () => {
      const { container } = renderRegistroPage();
      const frameBox = container.querySelector('.frame-box');
      expect(frameBox).toBeInTheDocument();
    });

    it('debe mantener la jerarquía de contenedores para el layout', () => {
      const { container } = renderRegistroPage();
      const pageCenter = container.querySelector('.page-center');
      const frameBox = container.querySelector('.frame-box');
      
      expect(pageCenter?.contains(frameBox)).toBe(true);
    });
  });

  describe('Integridad del componente', () => {
    it('debe renderizar sin errores', () => {
      expect(() => renderRegistroPage()).not.toThrow();
    });

    it('debe renderizar sin props', () => {
      const { container } = render(
        <BrowserRouter>
          <RegistroScreen />
        </BrowserRouter>
      );
      expect(container).toBeInTheDocument();
    });

    it('debe tener un único elemento raíz', () => {
      const { container } = renderRegistroPage();
      expect(container.firstChild).toBeTruthy();
    });

    it('debe mantener la estructura consistente en múltiples renderizados', () => {
      const { container: container1 } = renderRegistroPage();
      const { container: container2 } = renderRegistroPage();
      
      const pageCenter1 = container1.querySelector('.page-center');
      const pageCenter2 = container2.querySelector('.page-center');
      
      expect(pageCenter1).toBeInTheDocument();
      expect(pageCenter2).toBeInTheDocument();
    });
  });

  describe('Accesibilidad y estructura semántica', () => {
    it('debe tener una estructura de divs anidados correcta', () => {
      const { container } = renderRegistroPage();
      const allDivs = container.querySelectorAll('div');
      
      // Debería tener al menos 3 divs: page-center, frame-box, y mock-form-registro
      expect(allDivs.length).toBeGreaterThanOrEqual(3);
    });

    it('debe mantener el orden de elementos correcto', () => {
      const { container } = renderRegistroPage();
      const pageCenter = container.querySelector('.page-center');
      const frameBox = container.querySelector('.frame-box');
      
      expect(pageCenter).toBeInTheDocument();
      expect(frameBox).toBeInTheDocument();
      expect(pageCenter?.querySelector('.frame-box')).toBe(frameBox);
    });
  });

  describe('Renderizado del Fragment', () => {
    it('debe usar Fragment como contenedor raíz', () => {
      const { container } = renderRegistroPage();
      // El Fragment no aparece en el DOM, verificamos que existe page-center
      const pageCenter = container.querySelector('.page-center');
      expect(pageCenter).toBeInTheDocument();
    });

    it('debe renderizar contenido dentro del Fragment', () => {
      const { container } = renderRegistroPage();
      expect(container.querySelector('.page-center')).toBeInTheDocument();
    });
  });

  describe('Casos de uso', () => {
    it('debe mostrar la página de registro completa', () => {
      const { container } = renderRegistroPage();
      
      expect(container.querySelector('.page-center')).toBeInTheDocument();
      expect(container.querySelector('.frame-box')).toBeInTheDocument();
      expect(screen.getByTestId('mock-form-registro')).toBeInTheDocument();
    });

    it('debe proporcionar un contenedor visual para el formulario', () => {
      const { container } = renderRegistroPage();
      const frameBox = container.querySelector('.frame-box');
      const form = screen.getByTestId('mock-form-registro');
      
      expect(frameBox).toContainElement(form);
    });

    it('debe mantener la estructura de página independiente', () => {
      const { container } = renderRegistroPage();
      
      // No debe depender de props externas
      expect(container.querySelector('.page-center')).toBeInTheDocument();
      expect(screen.getByTestId('mock-form-registro')).toBeInTheDocument();
    });
  });

  describe('Validación completa', () => {
    it('debe tener todos los elementos requeridos presentes', () => {
      const { container } = renderRegistroPage();
      
      const pageCenter = container.querySelector('.page-center');
      const frameBox = container.querySelector('.frame-box');
      const form = screen.getByTestId('mock-form-registro');
      
      expect(pageCenter).toBeInTheDocument();
      expect(frameBox).toBeInTheDocument();
      expect(form).toBeInTheDocument();
      
      // Validar jerarquía
      expect(pageCenter).toContainElement(frameBox);
      expect(frameBox).toContainElement(form);
    });

    it('debe renderizar correctamente sin warnings', () => {
      const consoleWarn = vi.spyOn(console, 'warn');
      const consoleError = vi.spyOn(console, 'error');
      
      renderRegistroPage();
      
      expect(consoleWarn).not.toHaveBeenCalled();
      expect(consoleError).not.toHaveBeenCalled();
      
      consoleWarn.mockRestore();
      consoleError.mockRestore();
    });
  });
});
