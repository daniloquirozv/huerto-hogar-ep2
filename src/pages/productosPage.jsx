import React, { useState, useEffect } from 'react'
import Header from '../components/layout/header'
import Footer from '../components/layout/footer'
import BuscadorProductos from '../components/BuscadorProductos'
import CardsComponent from '../components/CardsComponent'
import { obtenerProductos } from '../service/productosService'
import { Spinner, Alert } from 'react-bootstrap'

function productosPage({ onAddToCart, cartItems, onUpdateQuantity, onRemoveItem, currentUser, onUserLogin, onUserLogout }) {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar productos desde la API al montar el componente
    useEffect(() => {
        cargarProductosDesdeAPI();
    }, []);

    const cargarProductosDesdeAPI = async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('Iniciando carga de productos desde API...');
            const data = await obtenerProductos();
            console.log('Productos recibidos:', data);
            
            if (!data || data.length === 0) {
                console.warn('La API no retornó productos');
                setError('No hay productos disponibles en la base de datos.');
                // Usar productos locales como fallback
                import('../data/productos').then(module => {
                    setProductos(module.productos);
                });
            } else {
                setProductos(data);
                console.log(`${data.length} productos cargados exitosamente`);
            }
        } catch (err) {
            console.error('Error al cargar productos:', err);
            console.error('Detalles del error:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            
            setError(`Error al cargar productos: ${err.message}`);
            
            // Intentar usar productos locales como fallback
            import('../data/productos').then(module => {
                setProductos(module.productos);
                console.log('Usando productos locales como respaldo');
            }).catch(fallbackErr => {
                console.error('Error al cargar productos locales:', fallbackErr);
            });
        } finally {
            setLoading(false);
        }
    };

    // Manejar actualización de producto después de agregar al carrito
    const handleAddToCart = async (producto, quantity) => {
        try {
            // Primero agregar al carrito local
            onAddToCart(producto, quantity);
            
            // Recargar productos para reflejar cambios de stock
            await cargarProductosDesdeAPI();
        } catch (err) {
            console.error('Error al actualizar producto:', err);
        }
    };

    if (loading) {
        return (
            <>
                <Header 
                    cartItems={cartItems}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemoveItem={onRemoveItem}
                    currentUser={currentUser}
                    onUserLogin={onUserLogin}
                    onUserLogout={onUserLogout}
                />
                <div className="container text-center my-5">
                    <Spinner animation="border" role="status" style={{ color: '#2E8B57' }}>
                        <span className="visually-hidden">Cargando productos...</span>
                    </Spinner>
                    <p className="mt-3">Cargando productos desde la base de datos...</p>
                </div>
                <Footer/>
            </>
        );
    }

    return (
        <>
            <Header 
                cartItems={cartItems}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
                currentUser={currentUser}
                onUserLogin={onUserLogin}
                onUserLogout={onUserLogout}
            />
            
            {error && (
                <div className="container mt-3">
                    <Alert variant="warning" dismissible onClose={() => setError(null)}>
                        <Alert.Heading>Advertencia</Alert.Heading>
                        <p>{error}</p>
                        <p className="mb-0">Se están mostrando productos de respaldo.</p>
                    </Alert>
                </div>
            )}
            
            <BuscadorProductos 
                onAddToCart={handleAddToCart} 
                productos={productos}
                onRecargar={cargarProductosDesdeAPI}
            />
            <CardsComponent 
                onAddToCart={handleAddToCart}
                productos={productos}
            />
            <Footer/>
        </>
    )
}

export default productosPage