import { usuariosApi } from './api';

/**
 * Servicio para gestionar operaciones con la API de Usuarios (puerto 8089)
 */

// Obtener todos los usuarios
export const obtenerUsuarios = async () => {
  try {
    const response = await usuariosApi.get('/usuarios');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener un usuario por ID
export const obtenerUsuarioPorId = async (id) => {
  try {
    const response = await usuariosApi.get(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Crear un nuevo usuario
export const crearUsuario = async (usuarioData) => {
  try {
    const response = await usuariosApi.post('/usuarios', usuarioData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Actualizar un usuario
export const actualizarUsuario = async (id, usuarioData) => {
  try {
    const response = await usuariosApi.put(`/usuarios/${id}`, usuarioData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Eliminar un usuario
export const eliminarUsuario = async (id) => {
  try {
    const response = await usuariosApi.delete(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login de usuario (ejemplo)
export const loginUsuario = async (credenciales) => {
  try {
    const response = await usuariosApi.post('/auth/login', credenciales);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Registrar usuario
export const registrarUsuario = async (datosRegistro) => {
  try {
    const response = await usuariosApi.post('/auth/registro', datosRegistro);
    return response.data;
  } catch (error) {
    throw error;
  }
};
