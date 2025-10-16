import React, { useState, useEffect } from 'react';
import { Modal, ListGroup } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import LoginUser from './ui/Loging';


export default function LoginModal({ show, handleClose, user, onUserChange }) {
    // currentUser: estado local para reflejar el login dentro del modal
    const [currentUser, setCurrentUser] = useState(user || null);
    const [showLogingModal, setShowLogingModal] = useState(false);

    // Si el prop `user` cambia desde el padre, sincronizamos
    useEffect(() => {
        setCurrentUser(user || null);
    }, [user]);

    const handleLogin = (foundUser, remember) => {
        setCurrentUser(foundUser);
        // notificar al padre si provee onUserChange
        if (typeof onUserChange === 'function') onUserChange(foundUser, remember);
        // cerrar el modal de login interno
        setShowLogingModal(false);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        if (typeof onUserChange === 'function') onUserChange(null);
    };

    const isLoggedIn = !!currentUser;
    const navigate = useNavigate();

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Mi Perfil</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                {/* Avatar o icono */}
                <div style={{ marginBottom: 16 }}>
                    <i className="bi bi-person-circle" style={{ fontSize: 60 }}></i>
                </div>
                {/* Nombre o estado */}
                <h4 className="mt-2">{isLoggedIn ? currentUser.name : "Invitado"}</h4>
                <p className="mb-4">{isLoggedIn ? currentUser.email : "No has iniciado sesión"}</p>

                <ListGroup>
                    {!isLoggedIn ? (
                        <>
                            <ListGroup.Item action onClick={() => setShowLogingModal(true)}>
                                <i className="bi bi-box-arrow-in-right me-2"></i> Iniciar Sesión
                            </ListGroup.Item>
                            <ListGroup.Item action>
                                <i className="bi bi-question-circle me-2"></i> Ayuda
                            </ListGroup.Item>
                            <ListGroup.Item action onClick={() => { handleClose && handleClose(); navigate('/registro'); }}>
                                <i className="bi bi-person-plus me-2"></i> Registrarse
                            </ListGroup.Item>
                        </>
                    ) : (
                        <>
                            <ListGroup.Item action onClick={() => console.log('Ir a Historial')}>
                                <i className="bi bi-clock-history me-2"></i> Historial
                            </ListGroup.Item>
                            <ListGroup.Item action onClick={() => console.log('Ir a Configuración')}>
                                <i className="bi bi-gear me-2"></i> Configuración
                            </ListGroup.Item>
                            <ListGroup.Item action onClick={() => console.log('Abrir Ayuda')}>
                                <i className="bi bi-question-circle me-2"></i> Ayuda
                            </ListGroup.Item>
                            <ListGroup.Item action onClick={handleLogout}>
                                <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                            </ListGroup.Item>
                        </>
                    )}
                </ListGroup>

                {/* Modal separado con el formulario de login (Loging.jsx) */}
                <LoginUser show={showLogingModal} handleClose={() => setShowLogingModal(false)} onLogin={handleLogin} />
            </Modal.Body>
        </Modal>
    );
}