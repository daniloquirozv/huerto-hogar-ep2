import React, { useState, useEffect } from 'react';
import { Modal, ListGroup, Badge } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import LoginUser from './ui/Loging';
import { isAdmin, hasValidSession } from '../utils/authUtils';



export default function LoginModal({ show, handleClose, user, onUserChange, onUserLogout }) {
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
        // Limpiar localStorage
        localStorage.removeItem('huertoHogarUser');
        if (typeof onUserChange === 'function') onUserChange(null);
        if (typeof onUserLogout === 'function') onUserLogout();
    };

    const isLoggedIn = !!currentUser;
    const navigate = useNavigate();

    // Determinar estilo según rol
    const esAdministrador = isLoggedIn && isAdmin(currentUser);
    const headerStyle = esAdministrador 
        ? { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }
        : { background: 'linear-gradient(135deg, #2E8B57 0%, #3CB371 100%)', color: 'white' };

    return (
        <Modal show={show} onHide={handleClose} centered size="md">
            <Modal.Header closeButton style={headerStyle}>
                <Modal.Title>
                    <i className={`bi ${esAdministrador ? 'bi-shield-check' : 'bi-person-circle'} me-2`}></i>
                    {esAdministrador ? 'Panel de Administrador' : 'Mi Perfil'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center" style={{ padding: '2rem' }}>
                {/* Avatar o icono con círculo de color */}
                <div style={{ 
                    marginBottom: 20,
                    position: 'relative',
                    display: 'inline-block'
                }}>
                    <div style={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: esAdministrador 
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : 'linear-gradient(135deg, #2E8B57 0%, #3CB371 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}>
                        <i className={`bi ${esAdministrador ? 'bi-shield-fill' : 'bi-person-fill'}`} 
                           style={{ fontSize: 50, color: 'white' }}></i>
                    </div>
                    {esAdministrador && (
                        <Badge 
                            bg="warning" 
                            text="dark"
                            style={{ 
                                position: 'absolute',
                                bottom: 0,
                                right: '50%',
                                transform: 'translateX(50%)',
                                fontSize: '0.75rem',
                                padding: '0.35rem 0.65rem',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                            }}
                        >
                            <i className="bi bi-star-fill me-1"></i>
                            ADMIN
                        </Badge>
                    )}
                </div>

                {/* Nombre o estado */}
                <h4 className="mt-3 mb-1" style={{ 
                    fontWeight: '600',
                    color: esAdministrador ? '#667eea' : '#2E8B57'
                }}>
                    {isLoggedIn ? (currentUser.name || currentUser.nombre) : "Invitado"}
                </h4>
                <p className="mb-1" style={{ 
                    color: '#6c757d',
                    fontSize: '0.9rem'
                }}>
                    {isLoggedIn ? (currentUser.email || currentUser.correo) : "No has iniciado sesión"}
                </p>
                {isLoggedIn && (
                    <Badge 
                        bg={esAdministrador ? "primary" : "success"} 
                        style={{ 
                            fontSize: '0.75rem',
                            padding: '0.35rem 0.75rem',
                            marginBottom: '1.5rem'
                        }}
                    >
                        {esAdministrador ? (
                            <>
                                <i className="bi bi-shield-check me-1"></i>
                                Administrador
                            </>
                        ) : (
                            <>
                                <i className="bi bi-person-check me-1"></i>
                                Cliente
                            </>
                        )}
                    </Badge>
                )}
                {!isLoggedIn && (
                    <p style={{ 
                        color: '#6c757d',
                        fontSize: '0.85rem',
                        marginBottom: '1.5rem'
                    }}>
                        Inicia sesión para acceder a todas las funciones
                    </p>
                )}

                <ListGroup variant="flush" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                    {!isLoggedIn ? (
                        <>
                            <ListGroup.Item 
                                action 
                                onClick={() => setShowLogingModal(true)}
                                style={{ 
                                    padding: '1rem 1.25rem',
                                    border: 'none',
                                    borderBottom: '1px solid #f0f0f0',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                                    e.currentTarget.style.paddingLeft = '1.5rem';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.paddingLeft = '1.25rem';
                                }}
                            >
                                <i className="bi bi-box-arrow-in-right me-3" style={{ color: '#2E8B57', fontSize: '1.2rem' }}></i>
                                <strong>Iniciar Sesión</strong>
                            </ListGroup.Item>
                            <ListGroup.Item 
                                action 
                                onClick={() => { handleClose && handleClose(); navigate('/registro'); }}
                                style={{ 
                                    padding: '1rem 1.25rem',
                                    border: 'none',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                                    e.currentTarget.style.paddingLeft = '1.5rem';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.paddingLeft = '1.25rem';
                                }}
                            >
                                <i className="bi bi-person-plus me-3" style={{ color: '#3CB371', fontSize: '1.2rem' }}></i>
                                <strong>Registrarse</strong>
                            </ListGroup.Item>
                        </>
                    ) : (
                        <>
                            {/* Panel Administrador - Destacado para admins */}
                            {isAdmin(currentUser) && hasValidSession() && (
                                <ListGroup.Item 
                                    action 
                                    onClick={() => { handleClose && handleClose(); navigate('/admin'); }}
                                    style={{ 
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        padding: '1.25rem',
                                        border: 'none',
                                        borderBottom: '1px solid rgba(255,255,255,0.2)',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                                    }}
                                >
                                    <i className="bi bi-shield-fill-check me-3" style={{ fontSize: '1.3rem' }}></i>
                                    Panel de Administración
                                    <i className="bi bi-arrow-right-circle-fill float-end" style={{ fontSize: '1.2rem' }}></i>
                                </ListGroup.Item>
                            )}

                            <ListGroup.Item 
                                action 
                                onClick={() => console.log('Ir a Historial')}
                                style={{ 
                                    padding: '1rem 1.25rem',
                                    border: 'none',
                                    borderBottom: '1px solid #f0f0f0',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                                    e.currentTarget.style.paddingLeft = '1.5rem';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.paddingLeft = '1.25rem';
                                }}
                            >
                                <i className="bi bi-clock-history me-3" style={{ color: '#6c757d', fontSize: '1.1rem' }}></i>
                                Historial de Compras
                            </ListGroup.Item>

                            <ListGroup.Item 
                                action 
                                onClick={() => console.log('Ir a Configuración')}
                                style={{ 
                                    padding: '1rem 1.25rem',
                                    border: 'none',
                                    borderBottom: '1px solid #f0f0f0',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                                    e.currentTarget.style.paddingLeft = '1.5rem';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.paddingLeft = '1.25rem';
                                }}
                            >
                                <i className="bi bi-gear me-3" style={{ color: '#6c757d', fontSize: '1.1rem' }}></i>
                                Configuración
                            </ListGroup.Item>

                            <ListGroup.Item 
                                action 
                                onClick={() => console.log('Abrir Ayuda')}
                                style={{ 
                                    padding: '1rem 1.25rem',
                                    border: 'none',
                                    borderBottom: '1px solid #f0f0f0',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                                    e.currentTarget.style.paddingLeft = '1.5rem';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.paddingLeft = '1.25rem';
                                }}
                            >
                                <i className="bi bi-question-circle me-3" style={{ color: '#6c757d', fontSize: '1.1rem' }}></i>
                                Centro de Ayuda
                            </ListGroup.Item>

                            <ListGroup.Item 
                                action 
                                onClick={handleLogout}
                                style={{ 
                                    padding: '1rem 1.25rem',
                                    border: 'none',
                                    color: '#dc3545',
                                    fontWeight: '500',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#fff5f5';
                                    e.currentTarget.style.paddingLeft = '1.5rem';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.paddingLeft = '1.25rem';
                                }}
                            >
                                <i className="bi bi-box-arrow-right me-3" style={{ fontSize: '1.1rem' }}></i>
                                Cerrar Sesión
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