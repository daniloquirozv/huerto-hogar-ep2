import { productosApi } from './api';
import { transformarProductosDesdeAPI, transformarProductoDesdeAPI, transformarProductoParaAPI } from './transformadorProductos';

/**
 * Servicio para gestionar operaciones con la API de Productos (puerto 8080)
 */

// Obtener todos los productos
export const obtenerProductos = async () => {
  try {
    console.log('🔍 Llamando a la API de productos...');
    const response = await productosApi.get('/productos');
    
    console.log('📦 Datos crudos de la API:', response.data);
    
    // Transformar los datos al formato esperado por React
    const productosTransformados = transformarProductosDesdeAPI(response.data);
    
    console.log('✅ Productos transformados:', productosTransformados);
    console.log(`📊 Total de productos: ${productosTransformados.length}`);
    
    return productosTransformados;
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No hubo respuesta del servidor');
    }
    throw error;
  }
};

// Obtener un producto por ID
export const obtenerProductoPorId = async (id) => {
  try {
    const response = await productosApi.get(`/productos/${id}`);
    return transformarProductoDesdeAPI(response.data);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    throw error;
  }
};

// Buscar productos por categoría
export const obtenerProductosPorCategoria = async (categoria) => {
  try {
    const response = await productosApi.get(`/productos/categoria/${categoria}`);
    return transformarProductosDesdeAPI(response.data);
  } catch (error) {
    throw error;
  }
};

// Buscar productos por nombre
export const buscarProductos = async (termino) => {
  try {
    const response = await productosApi.get(`/productos/buscar?q=${termino}`);
    return transformarProductosDesdeAPI(response.data);
  } catch (error) {
    throw error;
  }
};

// Crear un nuevo producto
export const crearProducto = async (productoData) => {
  try {
    const datosAPI = transformarProductoParaAPI(productoData);
    const response = await productosApi.post('/productos', datosAPI);
    return transformarProductoDesdeAPI(response.data);
  } catch (error) {
    throw error;
  }
};

// Actualizar un producto
export const actualizarProducto = async (id, productoData) => {
  try {
    const datosAPI = transformarProductoParaAPI(productoData);
    const response = await productosApi.put(`/productos/${id}`, datosAPI);
    return transformarProductoDesdeAPI(response.data);
  } catch (error) {
    throw error;
  }
};

// Eliminar un producto
export const eliminarProducto = async (id) => {
  try {
    const response = await productosApi.delete(`/productos/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Actualizar stock de producto
export const actualizarStock = async (id, cantidad) => {
  try {
    const response = await productosApi.patch(`/productos/${id}/stock`, { cantidad });
    return response.data;
  } catch (error) {
    throw error;
  }
};
