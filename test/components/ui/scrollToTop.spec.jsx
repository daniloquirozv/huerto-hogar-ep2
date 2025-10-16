import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ScrollToTop from '../../../src/components/ui/scrollToTop';

describe('ScrollToTop Component', () => {
    let scrollToSpy;

    beforeEach(() => {
        // Mock de window.scrollTo
        scrollToSpy = vi.fn();
        window.scrollTo = scrollToSpy;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('debe renderizar sin errores', () => {
        const { container } = render(
            <MemoryRouter>
                <ScrollToTop />
            </MemoryRouter>
        );
        
        // El componente retorna null, así que el container debería estar vacío
        expect(container.firstChild).toBeNull();    
    });

    it('debe llamar a window.scrollTo(0, 0) al montar el componente', () => {
        render(
            <MemoryRouter>
                <ScrollToTop />
            </MemoryRouter>
        );

        expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
        expect(scrollToSpy).toHaveBeenCalledTimes(1);
    });

    it('debe llamar a window.scrollTo cada vez que se renderiza con diferentes rutas', () => {
        // Renderizar con la primera ruta
        render(
            <MemoryRouter initialEntries={['/home']}>
                <ScrollToTop />
            </MemoryRouter>
        );

        expect(scrollToSpy).toHaveBeenCalledTimes(1);
        expect(scrollToSpy).toHaveBeenCalledWith(0, 0);

        vi.clearAllMocks();

        // Renderizar con la segunda ruta
        render(
            <MemoryRouter initialEntries={['/about']}>
                <ScrollToTop />
            </MemoryRouter>
        );

        expect(scrollToSpy).toHaveBeenCalledTimes(1);
        expect(scrollToSpy).toHaveBeenCalledWith(0, 0);

        vi.clearAllMocks();

        // Renderizar con la tercera ruta
        render(
            <MemoryRouter initialEntries={['/contact']}>
                <ScrollToTop />
            </MemoryRouter>
        );

        expect(scrollToSpy).toHaveBeenCalledTimes(1);
        expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
    });

    it('no debe llamar a window.scrollTo si la ruta no cambia', () => {
        const { rerender } = render(
            <MemoryRouter initialEntries={['/']}>
                <ScrollToTop />
            </MemoryRouter>
        );

        expect(scrollToSpy).toHaveBeenCalledTimes(1);

        // Re-renderizar sin cambiar la ruta
        rerender(
            <MemoryRouter initialEntries={['/']}>
                <ScrollToTop />
            </MemoryRouter>
        );

        // Solo debe haberse llamado una vez (en el montaje inicial)
        expect(scrollToSpy).toHaveBeenCalledTimes(1);
    });

    it('debe retornar null como elemento renderizado', () => {
        const { container } = render(
            <MemoryRouter>
                <ScrollToTop />
            </MemoryRouter>
        );

        expect(container.innerHTML).toBe('');
    });

    it('debe funcionar correctamente con diferentes rutas pathname', () => {
        const paths = ['/', '/productos', '/carrito', '/admin', '/blog'];

        paths.forEach((path, index) => {
            render(
                <MemoryRouter initialEntries={[path]}>
                    <ScrollToTop />
                </MemoryRouter>
            );

            expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
            expect(scrollToSpy).toHaveBeenCalledTimes(index + 1);
        });
    });

    it('debe llamar a scrollTo con los parámetros correctos', () => {
        render(
            <MemoryRouter>
                <ScrollToTop />
            </MemoryRouter>
        );

        // Verificar que se llama con exactamente dos argumentos: 0, 0
        expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
        const calls = scrollToSpy.mock.calls;
        expect(calls[0][0]).toBe(0); // x position
        expect(calls[0][1]).toBe(0); // y position
    });
});
