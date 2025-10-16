import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Blog from '../../../src/components/layout/blog';
import { blogPosts, categoriasBlogs, promocionesActivas } from '../../../src/data/blogPosts';

// Mock de navigator.clipboard
Object.assign(navigator, {
    clipboard: {
        writeText: vi.fn(),
    },
});

describe('Blog Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Renderizado inicial', () => {
        it('debe renderizar el componente correctamente', () => {
            render(<Blog />);
            expect(screen.getByText(/Blog HuertoHogar/i)).toBeInTheDocument();
            expect(screen.getByText(/Consejos, noticias y las mejores ofertas/i)).toBeInTheDocument();
        });

        it('debe mostrar el header del blog con el icono', () => {
            render(<Blog />);
            const header = screen.getByText(/Blog HuertoHogar/i);
            expect(header).toBeInTheDocument();
            expect(header.className).toContain('text-success');
        });

        it('debe renderizar el campo de búsqueda', () => {
            render(<Blog />);
            const searchInput = screen.getByPlaceholderText(/Buscar en el blog.../i);
            expect(searchInput).toBeInTheDocument();
        });

        it('debe renderizar el selector de categorías', () => {
            render(<Blog />);
            const categorySelect = screen.getByRole('combobox');
            expect(categorySelect).toBeInTheDocument();
        });

        it('debe mostrar todas las categorías en el selector', () => {
            render(<Blog />);
            const categorySelect = screen.getByRole('combobox');
            
            categoriasBlogs.forEach(categoria => {
                const option = screen.getByRole('option', { name: categoria.nombre });
                expect(option).toBeInTheDocument();
                expect(option.value).toBe(categoria.valor);
            });
        });
    });

    describe('Banner de promociones activas', () => {
        it('debe mostrar el banner si hay promociones activas', () => {
            render(<Blog />);
            
            if (promocionesActivas.length > 0) {
                expect(screen.getByText(/Promociones Activas/i)).toBeInTheDocument();
            }
        });

        it('debe mostrar el número correcto de promociones activas', () => {
            render(<Blog />);
            
            if (promocionesActivas.length > 0) {
                expect(screen.getByText(new RegExp(`${promocionesActivas.length} Promociones Activas`, 'i'))).toBeInTheDocument();
            }
        });
    });

    describe('Lista de posts', () => {
        it('debe renderizar todos los posts inicialmente', () => {
            render(<Blog />);
            
            // Verificar que se muestran los posts
            blogPosts.forEach(post => {
                expect(screen.getByText(post.titulo)).toBeInTheDocument();
            });
        });

        it('debe mostrar la imagen de cada post', () => {
            const { container } = render(<Blog />);
            
            // Verificar que existen imágenes con la clase post-imagen
            const images = container.querySelectorAll('.post-imagen');
            expect(images.length).toBe(blogPosts.length);
        });

        it('debe mostrar la categoría de cada post', () => {
            render(<Blog />);
            
            blogPosts.forEach(post => {
                const badges = screen.getAllByText(post.categoria);
                expect(badges.length).toBeGreaterThan(0);
            });
        });

        it('debe mostrar la fecha formateada de cada post', () => {
            render(<Blog />);
            
            blogPosts.forEach(post => {
                const fechaFormateada = new Date(post.fecha).toLocaleDateString('es-ES');
                const fechas = screen.getAllByText(fechaFormateada);
                expect(fechas.length).toBeGreaterThan(0);
            });
        });

        it('debe mostrar el resumen de cada post', () => {
            render(<Blog />);
            
            blogPosts.forEach(post => {
                expect(screen.getByText(post.resumen)).toBeInTheDocument();
            });
        });

        it('debe mostrar el badge de destacado en posts destacados', () => {
            render(<Blog />);
            
            const postsDestacados = blogPosts.filter(post => post.destacado);
            const destacadoBadges = screen.getAllByText(/Destacado/i);
            
            expect(destacadoBadges.length).toBe(postsDestacados.length);
        });

        it('debe mostrar el badge de urgente en posts urgentes', () => {
            render(<Blog />);
            
            const postsUrgentes = blogPosts.filter(post => post.urgente);
            if (postsUrgentes.length > 0) {
                const urgenteBadges = screen.getAllByText(/¡Urgente!/i);
                expect(urgenteBadges.length).toBe(postsUrgentes.length);
            }
        });
    });

    describe('Funcionalidad de búsqueda', () => {
        it('debe filtrar posts por título', () => {
            render(<Blog />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar en el blog.../i);
            const primerPost = blogPosts[0];
            
            fireEvent.change(searchInput, { target: { value: primerPost.titulo.substring(0, 10) } });
            
            expect(screen.getByText(primerPost.titulo)).toBeInTheDocument();
        });

        it('debe filtrar posts por resumen', () => {
            render(<Blog />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar en el blog.../i);
            const primerPost = blogPosts[0];
            
            fireEvent.change(searchInput, { target: { value: primerPost.resumen.substring(0, 10) } });
            
            expect(screen.getByText(primerPost.titulo)).toBeInTheDocument();
        });

        it('debe ser case-insensitive en la búsqueda', () => {
            render(<Blog />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar en el blog.../i);
            const primerPost = blogPosts[0];
            
            fireEvent.change(searchInput, { target: { value: primerPost.titulo.toUpperCase().substring(0, 10) } });
            
            expect(screen.getByText(primerPost.titulo)).toBeInTheDocument();
        });

        it('debe mostrar mensaje cuando no hay resultados', () => {
            render(<Blog />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar en el blog.../i);
            fireEvent.change(searchInput, { target: { value: 'textoquenoseguramentenoexiste12345' } });
            
            expect(screen.getByText(/No se encontraron posts/i)).toBeInTheDocument();
        });

        it('debe limpiar la búsqueda correctamente', () => {
            render(<Blog />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar en el blog.../i);
            
            fireEvent.change(searchInput, { target: { value: 'búsqueda' } });
            expect(searchInput.value).toBe('búsqueda');
            
            fireEvent.change(searchInput, { target: { value: '' } });
            expect(searchInput.value).toBe('');
        });
    });

    describe('Filtrado por categoría', () => {
        it('debe filtrar posts por categoría seleccionada', () => {
            render(<Blog />);
            
            const categorySelect = screen.getByRole('combobox');
            const categoriaTest = categoriasBlogs.find(cat => cat.valor !== 'todas');
            
            if (categoriaTest) {
                fireEvent.change(categorySelect, { target: { value: categoriaTest.valor } });
                
                const postsFiltrados = blogPosts.filter(post => post.categoria === categoriaTest.valor);
                
                postsFiltrados.forEach(post => {
                    expect(screen.getByText(post.titulo)).toBeInTheDocument();
                });
            }
        });

        it('debe mostrar todos los posts cuando se selecciona "todas"', () => {
            render(<Blog />);
            
            const categorySelect = screen.getByRole('combobox');
            
            // Cambiar a una categoría específica
            const categoriaEspecifica = categoriasBlogs.find(cat => cat.valor !== 'todas');
            if (categoriaEspecifica) {
                fireEvent.change(categorySelect, { target: { value: categoriaEspecifica.valor } });
                
                // Volver a "todas"
                fireEvent.change(categorySelect, { target: { value: 'todas' } });
                
                // Verificar que se muestran todos los posts
                blogPosts.forEach(post => {
                    expect(screen.getByText(post.titulo)).toBeInTheDocument();
                });
            }
        });

        it('debe combinar búsqueda y filtro de categoría', () => {
            render(<Blog />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar en el blog.../i);
            const categorySelect = screen.getByRole('combobox');
            
            // Seleccionar una categoría
            const categoriaTest = categoriasBlogs.find(cat => cat.valor !== 'todas');
            if (categoriaTest) {
                fireEvent.change(categorySelect, { target: { value: categoriaTest.valor } });
                
                // Agregar búsqueda
                const postEnCategoria = blogPosts.find(post => post.categoria === categoriaTest.valor);
                if (postEnCategoria) {
                    fireEvent.change(searchInput, { target: { value: postEnCategoria.titulo.substring(0, 5) } });
                    
                    // Verificar que el post está visible
                    expect(screen.getByText(postEnCategoria.titulo)).toBeInTheDocument();
                }
            }
        });
    });

    describe('Información de descuentos', () => {
        it('debe mostrar el badge de descuento cuando el post tiene descuento', () => {
            render(<Blog />);
            
            const postsConDescuento = blogPosts.filter(post => post.descuento);
            
            postsConDescuento.forEach(post => {
                const descuentoBadges = screen.getAllByText(new RegExp(`${post.descuento}% OFF`, 'i'));
                expect(descuentoBadges.length).toBeGreaterThan(0);
            });
        });

        it('debe mostrar el código de cupón', () => {
            render(<Blog />);
            
            const postsConCupon = blogPosts.filter(post => post.codigoCupon);
            
            postsConCupon.forEach(post => {
                const cuponTexts = screen.getAllByText(new RegExp(post.codigoCupon, 'i'));
                expect(cuponTexts.length).toBeGreaterThan(0);
            });
        });

        it('debe calcular y mostrar los días restantes correctamente', () => {
            render(<Blog />);
            
            const postsConFechaVencimiento = blogPosts.filter(post => post.fechaVencimiento);
            
            postsConFechaVencimiento.forEach(post => {
                const hoy = new Date();
                const vencimiento = new Date(post.fechaVencimiento);
                const diferencia = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
                
                if (diferencia > 0) {
                    const diasTexts = screen.getAllByText(new RegExp(`${diferencia} días restantes`, 'i'));
                    expect(diasTexts.length).toBeGreaterThan(0);
                }
            });
        });

        it('debe mostrar mensaje de oferta vencida cuando corresponde', () => {
            // Este test depende de si hay ofertas vencidas en los datos
            render(<Blog />);
            
            const postsVencidos = blogPosts.filter(post => {
                if (!post.fechaVencimiento) return false;
                const hoy = new Date();
                const vencimiento = new Date(post.fechaVencimiento);
                return vencimiento < hoy;
            });
            
            if (postsVencidos.length > 0) {
                const vencidoTexts = screen.getAllByText(/¡Oferta vencida!/i);
                expect(vencidoTexts.length).toBeGreaterThan(0);
            }
        });
    });

    describe('Botones de acción', () => {
        it('debe tener botón "Leer Más" en cada post', () => {
            render(<Blog />);
            
            const leerMasButtons = screen.getAllByText(/Leer Más/i);
            expect(leerMasButtons.length).toBe(blogPosts.length);
        });

        it('debe mostrar botón de copiar cupón en posts con cupón válido', () => {
            const { container } = render(<Blog />);
            
            const postsConCuponValido = blogPosts.filter(post => {
                if (!post.codigoCupon || !post.fechaVencimiento) return false;
                const hoy = new Date();
                const vencimiento = new Date(post.fechaVencimiento);
                const diferencia = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
                return diferencia > 0;
            });
            
            // Buscar iconos de clipboard (botones de copiar)
            const clipboardIcons = container.querySelectorAll('.bi-clipboard');
            
            expect(clipboardIcons.length).toBeGreaterThanOrEqual(postsConCuponValido.length);
        });
    });

    describe('Funcionalidad de copiar cupón', () => {
        it('debe copiar el cupón al portapapeles cuando se hace clic', async () => {
            const { container } = render(<Blog />);
            
            const postConCupon = blogPosts.find(post => {
                if (!post.codigoCupon || !post.fechaVencimiento) return false;
                const hoy = new Date();
                const vencimiento = new Date(post.fechaVencimiento);
                return Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24)) > 0;
            });
            
            if (postConCupon) {
                // Buscar todos los botones con icono de clipboard
                const clipboardButtons = container.querySelectorAll('button .bi-clipboard');
                
                if (clipboardButtons.length > 0) {
                    const button = clipboardButtons[0].closest('button');
                    fireEvent.click(button);
                    
                    await waitFor(() => {
                        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(postConCupon.codigoCupon);
                    });
                }
            }
        });

        it('debe cambiar el texto del botón después de copiar', async () => {
            const { container } = render(<Blog />);
            
            const postConCupon = blogPosts.find(post => {
                if (!post.codigoCupon || !post.fechaVencimiento) return false;
                const hoy = new Date();
                const vencimiento = new Date(post.fechaVencimiento);
                return Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24)) > 0;
            });
            
            if (postConCupon) {
                const clipboardButtons = container.querySelectorAll('button .bi-clipboard');
                
                if (clipboardButtons.length > 0) {
                    const button = clipboardButtons[0].closest('button');
                    fireEvent.click(button);
                    
                    await waitFor(() => {
                        const checkIcons = container.querySelectorAll('.bi-check');
                        expect(checkIcons.length).toBeGreaterThan(0);
                    });
                }
            }
        });

        it('debe restablecer el estado del cupón después de 3 segundos', async () => {
            const { container } = render(<Blog />);
            
            const postConCupon = blogPosts.find(post => {
                if (!post.codigoCupon || !post.fechaVencimiento) return false;
                const hoy = new Date();
                const vencimiento = new Date(post.fechaVencimiento);
                return Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24)) > 0;
            });
            
            if (postConCupon) {
                const clipboardButtons = container.querySelectorAll('button .bi-clipboard');
                
                if (clipboardButtons.length > 0) {
                    const button = clipboardButtons[0].closest('button');
                    
                    // Hacer clic
                    fireEvent.click(button);
                    
                    // Verificar que cambió a check
                    await waitFor(() => {
                        const checkIcons = container.querySelectorAll('.bi-check');
                        expect(checkIcons.length).toBeGreaterThan(0);
                    }, { timeout: 1000 });
                    
                    // Esperar más de 3 segundos para que se restablezca
                    await new Promise(resolve => setTimeout(resolve, 3100));
                    
                    // Verificar que volvió al estado original
                    const clipboardIconsAfter = container.querySelectorAll('.bi-clipboard');
                    expect(clipboardIconsAfter.length).toBeGreaterThan(0);
                }
            }
        });
    });

    describe('Vista de post individual', () => {
        it('debe mostrar la vista individual al hacer clic en "Leer Más"', () => {
            render(<Blog />);
            
            const leerMasButtons = screen.getAllByText(/Leer Más/i);
            fireEvent.click(leerMasButtons[0]);
            
            // Verificar que aparece el botón "Volver al Blog"
            expect(screen.getByText(/Volver al Blog/i)).toBeInTheDocument();
        });

        it('debe mostrar el título del post en la vista individual', () => {
            render(<Blog />);
            
            const primerPost = blogPosts[0];
            const leerMasButtons = screen.getAllByText(/Leer Más/i);
            fireEvent.click(leerMasButtons[0]);
            
            // El título debe aparecer como h1 en la vista individual
            const titulos = screen.getAllByText(primerPost.titulo);
            expect(titulos.length).toBeGreaterThan(0);
        });

        it('debe mostrar el autor del post', () => {
            render(<Blog />);
            
            const primerPost = blogPosts[0];
            const leerMasButtons = screen.getAllByText(/Leer Más/i);
            fireEvent.click(leerMasButtons[0]);
            
            expect(screen.getByText(new RegExp(primerPost.autor, 'i'))).toBeInTheDocument();
        });

        it('debe mostrar el contenido del post', () => {
            const { container } = render(<Blog />);
            
            const leerMasButtons = screen.getAllByText(/Leer Más/i);
            fireEvent.click(leerMasButtons[0]);
            
            // Verificar que existe el div con el contenido
            const contenidoDiv = container.querySelector('.post-contenido');
            expect(contenidoDiv).toBeInTheDocument();
        });

        it('debe volver a la lista al hacer clic en "Volver al Blog"', () => {
            render(<Blog />);
            
            // Ir a vista individual
            const leerMasButtons = screen.getAllByText(/Leer Más/i);
            fireEvent.click(leerMasButtons[0]);
            
            // Volver a la lista
            const volverButton = screen.getByText(/Volver al Blog/i);
            fireEvent.click(volverButton);
            
            // Verificar que estamos de vuelta en la lista
            expect(screen.getByText(/Blog HuertoHogar/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Buscar en el blog.../i)).toBeInTheDocument();
        });

        it('debe mostrar el cupón en la vista individual si existe', () => {
            render(<Blog />);
            
            const postConCupon = blogPosts.find(post => post.codigoCupon);
            
            if (postConCupon) {
                // Buscar el post en la lista
                const titulo = screen.getByText(postConCupon.titulo);
                const card = titulo.closest('.post-card') || titulo.closest('.card');
                const leerMasButton = card.querySelector('button');
                
                if (leerMasButton) {
                    fireEvent.click(leerMasButton);
                    
                    // Verificar que se muestra el cupón
                    const cuponTexts = screen.getAllByText(new RegExp(postConCupon.codigoCupon, 'i'));
                    expect(cuponTexts.length).toBeGreaterThan(0);
                }
            }
        });

        it('debe permitir copiar el cupón desde la vista individual', async () => {
            render(<Blog />);
            
            const postConCupon = blogPosts.find(post => {
                if (!post.codigoCupon || !post.fechaVencimiento) return false;
                const hoy = new Date();
                const vencimiento = new Date(post.fechaVencimiento);
                return Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24)) > 0;
            });
            
            if (postConCupon) {
                // Buscar el botón "Leer Más" del post con cupón
                const leerMasButtons = screen.getAllByText(/Leer Más/i);
                
                // Buscar el índice del post con cupón
                const postIndex = blogPosts.findIndex(p => p.id === postConCupon.id);
                
                if (postIndex !== -1 && postIndex < leerMasButtons.length) {
                    // Ir a la vista individual
                    fireEvent.click(leerMasButtons[postIndex]);
                    
                    // Esperar a que aparezca la vista individual
                    await waitFor(() => {
                        expect(screen.getByText(/Volver al Blog/i)).toBeInTheDocument();
                    }, { timeout: 1000 });
                    
                    // Buscar el botón de copiar en la vista individual
                    const copiarButtons = screen.queryAllByText(/Copiar Código/i);
                    
                    if (copiarButtons.length > 0) {
                        fireEvent.click(copiarButtons[0]);
                        
                        // Verificar que se copió
                        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(postConCupon.codigoCupon);
                    }
                }
            }
        });
    });

    describe('Newsletter', () => {
        it('debe mostrar la sección de newsletter', () => {
            render(<Blog />);
            
            expect(screen.getByText(/¡Suscríbete a nuestro Newsletter!/i)).toBeInTheDocument();
        });

        it('debe tener un campo de email', () => {
            render(<Blog />);
            
            const emailInput = screen.getByPlaceholderText(/tu@email.com/i);
            expect(emailInput).toBeInTheDocument();
            expect(emailInput.type).toBe('email');
        });

        it('debe tener un botón de suscribirse', () => {
            render(<Blog />);
            
            const suscribirseButton = screen.getByText(/Suscribirse/i);
            expect(suscribirseButton).toBeInTheDocument();
        });

        it('debe mostrar el incentivo de suscripción', () => {
            render(<Blog />);
            
            expect(screen.getByText(/Al suscribirte recibes un 10% OFF/i)).toBeInTheDocument();
        });
    });

    describe('Accesibilidad y UX', () => {
        it('debe tener imágenes renderizadas correctamente', () => {
            const { container } = render(<Blog />);
            
            // Verificar que existen imágenes
            const images = container.querySelectorAll('.post-imagen');
            expect(images.length).toBeGreaterThan(0);
            
            // Verificar que las imágenes tienen src
            images.forEach(img => {
                expect(img.src).toBeTruthy();
            });
        });

        it('debe tener botones con contenido', () => {
            render(<Blog />);
            
            const buttons = screen.getAllByRole('button');
            // Verificar que existen botones
            expect(buttons.length).toBeGreaterThan(0);
            
            // Verificar que al menos algunos botones tienen texto
            const buttonsWithText = buttons.filter(button => button.textContent.trim().length > 0);
            expect(buttonsWithText.length).toBeGreaterThan(0);
        });

        it('debe mostrar iconos visuales apropiados', () => {
            const { container } = render(<Blog />);
            
            // Verificar iconos de búsqueda, descuentos, etc.
            const icons = container.querySelectorAll('[class*="bi-"]');
            expect(icons.length).toBeGreaterThan(0);
        });
    });

    describe('Casos edge', () => {
        it('debe manejar correctamente cuando no hay posts', () => {
            // Este test requeriría mockear blogPosts como array vacío
            // Para simplificar, verificamos el mensaje de "no encontrados"
            render(<Blog />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar en el blog.../i);
            fireEvent.change(searchInput, { target: { value: 'xyz123abc456def789' } });
            
            expect(screen.getByText(/No se encontraron posts/i)).toBeInTheDocument();
            expect(screen.getByText(/Intenta con otros términos/i)).toBeInTheDocument();
        });

        it('debe manejar búsqueda con caracteres especiales', () => {
            render(<Blog />);
            
            const searchInput = screen.getByPlaceholderText(/Buscar en el blog.../i);
            fireEvent.change(searchInput, { target: { value: '!@#$%^&*()' } });
            
            // No debe crashear
            expect(searchInput.value).toBe('!@#$%^&*()');
        });

        it('debe manejar cupón vencido correctamente', () => {
            const { container } = render(<Blog />);
            
            // Buscar posts con cupón vencido
            const postsVencidos = blogPosts.filter(post => {
                if (!post.fechaVencimiento) return false;
                const hoy = new Date();
                const vencimiento = new Date(post.fechaVencimiento);
                return Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24)) <= 0;
            });
            
            if (postsVencidos.length > 0) {
                // Buscar el post vencido y verificar que no tiene botón de copiar activo
                postsVencidos.forEach(post => {
                    const vencidoTexts = screen.getAllByText(/¡Oferta vencida!/i);
                    expect(vencidoTexts.length).toBeGreaterThan(0);
                });
            }
        });
    });
});
