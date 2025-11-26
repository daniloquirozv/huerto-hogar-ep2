import axios from 'axios';

// Configuración base para las APIs usando variables de entorno
// En desarrollo usa el proxy de Vite (/api/...)
// En producción usa las URLs directas de EC2
const API_USUARIOS_BASE = import.meta.env.VITE_API_USUARIOS_URL || '/api/usuarios';
const API_PRODUCTOS_BASE = import.meta.env.VITE_API_PRODUCTOS_URL || '/api/v1/huertohogar';

console.log('🔧 Configuración de API:');
console.log('  - Productos:', API_PRODUCTOS_BASE);
console.log('  - Usuarios:', API_USUARIOS_BASE);
console.log('  - Modo:', import.meta.env.MODE);

// Instancia de Axios para Usuarios (puerto 8089)
export const usuariosApi = axios.create({
  baseURL: API_USUARIOS_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar token a las peticiones
usuariosApi.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('huertoHogarUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error('Error al parsear usuario de localStorage:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Instancia de Axios para Productos (puerto 8080)
export const productosApi = axios.create({
  baseURL: API_PRODUCTOS_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar token a las peticiones de productos
productosApi.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('huertoHogarUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error('Error al parsear usuario de localStorage:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
