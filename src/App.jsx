import React from 'react'
import './App.css';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import ProductoPage from './pages/productosPage';
import { useState, useEffect } from 'react';
import PrincipalPage from './pages/principalPage';
import Blog from './pages/blogPage';
import CarritoPage from './pages/CarritoPage'; 
import AdminPage from './pages/AdminPage';
import RegistroPage from './pages/RegistroPage';
import ScrollToTop from './components/ui/scrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import { obtenerProductos } from './service/productosService';
import { getCartForUser, saveCartForUser, clearCartForUser, migrateGuestCartToUser } from './utils/cartUtils';

function App() {
  // Implementación del estado global y lógica de la aplicación
  // Estado global del usuario - inicializado desde localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('huertoHogarUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error al cargar el usuario desde localStorage:', error);
      return null;
    }
  });

  // Estado global del carrito - inicializado según el usuario actual
  const [cartItems, setCartItems] = useState(() => {
    return getCartForUser(currentUser);
  });

  const [productosAPI, setProductosAPI] = useState([]);

  // Guardar el carrito del usuario actual en localStorage cada vez que cambie
  useEffect(() => {
    saveCartForUser(currentUser, cartItems);
  }, [cartItems, currentUser]);

  // Agregar producto al carrito
  const handleAddToCart = (producto, quantity) => {
    const existingItemIndex = cartItems.findIndex(item => item.codigo === producto.codigo);
    
    if (existingItemIndex !== -1) {
      // Si el producto ya existe, actualizar cantidad
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += quantity;
      setCartItems(updatedCart);
    } else {
      // Si es nuevo, agregarlo con la cantidad
      setCartItems([...cartItems, { ...producto, quantity }]);
    }
  };

  // Cargar productos de la API al iniciar
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const productos = await obtenerProductos();
        setProductosAPI(productos);
        console.log('Productos cargados desde API:', productos);
      } catch (error) {
        console.error('Error al cargar productos desde API:', error);
      }
    };
    cargarProductos();
  }, []);

  // Sincronizar carrito con productos de la API para tener datos actualizados
  useEffect(() => {
    if (productosAPI.length > 0 && cartItems.length > 0) {
      const cartItemsActualizados = cartItems.map(item => {
        const productoAPI = productosAPI.find(p => p.codigo === item.codigo || p.id === item.codigo);
        if (productoAPI) {
          // Actualizar datos del producto pero mantener la cantidad del carrito
          return {
            ...productoAPI,
            codigo: productoAPI.codigo || productoAPI.id,
            quantity: item.quantity
          };
        }
        return item;
      });

      // Agregar producto al carrito
  const handleAddToCart = (producto, quantity) => {    
    // Buscar el producto en la API para tener datos actualizados
    const productoActualizado = productosAPI.find(p => 
      p.codigo === producto.codigo || p.id === producto.codigo
    ) || producto;
    
    const codigoProducto = productoActualizado.codigo || productoActualizado.id;
    const existingItemIndex = cartItems.findIndex(item => item.codigo === codigoProducto);

    if (existingItemIndex !== -1) {
      // Si el producto ya existe, actualizar cantidad
      const updatedCart = [...cartItems];      
      updatedCart[existingItemIndex] = {
        ...productoActualizado,
        codigo: codigoProducto,
        quantity: updatedCart[existingItemIndex].quantity + quantity
      };
      setCartItems(updatedCart);
    } else {
      // Si es nuevo, agregarlo con la cantidad      
      setCartItems([...cartItems, { 
        ...productoActualizado, 
        codigo: codigoProducto,
        quantity 
      }]);
    }
  };
      
      // Solo actualizar si hay cambios
      const hayDiferencias = JSON.stringify(cartItems) !== JSON.stringify(cartItemsActualizados);
      if (hayDiferencias) {
        console.log('Sincronizando carrito con productos de API');
        setCartItems(cartItemsActualizados);
      }
    }
  }, [productosAPI]);

  // Actualizar cantidad de un producto
  const handleUpdateQuantity = (codigo, newQuantity) => {
    const updatedCart = cartItems.map(item =>
      item.codigo === codigo ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
  };

  // Eliminar producto del carrito
  const handleRemoveItem = (codigo) => {
    setCartItems(cartItems.filter(item => item.codigo !== codigo));
  };

  // Vaciar carrito del usuario actual
  const handleClearCart = () => {
    setCartItems([]);
    clearCartForUser(currentUser);
  };

  // Manejar login de usuario
  const handleUserLogin = (user, remember) => {
    console.log('👤 Usuario iniciando sesión:', user?.email || user?.id);
    
    // Actualizar usuario actual
    setCurrentUser(user);
    
    if (remember) {
      localStorage.setItem('huertoHogarUser', JSON.stringify(user));
    }

    // Migrar carrito de invitado a usuario y cargar carrito del usuario
    const userCart = migrateGuestCartToUser(user);
    setCartItems(userCart);
    
    console.log(`🛒 Carrito cargado: ${userCart.length} items`);
  };

  // Manejar logout de usuario
  const handleUserLogout = () => {
    console.log('👋 Usuario cerrando sesión');
    
    // Guardar carrito actual antes de cerrar sesión
    saveCartForUser(currentUser, cartItems);
    
    // Limpiar usuario
    setCurrentUser(null);
    localStorage.removeItem('huertoHogarUser');
    
    // Cargar carrito de invitado (vacío o con items previos)
    const guestCart = getCartForUser(null);
    setCartItems(guestCart);
    
    console.log('🛒 Cambiado a carrito de invitado');
  };

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path='/'
        element={<PrincipalPage
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          currentUser={currentUser}
          onUserLogin={handleUserLogin}
          onUserLogout={handleUserLogout}
        />}/>

        <Route path='/productos'
        element={<ProductoPage
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          currentUser={currentUser}
          onUserLogin={handleUserLogin}
          onUserLogout={handleUserLogout}
        />}/>

        <Route path='/blog'
        element={<Blog
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          currentUser={currentUser}
          onUserLogin={handleUserLogin}
          onUserLogout={handleUserLogout}
        />}/>

        <Route path='/carrito'
        element={<CarritoPage
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          currentUser={currentUser}
          onUserLogin={handleUserLogin}
          onUserLogout={handleUserLogout}
        />}/>

        <Route path='/admin'
        element={
          <ProtectedRoute requireAdmin={true} redirectTo="/">
            <AdminPage/>
          </ProtectedRoute>
        }/>

        <Route path='/registro'
        element={<RegistroPage/>}/>

      </Routes>
    </>
  )
}

export default App