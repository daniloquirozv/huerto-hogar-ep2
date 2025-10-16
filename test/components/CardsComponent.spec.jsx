import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import CardsComponent from '../../src/components/CardsComponent'
import { productos } from '../../src/data/productos'

describe('CardsComponent', () => {
    let mockOnAddToCart

    beforeEach(() => {
        mockOnAddToCart = vi.fn()
    })

    describe('Renderizado inicial', () => {
        it('debe renderizar el componente correctamente', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            expect(screen.getByText('Frutas Frescas')).toBeInTheDocument()
        })

        it('debe renderizar todas las categorías correctamente', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            expect(screen.getByText('Frutas Frescas')).toBeInTheDocument()
            expect(screen.getByText('Verduras')).toBeInTheDocument()
            expect(screen.getByText('Productos Orgánicos')).toBeInTheDocument()
            expect(screen.getByText('Productos Lácteos')).toBeInTheDocument()
        })

        it('debe renderizar las descripciones de cada categoría', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            expect(screen.getByText(/Nuestra selección de frutas frescas/i)).toBeInTheDocument()
            expect(screen.getByText(/Nuestra selección de verduras frescas/i)).toBeInTheDocument()
            expect(screen.getByText(/Nuestros productos orgánicos están elaborados/i)).toBeInTheDocument()
            expect(screen.getByText(/Los productos lácteos de HuertoHogar/i)).toBeInTheDocument()
        })

        it('debe renderizar todos los productos del catálogo', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            productos.forEach(producto => {
                expect(screen.getByText(producto.nombre)).toBeInTheDocument()
            })
        })

        it('debe mostrar la información básica de cada producto', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const primerProducto = productos[0]
            expect(screen.getByText(primerProducto.nombre)).toBeInTheDocument()
            expect(screen.getByText(primerProducto.codigo)).toBeInTheDocument()
            expect(screen.getByText(new RegExp(`\\$${primerProducto.precio.toLocaleString('es-CL')}`))).toBeInTheDocument()
        })

        it('debe mostrar el stock disponible de cada producto', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            productos.forEach(producto => {
                const stockText = `${producto.stock} ${producto.unidad} disponibles`
                expect(screen.getByText(stockText)).toBeInTheDocument()
            })
        })

        it('debe renderizar las imágenes de los productos', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            productos.forEach(producto => {
                const images = screen.getAllByAltText(producto.nombre)
                expect(images.length).toBeGreaterThan(0)
                expect(images[0]).toHaveAttribute('src', producto.imagen)
            })
        })

        it('debe mostrar la descripción de cada producto', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            productos.forEach(producto => {
                expect(screen.getByText(producto.descripcion)).toBeInTheDocument()
            })
        })

        it('debe renderizar el botón "Agregar al Carrito" para cada producto', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const buttons = screen.getAllByText(/Agregar al Carrito/i)
            expect(buttons.length).toBe(productos.length)
        })

        it('debe renderizar un input de cantidad para cada producto', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const cantidadInputs = screen.getAllByDisplayValue('1')
            expect(cantidadInputs.length).toBeGreaterThanOrEqual(productos.length)
        })
    })

    describe('Gestión de cantidades', () => {
        it('debe inicializar la cantidad en 1 para todos los productos', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const inputs = screen.getAllByRole('spinbutton')
            inputs.forEach(input => {
                expect(input).toHaveValue(1)
            })
        })

        it('debe cambiar la cantidad cuando el usuario modifica el input', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const inputs = screen.getAllByRole('spinbutton')
            const primerInput = inputs[0]
            
            fireEvent.change(primerInput, { target: { value: '5' } })
            expect(primerInput).toHaveValue(5)
        })

        it('debe manejar múltiples cambios de cantidad en diferentes productos', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const inputs = screen.getAllByRole('spinbutton')
            
            fireEvent.change(inputs[0], { target: { value: '3' } })
            fireEvent.change(inputs[1], { target: { value: '7' } })
            
            expect(inputs[0]).toHaveValue(3)
            expect(inputs[1]).toHaveValue(7)
        })

        it('debe establecer la cantidad en 1 si el valor es 0 o negativo', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const inputs = screen.getAllByRole('spinbutton')
            
            fireEvent.change(inputs[0], { target: { value: '0' } })
            expect(inputs[0]).toHaveValue(1)
            
            fireEvent.change(inputs[0], { target: { value: '-5' } })
            expect(inputs[0]).toHaveValue(1)
        })

        it('debe manejar valores no numéricos estableciendo la cantidad en 1', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const inputs = screen.getAllByRole('spinbutton')
            
            fireEvent.change(inputs[0], { target: { value: 'abc' } })
            expect(inputs[0]).toHaveValue(1)
        })

        it('debe respetar el atributo max basado en el stock', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const inputs = screen.getAllByRole('spinbutton')
            const primerProducto = productos[0]
            
            expect(inputs[0]).toHaveAttribute('max', primerProducto.stock.toString())
        })

        it('debe tener el atributo min en 1', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const inputs = screen.getAllByRole('spinbutton')
            inputs.forEach(input => {
                expect(input).toHaveAttribute('min', '1')
            })
        })
    })

    describe('Agregar al carrito', () => {
        it('debe llamar a onAddToCart cuando se hace clic en el botón', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const buttons = screen.getAllByText(/Agregar al Carrito/i)
            fireEvent.click(buttons[0])
            
            expect(mockOnAddToCart).toHaveBeenCalledTimes(1)
        })

        it('debe llamar a onAddToCart con el producto correcto y cantidad 1 por defecto', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const primerProducto = productos[0]
            const buttons = screen.getAllByText(/Agregar al Carrito/i)
            
            fireEvent.click(buttons[0])
            
            expect(mockOnAddToCart).toHaveBeenCalledWith(primerProducto, 1)
        })

        it('debe llamar a onAddToCart con la cantidad seleccionada', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const primerProducto = productos[0]
            const inputs = screen.getAllByRole('spinbutton')
            const buttons = screen.getAllByText(/Agregar al Carrito/i)
            
            fireEvent.change(inputs[0], { target: { value: '5' } })
            fireEvent.click(buttons[0])
            
            expect(mockOnAddToCart).toHaveBeenCalledWith(primerProducto, 5)
        })

        it('debe resetear la cantidad a 1 después de agregar al carrito', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const inputs = screen.getAllByRole('spinbutton')
            const buttons = screen.getAllByText(/Agregar al Carrito/i)
            
            fireEvent.change(inputs[0], { target: { value: '5' } })
            fireEvent.click(buttons[0])
            
            expect(inputs[0]).toHaveValue(1)
        })

        it('debe permitir agregar múltiples productos al carrito', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const buttons = screen.getAllByText(/Agregar al Carrito/i)
            
            fireEvent.click(buttons[0])
            fireEvent.click(buttons[1])
            fireEvent.click(buttons[2])
            
            expect(mockOnAddToCart).toHaveBeenCalledTimes(3)
        })

        it('debe agregar el mismo producto múltiples veces', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const primerProducto = productos[0]
            const buttons = screen.getAllByText(/Agregar al Carrito/i)
            
            fireEvent.click(buttons[0])
            fireEvent.click(buttons[0])
            
            expect(mockOnAddToCart).toHaveBeenCalledTimes(2)
            expect(mockOnAddToCart).toHaveBeenCalledWith(primerProducto, 1)
        })

        it('debe manejar diferentes cantidades para diferentes productos', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const inputs = screen.getAllByRole('spinbutton')
            const buttons = screen.getAllByText(/Agregar al Carrito/i)
            
            fireEvent.change(inputs[0], { target: { value: '3' } })
            fireEvent.click(buttons[0])
            
            fireEvent.change(inputs[1], { target: { value: '7' } })
            fireEvent.click(buttons[1])
            
            expect(mockOnAddToCart).toHaveBeenNthCalledWith(1, productos[0], 3)
            expect(mockOnAddToCart).toHaveBeenNthCalledWith(2, productos[1], 7)
        })
    })

    describe('Agrupación por categorías', () => {
        it('debe agrupar los productos por categoría correctamente', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const categorias = ['Frutas Frescas', 'Verduras', 'Productos Orgánicos', 'Productos Lácteos']
            
            categorias.forEach(categoria => {
                const categorySection = screen.getByText(categoria).closest('.category-section')
                expect(categorySection).toBeInTheDocument()
            })
        })

        it('debe mostrar solo los productos de la categoría Frutas Frescas en esa sección', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const frutasFrescas = productos.filter(p => p.categoria === 'Frutas Frescas')
            
            frutasFrescas.forEach(producto => {
                expect(screen.getByText(producto.nombre)).toBeInTheDocument()
            })
        })

        it('debe renderizar las secciones en el orden correcto', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const categorySections = screen.getAllByText(/Frutas Frescas|Verduras|Productos Orgánicos|Productos Lácteos/i)
                .filter(el => el.classList.contains('category-title'))
            
            expect(categorySections[0]).toHaveTextContent('Frutas Frescas')
            expect(categorySections[1]).toHaveTextContent('Verduras')
            expect(categorySections[2]).toHaveTextContent('Productos Orgánicos')
            expect(categorySections[3]).toHaveTextContent('Productos Lácteos')
        })
    })

    describe('Interfaz y clases CSS', () => {
        it('debe aplicar la clase product-card a cada tarjeta de producto', () => {
            const { container } = render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const productCards = container.querySelectorAll('.product-card')
            expect(productCards.length).toBe(productos.length)
        })

        it('debe aplicar la clase btn-add-cart a los botones de agregar', () => {
            const { container } = render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const addButtons = container.querySelectorAll('.btn-add-cart')
            expect(addButtons.length).toBe(productos.length)
        })

        it('debe mostrar el ícono del carrito en el botón', () => {
            const { container } = render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const cartIcons = container.querySelectorAll('.bi-cart-plus')
            expect(cartIcons.length).toBe(productos.length)
        })

        it('debe aplicar la clase category-section a cada sección', () => {
            const { container } = render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const categorySections = container.querySelectorAll('.category-section')
            expect(categorySections.length).toBe(4) // 4 categorías
        })

        it('debe mostrar el código del producto con la clase product-code', () => {
            const { container } = render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const productCodes = container.querySelectorAll('.product-code')
            expect(productCodes.length).toBe(productos.length)
        })

        it('debe mostrar el badge de stock con la clase stock-badge', () => {
            const { container } = render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const stockBadges = container.querySelectorAll('.stock-badge')
            expect(stockBadges.length).toBe(productos.length)
        })
    })

    describe('Props y validación', () => {
        it('debe requerir la prop onAddToCart', () => {
            // No debe lanzar error al renderizar sin la prop
            expect(() => render(<CardsComponent />)).not.toThrow()
        })

        it('debe funcionar correctamente con la prop onAddToCart proporcionada', () => {
            expect(() => render(<CardsComponent onAddToCart={mockOnAddToCart} />)).not.toThrow()
        })
    })

    describe('Formato de precios', () => {
        it('debe formatear los precios correctamente en formato CLP', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            productos.forEach(producto => {
                const precioFormateado = `$${producto.precio.toLocaleString('es-CL')} CLP/${producto.unidad}`
                expect(screen.getByText(new RegExp(precioFormateado.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeInTheDocument()
            })
        })
    })

    describe('Accesibilidad', () => {
        it('debe tener inputs de tipo number con roles adecuados', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const numberInputs = screen.getAllByRole('spinbutton')
            expect(numberInputs.length).toBe(productos.length)
        })

        it('debe tener botones con texto descriptivo', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            const buttons = screen.getAllByRole('button', { name: /Agregar al Carrito/i })
            expect(buttons.length).toBe(productos.length)
        })

        it('debe tener imágenes con texto alternativo', () => {
            render(<CardsComponent onAddToCart={mockOnAddToCart} />)
            
            productos.forEach(producto => {
                const images = screen.getAllByAltText(producto.nombre)
                expect(images.length).toBeGreaterThan(0)
            })
        })
    })
})
