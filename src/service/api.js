import axios from 'axios';

// Configuración base para las APIs
const API_USUARIOS_BASE = '/api/usuarios';
const API_PRODUCTOS_BASE = '/api/v1/huertohogar'; // Ruta correcta de tu Spring Boot

// Instancia de Axios para Usuarios (puerto 8089)
export const usuariosApi = axios.create({
  baseURL: API_USUARIOS_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Instancia de Axios para Productos (puerto 8080)
export const productosApi = axios.create({
  baseURL: API_PRODUCTOS_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para manejar errores globalmente
const handleError = (error) => {
  if (error.response) {
    // El servidor respondió con un código de estado fuera del rango 2xx
    console.error('Error de respuesta:', error.response.data);
    console.error('Status:', error.response.status);
  } else if (error.request) {
    // La petición fue hecha pero no hubo respuesta
    console.error('Error de red - No hay respuesta del servidor');
  } else {
    // Algo pasó al configurar la petición
    console.error('Error:', error.message);
  }
  return Promise.reject(error);
};

// Aplicar interceptor a ambas instancias
usuariosApi.interceptors.response.use(
  response => response,
  handleError
);

productosApi.interceptors.response.use(
  response => response,
  handleError
);
