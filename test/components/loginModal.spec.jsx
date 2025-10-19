import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginModal from '../../src/components/loginModal';
import users from '../../src/data/user';

// Mock del componente LoginUser
vi.mock('../../src/components/ui/Loging', () => ({
  default: ({ show, handleClose, onLogin }) => {
    if (!show) return null;
    return (
      <div data-testid="login-user-modal">
        <button onClick={() => {
          const testUser = users[0]; // Usar el primer usuario del mock
          onLogin(testUser, false);
        }}>
          Mock Login Success
        </button>
        <button onClick={handleClose}>Close Login</button>
      </div>
    );
  }
}));

// Helper para renderizar con Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('LoginModal Component', () => {
  let mockHandleClose;
  let mockOnUserChange;

  beforeEach(() => {
    mockHandleClose = vi.fn();
    mockOnUserChange = vi.fn();
  });

  describe('Renderizado básico', () => {
    it('debe renderizar el modal cuando show es true', () => {
      renderWithRouter(
        <LoginModal 
          show={true} 
          handleClose={mockHandleClose} 
          user={null}
          onUserChange={mockOnUserChange}
        />
      );

      expect(screen.getByText('Mi Perfil')).toBeInTheDocument();
    });

    it('no debe renderizar el modal cuando show es false', () => {
      renderWithRouter(
        <LoginModal 
          show={false} 
          handleClose={mockHandleClose} 
          user={null}
          onUserChange={mockOnUserChange}
        />
      );

      expect(screen.queryByText('Mi Perfil')).not.toBeInTheDocument();
    });

    it('debe mostrar el icono de perfil', () => {
      renderWithRouter(
        <LoginModal 
          show={true} 
          handleClose={mockHandleClose} 
          user={null}
          onUserChange={mockOnUserChange}
        />
      );

      const icon = screen.getByText('Mi Perfil').parentElement.parentElement.querySelector('.bi-person-circle');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Estado de invitado (sin usuario)', () => {
    it('debe mostrar "Invitado" cuando no hay usuario', () => {
      renderWithRouter(
        <LoginModal 
          show={true} 
          handleClose={mockHandleClose} 
          user={null}
          onUserChange={mockOnUserChange}
        />
      );

      expect(screen.getByText('Invitado')).toBeInTheDocument();
      expect(screen.getByText('No has iniciado sesión')).toBeInTheDocument();
    });

    it('debe mostrar las opciones correctas para invitado', () => {
      renderWithRouter(
        <LoginModal 
          show={true} 
          handleClose={mockHandleClose} 
          user={null}
          onUserChange={mockOnUserChange}
        />
      );

      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();      
      expect(screen.getByText('Registrarse')).toBeInTheDocument();
    });

    it('no debe mostrar las opciones de usuario logueado', () => {
      renderWithRouter(
        <LoginModal 
          show={true} 
          handleClose={mockHandleClose} 
          user={null}
          onUserChange={mockOnUserChange}
        />
      );

      expect(screen.queryByText('Historial')).not.toBeInTheDocument();
      expect(screen.queryByText('Configuración')).not.toBeInTheDocument();
      expect(screen.queryByText('Cerrar Sesión')).not.toBeInTheDocument();
    });
  });

  describe('Estado de usuario logueado', () => {
    const testUser = {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@example.com',
      password: 'password123',
      role: 'user'
    };

    it('debe mostrar el nombre del usuario cuando está logueado', () => {
      renderWithRouter(
        <LoginModal 
          show={true} 
          handleClose={mockHandleClose} 
          user={testUser}
          onUserChange={mockOnUserChange}
        />
      );

      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('juan@example.com')).toBeInTheDocument();
    });

    it('debe mostrar las opciones correctas para usuario logueado', () => {
      renderWithRouter(
        <LoginModal 
          show={true} 
          handleClose={mockHandleClose} 
          user={testUser}
          onUserChange={mockOnUserChange}
        />
      );

      expect(screen.getByText('Historial')).toBeInTheDocument();
      expect(screen.getByText('Configuración')).toBeInTheDocument();
      expect(screen.getByText('Ayuda')).toBeInTheDocument();
      expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
    });

    it('no debe mostrar las opciones de invitado', () => {
      renderWithRouter(
        <LoginModal 
          show={true} 
          handleClose={mockHandleClose} 
          user={testUser}
          onUserChange={mockOnUserChange}
        />
      );

      expect(screen.queryByText('Iniciar Sesión')).not.toBeInTheDocument();
      expect(screen.queryByText('Registrarse')).not.toBeInTheDocument();
    });
  });

  describe('Interacciones del usuario', () => {
    it('debe abrir el modal de login al hacer clic en "Iniciar Sesión"', async () => {
      renderWithRouter(
        <LoginModal 
          show={true} 
          handleClose={mockHandleClose} 
          user={null}
          onUserChange={mockOnUserChange}
        />
      );

      const loginButton = screen.getByText('Iniciar Sesión');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-user-modal')).toBeInTheDocument();
      });
    });

    it('debe cerrar el modal de login cuando se cierra internamente', async () => {
      renderWithRouter(
        <LoginModal 
          show={true} 
          handleClose={mockHandleClose} 
          user={null}
          onUserChange={mockOnUserChange}
        />
      );

      // Abrir modal de login
      const loginButton = screen.getByText('Iniciar Sesión');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-user-modal')).toBeInTheDocument();
      });

      // Cerrar modal de login
      const closeLoginButton = screen.getByText('Close Login');
      fireEvent.click(closeLoginButton);

      await waitFor(() => {
        expect(screen.queryByTestId('login-user-modal')).not.toBeInTheDocument();
      });
    });

    it('debe manejar el login exitoso correctamente', async () => {
      renderWithRouter(
        <LoginModal 
          show={true} 
          handleClose={mockHandleClose} 
          user={null}
          onUserChange={mockOnUserChange}
        />
      );

      // Abrir modal de login
      const loginButton = screen.getByText('Iniciar Sesión');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-user-modal')).toBeInTheDocument();
      });

      // Simular login exitoso
      const mockLoginButton = screen.getByText('Mock Login Success');
      fireEvent.click(mockLoginButton);

      await waitFor(() => {
        expect(mockOnUserChange).toHaveBeenCalledWith(users[0], false);
      });
    });

    it('debe llamar a handleLogout al hacer clic en "Cerrar Sesión"', () => {
      const testUser = {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
        role: 'user'
      };

      renderWithRouter(
        <LoginModal 
          show={true} 
          handleClose={mockHandleClose} 
          user={testUser}
          onUserChange={mockOnUserChange}
        />
      );

      const logoutButton = screen.getByText('Cerrar Sesión');
      fireEvent.click(logoutButton);

      expect(mockOnUserChange).toHaveBeenCalledWith(null);
    });

    it('debe navegar a registro al hacer clic en "Registrarse"', () => {
      const { container } = renderWithRouter(
        <LoginModal 
          show={true} 
          handleClose={mockHandleClose} 
          user={null}
          onUserChange={mockOnUserChange}
        />
      );

      const registerButton = screen.getByText('Registrarse');
      fireEvent.click(registerButton);

      // Verificar que se llama al handleClose
      expect(mockHandleClose).toHaveBeenCalled();
    });

    it('debe mostrar console.log al hacer clic en Historial', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const testUser = {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
        role: 'user'
      };

      renderWithRouter(
        <LoginModal 
          show={true} 
          handleClose={mockHandleClose} 
          user={testUser}
          onUserChange={mockOnUserChange}
        />
      );

      const historialButton = screen.getByText('Historial');
      fireEvent.click(historialButton);

      expect(consoleSpy).toHaveBeenCalledWith('Ir a Historial');
      consoleSpy.mockRestore();
    });

    it('debe mostrar console.log al hacer clic en Configuración', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const testUser = {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
        role: 'user'
      };

      renderWithRouter(
        <LoginModal 
          show={true} 
          handleClose={mockHandleClose} 
          user={testUser}
          onUserChange={mockOnUserChange}
        />
      );

      const configButton = screen.getByText('Configuración');
      fireEvent.click(configButton);

      expect(consoleSpy).toHaveBeenCalledWith('Ir a Configuración');
      consoleSpy.mockRestore();
    });
  });

  describe('Sincronización con props', () => {
    it('debe actualizar el estado local cuando cambia el prop user', () => {
      const { rerender } = renderWithRouter(
        <LoginModal 
          show={true} 
          handleClose={mockHandleClose} 
          user={null}
          onUserChange={mockOnUserChange}
        />
      );

      expect(screen.getByText('Invitado')).toBeInTheDocument();

      const testUser = {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
        role: 'user'
      };

      rerender(
        <BrowserRouter>
          <LoginModal 
            show={true} 
            handleClose={mockHandleClose} 
            user={testUser}
            onUserChange={mockOnUserChange}
          />
        </BrowserRouter>
      );

      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('juan@example.com')).toBeInTheDocument();
    });

    it('debe manejar el cambio de usuario logueado a invitado', () => {
      const testUser = {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
        role: 'user'
      };

      const { rerender } = renderWithRouter(
        <LoginModal 
          show={true} 
          handleClose={mockHandleClose} 
          user={testUser}
          onUserChange={mockOnUserChange}
        />
      );

      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();

      rerender(
        <BrowserRouter>
          <LoginModal 
            show={true} 
            handleClose={mockHandleClose} 
            user={null}
            onUserChange={mockOnUserChange}
          />
        </BrowserRouter>
      );

      expect(screen.getByText('Invitado')).toBeInTheDocument();
    });
  });

  describe('Callbacks opcionales', () => {
    it('debe funcionar sin onUserChange definido', () => {
      renderWithRouter(
        <LoginModal 
          show={true} 
          handleClose={mockHandleClose} 
          user={null}
          onUserChange={undefined}
        />
      );

      const loginButton = screen.getByText('Iniciar Sesión');
      fireEvent.click(loginButton);

      // No debe lanzar error
      expect(screen.getByTestId('login-user-modal')).toBeInTheDocument();
    });

    it('debe funcionar sin handleClose definido', () => {
      renderWithRouter(
        <LoginModal 
          show={true} 
          handleClose={undefined} 
          user={null}
          onUserChange={mockOnUserChange}
        />
      );

      // No debe lanzar error al renderizar
      expect(screen.getByText('Mi Perfil')).toBeInTheDocument();
    });
  });

  describe('Integración completa', () => {
    it('debe manejar el flujo completo: invitado -> login -> usuario logueado -> logout', async () => {
      const { rerender } = renderWithRouter(
        <LoginModal 
          show={true} 
          handleClose={mockHandleClose} 
          user={null}
          onUserChange={mockOnUserChange}
        />
      );

      // Estado inicial: Invitado
      expect(screen.getByText('Invitado')).toBeInTheDocument();

      // Abrir modal de login
      const loginButton = screen.getByText('Iniciar Sesión');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-user-modal')).toBeInTheDocument();
      });

      // Simular login exitoso
      const mockLoginButton = screen.getByText('Mock Login Success');
      fireEvent.click(mockLoginButton);

      await waitFor(() => {
        expect(mockOnUserChange).toHaveBeenCalledWith(users[0], false);
      });

      // Simular que el padre actualiza el user
      rerender(
        <BrowserRouter>
          <LoginModal 
            show={true} 
            handleClose={mockHandleClose} 
            user={users[0]}
            onUserChange={mockOnUserChange}
          />
        </BrowserRouter>
      );

      // Verificar que ahora muestra el usuario
      expect(screen.getByText(users[0].name)).toBeInTheDocument();

      // Hacer logout
      const logoutButton = screen.getByText('Cerrar Sesión');
      fireEvent.click(logoutButton);

      expect(mockOnUserChange).toHaveBeenCalledWith(null);
    });
  });
});
