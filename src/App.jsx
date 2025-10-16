import React from 'react'
import './App.css';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import ProductoPage from './pages/productosPage';
import { useState } from 'react';
import PrincipalPage from './pages/principalPage';
import Blog from './pages/blogPage';
import CarritoPage from './pages/CarritoPage'; 
import AdminPage from './pages/AdminPage';

function App() {
  // Estado global del carrito
  const [cartItems, setCartItems] = useState([]);

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
  };
  return (
    <Routes>
      <Route path='/'
      element={<PrincipalPage/>}/>

      <Route path='/productos'
      element={<ProductoPage/>}/>

      <Route path='/blog'
      element={<Blog/>}/>

      <Route path='/carrito'
      element={<CarritoPage/>}/>

      <Route path='/admin'
      element={<AdminPage/>}/>

    </Routes>
  )
}

export default App