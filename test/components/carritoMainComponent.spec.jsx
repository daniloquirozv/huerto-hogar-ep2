import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CarritoMainComponent from '../../src/components/carritoMainComponent';

describe('CarritoMainComponent', () => {
    const mockProductos = [
        {
            codigo: 'P001',
            nombre: 'Tomate Cherry',
            precio: 2500,
            cantidad: 10,
            quantity: 2,
            stock: 50,
            unidad: 'kg',
            categoria: 'Verduras',
            imagen: '/img/tomate.jpg',
            descripcion: 'Tomates cherry frescos'
        },
        {
            codigo: 'P002',
            nombre: 'Lechuga',
            precio: 1500,
            cantidad: 5,
            quantity: 1,
            stock: 30,
            unidad: 'unidad',
            categoria: 'Verduras',
            imagen: '/img/lechuga.jpg',
            descripcion: 'Lechuga fresca'
        }
    ];

    const mockHandlers = {
        onUpdateQuantity: vi.fn(),
        onRemoveItem: vi.fn(),
        onClearCart: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Renderizado básico', () => {
        it('debe renderizar el título del carrito', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            expect(screen.getByText(/Mi Carrito de Compras/i)).toBeInTheDocument();
        });

        it('debe mostrar el subtítulo descriptivo', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            expect(screen.getByText(/Gestiona tus productos y finaliza tu compra/i)).toBeInTheDocument();
        });

        it('debe renderizar correctamente con valores por defecto', () => {
            render(<CarritoMainComponent />);
            expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
        });
    });

    describe('Carrito vacío', () => {
        it('debe mostrar mensaje cuando el carrito está vacío', () => {
            render(<CarritoMainComponent cartItems={[]} {...mockHandlers} />);
            expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
        });

        it('debe mostrar icono de carrito vacío', () => {
            render(<CarritoMainComponent cartItems={[]} {...mockHandlers} />);
            const icon = document.querySelector('.bi-cart-x');
            expect(icon).toBeInTheDocument();
        });

        it('debe mostrar botón para ir a la tienda', () => {
            render(<CarritoMainComponent cartItems={[]} {...mockHandlers} />);
            const button = screen.getByText(/Ir a la Tienda/i);
            expect(button).toBeInTheDocument();
            expect(button.closest('a')).toHaveAttribute('href', '/productos');
        });

        it('debe mostrar texto de agregar productos', () => {
            render(<CarritoMainComponent cartItems={[]} {...mockHandlers} />);
            expect(screen.getByText(/Agrega productos para comenzar tu compra/i)).toBeInTheDocument();
        });
    });

    describe('Lista de productos', () => {
        it('debe renderizar todos los productos del carrito', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            expect(screen.getByText('Tomate Cherry')).toBeInTheDocument();
            expect(screen.getByText('Lechuga')).toBeInTheDocument();
        });

        it('debe mostrar el nombre de cada producto', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            mockProductos.forEach(producto => {
                expect(screen.getByText(producto.nombre)).toBeInTheDocument();
            });
        });

        it('debe mostrar el código de cada producto', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            mockProductos.forEach(producto => {
                expect(screen.getByText(producto.codigo)).toBeInTheDocument();
            });
        });

        it('debe mostrar la categoría de cada producto', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const categorias = screen.getAllByText('Verduras');
            expect(categorias).toHaveLength(mockProductos.length);
        });

        it('debe mostrar la imagen de cada producto', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            mockProductos.forEach(producto => {
                const images = screen.getAllByAltText(producto.nombre);
                expect(images.length).toBeGreaterThan(0);
            });
        });

        it('debe mostrar el precio formateado de cada producto', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const precios2500 = screen.getAllByText(/2\.500/);
            const precios1500 = screen.getAllByText(/1\.500/);
            expect(precios2500.length).toBeGreaterThan(0);
            expect(precios1500.length).toBeGreaterThan(0);
        });

        it('debe mostrar el stock disponible', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            expect(screen.getByText(/Stock: 50 kg/)).toBeInTheDocument();
            expect(screen.getByText(/Stock: 30 unidad/)).toBeInTheDocument();
        });
    });

    describe('Contador de items', () => {
        it('debe mostrar el total de items correctamente', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            // Total: 2 + 1 = 3 items
            expect(screen.getByText(/Productos en tu carrito \(3 items\)/i)).toBeInTheDocument();
        });

        it('debe calcular correctamente con un solo producto', () => {
            const unProducto = [mockProductos[0]];
            render(<CarritoMainComponent cartItems={unProducto} {...mockHandlers} />);
            expect(screen.getByText(/Productos en tu carrito \(2 items\)/i)).toBeInTheDocument();
        });

        it('debe mostrar el total de items en el resumen', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const badges = screen.getAllByText('3');
            expect(badges.length).toBeGreaterThan(0);
        });
    });

    describe('Cálculos de totales', () => {
        it('debe calcular el subtotal correctamente', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            // (2500 * 2) + (1500 * 1) = 6500
            const totals = screen.getAllByText(/6\.500/);
            expect(totals.length).toBeGreaterThan(0);
        });

        it('debe calcular el subtotal de cada producto', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            // Tomate: 2500 * 2 = 5000
            expect(screen.getByText(/5\.000/)).toBeInTheDocument();
        });

        it('debe mostrar envío gratis', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const gratisElements = screen.getAllByText(/Gratis/i);
            expect(gratisElements.length).toBeGreaterThan(0);
        });

        it('debe mostrar el total final igual al subtotal', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const totals = screen.getAllByText(/6\.500/);
            expect(totals.length).toBeGreaterThanOrEqual(2); // Subtotal y Total
        });
    });

    describe('Controles de cantidad', () => {
        it('debe tener botones de incrementar y decrementar', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const plusButtons = document.querySelectorAll('.bi-plus');
            const minusButtons = document.querySelectorAll('.bi-dash');
            expect(plusButtons.length).toBeGreaterThan(0);
            expect(minusButtons.length).toBeGreaterThan(0);
        });

        it('debe mostrar input de cantidad con el valor correcto', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const inputs = screen.getAllByRole('spinbutton');
            expect(inputs[0]).toHaveValue(2);
            expect(inputs[1]).toHaveValue(1);
        });

        it('debe llamar a onUpdateQuantity al incrementar', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const plusButtons = document.querySelectorAll('.bi-plus');
            fireEvent.click(plusButtons[0].closest('button'));
            expect(mockHandlers.onUpdateQuantity).toHaveBeenCalledWith('P001', 3);
        });

        it('debe llamar a onUpdateQuantity al decrementar', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const minusButtons = document.querySelectorAll('.bi-dash');
            fireEvent.click(minusButtons[0].closest('button'));
            expect(mockHandlers.onUpdateQuantity).toHaveBeenCalledWith('P001', 1);
        });

        it('debe deshabilitar el botón de decrementar cuando quantity es 1', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const minusButtons = document.querySelectorAll('.bi-dash');
            // El segundo producto tiene quantity = 1
            expect(minusButtons[1].closest('button')).toBeDisabled();
        });

        it('debe deshabilitar el botón de incrementar cuando se alcanza el stock', () => {
            const productoConStockLimitado = [{
                ...mockProductos[0],
                quantity: 50,
                stock: 50
            }];
            render(<CarritoMainComponent cartItems={productoConStockLimitado} {...mockHandlers} />);
            const plusButtons = document.querySelectorAll('.bi-plus');
            expect(plusButtons[0].closest('button')).toBeDisabled();
        });

        it('debe permitir cambiar cantidad manualmente en el input', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const inputs = screen.getAllByRole('spinbutton');
            fireEvent.change(inputs[0], { target: { value: '5' } });
            expect(mockHandlers.onUpdateQuantity).toHaveBeenCalledWith('P001', 5);
        });

        it('debe manejar valores inválidos en el input', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const inputs = screen.getAllByRole('spinbutton');
            fireEvent.change(inputs[0], { target: { value: '' } });
            expect(mockHandlers.onUpdateQuantity).toHaveBeenCalledWith('P001', 1);
        });

        it('no debe permitir cantidad menor a 1', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const inputs = screen.getAllByRole('spinbutton');
            fireEvent.change(inputs[0], { target: { value: '0' } });
            // No debería llamarse con 0, sino con 1 como mínimo
            expect(mockHandlers.onUpdateQuantity).not.toHaveBeenCalledWith('P001', 0);
        });
    });

    describe('Eliminar productos', () => {
        it('debe tener botón de eliminar para cada producto', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const deleteButtons = screen.getAllByText(/Eliminar/i);
            expect(deleteButtons.length).toBeGreaterThanOrEqual(mockProductos.length);
        });

        it('debe llamar a onRemoveItem al hacer clic en eliminar', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const deleteButtons = screen.getAllByText(/Eliminar/i);
            fireEvent.click(deleteButtons[0]);
            expect(mockHandlers.onRemoveItem).toHaveBeenCalledWith('P001');
        });

        it('debe tener botón para vaciar todo el carrito', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            expect(screen.getByText(/Vaciar Carrito/i)).toBeInTheDocument();
        });

        it('debe llamar a onClearCart al vaciar el carrito', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const clearButton = screen.getByText(/Vaciar Carrito/i);
            fireEvent.click(clearButton);
            expect(mockHandlers.onClearCart).toHaveBeenCalled();
        });
    });

    describe('Modal de detalles', () => {
        it('debe abrir modal al hacer clic en la imagen', async () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const images = screen.getAllByAltText('Tomate Cherry');
            fireEvent.click(images[0]);

            await waitFor(() => {
                expect(screen.getByText('Detalles del Producto')).toBeInTheDocument();
            });
        });

        it('debe abrir modal al hacer clic en el nombre del producto', async () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const productName = screen.getByText('Tomate Cherry');
            fireEvent.click(productName);

            await waitFor(() => {
                expect(screen.getByText('Detalles del Producto')).toBeInTheDocument();
            });
        });

        it('debe abrir modal al hacer clic en "Ver detalles"', async () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const detailButtons = screen.getAllByText(/Ver detalles/i);
            fireEvent.click(detailButtons[0]);

            await waitFor(() => {
                expect(screen.getByText('Detalles del Producto')).toBeInTheDocument();
            });
        });

        it('debe mostrar información completa del producto en el modal', async () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const images = screen.getAllByAltText('Tomate Cherry');
            fireEvent.click(images[0]);

            await waitFor(() => {
                expect(screen.getByText('Detalles del Producto')).toBeInTheDocument();
                expect(screen.getByText(/Tomates cherry frescos/i)).toBeInTheDocument();
            });
        });

        it('debe mostrar el código del producto en el modal', async () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const images = screen.getAllByAltText('Tomate Cherry');
            fireEvent.click(images[0]);

            await waitFor(() => {
                const modalContent = screen.getByText('Detalles del Producto').closest('.modal-content');
                expect(modalContent).toBeInTheDocument();
            });
        });

        it('debe cerrar el modal al hacer clic en cerrar', async () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const images = screen.getAllByAltText('Tomate Cherry');
            fireEvent.click(images[0]);

            await waitFor(() => {
                expect(screen.getByText('Detalles del Producto')).toBeInTheDocument();
            });

            const closeButton = screen.getByText('Cerrar');
            fireEvent.click(closeButton);

            await waitFor(() => {
                expect(screen.queryByText('Detalles del Producto')).not.toBeInTheDocument();
            });
        });

        it('debe permitir eliminar producto desde el modal', async () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const images = screen.getAllByAltText('Tomate Cherry');
            fireEvent.click(images[0]);

            await waitFor(() => {
                expect(screen.getByText('Detalles del Producto')).toBeInTheDocument();
            });

            const deleteButton = screen.getByText(/Eliminar del Carrito/i);
            fireEvent.click(deleteButton);

            expect(mockHandlers.onRemoveItem).toHaveBeenCalledWith('P001');
        });
    });

    describe('Resumen del pedido', () => {
        it('debe mostrar el título del resumen', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            expect(screen.getByText(/Resumen del Pedido/i)).toBeInTheDocument();
        });

        it('debe mostrar información de envío gratis', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            expect(screen.getByText(/Envío gratis en compras superiores a/i)).toBeInTheDocument();
        });

        it('debe tener botón de proceder al pago', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            expect(screen.getByText(/Proceder al Pago/i)).toBeInTheDocument();
        });

        it('debe tener botón de seguir comprando', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const button = screen.getByText(/Seguir Comprando/i);
            expect(button).toBeInTheDocument();
            expect(button.closest('a')).toHaveAttribute('href', '/productos');
        });
    });

    describe('Casos edge', () => {
        it('debe manejar carrito con un solo producto', () => {
            const unProducto = [mockProductos[0]];
            render(<CarritoMainComponent cartItems={unProducto} {...mockHandlers} />);
            expect(screen.getByText('Tomate Cherry')).toBeInTheDocument();
            expect(screen.queryByText('Lechuga')).not.toBeInTheDocument();
        });

        it('debe manejar productos con precio 0', () => {
            const productoGratis = [{
                ...mockProductos[0],
                precio: 0
            }];
            render(<CarritoMainComponent cartItems={productoGratis} {...mockHandlers} />);
            const totals = screen.getAllByText(/0/);
            expect(totals.length).toBeGreaterThan(0);
        });

        it('debe manejar productos sin imagen', () => {
            const productoSinImagen = [{
                ...mockProductos[0],
                imagen: ''
            }];
            render(<CarritoMainComponent cartItems={productoSinImagen} {...mockHandlers} />);
            const images = screen.getAllByAltText('Tomate Cherry');
            // Verificar que la imagen se renderiza aunque src esté vacío
            expect(images[0]).toBeInTheDocument();
        });

        it('debe funcionar sin callbacks definidos', () => {
            render(<CarritoMainComponent cartItems={mockProductos} />);
            expect(screen.getByText('Tomate Cherry')).toBeInTheDocument();
        });
    });

    describe('Funcionalidad de cupones de descuento', () => {
        it('debe mostrar campo de cupón de descuento', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            expect(screen.getByPlaceholderText(/Ingresa tu código/i)).toBeInTheDocument();
            expect(screen.getByText(/¿Tienes un cupón de descuento?/i)).toBeInTheDocument();
        });

        it('debe tener botón para aplicar cupón deshabilitado cuando está vacío', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const aplicarBtn = screen.getByText(/Aplicar/i).closest('button');
            expect(aplicarBtn).toBeDisabled();
        });

        it('debe habilitar botón aplicar cuando se ingresa texto', () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const input = screen.getByPlaceholderText(/Ingresa tu código/i);
            const aplicarBtn = screen.getByText(/Aplicar/i).closest('button');
            
            fireEvent.change(input, { target: { value: 'VERDURAS30' } });
            expect(aplicarBtn).not.toBeDisabled();
        });

        it('debe aplicar un cupón válido', async () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const input = screen.getByPlaceholderText(/Ingresa tu código/i);
            const aplicarBtn = screen.getByText(/Aplicar/i).closest('button');
            
            fireEvent.change(input, { target: { value: 'VERDURAS30' } });
            fireEvent.click(aplicarBtn);
            
            await waitFor(() => {
                expect(screen.getByText(/VERDURAS30/i)).toBeInTheDocument();
                expect(screen.getByText(/30% de descuento aplicado/i)).toBeInTheDocument();
            });
        });

        it('debe mostrar error para cupón inválido', async () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const input = screen.getByPlaceholderText(/Ingresa tu código/i);
            const aplicarBtn = screen.getByText(/Aplicar/i).closest('button');
            
            fireEvent.change(input, { target: { value: 'CUPONINVALIDO' } });
            fireEvent.click(aplicarBtn);
            
            await waitFor(() => {
                expect(screen.getByText(/no válido/i)).toBeInTheDocument();
            });
        });

        it('debe poder remover un cupón aplicado', async () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const input = screen.getByPlaceholderText(/Ingresa tu código/i);
            const aplicarBtn = screen.getByText(/Aplicar/i).closest('button');
            
            // Aplicar cupón
            fireEvent.change(input, { target: { value: 'VERDURAS30' } });
            fireEvent.click(aplicarBtn);
            
            await waitFor(() => {
                expect(screen.getByText(/VERDURAS30/i)).toBeInTheDocument();
            });
            
            // Remover cupón - buscar el botón dentro de la alerta de éxito
            const removeBtn = screen.getAllByRole('button').find(btn => 
                btn.querySelector('.bi-x')
            );
            fireEvent.click(removeBtn);
            
            await waitFor(() => {
                expect(screen.queryByText(/VERDURAS30/i)).not.toBeInTheDocument();
                expect(screen.getByPlaceholderText(/Ingresa tu código/i)).toBeInTheDocument();
            });
        });

        it('debe aplicar cupón al presionar Enter', async () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const input = screen.getByPlaceholderText(/Ingresa tu código/i);
            
            fireEvent.change(input, { target: { value: 'VERDURAS30' } });
            fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
            
            await waitFor(() => {
                expect(screen.getByText(/VERDURAS30/i)).toBeInTheDocument();
            });
        });

        it('debe calcular correctamente el descuento en el total', async () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            
            // Total sin descuento: 2500*2 + 1500*1 = 6500
            const totalSinDescuento = 6500;
            
            // Verificar total inicial
            expect(screen.getAllByText(`$${totalSinDescuento.toLocaleString('es-CL')} CLP`).length).toBeGreaterThan(0);
            
            // Aplicar cupón del 30%
            const input = screen.getByPlaceholderText(/Ingresa tu código/i);
            const aplicarBtn = screen.getByText(/Aplicar/i).closest('button');
            
            fireEvent.change(input, { target: { value: 'VERDURAS30' } });
            fireEvent.click(aplicarBtn);
            
            await waitFor(() => {
                const descuento = Math.round(totalSinDescuento * 0.30);
                const totalConDescuento = totalSinDescuento - descuento;
                
                // Verificar que muestra el descuento
                expect(screen.getByText(new RegExp(`-\\$${descuento.toLocaleString('es-CL')} CLP`, 'i'))).toBeInTheDocument();
                
                // Verificar el total con descuento
                expect(screen.getByText(new RegExp(`\\$${totalConDescuento.toLocaleString('es-CL')} CLP`, 'i'))).toBeInTheDocument();
            });
        });

        it('debe limpiar mensaje de error al escribir nuevamente', async () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const input = screen.getByPlaceholderText(/Ingresa tu código/i);
            const aplicarBtn = screen.getByText(/Aplicar/i).closest('button');
            
            // Aplicar cupón inválido
            fireEvent.change(input, { target: { value: 'INVALIDO' } });
            fireEvent.click(aplicarBtn);
            
            await waitFor(() => {
                expect(screen.getByText(/no válido/i)).toBeInTheDocument();
            });
            
            // Escribir de nuevo
            fireEvent.change(input, { target: { value: 'VERDURAS30' } });
            
            await waitFor(() => {
                expect(screen.queryByText(/no válido/i)).not.toBeInTheDocument();
            });
        });

        it('debe mostrar icono de descuento cuando hay cupón aplicado', async () => {
            render(<CarritoMainComponent cartItems={mockProductos} {...mockHandlers} />);
            const input = screen.getByPlaceholderText(/Ingresa tu código/i);
            const aplicarBtn = screen.getByText(/Aplicar/i).closest('button');
            
            fireEvent.change(input, { target: { value: 'VERDURAS30' } });
            fireEvent.click(aplicarBtn);
            
            await waitFor(() => {
                // Buscar el elemento que contiene el descuento con icono
                const descuentoElement = screen.getByText(/Descuento \(30%\):/i);
                expect(descuentoElement).toBeInTheDocument();
            });
        });
    });
});

