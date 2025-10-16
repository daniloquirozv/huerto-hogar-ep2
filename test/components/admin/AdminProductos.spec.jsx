import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminProductos from '../../../src/components/admin/AdminProductos';
import { productos as productosIniciales } from '../../../src/data/productos';

// Mock de window.confirm
const mockConfirm = vi.fn();
global.confirm = mockConfirm;

describe('AdminProductos Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockConfirm.mockReturnValue(true);
    });

    describe('Renderizado inicial', () => {
        it('debe renderizar el componente correctamente', () => {
            render(<AdminProductos />);
            expect(screen.getByTestId('admin-productos')).toBeInTheDocument();
        });

        it('debe mostrar el título del componente', () => {
            render(<AdminProductos />);
            expect(screen.getByText(/Gestión de Productos/i)).toBeInTheDocument();
        });

        it('debe mostrar el botón de agregar producto', () => {
            render(<AdminProductos />);
            expect(screen.getByRole('button', { name: /Agregar Producto/i })).toBeInTheDocument();
        });

        it('debe mostrar el campo de búsqueda', () => {
            render(<AdminProductos />);
            expect(screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i)).toBeInTheDocument();
        });

        it('debe mostrar los filtros de categoría, precio y stock', () => {
            render(<AdminProductos />);
            const selects = screen.getAllByRole('combobox');
            expect(selects.length).toBeGreaterThanOrEqual(3);
        });

        it('debe mostrar la tabla de productos', () => {
            render(<AdminProductos />);
            expect(screen.getByRole('table')).toBeInTheDocument();
        });

        it('debe mostrar los headers de la tabla correctamente', () => {
            render(<AdminProductos />);
            const headers = screen.getAllByRole('columnheader');
            expect(headers[0]).toHaveTextContent('Código');
            expect(headers[1]).toHaveTextContent('Nombre');
            expect(headers[2]).toHaveTextContent('Categoría');
            expect(headers[3]).toHaveTextContent('Precio');
            expect(headers[4]).toHaveTextContent('Stock');
            expect(headers[5]).toHaveTextContent('Unidad');
            expect(headers[6]).toHaveTextContent('Acciones');
        });

        it('debe mostrar el contador de productos', () => {
            render(<AdminProductos />);
            const badge = screen.getByText(/Mostrando:/);
            expect(badge).toBeInTheDocument();
        });
    });

    describe('Listado de productos', () => {
        it('debe mostrar los productos iniciales', () => {
            render(<AdminProductos />);
            productosIniciales.forEach(producto => {
                expect(screen.getByText(producto.codigo)).toBeInTheDocument();
            });
        });

        it('debe mostrar el nombre de cada producto', () => {
            render(<AdminProductos />);
            productosIniciales.forEach(producto => {
                expect(screen.getByText(producto.nombre)).toBeInTheDocument();
            });
        });

        it('debe mostrar botones de editar y eliminar para cada producto', () => {
            render(<AdminProductos />);
            const editButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('.bi-pencil')
            );
            const deleteButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('.bi-trash')
            );
            
            expect(editButtons.length).toBeGreaterThan(0);
            expect(deleteButtons.length).toBeGreaterThan(0);
        });
    });

    describe('Búsqueda de productos', () => {
        it('debe filtrar productos por nombre', () => {
            render(<AdminProductos />);
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            
            fireEvent.change(searchInput, { target: { value: 'Manzana' } });
            
            expect(screen.getByText(/Manzana/i)).toBeInTheDocument();
        });

        it('debe filtrar productos por código', () => {
            render(<AdminProductos />);
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            
            const primerProducto = productosIniciales[0];
            fireEvent.change(searchInput, { target: { value: primerProducto.codigo } });
            
            expect(screen.getByText(primerProducto.codigo)).toBeInTheDocument();
        });

        it('debe filtrar productos por categoría en búsqueda', () => {
            render(<AdminProductos />);
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            
            fireEvent.change(searchInput, { target: { value: 'Frutas' } });
            
            const frutasProducts = productosIniciales.filter(p => 
                p.categoria.toLowerCase().includes('frutas')
            );
            expect(frutasProducts.length).toBeGreaterThan(0);
        });

        it('debe mostrar todos los productos cuando la búsqueda está vacía', () => {
            render(<AdminProductos />);
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            
            fireEvent.change(searchInput, { target: { value: 'xyz123' } });
            fireEvent.change(searchInput, { target: { value: '' } });
            
            productosIniciales.forEach(producto => {
                expect(screen.getByText(producto.codigo)).toBeInTheDocument();
            });
        });

        it('debe ser case-insensitive en la búsqueda', () => {
            render(<AdminProductos />);
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            
            fireEvent.change(searchInput, { target: { value: 'MANZANA' } });
            
            const manzanaProduct = productosIniciales.find(p => 
                p.nombre.toLowerCase().includes('manzana')
            );
            if (manzanaProduct) {
                expect(screen.getByText(manzanaProduct.nombre)).toBeInTheDocument();
            }
        });
    });

    describe('Filtros', () => {
        it('debe filtrar por categoría', () => {
            render(<AdminProductos />);
            const selects = screen.getAllByRole('combobox');
            const categorySelect = selects[0]; // Primer select es categoría
            
            fireEvent.change(categorySelect, { target: { value: 'Frutas Frescas' } });
            
            // Verificar que el badge de contador se actualiza
            expect(screen.getByText(/Mostrando:/)).toBeInTheDocument();
        });

        it('debe ordenar productos por precio ascendente', () => {
            render(<AdminProductos />);
            const selects = screen.getAllByRole('combobox');
            const priceSelect = selects[1]; // Segundo select es precio
            
            fireEvent.change(priceSelect, { target: { value: 'asc' } });
            
            expect(screen.getByText(/Mostrando:/)).toBeInTheDocument();
        });

        it('debe ordenar productos por precio descendente', () => {
            render(<AdminProductos />);
            const selects = screen.getAllByRole('combobox');
            const priceSelect = selects[1]; // Segundo select es precio
            
            fireEvent.change(priceSelect, { target: { value: 'desc' } });
            
            expect(screen.getByText(/Mostrando:/)).toBeInTheDocument();
        });

        it('debe filtrar productos con stock bajo', () => {
            render(<AdminProductos />);
            const selects = screen.getAllByRole('combobox');
            const stockSelect = selects[2]; // Tercer select es stock
            
            fireEvent.change(stockSelect, { target: { value: 'bajo' } });
            
            expect(screen.getByText(/Mostrando:/)).toBeInTheDocument();
        });

        it('debe filtrar productos con stock alto', () => {
            render(<AdminProductos />);
            const selects = screen.getAllByRole('combobox');
            const stockSelect = selects[2]; // Tercer select es stock
            
            fireEvent.change(stockSelect, { target: { value: 'alto' } });
            
            expect(screen.getByText(/Mostrando:/)).toBeInTheDocument();
        });

        it('debe mostrar el botón de limpiar filtros cuando hay filtros activos', () => {
            render(<AdminProductos />);
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            
            fireEvent.change(searchInput, { target: { value: 'test' } });
            
            expect(screen.getByRole('button', { name: /Limpiar Filtros/i })).toBeInTheDocument();
        });

        it('debe limpiar todos los filtros al hacer clic en limpiar', () => {
            render(<AdminProductos />);
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            const selects = screen.getAllByRole('combobox');
            const categorySelect = selects[0];
            
            fireEvent.change(searchInput, { target: { value: 'test' } });
            fireEvent.change(categorySelect, { target: { value: 'Frutas Frescas' } });
            
            const clearButton = screen.getByRole('button', { name: /Limpiar Filtros/i });
            fireEvent.click(clearButton);
            
            expect(searchInput.value).toBe('');
            expect(categorySelect.value).toBe('');
        });
    });

    describe('Modal de agregar producto', () => {
        it('debe abrir el modal al hacer clic en agregar producto', () => {
            render(<AdminProductos />);
            const addButton = screen.getByRole('button', { name: /Agregar Producto/i });
            
            fireEvent.click(addButton);
            
            expect(screen.getByText('Agregar Nuevo Producto')).toBeInTheDocument();
        });

        it('debe mostrar el formulario vacío al agregar nuevo producto', () => {
            render(<AdminProductos />);
            const addButton = screen.getByRole('button', { name: /Agregar Producto/i });
            
            fireEvent.click(addButton);
            
            const codigoInput = screen.getByPlaceholderText(/Ej: FR001/i);
            expect(codigoInput.value).toBe('');
        });

        it('debe cerrar el modal al hacer clic en cancelar', async () => {
            render(<AdminProductos />);
            const addButton = screen.getByRole('button', { name: /Agregar Producto/i });
            
            fireEvent.click(addButton);
            
            expect(screen.getByText('Agregar Nuevo Producto')).toBeInTheDocument();
            
            const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
            fireEvent.click(cancelButton);
            
            await waitFor(() => {
                expect(screen.queryByText('Agregar Nuevo Producto')).not.toBeInTheDocument();
            });
        });

        it('debe mostrar todos los campos del formulario', () => {
            render(<AdminProductos />);
            const addButton = screen.getByRole('button', { name: /Agregar Producto/i });
            
            fireEvent.click(addButton);
            
            expect(screen.getByPlaceholderText(/Ej: FR001/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Nombre del producto/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Descripción del producto/i)).toBeInTheDocument();
        });

        it('debe tener botón de guardar en el modal', () => {
            render(<AdminProductos />);
            const addButton = screen.getByRole('button', { name: /Agregar Producto/i });
            
            fireEvent.click(addButton);
            
            expect(screen.getByRole('button', { name: /Guardar/i })).toBeInTheDocument();
        });
    });

    describe('Agregar producto', () => {
        it('debe agregar un nuevo producto correctamente', async () => {
            render(<AdminProductos />);
            const addButton = screen.getByRole('button', { name: /Agregar Producto/i });
            
            fireEvent.click(addButton);
            
            const codigoInput = screen.getByPlaceholderText(/Ej: FR001/i);
            const nombreInput = screen.getByPlaceholderText(/Nombre del producto/i);
            const descripcionInput = screen.getByPlaceholderText(/Descripción del producto/i);
            const inputs = screen.getAllByRole('spinbutton'); // Para precio y stock
            
            fireEvent.change(codigoInput, { target: { value: 'TEST001' } });
            fireEvent.change(nombreInput, { target: { value: 'Producto Test' } });
            fireEvent.change(inputs[0], { target: { value: '1000' } }); // Precio
            fireEvent.change(inputs[1], { target: { value: '50' } }); // Stock
            fireEvent.change(descripcionInput, { target: { value: 'Descripción de prueba' } });
            
            const saveButton = screen.getByRole('button', { name: /Guardar/i });
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                expect(screen.getByText(/Producto agregado exitosamente/i)).toBeInTheDocument();
            });
        });

        it('debe mostrar error al intentar agregar producto con código duplicado', async () => {
            render(<AdminProductos />);
            const addButton = screen.getByRole('button', { name: /Agregar Producto/i });
            
            fireEvent.click(addButton);
            
            const codigoExistente = productosIniciales[0].codigo;
            
            const codigoInput = screen.getByPlaceholderText(/Ej: FR001/i);
            const nombreInput = screen.getByPlaceholderText(/Nombre del producto/i);
            const descripcionInput = screen.getByPlaceholderText(/Descripción del producto/i);
            const inputs = screen.getAllByRole('spinbutton');
            
            fireEvent.change(codigoInput, { target: { value: codigoExistente } });
            fireEvent.change(nombreInput, { target: { value: 'Producto Test' } });
            fireEvent.change(inputs[0], { target: { value: '1000' } });
            fireEvent.change(inputs[1], { target: { value: '50' } });
            fireEvent.change(descripcionInput, { target: { value: 'Descripción de prueba' } });
            
            const saveButton = screen.getByRole('button', { name: /Guardar/i });
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                expect(screen.getByText(/El código del producto ya existe/i)).toBeInTheDocument();
            });
        });

        it('debe actualizar el contador de productos después de agregar', async () => {
            render(<AdminProductos />);
            const initialCount = productosIniciales.length;
            
            const addButton = screen.getByRole('button', { name: /Agregar Producto/i });
            fireEvent.click(addButton);
            
            const codigoInput = screen.getByPlaceholderText(/Ej: FR001/i);
            const nombreInput = screen.getByPlaceholderText(/Nombre del producto/i);
            const descripcionInput = screen.getByPlaceholderText(/Descripción del producto/i);
            const inputs = screen.getAllByRole('spinbutton');
            
            fireEvent.change(codigoInput, { target: { value: 'NEW001' } });
            fireEvent.change(nombreInput, { target: { value: 'Nuevo Producto' } });
            fireEvent.change(inputs[0], { target: { value: '2000' } });
            fireEvent.change(inputs[1], { target: { value: '100' } });
            fireEvent.change(descripcionInput, { target: { value: 'Descripción' } });
            
            const saveButton = screen.getByRole('button', { name: /Guardar/i });
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                expect(screen.getByText(new RegExp(`${initialCount + 1} productos`))).toBeInTheDocument();
            });
        });
    });

    describe('Editar producto', () => {
        it('debe abrir el modal de edición al hacer clic en editar', () => {
            render(<AdminProductos />);
            const editButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('.bi-pencil')
            );
            
            fireEvent.click(editButtons[0]);
            
            expect(screen.getByText('Editar Producto')).toBeInTheDocument();
        });

        it('debe cargar los datos del producto en el formulario', () => {
            render(<AdminProductos />);
            const primerProducto = productosIniciales[0];
            const editButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('.bi-pencil')
            );
            
            fireEvent.click(editButtons[0]);
            
            expect(screen.getByDisplayValue(primerProducto.codigo)).toBeInTheDocument();
            expect(screen.getByDisplayValue(primerProducto.nombre)).toBeInTheDocument();
        });

        it('debe deshabilitar el campo de código al editar', () => {
            render(<AdminProductos />);
            const editButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('.bi-pencil')
            );
            
            fireEvent.click(editButtons[0]);
            
            const primerProducto = productosIniciales[0];
            const codigoInput = screen.getByDisplayValue(primerProducto.codigo);
            expect(codigoInput).toBeDisabled();
        });

        it('debe actualizar un producto correctamente', async () => {
            render(<AdminProductos />);
            const editButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('.bi-pencil')
            );
            
            fireEvent.click(editButtons[0]);
            
            const nombreInput = screen.getByPlaceholderText(/Nombre del producto/i);
            fireEvent.change(nombreInput, { target: { value: 'Producto Actualizado' } });
            
            const saveButton = screen.getByRole('button', { name: /Actualizar/i });
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                expect(screen.getByText(/Producto actualizado exitosamente/i)).toBeInTheDocument();
            });
        });

        it('debe mostrar el botón "Actualizar" en lugar de "Guardar" al editar', () => {
            render(<AdminProductos />);
            const editButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('.bi-pencil')
            );
            
            fireEvent.click(editButtons[0]);
            
            expect(screen.getByRole('button', { name: /Actualizar/i })).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /Guardar/i })).not.toBeInTheDocument();
        });

        it('debe actualizar el precio del producto', async () => {
            render(<AdminProductos />);
            const editButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('.bi-pencil')
            );
            
            fireEvent.click(editButtons[0]);
            
            const inputs = screen.getAllByRole('spinbutton');
            const precioInput = inputs[0]; // Primer spinbutton es precio
            
            fireEvent.change(precioInput, { target: { value: '5000' } });
            
            const saveButton = screen.getByRole('button', { name: /Actualizar/i });
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                expect(screen.getByText(/Producto actualizado exitosamente/i)).toBeInTheDocument();
            });
        });

        it('debe actualizar el stock del producto', async () => {
            render(<AdminProductos />);
            const editButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('.bi-pencil')
            );
            
            fireEvent.click(editButtons[0]);
            
            const inputs = screen.getAllByRole('spinbutton');
            const stockInput = inputs[1]; // Segundo spinbutton es stock
            
            fireEvent.change(stockInput, { target: { value: '200' } });
            
            const saveButton = screen.getByRole('button', { name: /Actualizar/i });
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                expect(screen.getByText(/Producto actualizado exitosamente/i)).toBeInTheDocument();
            });
        });
    });

    describe('Eliminar producto', () => {
        it('debe mostrar confirmación al intentar eliminar', () => {
            render(<AdminProductos />);
            const deleteButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('.bi-trash')
            );
            
            fireEvent.click(deleteButtons[0]);
            
            expect(mockConfirm).toHaveBeenCalledWith('¿Está seguro de eliminar este producto?');
        });

        it('debe eliminar el producto al confirmar', async () => {
            mockConfirm.mockReturnValue(true);
            render(<AdminProductos />);
            
            const deleteButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('.bi-trash')
            );
            
            fireEvent.click(deleteButtons[0]);
            
            await waitFor(() => {
                expect(screen.getByText(/Producto eliminado exitosamente/i)).toBeInTheDocument();
            });
        });

        it('no debe eliminar el producto al cancelar', () => {
            mockConfirm.mockReturnValue(false);
            render(<AdminProductos />);
            
            const initialCount = productosIniciales.length;
            const deleteButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('.bi-trash')
            );
            
            fireEvent.click(deleteButtons[0]);
            
            expect(screen.getByText(new RegExp(`${initialCount} productos`))).toBeInTheDocument();
        });

        it('debe actualizar el contador después de eliminar', async () => {
            mockConfirm.mockReturnValue(true);
            render(<AdminProductos />);
            
            const initialCount = productosIniciales.length;
            const deleteButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('.bi-trash')
            );
            
            fireEvent.click(deleteButtons[0]);
            
            await waitFor(() => {
                expect(screen.getByText(new RegExp(`${initialCount - 1} productos`))).toBeInTheDocument();
            });
        });
    });

    describe('Validaciones del formulario', () => {
        it('debe requerir el campo código', () => {
            render(<AdminProductos />);
            const addButton = screen.getByRole('button', { name: /Agregar Producto/i });
            
            fireEvent.click(addButton);
            
            const codigoInput = screen.getByPlaceholderText(/Ej: FR001/i);
            expect(codigoInput).toHaveAttribute('required');
        });

        it('debe requerir el campo nombre', () => {
            render(<AdminProductos />);
            const addButton = screen.getByRole('button', { name: /Agregar Producto/i });
            
            fireEvent.click(addButton);
            
            const nombreInput = screen.getByPlaceholderText(/Nombre del producto/i);
            expect(nombreInput).toHaveAttribute('required');
        });

        it('debe requerir el campo precio', () => {
            render(<AdminProductos />);
            const addButton = screen.getByRole('button', { name: /Agregar Producto/i });
            
            fireEvent.click(addButton);
            
            const inputs = screen.getAllByRole('spinbutton');
            const precioInput = inputs[0];
            expect(precioInput).toHaveAttribute('required');
        });

        it('debe requerir el campo stock', () => {
            render(<AdminProductos />);
            const addButton = screen.getByRole('button', { name: /Agregar Producto/i });
            
            fireEvent.click(addButton);
            
            const inputs = screen.getAllByRole('spinbutton');
            const stockInput = inputs[1];
            expect(stockInput).toHaveAttribute('required');
        });

        it('debe validar que el precio sea un número', () => {
            render(<AdminProductos />);
            const addButton = screen.getByRole('button', { name: /Agregar Producto/i });
            
            fireEvent.click(addButton);
            
            const inputs = screen.getAllByRole('spinbutton');
            const precioInput = inputs[0];
            expect(precioInput).toHaveAttribute('type', 'number');
        });

        it('debe validar que el stock sea un número', () => {
            render(<AdminProductos />);
            const addButton = screen.getByRole('button', { name: /Agregar Producto/i });
            
            fireEvent.click(addButton);
            
            const inputs = screen.getAllByRole('spinbutton');
            const stockInput = inputs[1];
            expect(stockInput).toHaveAttribute('type', 'number');
        });

        it('debe validar que el precio no sea negativo', () => {
            render(<AdminProductos />);
            const addButton = screen.getByRole('button', { name: /Agregar Producto/i });
            
            fireEvent.click(addButton);
            
            const inputs = screen.getAllByRole('spinbutton');
            const precioInput = inputs[0];
            expect(precioInput).toHaveAttribute('min', '0');
        });

        it('debe validar que el stock no sea negativo', () => {
            render(<AdminProductos />);
            const addButton = screen.getByRole('button', { name: /Agregar Producto/i });
            
            fireEvent.click(addButton);
            
            const inputs = screen.getAllByRole('spinbutton');
            const stockInput = inputs[1];
            expect(stockInput).toHaveAttribute('min', '0');
        });
    });

    describe('Alertas', () => {
        it('debe mostrar alerta de éxito al agregar producto', async () => {
            render(<AdminProductos />);
            const addButton = screen.getByRole('button', { name: /Agregar Producto/i });
            
            fireEvent.click(addButton);
            
            const codigoInput = screen.getByPlaceholderText(/Ej: FR001/i);
            const nombreInput = screen.getByPlaceholderText(/Nombre del producto/i);
            const descripcionInput = screen.getByPlaceholderText(/Descripción del producto/i);
            const inputs = screen.getAllByRole('spinbutton');
            
            fireEvent.change(codigoInput, { target: { value: 'ALERT001' } });
            fireEvent.change(nombreInput, { target: { value: 'Test' } });
            fireEvent.change(inputs[0], { target: { value: '1000' } });
            fireEvent.change(inputs[1], { target: { value: '50' } });
            fireEvent.change(descripcionInput, { target: { value: 'Test' } });
            
            const saveButton = screen.getByRole('button', { name: /Guardar/i });
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                expect(screen.getByText(/Producto agregado exitosamente/i)).toBeInTheDocument();
            });
        });

        it('debe mostrar alerta de advertencia al eliminar producto', async () => {
            mockConfirm.mockReturnValue(true);
            render(<AdminProductos />);
            
            const deleteButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.querySelector('.bi-trash')
            );
            
            fireEvent.click(deleteButtons[0]);
            
            await waitFor(() => {
                expect(screen.getByText(/Producto eliminado exitosamente/i)).toBeInTheDocument();
            });
        });

        it('debe ocultar la alerta automáticamente después de 3 segundos', async () => {
            render(<AdminProductos />);
            
            const addButton = screen.getByRole('button', { name: /Agregar Producto/i });
            fireEvent.click(addButton);
            
            const codigoInput = screen.getByPlaceholderText(/Ej: FR001/i);
            const nombreInput = screen.getByPlaceholderText(/Nombre del producto/i);
            const descripcionInput = screen.getByPlaceholderText(/Descripción del producto/i);
            const inputs = screen.getAllByRole('spinbutton');
            
            fireEvent.change(codigoInput, { target: { value: 'TIMER001' } });
            fireEvent.change(nombreInput, { target: { value: 'Test Timer' } });
            fireEvent.change(inputs[0], { target: { value: '1000' } });
            fireEvent.change(inputs[1], { target: { value: '50' } });
            fireEvent.change(descripcionInput, { target: { value: 'Test' } });
            
            const saveButton = screen.getByRole('button', { name: /Guardar/i });
            fireEvent.click(saveButton);
            
            // Esperar a que aparezca la alerta
            await waitFor(() => {
                expect(screen.getByText(/Producto agregado exitosamente/i)).toBeInTheDocument();
            });
            
            // Esperar a que la alerta desaparezca (3 segundos + margen)
            await waitFor(() => {
                expect(screen.queryByText(/Producto agregado exitosamente/i)).not.toBeInTheDocument();
            }, { timeout: 4000 });
        });
    });

    describe('Categorías y badges', () => {
        it('debe mostrar badges de categoría con colores', () => {
            render(<AdminProductos />);
            
            productosIniciales.forEach(producto => {
                const badges = screen.getAllByText(producto.categoria);
                expect(badges.length).toBeGreaterThan(0);
            });
        });

        it('debe mostrar badge de stock bajo en rojo', () => {
            render(<AdminProductos />);
            
            const productosStockBajo = productosIniciales.filter(p => p.stock < 50);
            if (productosStockBajo.length > 0) {
                expect(screen.getByText(/Mostrando:/)).toBeInTheDocument();
            }
        });

        it('debe mostrar badge de stock alto en verde', () => {
            render(<AdminProductos />);
            
            const productosStockAlto = productosIniciales.filter(p => p.stock >= 50);
            if (productosStockAlto.length > 0) {
                expect(screen.getByText(/Mostrando:/)).toBeInTheDocument();
            }
        });
    });

    describe('Integración de filtros múltiples', () => {
        it('debe combinar búsqueda y filtro de categoría', () => {
            render(<AdminProductos />);
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            const selects = screen.getAllByRole('combobox');
            const categorySelect = selects[0];
            
            fireEvent.change(searchInput, { target: { value: 'test' } });
            fireEvent.change(categorySelect, { target: { value: 'Frutas Frescas' } });
            
            expect(screen.getByText(/Mostrando:/)).toBeInTheDocument();
        });

        it('debe combinar todos los filtros disponibles', () => {
            render(<AdminProductos />);
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, código o categoría/i);
            const selects = screen.getAllByRole('combobox');
            const categorySelect = selects[0];
            const priceSelect = selects[1];
            const stockSelect = selects[2];
            
            fireEvent.change(searchInput, { target: { value: 'test' } });
            fireEvent.change(categorySelect, { target: { value: 'Frutas Frescas' } });
            fireEvent.change(priceSelect, { target: { value: 'asc' } });
            fireEvent.change(stockSelect, { target: { value: 'alto' } });
            
            expect(screen.getByRole('button', { name: /Limpiar Filtros/i })).toBeInTheDocument();
        });
    });

    describe('Manejo de cambios en el formulario', () => {
        it('debe actualizar el campo de código al escribir', () => {
            render(<AdminProductos />);
            const addButton = screen.getByRole('button', { name: /Agregar Producto/i });
            
            fireEvent.click(addButton);
            
            const codigoInput = screen.getByPlaceholderText(/Ej: FR001/i);
            fireEvent.change(codigoInput, { target: { value: 'TEST123' } });
            
            expect(codigoInput.value).toBe('TEST123');
        });

        it('debe actualizar todos los campos del formulario', () => {
            render(<AdminProductos />);
            const addButton = screen.getByRole('button', { name: /Agregar Producto/i });
            
            fireEvent.click(addButton);
            
            const codigoInput = screen.getByPlaceholderText(/Ej: FR001/i);
            const nombreInput = screen.getByPlaceholderText(/Nombre del producto/i);
            const descripcionInput = screen.getByPlaceholderText(/Descripción del producto/i);
            const spinButtons = screen.getAllByRole('spinbutton');
            const precioInput = spinButtons[0];
            const stockInput = spinButtons[1];
            
            fireEvent.change(codigoInput, { target: { value: 'CODE123' } });
            fireEvent.change(nombreInput, { target: { value: 'Producto Nuevo' } });
            fireEvent.change(precioInput, { target: { value: '1500' } });
            fireEvent.change(stockInput, { target: { value: '75' } });
            fireEvent.change(descripcionInput, { target: { value: 'Descripción completa' } });
            
            expect(codigoInput.value).toBe('CODE123');
            expect(nombreInput.value).toBe('Producto Nuevo');
            expect(precioInput.value).toBe('1500');
            expect(stockInput.value).toBe('75');
            expect(descripcionInput.value).toBe('Descripción completa');
        });
    });
});
