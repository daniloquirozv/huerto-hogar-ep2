import { Col, Container, Row } from "react-bootstrap";
import '../../assets/style/principal/principal-base-style.css';
import '../../assets/style/principal/principal-footer-style.css';
import { useState } from "react";
import { tiendas } from "../../data/tiendas";
import GoogleMapsIntegration from "../ui/googleMapsIntegration";

export default function Footer() {

    const [selectedStore, setSelectedStore] = useState(null);

    // Cuando seleccionas una tienda, actualiza el estado
    const handleStoreClick = (idx) => {
        setSelectedStore(idx);
    };

    return (
        <footer className="footer-eco" id="contacto">
            {/* Sección principal del footer */}
            <Container className="container-fluid py-5">
                <Row className="gy-4 gx-4">
                    {/* Columna izquierda - Información de contacto */}
                    <Col lg={4} md={6} className="text-center px-3">
                        {/* Tiendas asociadas */}
                        <div className="mb-4">
                            <h5 className="eco-title mb-4">
                                <i className="bi bi-shop me-2 text-black"></i>
                                Tiendas Asociadas
                            </h5>
                            <div className="footer-list text-start">
                                <ul className="list-unstyled footer-list mb-2">
                                    {tiendas.map((tienda, idx) => (
                                        <li key={tienda.nombre}>
                                            <i className="bi bi-geo-alt me-2"></i>
                                            <b>
                                                <span
                                                    style={{
                                                        color: selectedStore === idx ? '#28a745' : 'inherit',
                                                        textDecoration: 'underline',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => handleStoreClick(idx)}
                                                >
                                                    {tienda.nombre}:
                                                </span>
                                            </b>
                                            &nbsp;{tienda.direccion}. <br /> Tel: {tienda.telefono}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Col>

                    {/* Columna centro - Mapa Google */}
                    <Col lg={4} md={6} className="text-center px-3">
                        <h5 className="eco-title mb-3">
                            <i className="bi bi-geo-alt me-2 text-black"></i>
                            Encuéntranos
                        </h5>
                        <div className="footer-google-maps rounded-4 overflow-hidden shadow-sm mb-2">
                            {/* Mapa de Google My Maps Integrado */}
                            <GoogleMapsIntegration
                                selectedStore={selectedStore}
                                onStoreSelect={handleStoreClick}
                                width="100%"
                                height="350px"
                                className="google-maps-footer"
                            />
                        </div>
                    </Col>

                    {/* Columna derecha - Redes sociales */}
                    <Col lg={4} className="text-center px-3">
                        <h5 className="eco-title mb-4">
                            <i className="bi bi-share me-2 text-black"></i>
                            Síguenos
                        </h5>
                        {/* Botones de redes sociales */}
                        <div className="footer-social mb-4">
                            <a
                                className="social-link"
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="bi bi-facebook"></i>
                            </a>

                            <a
                                className="social-link"
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="bi bi-instagram"></i>
                            </a>

                            <a
                                className="social-link"
                                href="https://wa.me/56912345678"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="bi bi-whatsapp"></i>
                            </a>

                            <a
                                className="social-link"
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="bi bi-twitter"></i>
                            </a>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Línea divisoria */}
            <div style={{ background: 'rgba(255, 255, 255, 0.2)', height: '1px', margin: '0 2rem' }}></div>

            {/* Sección de derechos reservados - Centro */}
            <Container className="pb-4">
                <Row>
                    <Col className="text-center py-4">
                        <p className="mb-3" style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem' }}>
                            © 2024 <span className="text-white fw-bold" style={{ color: '#a8d5a3 !important' }}>HuertoHogar</span>.
                            Todos los derechos reservados.
                        </p>
                        <div className="footer-links mb-3">
                            <a href="#privacy" className="text-decoration-none me-4 text-white">
                                Política de Privacidad
                            </a>
                            <a href="#terms" className="text-decoration-none me-4 text-white">
                                Términos y Condiciones
                            </a>
                            <a href="#cookies" className="text-decoration-none text-white">
                                Política de Cookies
                            </a>
                        </div>
                        <div className="d-flex justify-content-center align-items-center" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            <i className="fas fa-leaf text-success me-2" style={{ fontSize: '1.2rem' }}></i>
                            <span style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>
                                Cultivando el futuro, un hogar a la vez
                            </span>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

