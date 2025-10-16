import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminPage from '../../src/pages/AdminPage';

// Mock de los componentes admin
vi.mock('../src/components/admin/AdminProductos', () => ({
    default: () => <div data-testid="admin-productos">Admin Productos Component</div>
}));

vi.mock('../src/components/admin/AdminUsuarios', () => ({
    default: () => <div data-testid="admin-usuarios">Admin Usuarios Component</div>
}));

// Mock de las imágenes
vi.mock('../src/assets/images/principal/LogoTipo.png', () => ({
    default: 'mocked-logo.png'
}));

// Helper para renderizar con router
const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('AdminPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Renderizado inicial', () => {
        it('debe renderizar correctamente la página de administración', () => {
            renderWithRouter(<AdminPage />);
            
            expect(screen.getByText('Panel de Administración')).toBeInTheDocument();
        });

        it('debe mostrar el logotipo con los atributos correctos', () => {
            renderWithRouter(<AdminPage />);
            
            const logo = screen.getByAltText('Huerto Hogar');
            expect(logo).toBeInTheDocument();
            expect(logo).toHaveAttribute('title', 'Huerto Hogar');
            expect(logo).toHaveAttribute('width', '100');
        });

        it('debe mostrar el enlace para volver a la tienda', () => {
            renderWithRouter(<AdminPage />);
            
            const volverLink = screen.getByText('Volver a la Tienda');
            expect(volverLink).toBeInTheDocument();
        });

        it('debe mostrar las pestañas de navegación (Productos y Usuarios)', () => {
            renderWithRouter(<AdminPage />);
            
            expect(screen.getByText('Productos')).toBeInTheDocument();
            expect(screen.getByText('Usuarios')).toBeInTheDocument();
        });
    });

    describe('Navegación entre tabs', () => {
        it('debe mostrar el componente AdminProductos por defecto', () => {
            renderWithRouter(<AdminPage />);
            
            // Verificar que el tab de productos está activo
            const productosTab = screen.getByText('Productos').closest('a');
            expect(productosTab).toHaveClass('active');
            
            // Ambos componentes se renderizan, pero verificamos que AdminProductos esté visible
            expect(screen.getByTestId('admin-productos')).toBeInTheDocument();
        });

        it('debe cambiar a la pestaña de usuarios al hacer click', async () => {
            renderWithRouter(<AdminPage />);
            
            // Click en la pestaña de usuarios
            const usuariosTab = screen.getByText('Usuarios');
            fireEvent.click(usuariosTab);
            
            await waitFor(() => {
                expect(screen.getByTestId('admin-usuarios')).toBeInTheDocument();
            });
        });

        it('debe volver a la pestaña de productos al hacer click', async () => {
            renderWithRouter(<AdminPage />);
            
            // Primero ir a usuarios
            const usuariosTab = screen.getByText('Usuarios');
            fireEvent.click(usuariosTab);
            
            await waitFor(() => {
                expect(screen.getByTestId('admin-usuarios')).toBeInTheDocument();
            });
            
            // Volver a productos
            const productosTab = screen.getByText('Productos');
            fireEvent.click(productosTab);
            
            await waitFor(() => {
                expect(screen.getByTestId('admin-productos')).toBeInTheDocument();
            });
        });
    });

    describe('Estilos y clases CSS', () => {
        it('debe aplicar la clase admin-page al contenedor principal', () => {
            const { container } = renderWithRouter(<AdminPage />);
            
            expect(container.querySelector('.admin-page')).toBeInTheDocument();
        });

        it('debe aplicar la clase admin-navbar al navbar', () => {
            const { container } = renderWithRouter(<AdminPage />);
            
            expect(container.querySelector('.admin-navbar')).toBeInTheDocument();
        });

        it('debe aplicar las clases correctas a la navegación de tabs', () => {
            const { container } = renderWithRouter(<AdminPage />);
            
            expect(container.querySelector('.admin-nav')).toBeInTheDocument();
            expect(container.querySelector('.admin-nav-link')).toBeInTheDocument();
        });
    });

    describe('Iconos de Bootstrap', () => {
        it('debe mostrar el icono de flecha en el botón de volver', () => {
            const { container } = renderWithRouter(<AdminPage />);
            
            const arrowIcon = container.querySelector('.bi-arrow-left-circle');
            expect(arrowIcon).toBeInTheDocument();
        });

        it('debe mostrar el icono de caja en la pestaña de productos', () => {
            const { container } = renderWithRouter(<AdminPage />);
            
            const boxIcon = container.querySelector('.bi-box-seam');
            expect(boxIcon).toBeInTheDocument();
        });

        it('debe mostrar el icono de personas en la pestaña de usuarios', () => {
            const { container } = renderWithRouter(<AdminPage />);
            
            const peopleIcon = container.querySelector('.bi-people');
            expect(peopleIcon).toBeInTheDocument();
        });
    });

    describe('Accesibilidad', () => {
        it('debe tener un navbar con aria-controls correcto', () => {
            renderWithRouter(<AdminPage />);
            
            const navbarToggle = screen.getByLabelText('Toggle navigation');
            expect(navbarToggle).toHaveAttribute('aria-controls', 'admin-navbar-nav');
        });

        it('debe usar Nav.Link con eventKey para accesibilidad de teclado', () => {
            renderWithRouter(<AdminPage />);
            
            const productosTab = screen.getByText('Productos').closest('a');
            const usuariosTab = screen.getByText('Usuarios').closest('a');
            
            expect(productosTab).toBeInTheDocument();
            expect(usuariosTab).toBeInTheDocument();
        });
    });

    describe('Layout responsive', () => {
        it('debe tener un Navbar con expand="lg"', () => {
            const { container } = renderWithRouter(<AdminPage />);
            
            const navbar = container.querySelector('.navbar-expand-lg');
            expect(navbar).toBeInTheDocument();
        });

        it('debe contener un Container de Bootstrap', () => {
            const { container } = renderWithRouter(<AdminPage />);
            
            const containers = container.querySelectorAll('.container');
            expect(containers.length).toBeGreaterThan(0);
        });
    });

    describe('Estado del componente', () => {
        it('debe mantener la pestaña activa en el estado', async () => {
            renderWithRouter(<AdminPage />);
            
            // Verificar que productos está activo inicialmente
            const productosTab = screen.getByText('Productos').closest('a');
            expect(productosTab).toHaveClass('active');
            
            // Cambiar a usuarios
            const usuariosTab = screen.getByText('Usuarios');
            fireEvent.click(usuariosTab);
            
            await waitFor(() => {
                const usuariosTabActive = screen.getByText('Usuarios').closest('a');
                expect(usuariosTabActive).toHaveClass('active');
            });
        });
    });

    describe('Integración con React Router', () => {
        it('debe usar Link de react-router-dom para navegación', () => {
            renderWithRouter(<AdminPage />);
            
            const links = screen.getAllByRole('link');
            expect(links.length).toBeGreaterThan(0);
        });

        it('el enlace de volver debe apuntar a la raíz', () => {
            renderWithRouter(<AdminPage />);
            
            const volverLink = screen.getByText('Volver a la Tienda').closest('a');
            expect(volverLink).toHaveAttribute('href', '/');
        });

        it('el logo debe apuntar a la raíz', () => {
            renderWithRouter(<AdminPage />);
            
            const logoLink = screen.getByAltText('Huerto Hogar').closest('a');
            expect(logoLink).toHaveAttribute('href', '/');
        });
    });
});
