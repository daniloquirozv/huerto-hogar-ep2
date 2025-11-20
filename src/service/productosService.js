import { productosApi } from './api';
import { transformarProductosDesdeAPI, transformarProductoDesdeAPI, transformarProductoParaAPI } from './transformadorProductos';

/**
 * Servicio para gestionar operaciones con la API de Productos (puerto 8080)
 */

// Obtener todos los productos
export const obtenerProductos = async () => {
  try {
    console.log('Llamando a la API de productos...');
    const response = await productosApi.get('/productos');
    
    console.log('Datos crudos de la API:', response.data);
    
    // Transformar los datos al formato esperado por React
    const productosTransformados = transformarProductosDesdeAPI(response.data);
    
    console.log('Productos transformados:', productosTransformados);
    console.log(`Total de productos: ${productosTransformados.length}`);
    
    return productosTransformados;
  } catch (error) {
    console.error('Error al obtener productos:', error);
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
    const response = await productosApi.put(`/productos/${id}/actualizar`, datosAPI);
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

// Procesar compra - Actualizar stock de múltiples productos
export const procesarCompra = async (productosCompra) => {
  try {
    console.log('🛒 Procesando compra de productos:', productosCompra);
    
    const promesasActualizacion = productosCompra.map(async (item) => {
      try {
        // Validar que el ID existe
        if (!item.id) {
          throw new Error(`ID no válido para el producto ${item.nombre || item.codigo}`);
        }
        
        console.log(`📦 Procesando producto ID: ${item.id}, Nombre: ${item.nombre}`);
        
        // Obtener el producto actual para verificar stock
        const productoActual = await obtenerProductoPorId(item.id);
        
        console.log(`📊 Stock actual: ${productoActual.stock}, Cantidad solicitada: ${item.quantity}`);
        console.log('Producto completo:', productoActual);
        
        // Verificar que haya suficiente stock
        if (productoActual.stock < item.quantity) {
          throw new Error(`Stock insuficiente para ${productoActual.nombre}. Disponible: ${productoActual.stock}, Solicitado: ${item.quantity}`);
        }
        
        // Calcular nuevo stock
        const nuevoStock = productoActual.stock - item.quantity;
        
        console.log(`🔄 Actualizando stock de ${productoActual.nombre} de ${productoActual.stock} a ${nuevoStock}`);
        
        // Preparar datos para actualización con TODOS los campos requeridos
        const productoActualizado = {
          ...productoActual,
          stock: nuevoStock
        };
        
        // Transformar al formato de la API
        const datosAPI = transformarProductoParaAPI(productoActualizado);
        
        console.log('Datos a enviar al backend:', datosAPI);
        console.log(`URL del PUT: ${productosApi.defaults.baseURL}/productos/${item.id}/actualizar`);
        console.log('Método HTTP: PUT');
        
        // Actualizar el producto usando PUT con el endpoint correcto
        const response = await productosApi.put(`/productos/${item.id}/actualizar`, datosAPI);
        const productoRespuesta = transformarProductoDesdeAPI(response.data);
        
        console.log(`✅ Stock actualizado para ${productoActual.nombre}: ${productoActual.stock} → ${nuevoStock}`);
        
        return {
          success: true,
          producto: productoRespuesta,
          cantidadComprada: item.quantity,
          stockAnterior: productoActual.stock,
          stockNuevo: nuevoStock
        };
      } catch (error) {
        console.error(`❌ Error al actualizar ${item.nombre || item.codigo}:`, error);
        console.error('Detalles del error:', error.response?.data || error.message);
        console.error('Status del error:', error.response?.status);
        
        // Extraer mensaje de error legible
        let mensajeError = 'Error desconocido';
        if (error.response?.data) {
          // Si el backend devuelve un string directamente
          if (typeof error.response.data === 'string') {
            mensajeError = error.response.data;
          } 
          // Si el backend devuelve un objeto con mensaje
          else if (error.response.data.message) {
            mensajeError = error.response.data.message;
          }
          // Si hay otros campos de error
          else if (error.response.data.error) {
            mensajeError = error.response.data.error;
          }
          // Convertir objeto a JSON legible
          else {
            mensajeError = JSON.stringify(error.response.data);
          }
        } else if (error.message) {
          mensajeError = error.message;
        }
        
        return {
          success: false,
          producto: item,
          error: mensajeError
        };
      }
    });
    
    // Esperar todas las actualizaciones
    const resultados = await Promise.all(promesasActualizacion);
    
    // Verificar si todas fueron exitosas
    const fallidas = resultados.filter(r => !r.success);
    
    if (fallidas.length > 0) {
      console.error('❌ Algunas actualizaciones fallaron:', fallidas);
      return {
        success: false,
        resultados,
        mensaje: `${fallidas.length} producto(s) no pudieron actualizarse`
      };
    }
    
    console.log('✅ Compra procesada exitosamente');
    return {
      success: true,
      resultados,
      mensaje: 'Compra procesada exitosamente'
    };
    
  } catch (error) {
    console.error('❌ Error al procesar compra:', error);
    throw error;
  }
};
