import React, { useState, useEffect } from 'react';
import { Alert, Button, Badge, Container, Row, Col } from 'react-bootstrap';
import { promocionesActivas } from '../../data/blogPosts';
import '../../assets/style/principal/principal-base-style.css';
import '../../assets/style/principal/principal-banner-style.css';

const BannerDescuentos = () => {
    const [promocionActual, setPromocionActual] = useState(0);
    const [cuponCopiado, setCuponCopiado] = useState('');
    const [mostrarBanner, setMostrarBanner] = useState(true);

    // Rotar promociones cada 5 segundos
    useEffect(() => {
        if (promocionesActivas.length > 1) {
            const interval = setInterval(() => {
                setPromocionActual(prev => (prev + 1) % promocionesActivas.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, []);

    // Función para copiar cupón
    const copiarCupon = (codigo) => {
        navigator.clipboard.writeText(codigo);
        setCuponCopiado(codigo);
        setTimeout(() => setCuponCopiado(''), 3000);
    };

    // Calcular días restantes
    const diasRestantes = (fechaVencimiento) => {
        const hoy = new Date();
        const vencimiento = new Date(fechaVencimiento);
        const diferencia = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
        return diferencia;
    };

    if (!mostrarBanner || promocionesActivas.length === 0) {
        return null;
    }

    const promo = promocionesActivas[promocionActual];
    const dias = diasRestantes(promo.fechaVencimiento);

    return (
        <section className="banner-descuentos-section">
            <Container>
                <Alert 
                    variant="success" 
                    className={`banner-descuentos ${promo.urgente ? 'urgente' : ''}`}
                    dismissible
                    onClose={() => setMostrarBanner(false)}
                >
                    <Row className="align-items-center">
                        <Col lg={2} className="text-center mb-3 mb-lg-0">
                            <div className="descuento-badge">
                                <span className="descuento-porcentaje">{promo.descuento}%</span>
                                <span className="descuento-texto">OFF</span>
                            </div>
                        </Col>
                        
                        <Col lg={6} className="mb-3 mb-lg-0">
                            <div className="banner-contenido">
                                <h4 className="banner-titulo">
                                    {promo.urgente && <i className="bi bi-lightning-fill text-warning me-2"></i>}
                                    {promo.titulo}
                                </h4>
                                <p className="banner-descripcion mb-2">
                                    {promo.resumen}
                                </p>
                                <div className="banner-meta">
                                    <Badge bg="primary" className="me-2">{promo.categoria}</Badge>
                                    <small className="text-muted">
                                        <i className='bi bi-clock'></i> {dias > 0 ? `${dias} días restantes` : '¡Última oportunidad!'}
                                    </small>
                                </div>
                            </div>
                        </Col>
                        
                        <Col lg={4} className="text-center">
                            <div className="banner-accion">
                                <div className="cupon-container mb-3">
                                    <div className="cupon-codigo">
                                        <span className="cupon-label">Código:</span>
                                        <span className="cupon-valor">{promo.codigoCupon}</span>
                                    </div>
                                    <Button
                                        variant={cuponCopiado === promo.codigoCupon ? "success" : "warning"}
                                        size="sm"
                                        onClick={() => copiarCupon(promo.codigoCupon)}
                                        className="cupon-btn"
                                    >
                                        {cuponCopiado === promo.codigoCupon ? (
                                            <><i className="bi bi-check-circle-fill me-1"></i>¡Copiado!</>
                                        ) : (
                                            <><i className="bi bi-clipboard me-1"></i>Copiar</>
                                        )}
                                    </Button>
                                </div>
                                <Button 
                                    variant="success" 
                                    className="btn-aprovechar"
                                    href="#productos"
                                >
                                    <i className="bi bi-cart-plus me-2"></i>
                                    ¡Aprovechar Oferta!
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    
                    {/* Indicadores de promociones múltiples */}
                    {promocionesActivas.length > 1 && (
                        <div className="promociones-indicadores">
                            {promocionesActivas.map((_, index) => (
                                <button
                                    key={index}
                                    className={`indicador ${index === promocionActual ? 'activo' : ''}`}
                                    onClick={() => setPromocionActual(index)}
                                    aria-label={`Ver promoción ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </Alert>
            </Container>
        </section>
    );
};

export default BannerDescuentos;