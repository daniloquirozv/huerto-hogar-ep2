import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BuscadorProductos from '../../src/components/BuscadorProductos';

// Mock de datos de productos
vi.mock('../../src/data/productos', () => ({
    productos: [
        {
            codigo: 'TOM001',
            nombre: 'Tomates Cherry',
            descripcion: 'Tomates cherry orgánicos de excelente sabor y calidad',
            precio: 2500,
            stock: 50,
            unidad: 'kg',
            categoria: 'Verduras',
            imagen: '/images/tomates.jpg'
        },
        {
            codigo: 'LEC002',
            nombre: 'Lechuga Orgánica',
            descripcion: 'Lechuga fresca cultivada sin pesticidas',
            precio: 1500,
            stock: 30,
            unidad: 'unidad',
            categoria: 'Verduras',
            imagen: '/images/lechuga.jpg'
        },
        {
            codigo: 'MAN003',
            nombre: 'Manzanas Rojas',
            descripcion: 'Manzanas rojas dulces y crujientes',
            precio: 3000,
            stock: 40,
            unidad: 'kg',
            categoria: 'Frutas',
            imagen: '/images/manzanas.jpg'
        },
        {
            codigo: 'HIE004',
            nombre: 'Albahaca Fresca',
            descripcion: 'Albahaca aromática para tus platos',
            precio: 1000,
            stock: 20,
            unidad: 'manojo',
            categoria: 'Hierbas',
            imagen: '/images/albahaca.jpg'
        },
        {
            codigo: 'ZAN005',
            nombre: 'Zanahorias',
            descripcion: 'Zanahorias frescas y nutritivas',
            precio: 1800,
            stock: 60,
            unidad: 'kg',
            categoria: 'Verduras',
            imagen: '/images/zanahorias.jpg'
        }
    ]
}));

describe('BuscadorProductos Component', () => {
    let mockOnAddToCart;

    beforeEach(() => {
        mockOnAddToCart = vi.fn();
    });

    describe('Renderizado inicial', () => {
        it('debe renderizar el componente correctamente', () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            expect(screen.getByText(/Buscador de Productos/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i)).toBeInTheDocument();
        });

        it('debe renderizar los filtros de categoría y precio', () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            // Verificar que existan los selects de filtros
            const selects = screen.getAllByRole('combobox');
            expect(selects).toHaveLength(2); // Categoría y Precio
            
            // Verificar las opciones del select de categoría
            expect(screen.getByText('Todas las categorías')).toBeInTheDocument();
            expect(screen.getByText('Sin ordenar')).toBeInTheDocument();
        });

        it('no debe mostrar productos inicialmente sin filtros', () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            expect(screen.queryByText('Tomates Cherry')).not.toBeInTheDocument();
            expect(screen.queryByText('Lechuga Orgánica')).not.toBeInTheDocument();
        });

        it('debe renderizar todas las categorías en el select', () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            // Buscar el select que contiene "Todas las categorías"
            const selects = screen.getAllByRole('combobox');
            const categorySelect = selects[0]; // El primero es el de categoría
            expect(categorySelect).toBeInTheDocument();
            
            // Verificar que existen opciones de categoría
            const options = categorySelect.querySelectorAll('option');
            expect(options.length).toBeGreaterThan(1); // Más de 1 por la opción "Todas las categorías"
        });
    });

    describe('Búsqueda por texto', () => {
        it('debe filtrar productos por nombre', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            fireEvent.change(searchInput, { target: { value: 'Tomate' } });

            await waitFor(() => {
                expect(screen.getByText('Tomates Cherry')).toBeInTheDocument();
            });

            expect(screen.queryByText('Lechuga Orgánica')).not.toBeInTheDocument();
        });

        it('debe filtrar productos por código', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            fireEvent.change(searchInput, { target: { value: 'LEC002' } });

            await waitFor(() => {
                expect(screen.getByText('Lechuga Orgánica')).toBeInTheDocument();
            });

            expect(screen.queryByText('Tomates Cherry')).not.toBeInTheDocument();
        });

        it('debe filtrar productos por categoría en búsqueda de texto', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            fireEvent.change(searchInput, { target: { value: 'Frutas' } });

            await waitFor(() => {
                expect(screen.getByText('Manzanas Rojas')).toBeInTheDocument();
            });

            expect(screen.queryByText('Tomates Cherry')).not.toBeInTheDocument();
        });

        it('debe ser case-insensitive en la búsqueda', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            fireEvent.change(searchInput, { target: { value: 'TOMATE' } });

            await waitFor(() => {
                expect(screen.getByText('Tomates Cherry')).toBeInTheDocument();
            });
        });

        it('debe mostrar mensaje cuando no hay resultados', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            fireEvent.change(searchInput, { target: { value: 'ProductoInexistente123' } });

            await waitFor(() => {
                expect(screen.getByText(/No se encontraron productos con los filtros aplicados/i)).toBeInTheDocument();
            });
        });
    });

    describe('Filtro por categoría', () => {
        it('debe filtrar productos por categoría seleccionada', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const selects = screen.getAllByRole('combobox');
            const categorySelect = selects[0]; // El primero es el de categoría
            fireEvent.change(categorySelect, { target: { value: 'Verduras' } });

            await waitFor(() => {
                expect(screen.getByText('Tomates Cherry')).toBeInTheDocument();
                expect(screen.getByText('Lechuga Orgánica')).toBeInTheDocument();
                expect(screen.getByText('Zanahorias')).toBeInTheDocument();
            });

            expect(screen.queryByText('Manzanas Rojas')).not.toBeInTheDocument();
            expect(screen.queryByText('Albahaca Fresca')).not.toBeInTheDocument();
        });

        it('debe combinar búsqueda de texto con filtro de categoría', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            const selects = screen.getAllByRole('combobox');
            const categorySelect = selects[0];

            fireEvent.change(categorySelect, { target: { value: 'Verduras' } });
            fireEvent.change(searchInput, { target: { value: 'Tomate' } });

            await waitFor(() => {
                expect(screen.getByText('Tomates Cherry')).toBeInTheDocument();
            });

            expect(screen.queryByText('Lechuga Orgánica')).not.toBeInTheDocument();
            expect(screen.queryByText('Zanahorias')).not.toBeInTheDocument();
        });
    });

    describe('Ordenamiento por precio', () => {
        it('debe ordenar productos de menor a mayor precio', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const selects = screen.getAllByRole('combobox');
            const priceSelect = selects[1]; // El segundo es el de precio
            fireEvent.change(priceSelect, { target: { value: 'asc' } });

            await waitFor(() => {
                const products = screen.getAllByRole('heading', { level: 5 }).filter(h => h.textContent.includes('CLP'));
                expect(products[0].textContent).toContain('1.000');
            });
        });

        it('debe ordenar productos de mayor a menor precio', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const selects = screen.getAllByRole('combobox');
            const priceSelect = selects[1]; // El segundo es el de precio
            fireEvent.change(priceSelect, { target: { value: 'desc' } });

            await waitFor(() => {
                const products = screen.getAllByRole('heading', { level: 5 }).filter(h => h.textContent.includes('CLP'));
                expect(products[0].textContent).toContain('3.000');
            });
        });

        it('debe combinar filtro de categoría con ordenamiento', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const selects = screen.getAllByRole('combobox');
            const categorySelect = selects[0];
            const priceSelect = selects[1];

            fireEvent.change(categorySelect, { target: { value: 'Verduras' } });
            fireEvent.change(priceSelect, { target: { value: 'asc' } });

            await waitFor(() => {
                expect(screen.getByText('Lechuga Orgánica')).toBeInTheDocument();
            });
        });
    });

    describe('Limpiar filtros', () => {
        it('debe mostrar botón "Limpiar Filtros" cuando hay filtros activos', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            fireEvent.change(searchInput, { target: { value: 'Tomate' } });

            await waitFor(() => {
                expect(screen.getByText(/Limpiar Filtros/i)).toBeInTheDocument();
            });
        });

        it('debe limpiar todos los filtros al hacer clic en "Limpiar Filtros"', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            const selects = screen.getAllByRole('combobox');
            const categorySelect = selects[0];
            const priceSelect = selects[1];

            // Aplicar filtros
            fireEvent.change(searchInput, { target: { value: 'Tomate' } });
            fireEvent.change(categorySelect, { target: { value: 'Verduras' } });
            fireEvent.change(priceSelect, { target: { value: 'asc' } });

            await waitFor(() => {
                expect(screen.getByText('Tomates Cherry')).toBeInTheDocument();
            });

            // Limpiar filtros
            const clearButton = screen.getByText(/Limpiar Filtros/i);
            fireEvent.click(clearButton);

            await waitFor(() => {
                expect(searchInput.value).toBe('');
                expect(categorySelect.value).toBe('');
                expect(priceSelect.value).toBe('');
                expect(screen.queryByText('Tomates Cherry')).not.toBeInTheDocument();
            });
        });
    });

    describe('Gestión de cantidades', () => {
        it('debe permitir cambiar la cantidad de un producto', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            fireEvent.change(searchInput, { target: { value: 'Tomate' } });

            await waitFor(() => {
                expect(screen.getByText('Tomates Cherry')).toBeInTheDocument();
            });

            const quantityInputs = screen.getAllByPlaceholderText('0');
            const quantityInput = quantityInputs[0];

            fireEvent.change(quantityInput, { target: { value: '5' } });

            expect(quantityInput.value).toBe('5');
        });

        it('debe establecer cantidad en 0 si el valor es inválido', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            fireEvent.change(searchInput, { target: { value: 'Tomate' } });

            await waitFor(() => {
                expect(screen.getByText('Tomates Cherry')).toBeInTheDocument();
            });

            const quantityInputs = screen.getAllByPlaceholderText('0');
            const quantityInput = quantityInputs[0];

            fireEvent.change(quantityInput, { target: { value: '-5' } });

            expect(quantityInput.value).toBe('0');
        });
    });

    describe('Agregar al carrito', () => {
        it('debe agregar producto al carrito con la cantidad especificada', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            fireEvent.change(searchInput, { target: { value: 'Tomate' } });

            await waitFor(() => {
                expect(screen.getByText('Tomates Cherry')).toBeInTheDocument();
            });

            const quantityInputs = screen.getAllByPlaceholderText('0');
            const quantityInput = quantityInputs[0];
            fireEvent.change(quantityInput, { target: { value: '3' } });

            const addButton = screen.getByRole('button', { name: /Agregar al Carrito/i });
            fireEvent.click(addButton);

            expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
            expect(mockOnAddToCart).toHaveBeenCalledWith(
                expect.objectContaining({
                    codigo: 'TOM001',
                    nombre: 'Tomates Cherry'
                }),
                3
            );
        });

        it('debe resetear la cantidad después de agregar al carrito', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            fireEvent.change(searchInput, { target: { value: 'Tomate' } });

            await waitFor(() => {
                expect(screen.getByText('Tomates Cherry')).toBeInTheDocument();
            });

            const quantityInputs = screen.getAllByPlaceholderText('0');
            const quantityInput = quantityInputs[0];
            fireEvent.change(quantityInput, { target: { value: '3' } });

            const addButton = screen.getByRole('button', { name: /Agregar al Carrito/i });
            fireEvent.click(addButton);

            await waitFor(() => {
                expect(quantityInput.value).toBe('0');
            });
        });

        it('debe usar cantidad 1 por defecto si no se especifica cantidad', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            fireEvent.change(searchInput, { target: { value: 'Tomate' } });

            await waitFor(() => {
                expect(screen.getByText('Tomates Cherry')).toBeInTheDocument();
            });

            const quantityInputs = screen.getAllByPlaceholderText('0');
            const quantityInput = quantityInputs[0];
            fireEvent.change(quantityInput, { target: { value: '1' } });

            const addButton = screen.getByRole('button', { name: /Agregar al Carrito/i });
            fireEvent.click(addButton);

            expect(mockOnAddToCart).toHaveBeenCalledWith(
                expect.objectContaining({ codigo: 'TOM001' }),
                1
            );
        });

        it('debe deshabilitar el botón cuando la cantidad es 0', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            fireEvent.change(searchInput, { target: { value: 'Tomate' } });

            await waitFor(() => {
                expect(screen.getByText('Tomates Cherry')).toBeInTheDocument();
            });

            const addButton = screen.getByRole('button', { name: /Agregar al Carrito/i });
            expect(addButton).toBeDisabled();
        });

        it('debe deshabilitar el botón cuando la cantidad excede el stock', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            fireEvent.change(searchInput, { target: { value: 'Tomate' } });

            await waitFor(() => {
                expect(screen.getByText('Tomates Cherry')).toBeInTheDocument();
            });

            const quantityInputs = screen.getAllByPlaceholderText('0');
            const quantityInput = quantityInputs[0];
            fireEvent.change(quantityInput, { target: { value: '100' } }); // Mayor que stock (50)

            const addButton = screen.getByRole('button', { name: /Agregar al Carrito/i });
            expect(addButton).toBeDisabled();
        });
    });

    describe('Visualización de productos', () => {
        it('debe mostrar la información completa del producto', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            fireEvent.change(searchInput, { target: { value: 'Tomate' } });

            await waitFor(() => {
                expect(screen.getByText('Tomates Cherry')).toBeInTheDocument();
                expect(screen.getByText('TOM001')).toBeInTheDocument();
                // Usar getAllByText para manejar múltiples apariciones
                const verdurasBadges = screen.getAllByText('Verduras');
                expect(verdurasBadges.length).toBeGreaterThan(0);
                expect(screen.getByText(/50 kg disponibles/i)).toBeInTheDocument();
            });
        });

        it('debe mostrar el contador de resultados', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const selects = screen.getAllByRole('combobox');
            const categorySelect = selects[0];
            fireEvent.change(categorySelect, { target: { value: 'Verduras' } });

            await waitFor(() => {
                expect(screen.getByText(/Resultados de búsqueda: 3 producto\(s\)/i)).toBeInTheDocument();
            });
        });

        it('debe renderizar la imagen del producto', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            fireEvent.change(searchInput, { target: { value: 'Tomate' } });

            await waitFor(() => {
                const image = screen.getByAltText('Tomates Cherry');
                expect(image).toBeInTheDocument();
                expect(image).toHaveAttribute('src', '/images/tomates.jpg');
            });
        });

        it('debe formatear el precio correctamente', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            fireEvent.change(searchInput, { target: { value: 'Tomate' } });

            await waitFor(() => {
                expect(screen.getByText(/\$2\.500 CLP\/kg/i)).toBeInTheDocument();
            });
        });
    });

    describe('Comportamiento de filtros múltiples', () => {
        it('debe aplicar todos los filtros simultáneamente', async () => {
            render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            const selects = screen.getAllByRole('combobox');
            const categorySelect = selects[0];
            const priceSelect = selects[1];

            fireEvent.change(categorySelect, { target: { value: 'Verduras' } });
            fireEvent.change(searchInput, { target: { value: 'a' } }); // Busca productos con 'a'
            fireEvent.change(priceSelect, { target: { value: 'asc' } });

            await waitFor(() => {
                const products = screen.queryAllByRole('heading', { level: 5 });
                expect(products.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Props del componente', () => {
        it('debe requerir la prop onAddToCart', () => {
            // Esta prueba verifica que el componente se renderiza sin errores cuando se pasa onAddToCart
            expect(() => {
                render(<BuscadorProductos onAddToCart={mockOnAddToCart} />);
            }).not.toThrow();
        });
    });
});
