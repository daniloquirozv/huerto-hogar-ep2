import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Footer from '../../../src/components/layout/footer';
import { tiendas } from '../../../src/data/tiendas';

// Mock del componente GoogleMapsIntegration
vi.mock('../../../src/components/ui/googleMapsIntegration', () => ({
  default: ({ selectedStore, onStoreSelect }) => (
    <div data-testid="google-maps-mock">
      Google Maps Mock - Store: {selectedStore !== null ? selectedStore : 'none'}
    </div>
  )
}));

describe('Footer Component', () => {
  
  describe('Renderizado básico', () => {
    it('debe renderizar el componente footer correctamente', () => {
      render(<Footer />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('footer-eco');
    });

    it('debe renderizar el título de tiendas asociadas', () => {
      render(<Footer />);
      expect(screen.getByText(/Tiendas Asociadas/i)).toBeInTheDocument();
    });

    it('debe renderizar el título de Encuéntranos', () => {
      render(<Footer />);
      expect(screen.getByText(/Encuéntranos/i)).toBeInTheDocument();
    });

    it('debe renderizar el título de Síguenos', () => {
      render(<Footer />);
      expect(screen.getByText(/Síguenos/i)).toBeInTheDocument();
    });

    it('debe renderizar el año y nombre de la empresa', () => {
      render(<Footer />);
      expect(screen.getByText(/© 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/HuertoHogar/i)).toBeInTheDocument();
    });

    it('debe renderizar el eslogan', () => {
      render(<Footer />);
      expect(screen.getByText(/Cultivando el futuro, un hogar a la vez/i)).toBeInTheDocument();
    });
  });

  describe('Tiendas Asociadas', () => {
    it('debe renderizar todas las tiendas del arreglo', () => {
      const { container } = render(<Footer />);
      tiendas.forEach(tienda => {
        // Buscar el nombre seguido de dos puntos para identificar el nombre de la tienda
        expect(screen.getByText(new RegExp(`${tienda.nombre}:`, 'i'))).toBeInTheDocument();
      });
    });

    it('debe mostrar la dirección de cada tienda', () => {
      render(<Footer />);
      tiendas.forEach(tienda => {
        expect(screen.getByText(new RegExp(tienda.direccion, 'i'))).toBeInTheDocument();
      });
    });

    it('debe mostrar el teléfono de cada tienda', () => {
      const { container } = render(<Footer />);
      // Verificar que cada teléfono aparece al menos una vez
      const uniquePhones = [...new Set(tiendas.map(t => t.telefono))];
      uniquePhones.forEach(telefono => {
        const escapedPhone = telefono.replace(/[+]/g, '\\+');
        const matches = screen.getAllByText(new RegExp(escapedPhone, 'i'));
        expect(matches.length).toBeGreaterThan(0);
      });
    });

    it('debe tener iconos de geolocalización para cada tienda', () => {
      const { container } = render(<Footer />);
      const geoIcons = container.querySelectorAll('.bi-geo-alt');
      // Debe haber al menos tantos iconos como tiendas más el del título "Encuéntranos"
      expect(geoIcons.length).toBeGreaterThanOrEqual(tiendas.length);
    });

    it('debe permitir hacer clic en el nombre de una tienda', () => {
      render(<Footer />);
      const firstStoreName = screen.getByText(new RegExp(`${tiendas[0].nombre}:`, 'i'));
      
      expect(firstStoreName).toBeInTheDocument();
      fireEvent.click(firstStoreName);
      
      // Verificar que el texto tiene el estilo de seleccionado
      expect(firstStoreName).toHaveStyle({ color: '#28a745' });
    });

    it('debe cambiar el color de la tienda seleccionada', () => {
      render(<Footer />);
      const secondStoreName = screen.getByText(new RegExp(`${tiendas[1].nombre}:`, 'i'));
      
      // Hacer clic en la segunda tienda
      fireEvent.click(secondStoreName);
      
      // Verificar que cambió de color
      expect(secondStoreName).toHaveStyle({ color: '#28a745' });
    });

    it('debe tener cursor pointer en los nombres de tiendas', () => {
      render(<Footer />);
      const firstStoreName = screen.getByText(new RegExp(`${tiendas[0].nombre}:`, 'i'));
      
      expect(firstStoreName).toHaveStyle({ cursor: 'pointer' });
    });

    it('debe tener texto subrayado en los nombres de tiendas', () => {
      render(<Footer />);
      const firstStoreName = screen.getByText(new RegExp(`${tiendas[0].nombre}:`, 'i'));
      
      expect(firstStoreName).toHaveStyle({ textDecoration: 'underline' });
    });
  });

  describe('Mapa de Google', () => {
    it('debe renderizar el componente GoogleMapsIntegration', () => {
      render(<Footer />);
      expect(screen.getByTestId('google-maps-mock')).toBeInTheDocument();
    });

    it('debe inicializar sin tienda seleccionada', () => {
      render(<Footer />);
      const mapElement = screen.getByTestId('google-maps-mock');
      expect(mapElement).toHaveTextContent('Store: none');
    });

    it('debe actualizar la tienda seleccionada cuando se hace clic en una tienda', () => {
      render(<Footer />);
      const firstStoreName = screen.getByText(new RegExp(`${tiendas[0].nombre}:`, 'i'));
      
      fireEvent.click(firstStoreName);
      
      const mapElement = screen.getByTestId('google-maps-mock');
      expect(mapElement).toHaveTextContent('Store: 0');
    });

    it('debe tener el contenedor del mapa con las clases correctas', () => {
      const { container } = render(<Footer />);
      const mapContainer = container.querySelector('.footer-google-maps');
      
      expect(mapContainer).toBeInTheDocument();
      expect(mapContainer).toHaveClass('rounded-4', 'overflow-hidden', 'shadow-sm', 'mb-2');
    });
  });

  describe('Redes Sociales', () => {
    it('debe renderizar el enlace de Facebook', () => {
      const { container } = render(<Footer />);
      const facebookLink = container.querySelector('a[href="https://facebook.com"]');
      expect(facebookLink).toBeInTheDocument();
      expect(facebookLink).toHaveAttribute('href', 'https://facebook.com');
    });

    it('debe renderizar el enlace de Instagram', () => {
      const { container } = render(<Footer />);
      const instagramLink = container.querySelector('a[href="https://instagram.com"]');
      expect(instagramLink).toBeInTheDocument();
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com');
    });

    it('debe renderizar el enlace de WhatsApp', () => {
      const { container } = render(<Footer />);
      const whatsappLink = container.querySelector('a[href="https://wa.me/56912345678"]');
      expect(whatsappLink).toBeInTheDocument();
      expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/56912345678');
    });

    it('debe renderizar el enlace de Twitter', () => {
      const { container } = render(<Footer />);
      const twitterLink = container.querySelector('a[href="https://twitter.com"]');
      expect(twitterLink).toBeInTheDocument();
      expect(twitterLink).toHaveAttribute('href', 'https://twitter.com');
    });

    it('todos los enlaces de redes sociales deben abrir en nueva pestaña', () => {
      const { container } = render(<Footer />);
      const socialLinks = [
        container.querySelector('a[href="https://facebook.com"]'),
        container.querySelector('a[href="https://instagram.com"]'),
        container.querySelector('a[href="https://wa.me/56912345678"]'),
        container.querySelector('a[href="https://twitter.com"]')
      ];

      socialLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('debe tener la clase social-link en todos los enlaces sociales', () => {
      const { container } = render(<Footer />);
      const socialLinks = container.querySelectorAll('.social-link');
      
      expect(socialLinks.length).toBe(4); // Facebook, Instagram, WhatsApp, Twitter
    });

    it('debe tener iconos de Bootstrap en los enlaces sociales', () => {
      const { container } = render(<Footer />);
      
      expect(container.querySelector('.bi-facebook')).toBeInTheDocument();
      expect(container.querySelector('.bi-instagram')).toBeInTheDocument();
      expect(container.querySelector('.bi-whatsapp')).toBeInTheDocument();
      expect(container.querySelector('.bi-twitter')).toBeInTheDocument();
    });
  });

  describe('Sección de derechos reservados', () => {
    it('debe renderizar el enlace de Política de Privacidad', () => {
      render(<Footer />);
      const privacyLink = screen.getByText(/Política de Privacidad/i);
      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink.closest('a')).toHaveAttribute('href', '#privacy');
    });

    it('debe renderizar el enlace de Términos y Condiciones', () => {
      render(<Footer />);
      const termsLink = screen.getByText(/Términos y Condiciones/i);
      expect(termsLink).toBeInTheDocument();
      expect(termsLink.closest('a')).toHaveAttribute('href', '#terms');
    });

    it('debe renderizar el enlace de Política de Cookies', () => {
      render(<Footer />);
      const cookiesLink = screen.getByText(/Política de Cookies/i);
      expect(cookiesLink).toBeInTheDocument();
      expect(cookiesLink.closest('a')).toHaveAttribute('href', '#cookies');
    });

    it('todos los derechos reservados están en el año correcto', () => {
      render(<Footer />);
      expect(screen.getByText(/© 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/Todos los derechos reservados/i)).toBeInTheDocument();
    });
  });

  describe('Interactividad entre componentes', () => {
    it('debe actualizar el mapa cuando se selecciona una tienda diferente', () => {
      render(<Footer />);
      
      // Seleccionar primera tienda
      const firstStoreName = screen.getByText(new RegExp(`${tiendas[0].nombre}:`, 'i'));
      fireEvent.click(firstStoreName);
      
      let mapElement = screen.getByTestId('google-maps-mock');
      expect(mapElement).toHaveTextContent('Store: 0');
      
      // Seleccionar segunda tienda
      if (tiendas.length > 1) {
        const secondStoreName = screen.getByText(new RegExp(`${tiendas[1].nombre}:`, 'i'));
        fireEvent.click(secondStoreName);
        
        mapElement = screen.getByTestId('google-maps-mock');
        expect(mapElement).toHaveTextContent('Store: 1');
      }
    });

    it('debe mantener solo una tienda seleccionada a la vez', () => {
      render(<Footer />);
      
      if (tiendas.length > 1) {
        const firstStoreName = screen.getByText(new RegExp(`${tiendas[0].nombre}:`, 'i'));
        const secondStoreName = screen.getByText(new RegExp(`${tiendas[1].nombre}:`, 'i'));
        
        // Seleccionar primera tienda
        fireEvent.click(firstStoreName);
        expect(firstStoreName).toHaveStyle({ color: '#28a745' });
        
        // Seleccionar segunda tienda
        fireEvent.click(secondStoreName);
        expect(secondStoreName).toHaveStyle({ color: '#28a745' });
        
        // La primera ya no debe estar con color verde
        expect(firstStoreName).not.toHaveStyle({ color: '#28a745' });
      }
    });
  });

  describe('Estructura y layout', () => {
    it('debe tener la estructura de Container y Row de Bootstrap', () => {
      const { container } = render(<Footer />);
      
      expect(container.querySelector('.container-fluid')).toBeInTheDocument();
      expect(container.querySelectorAll('.row').length).toBeGreaterThan(0);
    });

    it('debe tener tres columnas principales en desktop', () => {
      const { container } = render(<Footer />);
      const columns = container.querySelectorAll('[class*="col-lg"]');
      
      expect(columns.length).toBeGreaterThanOrEqual(3);
    });

    it('debe tener el id contacto en el footer', () => {
      render(<Footer />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveAttribute('id', 'contacto');
    });

    it('debe tener una línea divisoria', () => {
      const { container } = render(<Footer />);
      const divider = container.querySelector('[style*="rgba(255, 255, 255, 0.2)"]');
      expect(divider).toBeInTheDocument();
    });
  });

  describe('Accesibilidad', () => {
    it('debe tener iconos semánticos para secciones', () => {
      const { container } = render(<Footer />);
      
      expect(container.querySelector('.bi-shop')).toBeInTheDocument(); // Tiendas
      expect(container.querySelector('.bi-share')).toBeInTheDocument(); // Redes sociales
    });

    it('todos los enlaces externos deben tener rel="noopener noreferrer"', () => {
      const { container } = render(<Footer />);
      const externalLinks = container.querySelectorAll('a[target="_blank"]');
      
      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('debe tener textos legibles para screen readers', () => {
      render(<Footer />);
      
      // Verificar que hay texto descriptivo, no solo iconos
      expect(screen.getByText(/Tiendas Asociadas/i)).toBeInTheDocument();
      expect(screen.getByText(/Encuéntranos/i)).toBeInTheDocument();
      expect(screen.getByText(/Síguenos/i)).toBeInTheDocument();
    });
  });

  describe('Estilos y clases CSS', () => {
    it('debe tener la clase eco-title en los títulos', () => {
      const { container } = render(<Footer />);
      const ecoTitles = container.querySelectorAll('.eco-title');
      
      expect(ecoTitles.length).toBeGreaterThan(0);
    });

    it('debe tener la clase footer-social para la sección de redes', () => {
      const { container } = render(<Footer />);
      expect(container.querySelector('.footer-social')).toBeInTheDocument();
    });

    it('debe tener la clase footer-list para la lista de tiendas', () => {
      const { container } = render(<Footer />);
      const footerList = container.querySelector('.footer-list');
      expect(footerList).toBeInTheDocument();
    });

    it('debe tener listas sin estilo (list-unstyled)', () => {
      const { container } = render(<Footer />);
      expect(container.querySelector('.list-unstyled')).toBeInTheDocument();
    });
  });
});
