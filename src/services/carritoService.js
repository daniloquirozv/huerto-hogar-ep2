import { actualizarStock, actualizarProducto } from './productosService';

/**
 * Servicio para sincronizar el carrito con la base de datos
 */

/**
 * Actualiza el stock de un producto después de agregarlo al carrito
 * @param {string} productoCodigo - Código del producto
 * @param {number} cantidadComprada - Cantidad agregada al carrito
 * @param {number} stockActual - Stock actual del producto
 * @returns {Promise<Object>} Producto actualizado
 */
export const actualizarStockDespuesDeCompra = async (productoCodigo, cantidadComprada, stockActual) => {
  try {
    const nuevoStock = stockActual - cantidadComprada;
    
    if (nuevoStock < 0) {
      throw new Error('Stock insuficiente');
    }

    const response = await actualizarStock(productoCodigo, nuevoStock);
    return response;
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    throw error;
  }
};

/**
 * Restaura el stock cuando se elimina un producto del carrito
 * @param {string} productoCodigo - Código del producto
 * @param {number} cantidadARestaurar - Cantidad a restaurar
 * @param {number} stockActual - Stock actual del producto
 * @returns {Promise<Object>} Producto actualizado
 */
export const restaurarStockDespuesDeEliminar = async (productoCodigo, cantidadARestaurar, stockActual) => {
  try {
    const nuevoStock = stockActual + cantidadARestaurar;
    const response = await actualizarStock(productoCodigo, nuevoStock);
    return response;
  } catch (error) {
    console.error('Error al restaurar stock:', error);
    throw error;
  }
};

/**
 * Sincroniza múltiples productos del carrito con la base de datos
 * @param {Array} carritoItems - Items del carrito
 * @returns {Promise<Array>} Resultados de la sincronización
 */
export const sincronizarCarritoConBD = async (carritoItems) => {
  try {
    const promesas = carritoItems.map(item => 
      actualizarStockDespuesDeCompra(item.codigo, item.quantity, item.stock)
    );
    
    const resultados = await Promise.allSettled(promesas);
    return resultados;
  } catch (error) {
    console.error('Error al sincronizar carrito:', error);
    throw error;
  }
};

/**
 * Valida si hay suficiente stock antes de agregar al carrito
 * @param {Object} producto - Producto a validar
 * @param {number} cantidadDeseada - Cantidad que se desea agregar
 * @returns {Object} Resultado de la validación
 */
export const validarStockDisponible = (producto, cantidadDeseada) => {
  if (!producto) {
    return {
      valido: false,
      mensaje: 'Producto no encontrado'
    };
  }

  if (cantidadDeseada <= 0) {
    return {
      valido: false,
      mensaje: 'La cantidad debe ser mayor a 0'
    };
  }

  if (cantidadDeseada > producto.stock) {
    return {
      valido: false,
      mensaje: `Stock insuficiente. Solo hay ${producto.stock} ${producto.unidad} disponibles`
    };
  }

  return {
    valido: true,
    mensaje: 'Stock disponible'
  };
};
