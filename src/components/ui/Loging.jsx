import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/style/users/Login-styles.css';
import { Modal } from 'react-bootstrap';
import { loginUsuario } from '../../service/ApiUsuario';
/**
 * LoginUser
 * Props:
 *  - show: boolean -> mostrar modal
 *  - handleClose: fn -> cerrar modal
 *  - onLogin: fn(user, remember) -> callback cuando login es exitoso
 */
function LoginUser({ show, handleClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const emailRef = useRef(null);

  useEffect(() => {
    if (show) {
      setError('');
      // focus al abrir
      setTimeout(() => emailRef.current && emailRef.current.focus(), 50);
    } else {
      // limpiar campos al cerrar
      setEmail('');
      setPassword('');
      setRemember(false);
      setError('');
    }
  }, [show]);

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setError('');

    if(!email){
      setError('Ingresa un correo valido');
      return;
    }
    if (!password){
      setError('Ingresa tu contraseña');
      return;
    }
    try{
      //llama al backend para actualizar
      const usuario = await loginUsuario(email,password);
      
      // Guardar en localStorage si el checkbox está marcado
      if (remember) {
        localStorage.setItem('huertoHogarUser', JSON.stringify(usuario));
      }
      
      // login exitoso: pasa el usuario al callback y cierra el modal
      if(onLogin) onLogin(usuario,remember);
      handleClose && handleClose();
    } catch(error){
      console.error('Error al hacer login',error);
      
      // maneja diferentes tipos de errores
      if(error.response?.data?.message) {
        setError(error.response.data.message);
      }else if (error.response?.status ===404){
        setError('Usuario no encontrado');
      }else if (error.response?.status===401){
        setError('Credenciales invalidas o usuario inactivo');
      } else{
        setError('Error al conectar con el servidor')
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} style={{ color: 'black', textAlign: 'center' }}>
      <Modal.Header closeButton className="close-btn">
        <Modal.Title className="Login">Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label className="email">Correo</label>
          <input
            ref={emailRef}
            className="login-input"
            type="email"
            name="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="password">Contraseña</label>
          <input
            className="login-input"
            type="password"
            name="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="remember-container">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label htmlFor="remember">Recuérdame</label>
          </div>

          <p className="sin-cuenta">si no tienes cuenta <Link to="/registro">regístrate aquí</Link></p>

          {error && <div className="login-error" role="alert">{error}</div>}

          <button className="login-button" type="submit">Login</button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginUser;
