import React, { useState, useEffect } from 'react';
import { obtenerProductos, obtenerProductoPorId, buscarProductos } from '../services/productosService';

/**
 * Ejemplo de componente que consume la API de Productos
 */
function EjemploProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ejemplo 1: Cargar todos los productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerProductos();
      setProductos(data);
    } catch (err) {
      setError('Error al cargar productos: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Ejemplo 2: Buscar un producto específico
  const buscarProducto = async (id) => {
    try {
      const producto = await obtenerProductoPorId(id);
      console.log('Producto encontrado:', producto);
      return producto;
    } catch (err) {
      console.error('Error al buscar producto:', err);
    }
  };

  // Ejemplo 3: Buscar productos por término
  const handleBuscar = async (termino) => {
    setLoading(true);
    try {
      const resultados = await buscarProductos(termino);
      setProductos(resultados);
    } catch (err) {
      setError('Error en la búsqueda: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container">
      <h2>Productos desde API Spring Boot (Puerto 8080)</h2>
      <button onClick={cargarProductos} className="btn btn-primary mb-3">
        Recargar Productos
      </button>
      
      <div className="row">
        {productos.map(producto => (
          <div key={producto.id} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text">${producto.precio}</p>
                <p className="card-text">Stock: {producto.stock}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EjemploProductos;
