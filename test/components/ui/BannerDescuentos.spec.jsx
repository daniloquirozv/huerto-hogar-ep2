import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import BannerDescuentos from '../../../src/components/ui/BannerDescuentos';

// Mock de navigator.clipboard
Object.assign(navigator, {
    clipboard: {
        writeText: vi.fn(() => Promise.resolve())
    }
});

// Mock de los datos de promociones
vi.mock('../../../src/data/blogPosts', () => ({
    promocionesActivas: [
        {
            id: 1,
            titulo: "¡OFERTA ESPECIAL! 30% OFF en Verduras Orgánicas",
            categoria: "Promociones",
            fecha: "2025-10-10",
            resumen: "¡Aprovecha nuestra súper oferta en verduras orgánicas!",
            descuento: 30,
            codigoCupon: "VERDURAS30",
            fechaVencimiento: "2025-12-31",
            urgente: false
        },
        {
            id: 2,
            titulo: "¡FLASH SALE! 50% OFF en Catálogo",
            categoria: "Promociones Flash",
            fecha: "2025-10-15",
            resumen: "¡Solo por 48 horas! Disfruta de un 50% de descuento.",
            descuento: 50,
            codigoCupon: "FLASH50",
            fechaVencimiento: "2025-11-30",
            urgente: true
        },
        {
            id: 3,
            titulo: "20% OFF en Frutas de Temporada",
            categoria: "Ofertas",
            fecha: "2025-10-12",
            resumen: "Descuentos en las mejores frutas del otoño.",
            descuento: 20,
            codigoCupon: "OTOÑO20",
            fechaVencimiento: "2025-10-20",
            urgente: false
        }
    ]
}));

describe('BannerDescuentos Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    describe('Renderizado inicial', () => {
        it('debe renderizar el componente correctamente', () => {
            render(<BannerDescuentos />);
            
            expect(screen.getByText(/OFERTA ESPECIAL! 30% OFF en Verduras Orgánicas/i)).toBeInTheDocument();
        });

        it('debe mostrar la primera promoción por defecto', () => {
            render(<BannerDescuentos />);
            
            expect(screen.getByText(/OFERTA ESPECIAL! 30% OFF en Verduras Orgánicas/i)).toBeInTheDocument();
            expect(screen.getByText(/Aprovecha nuestra súper oferta en verduras orgánicas!/i)).toBeInTheDocument();
        });

        it('debe mostrar el porcentaje de descuento', () => {
            render(<BannerDescuentos />);
            
            expect(screen.getByText('30%')).toBeInTheDocument();
            expect(screen.getByText('OFF')).toBeInTheDocument();
        });

        it('debe mostrar la categoría de la promoción', () => {
            render(<BannerDescuentos />);
            
            expect(screen.getByText('Promociones')).toBeInTheDocument();
        });

        it('debe mostrar el código de cupón', () => {
            render(<BannerDescuentos />);
            
            expect(screen.getByText('Código:')).toBeInTheDocument();
            expect(screen.getByText('VERDURAS30')).toBeInTheDocument();
        });

        it('debe mostrar el botón para copiar cupón', () => {
            render(<BannerDescuentos />);
            
            expect(screen.getByRole('button', { name: /Copiar/i })).toBeInTheDocument();
        });

        it('debe mostrar el botón para aprovechar oferta', () => {
            render(<BannerDescuentos />);
            
            expect(screen.getByRole('button', { name: /Aprovechar Oferta!/i })).toBeInTheDocument();
        });

        it('debe tener el enlace correcto en el botón de aprovechar oferta', () => {
            render(<BannerDescuentos />);
            
            const botonOferta = screen.getByRole('button', { name: /Aprovechar Oferta!/i });
            expect(botonOferta).toHaveAttribute('href', '/productos');
        });

        it('debe mostrar indicadores cuando hay múltiples promociones', () => {
            render(<BannerDescuentos />);
            
            const indicadores = screen.getAllByRole('button', { name: /Ver promoción/i });
            expect(indicadores).toHaveLength(3);
        });

        it('no debe mostrar el ícono de urgente en promociones normales', () => {
            render(<BannerDescuentos />);
            
            const titulo = screen.getByText(/OFERTA ESPECIAL! 30% OFF en Verduras Orgánicas/i).parentElement;
            expect(titulo.querySelector('.bi-lightning-fill')).not.toBeInTheDocument();
        });
    });

    describe('Cálculo de días restantes', () => {
        it('debe mostrar días restantes para promociones vigentes', () => {
            render(<BannerDescuentos />);
            
            expect(screen.getByText(/días restantes/i)).toBeInTheDocument();
        });

        it('debe calcular correctamente los días restantes', () => {
            render(<BannerDescuentos />);
            
            // La promoción vence el 2025-12-31, debe mostrar días restantes
            const diasText = screen.getByText(/días restantes/i);
            expect(diasText).toBeInTheDocument();
        });
    });

    describe('Funcionalidad de copiar cupón', () => {
        it('debe copiar el código del cupón al hacer click', async () => {
            render(<BannerDescuentos />);
            
            const botonCopiar = screen.getByRole('button', { name: /Copiar/i });
            
            await act(async () => {
                fireEvent.click(botonCopiar);
            });
            
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('VERDURAS30');
        });

        it('debe cambiar el texto del botón después de copiar', async () => {
            render(<BannerDescuentos />);
            
            const botonCopiar = screen.getByRole('button', { name: /Copiar/i });
            
            await act(async () => {
                fireEvent.click(botonCopiar);
            });
            
            expect(screen.getByText(/¡Copiado!/i)).toBeInTheDocument();
        });

        it('debe cambiar el icono del botón después de copiar', async () => {
            render(<BannerDescuentos />);
            
            const botonCopiar = screen.getByRole('button', { name: /Copiar/i });
            
            await act(async () => {
                fireEvent.click(botonCopiar);
            });
            
            const botonCopiado = screen.getByRole('button', { name: /¡Copiado!/i });
            expect(botonCopiado.querySelector('.bi-check-circle-fill')).toBeInTheDocument();
        });

        it('debe restaurar el texto original después de 3 segundos', async () => {
            render(<BannerDescuentos />);
            
            const botonCopiar = screen.getByRole('button', { name: /Copiar/i });
            
            await act(async () => {
                fireEvent.click(botonCopiar);
            });
            
            expect(screen.getByText(/¡Copiado!/i)).toBeInTheDocument();
            
            // Avanzar el tiempo 3 segundos
            await act(async () => {
                vi.advanceTimersByTime(3000);
            });
            
            expect(screen.getByText(/Copiar/i)).toBeInTheDocument();
        });

        it('debe cambiar la variante del botón después de copiar', async () => {
            render(<BannerDescuentos />);
            
            const botonCopiar = screen.getByRole('button', { name: /Copiar/i });
            expect(botonCopiar).toHaveClass('btn-warning');
            
            await act(async () => {
                fireEvent.click(botonCopiar);
            });
            
            const botonCopiado = screen.getByRole('button', { name: /¡Copiado!/i });
            expect(botonCopiado).toHaveClass('btn-success');
        });
    });

    describe('Rotación de promociones', () => {
        it('debe cambiar a la siguiente promoción después de 5 segundos', async () => {
            render(<BannerDescuentos />);
            
            expect(screen.getByText(/OFERTA ESPECIAL! 30% OFF en Verduras Orgánicas/i)).toBeInTheDocument();
            
            // Avanzar 5 segundos
            await act(async () => {
                vi.advanceTimersByTime(5000);
            });
            
            expect(screen.getByText(/FLASH SALE! 50% OFF en Catálogo/i)).toBeInTheDocument();
        });

        it('debe volver a la primera promoción después de la última', async () => {
            render(<BannerDescuentos />);
            
            expect(screen.getByText(/OFERTA ESPECIAL! 30% OFF en Verduras Orgánicas/i)).toBeInTheDocument();
            
            // Avanzar 15 segundos (3 rotaciones)
            await act(async () => {
                vi.advanceTimersByTime(15000);
            });
            
            expect(screen.getByText(/OFERTA ESPECIAL! 30% OFF en Verduras Orgánicas/i)).toBeInTheDocument();
        });

        it('debe actualizar el código de cupón al cambiar de promoción', async () => {
            render(<BannerDescuentos />);
            
            expect(screen.getByText('VERDURAS30')).toBeInTheDocument();
            
            // Avanzar 5 segundos
            await act(async () => {
                vi.advanceTimersByTime(5000);
            });
            
            expect(screen.getByText('FLASH50')).toBeInTheDocument();
        });

        it('debe actualizar el porcentaje de descuento al cambiar de promoción', async () => {
            render(<BannerDescuentos />);
            
            expect(screen.getByText('30%')).toBeInTheDocument();
            
            // Avanzar 5 segundos
            await act(async () => {
                vi.advanceTimersByTime(5000);
            });
            
            expect(screen.getByText('50%')).toBeInTheDocument();
        });
    });

    describe('Navegación manual de promociones', () => {
        it('debe cambiar de promoción al hacer click en un indicador', async () => {
            render(<BannerDescuentos />);
            
            expect(screen.getByText(/OFERTA ESPECIAL! 30% OFF en Verduras Orgánicas/i)).toBeInTheDocument();
            
            const indicadores = screen.getAllByRole('button', { name: /Ver promoción/i });
            
            await act(async () => {
                fireEvent.click(indicadores[1]);
            });
            
            expect(screen.getByText(/FLASH SALE! 50% OFF en Catálogo/i)).toBeInTheDocument();
        });

        it('debe marcar el indicador activo correctamente', () => {
            render(<BannerDescuentos />);
            
            const indicadores = screen.getAllByRole('button', { name: /Ver promoción/i });
            expect(indicadores[0]).toHaveClass('activo');
            expect(indicadores[1]).not.toHaveClass('activo');
        });

        it('debe actualizar el indicador activo al cambiar de promoción', async () => {
            render(<BannerDescuentos />);
            
            const indicadores = screen.getAllByRole('button', { name: /Ver promoción/i });
            
            await act(async () => {
                fireEvent.click(indicadores[2]);
            });
            
            expect(indicadores[2]).toHaveClass('activo');
            expect(indicadores[0]).not.toHaveClass('activo');
        });
    });

    describe('Funcionalidad de cerrar banner', () => {
        it('debe cerrar el banner al hacer click en el botón de cierre', async () => {
            render(<BannerDescuentos />);
            
            const banner = screen.getByRole('alert');
            expect(banner).toBeInTheDocument();
            
            const botonCerrar = screen.getByRole('button', { name: /Close alert/i });
            
            await act(async () => {
                fireEvent.click(botonCerrar);
            });
            
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });

        it('no debe mostrar ningún contenido después de cerrar', async () => {
            render(<BannerDescuentos />);
            
            const botonCerrar = screen.getByRole('button', { name: /Close alert/i });
            
            await act(async () => {
                fireEvent.click(botonCerrar);
            });
            
            expect(screen.queryByText(/OFERTA ESPECIAL/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/Copiar/i)).not.toBeInTheDocument();
        });
    });

    describe('Promociones urgentes', () => {
        it('debe mostrar el ícono de urgente en promociones marcadas como urgentes', async () => {
            render(<BannerDescuentos />);
            
            // Cambiar a la segunda promoción que es urgente
            await act(async () => {
                vi.advanceTimersByTime(5000);
            });
            
            const titulo = screen.getByText(/FLASH SALE! 50% OFF en Catálogo/i).parentElement;
            expect(titulo.querySelector('.bi-lightning-fill')).toBeInTheDocument();
        });

        it('debe aplicar la clase urgente al banner en promociones urgentes', async () => {
            render(<BannerDescuentos />);
            
            const banner = screen.getByRole('alert');
            expect(banner).not.toHaveClass('urgente');
            
            // Cambiar a la segunda promoción que es urgente
            await act(async () => {
                vi.advanceTimersByTime(5000);
            });
            
            const bannerUrgente = screen.getByRole('alert');
            expect(bannerUrgente).toHaveClass('urgente');
        });
    });

    describe('Estilos y clases CSS', () => {
        it('debe tener la clase correcta en el contenedor principal', () => {
            render(<BannerDescuentos />);
            
            const seccion = document.querySelector('.banner-descuentos-section');
            expect(seccion).toBeInTheDocument();
        });

        it('debe tener el badge de descuento con las clases correctas', () => {
            render(<BannerDescuentos />);
            
            const badge = document.querySelector('.descuento-badge');
            expect(badge).toBeInTheDocument();
            
            const porcentaje = badge.querySelector('.descuento-porcentaje');
            const texto = badge.querySelector('.descuento-texto');
            
            expect(porcentaje).toBeInTheDocument();
            expect(texto).toBeInTheDocument();
        });

        it('debe tener la estructura correcta del contenedor de cupón', () => {
            render(<BannerDescuentos />);
            
            const cuponContainer = document.querySelector('.cupon-container');
            expect(cuponContainer).toBeInTheDocument();
            
            const cuponCodigo = cuponContainer.querySelector('.cupon-codigo');
            expect(cuponCodigo).toBeInTheDocument();
        });

        it('debe usar el componente Alert de react-bootstrap', () => {
            render(<BannerDescuentos />);
            
            const alert = screen.getByRole('alert');
            expect(alert).toHaveClass('alert');
            expect(alert).toHaveClass('alert-success');
        });
    });

    describe('Accesibilidad', () => {
        it('debe tener labels aria en los botones de indicadores', () => {
            render(<BannerDescuentos />);
            
            const indicador1 = screen.getByRole('button', { name: 'Ver promoción 1' });
            const indicador2 = screen.getByRole('button', { name: 'Ver promoción 2' });
            const indicador3 = screen.getByRole('button', { name: 'Ver promoción 3' });
            
            expect(indicador1).toBeInTheDocument();
            expect(indicador2).toBeInTheDocument();
            expect(indicador3).toBeInTheDocument();
        });

        it('debe ser dismissible el alert', () => {
            render(<BannerDescuentos />);
            
            const botonCerrar = screen.getByRole('button', { name: /Close alert/i });
            expect(botonCerrar).toBeInTheDocument();
        });
    });

    describe('Manejo de casos especiales', () => {
        it('debe limpiar el intervalo al desmontar el componente', () => {
            const { unmount } = render(<BannerDescuentos />);
            
            const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
            unmount();
            
            expect(clearIntervalSpy).toHaveBeenCalled();
        });

        it('debe manejar correctamente el estado de cuponCopiado para diferentes cupones', async () => {
            render(<BannerDescuentos />);
            
            // Copiar primer cupón
            const botonCopiar = screen.getByRole('button', { name: /Copiar/i });
            
            await act(async () => {
                fireEvent.click(botonCopiar);
            });
            
            expect(screen.getByText(/¡Copiado!/i)).toBeInTheDocument();
            
            // Cambiar a otra promoción
            const indicadores = screen.getAllByRole('button', { name: /Ver promoción/i });
            
            await act(async () => {
                fireEvent.click(indicadores[1]);
            });
            
            // El botón debe volver a mostrar "Copiar" porque es otro cupón
            expect(screen.getByRole('button', { name: /Copiar/i })).toBeInTheDocument();
        });
    });

    describe('Integración con Container de Bootstrap', () => {
        it('debe usar el componente Container de react-bootstrap', () => {
            render(<BannerDescuentos />);
            
            const container = document.querySelector('.container');
            expect(container).toBeInTheDocument();
        });

        it('debe usar Row y Col de react-bootstrap', () => {
            render(<BannerDescuentos />);
            
            const rows = document.querySelectorAll('.row');
            expect(rows.length).toBeGreaterThan(0);
            
            const cols = document.querySelectorAll('[class*="col"]');
            expect(cols.length).toBeGreaterThan(0);
        });
    });

    describe('Iconos de Bootstrap Icons', () => {
        it('debe mostrar el icono de carrito en el botón de aprovechar oferta', () => {
            render(<BannerDescuentos />);
            
            const botonOferta = screen.getByRole('button', { name: /Aprovechar Oferta!/i });
            expect(botonOferta.querySelector('.bi-cart-plus')).toBeInTheDocument();
        });

        it('debe mostrar el icono de reloj para días restantes', () => {
            render(<BannerDescuentos />);
            
            const icono = document.querySelector('.bi-clock');
            expect(icono).toBeInTheDocument();
        });

        it('debe mostrar el icono de clipboard en el botón de copiar', () => {
            render(<BannerDescuentos />);
            
            const botonCopiar = screen.getByRole('button', { name: /Copiar/i });
            expect(botonCopiar.querySelector('.bi-clipboard')).toBeInTheDocument();
        });
    });
});
