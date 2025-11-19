import React, { useState } from 'react';
import { loginUsuario, registrarUsuario, obtenerUsuarios } from '../services/usuariosService';

/**
 * Ejemplo de componente que consume la API de Usuarios
 */
function EjemploUsuarios() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  // Ejemplo 1: Login de usuario
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');
    
    try {
      const credenciales = { email, password };
      const response = await loginUsuario(credenciales);
      
      setMensaje('Login exitoso!');
      console.log('Usuario autenticado:', response);
      
      // Aquí podrías guardar el token en localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('usuario', JSON.stringify(response.usuario));
      }
    } catch (err) {
      setMensaje('Error al iniciar sesión: ' + (err.response?.data?.message || err.message));
      console.error('Error de login:', err);
    } finally {
      setLoading(false);
    }
  };

  // Ejemplo 2: Registrar nuevo usuario
  const handleRegistro = async (datosUsuario) => {
    setLoading(true);
    try {
      const nuevoUsuario = await registrarUsuario(datosUsuario);
      setMensaje('Usuario registrado exitosamente!');
      console.log('Usuario creado:', nuevoUsuario);
      return nuevoUsuario;
    } catch (err) {
      setMensaje('Error al registrar: ' + (err.response?.data?.message || err.message));
      console.error('Error de registro:', err);
    } finally {
      setLoading(false);
    }
  };

  // Ejemplo 3: Listar todos los usuarios (para admin)
  const listarUsuarios = async () => {
    setLoading(true);
    try {
      const usuarios = await obtenerUsuarios();
      console.log('Lista de usuarios:', usuarios);
      return usuarios;
    } catch (err) {
      setMensaje('Error al obtener usuarios: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login - API Usuarios (Puerto 8089)</h2>
      
      <form onSubmit={handleLogin} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </form>

      {mensaje && (
        <div className={`alert ${mensaje.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
          {mensaje}
        </div>
      )}
    </div>
  );
}

export default EjemploUsuarios;
