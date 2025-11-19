/**
 * Servicio para transformar los datos de la API Spring Boot
 * al formato esperado por el frontend React
 */

// Importar imágenes desde assets
import manzanasImg from '../assets/images/Productos/Manzanas-Fuji.png';
import naranjasImg from '../assets/images/Productos/Naranjas-valencia.png';
import platanosImg from '../assets/images/Productos/Platanos-cavendish.png';
import zanahoriasImg from '../assets/images/Productos/Zanahorias-organicas.png';
import espinacasImg from '../assets/images/Productos/Espinacas-frescas.png';
import pimientosImg from '../assets/images/Productos/Pimientos-tricolores.png';
import mielImg from '../assets/images/Productos/Miel-organica.png';
import quinoaImg from '../assets/images/Productos/Quinoa-organica.png';
import yogurtImg from '../assets/images/Productos/Yogurt-natural.png';
import lecheImg from '../assets/images/Productos/Leche-natural.png';

// Mapa de imágenes por nombre de producto (keywords)
const imagenesProductos = {
  'manzana': manzanasImg,
  'naranja': naranjasImg,
  'platano': platanosImg,
  'banana': platanosImg,
  'zanahoria': zanahoriasImg,
  'espinaca': espinacasImg,
  'pimiento': pimientosImg,
  'miel': mielImg,
  'quinoa': quinoaImg,
  'yogurt': yogurtImg,  
  'leche': lecheImg
};

// Imagen por defecto
const imagenDefault = manzanasImg; // Usar manzanas como default

/**
 * Busca la imagen adecuada basándose en el nombre del producto
 * @param {string} nombreProducto - Nombre del producto
 * @returns {string} Ruta de la imagen
 */
const obtenerImagenProducto = (nombreProducto) => {
  if (!nombreProducto) return imagenDefault;
  
  const nombreLower = nombreProducto.toLowerCase();
  
  // Buscar coincidencia en el mapa de imágenes
  for (const [keyword, imagen] of Object.entries(imagenesProductos)) {
    if (nombreLower.includes(keyword)) {
      return imagen;
    }
  }
  
  // Si no hay coincidencia, retornar imagen por defecto
  return imagenDefault;
};

/**
 * Transforma un producto desde el formato de la API al formato del frontend
 * @param {Object} productoAPI - Producto desde Spring Boot
 * @returns {Object} Producto en formato React
 */
export const transformarProductoDesdeAPI = (productoAPI) => {
  if (!productoAPI) return null;

  // Generar código único basado en el ID
  const codigo = `PROD${productoAPI.idProducto?.toString().padStart(3, '0')}`;
  
  // Obtener imagen basada en el nombre del producto
  const imagen = obtenerImagenProducto(productoAPI.nombreProducto);

  return {
    // Mapeo de campos de API → Frontend
    codigo: codigo,
    id: productoAPI.idProducto,
    nombre: productoAPI.nombreProducto,
    precio: productoAPI.precioProducto,
    unidad: productoAPI.unidadProducto,
    stock: productoAPI.stockProducto,
    descripcion: productoAPI.descripcionProducto,
    
    // Categoría - manejar objeto anidado
    categoria: productoAPI.idCategoria?.nombreCategoria || 'Sin categoría',
    categoriaId: productoAPI.idCategoria?.idCategoria,
    
    // Imagen - buscar en assets por nombre del producto
    imagen: imagen,
  };
};

/**
 * Transforma un array de productos desde la API
 * @param {Array} productosAPI - Array de productos desde Spring Boot
 * @returns {Array} Array de productos en formato React
 */
export const transformarProductosDesdeAPI = (productosAPI) => {
  if (!Array.isArray(productosAPI)) {
    console.error('Los datos recibidos no son un array:', productosAPI);
    return [];
  }

  return productosAPI.map(transformarProductoDesdeAPI).filter(p => p !== null);
};

/**
 * Transforma un producto desde el formato del frontend al formato de la API
 * @param {Object} productoFrontend - Producto desde React
 * @returns {Object} Producto en formato API
 */
export const transformarProductoParaAPI = (productoFrontend) => {
  return {
    idProducto: productoFrontend.id,
    nombreProducto: productoFrontend.nombre,
    precioProducto: productoFrontend.precio,
    unidadProducto: productoFrontend.unidad,
    stockProducto: productoFrontend.stock,
    descripcionProducto: productoFrontend.descripcion,
    idCategoria: productoFrontend.categoriaId ? {
      idCategoria: productoFrontend.categoriaId
    } : null
  };
};

/**
 * Log para debugging - muestra cómo se transformó el producto
 */
export const logTransformacion = (productoAPI) => {
  console.group('🔄 Transformación de Producto');
  console.log('Desde API:', productoAPI);
  console.log('A Frontend:', transformarProductoDesdeAPI(productoAPI));
  console.groupEnd();
};
