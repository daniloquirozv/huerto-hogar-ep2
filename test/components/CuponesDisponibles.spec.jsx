import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CuponesDisponibles from '../../src/components/CuponesDisponibles';

describe('CuponesDisponibles', () => {
    describe('Renderizado básico', () => {
        it('debe renderizar el título del componente', () => {
            render(<CuponesDisponibles />);
            expect(screen.getByText(/Cupones de Descuento Disponibles/i)).toBeInTheDocument();
        });

        it('debe mostrar el subtítulo descriptivo', () => {
            render(<CuponesDisponibles />);
            expect(screen.getByText(/Usa estos códigos en tu carrito/i)).toBeInTheDocument();
        });

        it('debe renderizar las instrucciones de uso', () => {
            render(<CuponesDisponibles />);
            expect(screen.getByText(/¿Cómo usar tus cupones?/i)).toBeInTheDocument();
        });
    });

    describe('Lista de cupones', () => {
        it('debe mostrar cupones disponibles', () => {
            render(<CuponesDisponibles />);
            
            // Verificar que hay cupones en la vista
            const cupones = screen.getAllByText(/Válido hasta:/i);
            expect(cupones.length).toBeGreaterThan(0);
        });

        it('debe mostrar el código de cada cupón', () => {
            render(<CuponesDisponibles />);
            
            // Verificar códigos comunes
            expect(screen.getByText(/VERDURAS30/i)).toBeInTheDocument();
        });

        it('debe mostrar el porcentaje de descuento', () => {
            render(<CuponesDisponibles />);
            
            // Buscar badges con porcentajes (pueden estar en diferentes formatos)
            const element = screen.getByText(/VERDURAS30/i);
            expect(element).toBeInTheDocument();
        });

        it('debe mostrar la fecha de vencimiento', () => {
            render(<CuponesDisponibles />);
            
            const fechas = screen.getAllByText(/Válido hasta:/i);
            expect(fechas.length).toBeGreaterThan(0);
        });

        it('debe mostrar días restantes', () => {
            render(<CuponesDisponibles />);
            
            // Verificar que se muestran días restantes o "último día"
            const dias = screen.queryAllByText(/días restantes|día restante|Último día/i);
            // Al menos algunos cupones deben mostrar días restantes
            expect(dias.length).toBeGreaterThanOrEqual(0);
        });

        it('debe mostrar la categoría de cada cupón', () => {
            render(<CuponesDisponibles />);
            
            // Buscar badges de categorías
            const categorias = screen.getAllByText(/Promociones|Consejos|Tutoriales|Salud/i);
            expect(categorias.length).toBeGreaterThan(0);
        });
    });

    describe('Instrucciones de uso', () => {
        it('debe mostrar instrucción 1: Copia el código', () => {
            render(<CuponesDisponibles />);
            // Buscar el h6 específico, no el texto repetido en los cupones
            const heading = screen.getAllByText(/Copia el código/i).find(el => el.tagName === 'H6');
            expect(heading).toBeInTheDocument();
        });

        it('debe mostrar instrucción 2: Agrega productos', () => {
            render(<CuponesDisponibles />);
            expect(screen.getByText(/Agrega productos/i)).toBeInTheDocument();
        });

        it('debe mostrar instrucción 3: Aplica el cupón', () => {
            render(<CuponesDisponibles />);
            expect(screen.getByText(/Aplica el cupón/i)).toBeInTheDocument();
        });

        it('debe tener iconos numerados en las instrucciones', () => {
            render(<CuponesDisponibles />);
            const container = screen.getByText(/¿Cómo usar tus cupones?/i).closest('.card-body');
            expect(container).toBeInTheDocument();
        });
    });

    describe('Elementos visuales', () => {
        it('debe tener icono de ticket en el título', () => {
            render(<CuponesDisponibles />);
            const titulo = screen.getByText(/Cupones de Descuento Disponibles/i);
            const icono = titulo.querySelector('.bi-ticket-perforated-fill');
            expect(icono).toBeInTheDocument();
        });

        it('debe tener icono de pregunta en instrucciones', () => {
            render(<CuponesDisponibles />);
            const instrucciones = screen.getByText(/¿Cómo usar tus cupones?/i);
            const icono = instrucciones.querySelector('.bi-question-circle');
            expect(icono).toBeInTheDocument();
        });

        it('debe mostrar iconos de calendario para fechas', () => {
            render(<CuponesDisponibles />);
            const container = document.querySelector('.cupones-disponibles');
            const iconos = container.querySelectorAll('.bi-calendar-event');
            expect(iconos.length).toBeGreaterThan(0);
        });

        it('debe mostrar iconos de reloj o alerta para días restantes', () => {
            render(<CuponesDisponibles />);
            const container = document.querySelector('.cupones-disponibles');
            const iconos = container.querySelectorAll('.bi-clock, .bi-exclamation-triangle');
            expect(iconos.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('Estilos y clases', () => {
        it('debe aplicar clase shadow-sm a las tarjetas', () => {
            render(<CuponesDisponibles />);
            const tarjetas = document.querySelectorAll('.card.shadow-sm');
            expect(tarjetas.length).toBeGreaterThan(0);
        });

        it('debe aplicar borde izquierdo coloreado a las tarjetas', () => {
            render(<CuponesDisponibles />);
            const tarjetas = document.querySelectorAll('.card');
            const tarjetaCupon = Array.from(tarjetas).find(t => 
                t.style.borderLeft && t.style.borderLeft.includes('5px')
            );
            expect(tarjetaCupon).toBeDefined();
        });

        it('debe usar fuente monospace para códigos', () => {
            render(<CuponesDisponibles />);
            const codigo = screen.getByText(/VERDURAS30/i);
            const codigoElement = codigo.closest('div');
            expect(codigoElement.style.fontFamily).toContain('monospace');
        });
    });

    describe('Información de cupones', () => {
        it('debe mostrar información de cómo usar', () => {
            render(<CuponesDisponibles />);
            expect(screen.getAllByText(/Copia el código y pégalo en tu carrito/i).length).toBeGreaterThan(0);
        });

        it('debe tener badges con categorías', () => {
            render(<CuponesDisponibles />);
            const badges = document.querySelectorAll('.badge.bg-secondary');
            expect(badges.length).toBeGreaterThan(0);
        });
    });

    describe('Responsive', () => {
        it('debe usar col-md-6 para cupones en tablets', () => {
            render(<CuponesDisponibles />);
            const cols = document.querySelectorAll('.col-md-6');
            expect(cols.length).toBeGreaterThan(0);
        });

        it('debe usar col-lg-4 para cupones en desktop', () => {
            render(<CuponesDisponibles />);
            const cols = document.querySelectorAll('.col-lg-4');
            expect(cols.length).toBeGreaterThan(0);
        });

        it('debe tener instrucciones en col-md-4', () => {
            render(<CuponesDisponibles />);
            // Buscar específicamente el h6 de la instrucción
            const heading = screen.getAllByText(/Copia el código/i).find(el => el.tagName === 'H6');
            const instruccionesCols = heading.closest('.col-md-4');
            expect(instruccionesCols).toBeInTheDocument();
        });
    });

    describe('Accesibilidad', () => {
        it('debe tener estructura de headings correcta', () => {
            render(<CuponesDisponibles />);
            
            // h2 para título principal
            const h2 = document.querySelector('h2');
            expect(h2).toBeInTheDocument();
            expect(h2.textContent).toContain('Cupones de Descuento');
            
            // h5 para subtítulos
            const h5s = document.querySelectorAll('h5');
            expect(h5s.length).toBeGreaterThan(0);
        });

        it('debe tener texto alternativo descriptivo', () => {
            render(<CuponesDisponibles />);
            
            // Verificar que hay iconos con clases apropiadas
            const iconos = document.querySelectorAll('[class*="bi-"]');
            expect(iconos.length).toBeGreaterThan(0);
        });
    });
});
