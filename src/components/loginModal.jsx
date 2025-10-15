import { Modal, ListGroup, Button } from "react-bootstrap";

export default function LoginModal({ show, handleClose, user }) {
    const isLoggedIn = !!user;

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
                <h4 className="mt-2">{isLoggedIn ? user.name : "Invitado"}</h4>
                <p className="mb-4">{isLoggedIn ? user.email : "No has iniciado sesión"}</p>

                <ListGroup>
                    {!isLoggedIn ? (
                        <>
                            <ListGroup.Item action>
                                <i className="bi bi-box-arrow-in-right me-2"></i> Iniciar Sesión
                            </ListGroup.Item>
                            <ListGroup.Item action>
                                <i className="bi bi-question-circle me-2"></i> Ayuda
                            </ListGroup.Item>
                            <ListGroup.Item action>
                                <i className="bi bi-person-plus me-2"></i> Registrarse
                            </ListGroup.Item>
                        </>
                    ) : (
                        <>
                            <ListGroup.Item action>
                                <i className="bi bi-clock-history me-2"></i> Historial
                            </ListGroup.Item>
                            <ListGroup.Item action>
                                <i className="bi bi-gear me-2"></i> Configuración
                            </ListGroup.Item>
                            <ListGroup.Item action>
                                <i className="bi bi-question-circle me-2"></i> Ayuda
                            </ListGroup.Item>
                            <ListGroup.Item action>
                                <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                            </ListGroup.Item>
                        </>
                    )}
                </ListGroup>
            </Modal.Body>
        </Modal>
    );
}