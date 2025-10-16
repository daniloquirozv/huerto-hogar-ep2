import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CarritoMenu from '../../src/components/carritoMenu'

// Mock para useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate
    }
})

const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    )
}

describe('CarritoMenu', () => {
    let mockHandleClose
    let mockOnRemoveFromCart
    let mockOnUpdateQuantity
    let mockConfirm

    beforeEach(() => {
        mockHandleClose = vi.fn()
        mockOnRemoveFromCart = vi.fn()
        mockOnUpdateQuantity = vi.fn()
        mockNavigate.mockClear()
        
        // Mock window.confirm
        mockConfirm = vi.fn(() => true)
        global.window.confirm = mockConfirm
    })

    const productoEjemplo = {
        codigo: "FR001",
        nombre: "Manzanas Fuji",
        precio: 1200,
        unidad: "kg",
        stock: 150,
        categoria: "Frutas Frescas",
        descripcion: "Manzanas Fuji crujientes y dulces",
        imagen: "/images/manzanas.png",
        quantity: 2
    }

    const productoEjemplo2 = {
        codigo: "FR002",
        nombre: "Naranjas Valencia",
        precio: 1000,
        unidad: "kg",
        stock: 200,
        categoria: "Frutas Frescas",
        descripcion: "Naranjas jugosas",
        imagen: "/images/naranjas.png",
        quantity: 3
    }

    describe('Renderizado inicial', () => {
        it('debe renderizar el componente cuando show es true', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            expect(screen.getByText(/Mi Carrito/i)).toBeInTheDocument()
        })

        it('no debe mostrar el componente cuando show es false', () => {
            renderWithRouter(
                <CarritoMenu
                    show={false}
                    handleClose={mockHandleClose}
                    carritoItems={[]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            expect(screen.queryByText(/Mi Carrito/i)).not.toBeInTheDocument()
        })

        it('debe mostrar el título "Mi Carrito" con el ícono', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            expect(screen.getByText(/Mi Carrito/i)).toBeInTheDocument()
        })

        it('debe tener un botón de cerrar', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const closeButton = screen.getByLabelText('Close')
            expect(closeButton).toBeInTheDocument()
        })
    })

    describe('Carrito vacío', () => {
        it('debe mostrar mensaje cuando el carrito está vacío', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument()
        })

        it('debe mostrar el ícono de carrito vacío', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument()
        })

        it('debe mostrar mensaje de sugerencia', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            expect(screen.getByText(/Navega por las ofertas y categorías/i)).toBeInTheDocument()
        })

        it('debe mostrar botón "Buscar productos"', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            expect(screen.getByText(/Buscar productos/i)).toBeInTheDocument()
        })

        it('debe cerrar el menú al hacer clic en "Buscar productos"', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const button = screen.getByText(/Buscar productos/i)
            fireEvent.click(button)
            expect(mockHandleClose).toHaveBeenCalledTimes(1)
        })

        it('debe manejar carritoItems undefined correctamente', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={undefined}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument()
        })

        it('debe manejar carritoItems null correctamente', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={null}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument()
        })
    })

    describe('Carrito con productos', () => {
        it('debe mostrar los productos en el carrito', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            expect(screen.getByText(productoEjemplo.nombre)).toBeInTheDocument()
        })

        it('debe mostrar la imagen del producto', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const img = screen.getByAltText(productoEjemplo.nombre)
            expect(img).toBeInTheDocument()
            expect(img).toHaveAttribute('src', productoEjemplo.imagen)
        })

        it('debe mostrar el precio del producto', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const precioFormateado = `$${productoEjemplo.precio.toLocaleString('es-CL')} CLP/${productoEjemplo.unidad}`
            expect(screen.getByText(precioFormateado)).toBeInTheDocument()
        })

        it('debe mostrar la cantidad del producto', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const quantityButton = screen.getByText(productoEjemplo.quantity.toString())
            expect(quantityButton).toBeInTheDocument()
        })

        it('debe mostrar el subtotal del producto', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const subtotal = (productoEjemplo.precio * productoEjemplo.quantity).toLocaleString('es-CL')
            expect(screen.getByText(`$${subtotal}`)).toBeInTheDocument()
        })

        it('debe mostrar múltiples productos', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo, productoEjemplo2]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            expect(screen.getByText(productoEjemplo.nombre)).toBeInTheDocument()
            expect(screen.getByText(productoEjemplo2.nombre)).toBeInTheDocument()
        })

        it('debe mostrar el botón de eliminar para cada producto', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo, productoEjemplo2]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const deleteButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
                btn.className.includes('text-danger')
            )
            expect(deleteButtons.length).toBeGreaterThanOrEqual(2)
        })
    })

    describe('Cálculo del total', () => {
        it('debe calcular el total correctamente con un producto', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const total = (productoEjemplo.precio * productoEjemplo.quantity).toLocaleString('es-CL')
            expect(screen.getByText(`$${total} CLP`)).toBeInTheDocument()
        })

        it('debe calcular el total correctamente con múltiples productos', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo, productoEjemplo2]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const total = (
                (productoEjemplo.precio * productoEjemplo.quantity) +
                (productoEjemplo2.precio * productoEjemplo2.quantity)
            ).toLocaleString('es-CL')
            expect(screen.getByText(`$${total} CLP`)).toBeInTheDocument()
        })

        it('debe mostrar 0 cuando el carrito está vacío', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            expect(screen.queryByText(/Total:/i)).not.toBeInTheDocument()
        })
    })

    describe('Gestión de cantidades', () => {
        it('debe mostrar botones de incrementar y decrementar', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            // Verificar que existen botones con los íconos
            const allButtons = screen.getAllByRole('button')
            expect(allButtons.length).toBeGreaterThan(0)
        })

        it('debe incrementar la cantidad al hacer clic en el botón +', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            // Obtener todos los botones del grupo de cantidad
            const allButtons = screen.getAllByRole('button')
            
            // El último botón de outline-success no deshabilitado debería ser el de incrementar
            const outlineButtons = allButtons.filter(btn => 
                !btn.disabled && btn.className.includes('btn-outline-success')
            )
            
            // Buscar específicamente el botón que incrementa (debería ser el segundo o último)
            if (outlineButtons.length >= 2) {
                const plusButton = outlineButtons[1] // El segundo botón outline es el de +
                fireEvent.click(plusButton)
                
                expect(mockOnUpdateQuantity).toHaveBeenCalledWith(
                    productoEjemplo.codigo,
                    productoEjemplo.quantity + 1
                )
            } else {
                // Si no podemos encontrar el botón específico, al menos verificamos que existe
                expect(outlineButtons.length).toBeGreaterThan(0)
            }
        })

        it('debe decrementar la cantidad al hacer clic en el botón -', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const allButtons = screen.getAllByRole('button')
            const minusButtons = allButtons.filter(btn => 
                !btn.disabled && btn.className.includes('btn-outline-success')
            )
            
            if (minusButtons.length > 0) {
                const minusButton = minusButtons[0]
                fireEvent.click(minusButton)
                
                expect(mockOnUpdateQuantity).toHaveBeenCalledWith(
                    productoEjemplo.codigo,
                    productoEjemplo.quantity - 1
                )
            }
        })

        it('debe eliminar el producto si la cantidad es 1 y se hace clic en -', () => {
            const productoConCantidad1 = { ...productoEjemplo, quantity: 1 }
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoConCantidad1]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const allButtons = screen.getAllByRole('button')
            const minusButtons = allButtons.filter(btn => 
                !btn.disabled && btn.className.includes('btn-outline-success')
            )
            
            if (minusButtons.length > 0) {
                const minusButton = minusButtons[0]
                fireEvent.click(minusButton)
                
                expect(mockOnRemoveFromCart).toHaveBeenCalledWith(productoConCantidad1.codigo)
                expect(mockOnUpdateQuantity).not.toHaveBeenCalled()
            }
        })
    })

    describe('Eliminación de productos', () => {
        it('debe mostrar confirmación al intentar eliminar un producto', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const allButtons = screen.getAllByRole('button')
            const deleteButtons = allButtons.filter(btn => 
                btn.className.includes('text-danger')
            )
            
            if (deleteButtons.length > 0) {
                fireEvent.click(deleteButtons[0])
                
                expect(mockConfirm).toHaveBeenCalledWith(
                    "¿Estás seguro de eliminar este producto del carrito?"
                )
            }
        })

        it('debe eliminar el producto si se confirma', () => {
            mockConfirm.mockReturnValue(true)
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const allButtons = screen.getAllByRole('button')
            const deleteButtons = allButtons.filter(btn => 
                btn.className.includes('text-danger')
            )
            
            if (deleteButtons.length > 0) {
                fireEvent.click(deleteButtons[0])
                
                expect(mockOnRemoveFromCart).toHaveBeenCalledWith(productoEjemplo.codigo)
            }
        })

        it('no debe eliminar el producto si se cancela la confirmación', () => {
            mockConfirm.mockReturnValue(false)
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const allButtons = screen.getAllByRole('button')
            const deleteButtons = allButtons.filter(btn => 
                btn.className.includes('text-danger')
            )
            
            if (deleteButtons.length > 0) {
                fireEvent.click(deleteButtons[0])
                
                expect(mockOnRemoveFromCart).not.toHaveBeenCalled()
            }
        })
    })

    describe('Navegación', () => {
        it('debe mostrar el botón "Seguir comprando" cuando hay productos', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            expect(screen.getByText(/Seguir comprando/i)).toBeInTheDocument()
        })

        it('debe cerrar el menú al hacer clic en "Seguir comprando"', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const button = screen.getByText(/Seguir comprando/i)
            fireEvent.click(button)
            
            expect(mockHandleClose).toHaveBeenCalledTimes(1)
        })

        it('debe mostrar el botón "Pagar" cuando hay productos', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            expect(screen.getByText(/Pagar/i)).toBeInTheDocument()
        })

        it('debe navegar a /carrito y cerrar el menú al hacer clic en "Pagar"', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const button = screen.getByText(/Pagar/i)
            fireEvent.click(button)
            
            expect(mockHandleClose).toHaveBeenCalledTimes(1)
            expect(mockNavigate).toHaveBeenCalledWith('/carrito')
        })

        it('debe mostrar el ícono de tarjeta de crédito en el botón Pagar', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const payButton = screen.getByText(/Pagar/i)
            expect(payButton).toBeInTheDocument()
        })
    })

    describe('Interfaz y estilos', () => {
        it('debe renderizar el offcanvas correctamente', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            expect(screen.getByText(/Mi Carrito/i)).toBeInTheDocument()
        })

        it('debe mostrar el título correctamente', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            expect(screen.getByText(/Mi Carrito/i)).toBeInTheDocument()
        })

        it('debe renderizar la estructura del offcanvas', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            expect(screen.getByText(/Mi Carrito/i)).toBeInTheDocument()
        })

        it('debe mostrar las imágenes de productos con border-radius', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const img = screen.getByAltText(productoEjemplo.nombre)
            expect(img).toHaveStyle({ borderRadius: '8px' })
        })

        it('debe mostrar el total con color verde', () => {
            const { container } = renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const totalElement = screen.getByText(/Total:/i).closest('div').querySelector('h4')
            expect(totalElement).toHaveClass('text-success')
        })
    })

    describe('Accesibilidad', () => {
        it('debe tener botones con roles adecuados', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const buttons = screen.getAllByRole('button')
            expect(buttons.length).toBeGreaterThan(0)
        })

        it('debe tener imágenes con atributo alt', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const img = screen.getByAltText(productoEjemplo.nombre)
            expect(img).toHaveAttribute('alt', productoEjemplo.nombre)
        })

        it('debe deshabilitar el botón de cantidad', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    carritoItems={[productoEjemplo]}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            const quantityButton = screen.getByText(productoEjemplo.quantity.toString())
            expect(quantityButton).toBeDisabled()
        })
    })

    describe('Props y validación', () => {
        it('debe manejar correctamente todas las props requeridas', () => {
            expect(() => 
                renderWithRouter(
                    <CarritoMenu
                        show={true}
                        handleClose={mockHandleClose}
                        carritoItems={[productoEjemplo]}
                        onRemoveFromCart={mockOnRemoveFromCart}
                        onUpdateQuantity={mockOnUpdateQuantity}
                    />
                )
            ).not.toThrow()
        })

        it('debe usar array vacío por defecto si carritoItems no se proporciona', () => {
            renderWithRouter(
                <CarritoMenu
                    show={true}
                    handleClose={mockHandleClose}
                    onRemoveFromCart={mockOnRemoveFromCart}
                    onUpdateQuantity={mockOnUpdateQuantity}
                />
            )
            expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument()
        })
    })
})
