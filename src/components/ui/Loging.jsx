import React, { useState, useRef, useEffect } from 'react';
import '../../assets/style/users/Login-styles.css';
import { Modal } from 'react-bootstrap';
import users from '../../data/user';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Ingresa un correo válido');
      return;
    }
    if (!password) {
      setError('Ingresa tu contraseña');
      return;
    }

    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) {
      setError('Credenciales inválidas. Verifica tu correo y contraseña');
      return;
    }

    // Login exitoso: pasar el user al callback y cerrar modal
    if (onLogin) onLogin(found, remember);
    handleClose && handleClose();
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

          <p className="sin-cuenta">si no tienes cuenta <a href="/registro">regístrate aquí</a></p>

          {error && <div className="login-error" role="alert">{error}</div>}

          <button className="login-button" type="submit">Login</button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginUser;
