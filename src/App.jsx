import React from 'react'
import './App.css';
import { Route, Routes } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css'
import ProductoPage from './pages/productosPage';
// import CarritoPage from './pages/CarritoPage';
// import AdminPage from './pages/AdminPage';
// import { useState } from 'react';
import PrincipalPage from './pages/principalPage';
import Blog from './pages/blogPage';
import CarritoPage from './pages/CarritoPage'; 

function App() {
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




    </Routes>
  )
}

export default App