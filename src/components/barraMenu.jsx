import { useEffect } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import logotipo from '../assets/images/principal/LogoTipo.png';

export default function BarraMenu({ show, onHide, onShowLogin, onShowCart }) {
    useEffect(() => {
        document.body.classList.toggle('non-scroll', show);
        return () => document.body.classList.remove('non-scroll');
    }, [show]);

    // Función para hacer scroll al footer de contacto
    const scrollToContacto = () => {
        // Primero cerrar el menú
        onHide();
        
        // Esperar un poco para que el menú se cierre completamente y luego hacer scroll
        setTimeout(() => {
            const contactoElement = document.getElementById('contacto');
            if (contactoElement) {
                // Usar window.scrollTo para mayor control
                const elementPosition = contactoElement.offsetTop;
                window.scrollTo({
                    top: elementPosition - 20, // Pequeño offset para mejor visualización
                    behavior: 'smooth'
                });
            }
        }, 300); // Dar tiempo para que el menú se cierre
    };

    

    return (
        <Offcanvas show={show} onHide={onHide} placement="start" backdrop="static" className="barra-menu-offcanvas success">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>
                    <img src={logotipo} alt="LogoTipo" width={110} style={{ marginBottom: "-16px" }} />
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {/* Sección búsqueda */}
                <div style={{ padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                    <div style={{ fontSize: "0.96rem", color: "#444", marginBottom: "7px" }}>
                        <strong>Tienda Online</strong>
                        <div style={{ fontSize: "0.92rem", color: "#888" }}>
                            Todo lo que necesitas para tu despensa, ¡y más!
                        </div>
                    </div>
                    <div style={{
                        fontSize: "0.97rem",
                        background: "#f2f8ff",
                        borderRadius: "6px",
                        marginBottom: "5px",
                        padding: "4px 8px"
                    }}>
                        <strong>Productos</strong>
                        <div style={{ color: "#1d7bcc", fontSize: "0.93rem" }}>
                            Miles de productos a tu alcance...
                        </div>
                    </div>
                </div>
                {/* Sección de accesos */}
                <div style={{ borderBottom: "1px solid #f0f0f0", padding: "14px 0" }}>
                    <div 
                        className="d-flex align-items-center gap-2 mb-3" 
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            onShowLogin();
                            onHide();
                        }}
                    >
                        <i className="bi bi-person" style={{ fontSize: "1.2rem" }}></i>
                        <span>Mi perfil</span>
                    </div>
                    <div 
                        className="d-flex align-items-center gap-2 mb-3" 
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            onShowCart();
                            onHide();
                        }}
                    >
                        <i className="bi bi-cart3" style={{ fontSize: "1.2rem" }}></i>
                        <span>Mi carrito</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-3" style={{ cursor: "pointer" }}>
                        <i className="bi bi-gear" style={{ fontSize: "1.2rem" }}></i>
                        <span>Configuración</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-3" style={{ cursor: "pointer" }}>
                        <i className="bi bi-tag" style={{ fontSize: "1.2rem" }}></i>
                        <span>Ofertas</span>
                    </div>
                </div>
                {/* Ayuda y Secciones */}
                <div style={{ padding: "14px 0" }}>
                    <Link 
                        to="/blog"
                        className="d-flex align-items-center gap-2 mb-3 text-decoration-none text-dark" 
                        style={{ cursor: "pointer" }}
                        onClick={onHide}
                    >
                        <i className="bi bi-chat" style={{ fontSize: "1.2rem" }}></i>
                        <span>Blog</span>
                    </Link>
                    <div 
                        className="d-flex align-items-center gap-2 mb-3" 
                        style={{ cursor: "pointer" }}
                        onClick={scrollToContacto}
                    >
                        <i className="bi bi-telephone" style={{ fontSize: "1.2rem" }}></i>
                        <span>Contacto</span>
                        <i className="bi bi-chevron-right ms-auto" style={{ fontSize: "1.2rem" }}></i>
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-3" style={{ cursor: "pointer" }}>
                        <i className="bi bi-question-circle" style={{ fontSize: "1.2rem" }}></i>
                        <span>Ayuda</span>
                    </div>
                </div>
                {/* Botón inicio sesión/registro */}
                <div className="d-flex justify-content-center mb-3">
                    <Button
                        as={Link}
                        to="/login"
                        variant="success"
                        style={{
                            fontWeight: 600,
                            fontSize: "1rem",
                            borderRadius: "22px",
                            padding: "0.6rem 1.4rem"
                        }}
                    >
                        Iniciar sesión o crea una cuenta
                    </Button>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
}