import React from 'react'
import './App.css';
import { Route, Routes } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css'
import ProductoPage from './pages/productosPage';
// import CarritoPage from './pages/CarritoPage';
// import AdminPage from './pages/AdminPage';
// import { useState } from 'react';
import PrincipalPage from './pages/principalPage';

function App() {
  return (
    <Routes>
      <Route path='/'
      element={<PrincipalPage/>}/>

      <Route path='/productos'
      element={<ProductoPage/>}/>




    </Routes>
  )
}

export default App