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

function App() {
  // Estado global del carrito - inicializado desde localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('huertoHogarCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error al cargar el carrito desde localStorage:', error);
      return [];
    }
  });

  // Guardar el carrito en localStorage cada vez que cambie
  useEffect(() => {
    try {
      localStorage.setItem('huertoHogarCart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error al guardar el carrito en localStorage:', error);
    }
  }, [cartItems]);

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

  // Vaciar carrito
  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem('huertoHogarCart');
  };
  return (
    <Routes>
      <Route path='/'
      element={<PrincipalPage
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />}/>

      <Route path='/productos'
      element={<ProductoPage
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />}/>

      <Route path='/blog'
      element={<Blog
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />}/>

      <Route path='/carrito'
      element={<CarritoPage
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />}/>

      <Route path='/admin'
      element={<AdminPage/>}/>

      <Route path='/registro'
      element={<RegistroPage/>}/>

    </Routes>
  )
}

export default App