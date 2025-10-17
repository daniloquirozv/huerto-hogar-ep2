import React from 'react';
import { Card, Badge, Row, Col, Alert } from 'react-bootstrap';
import { getActiveCoupons } from '../utils/discountUtils';
import 'bootstrap-icons/font/bootstrap-icons.css';

/**
 * Componente para mostrar cupones de descuento disponibles
 */
function CuponesDisponibles() {
    const cupones = getActiveCoupons();

    // Formatear fecha
    const formatearFecha = (fechaStr) => {
        const fecha = new Date(fechaStr + 'T00:00:00');
        return fecha.toLocaleDateString('es-CL', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    // Calcular días restantes
    const diasRestantes = (fechaStr) => {
        const hoy = new Date();
        const vencimiento = new Date(fechaStr + 'T23:59:59');
        const diffTime = vencimiento - hoy;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (cupones.length === 0) {
        return (
            <Alert variant="info" className="text-center">
                <i className="bi bi-info-circle me-2"></i>
                No hay cupones de descuento disponibles en este momento
            </Alert>
        );
    }

    return (
        <div className="cupones-disponibles">
            <div className="text-center mb-4">
                <h2 style={{ color: '#2E8B57', fontWeight: 'bold' }}>
                    <i className="bi bi-ticket-perforated-fill me-2"></i>
                    Cupones de Descuento Disponibles
                </h2>
                <p className="text-muted">
                    Usa estos códigos en tu carrito de compras para obtener descuentos
                </p>
            </div>

            <Row>
                {cupones.map((cupon, index) => {
                    const dias = diasRestantes(cupon.fechaVencimiento);
                    const esUrgente = cupon.urgente || dias <= 3;

                    return (
                        <Col key={index} md={6} lg={4} className="mb-4">
                            <Card 
                                className="h-100 shadow-sm position-relative"
                                style={{ 
                                    borderLeft: esUrgente ? '5px solid #dc3545' : '5px solid #2E8B57',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '';
                                }}
                            >
                                {/* Badge de porcentaje */}
                                <div 
                                    className="position-absolute top-0 end-0 m-3"
                                    style={{
                                        backgroundColor: esUrgente ? '#dc3545' : '#2E8B57',
                                        color: 'white',
                                        padding: '10px 15px',
                                        borderRadius: '50%',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    {cupon.descuento}%
                                </div>

                                <Card.Body>
                                    {/* Código del cupón */}
                                    <div className="mb-3 mt-2">
                                        <div 
                                            className="text-center p-3 rounded"
                                            style={{
                                                backgroundColor: '#f8f9fa',
                                                border: '2px dashed #2E8B57',
                                                fontSize: '1.5rem',
                                                fontWeight: 'bold',
                                                letterSpacing: '2px',
                                                fontFamily: 'monospace',
                                                color: '#2E8B57'
                                            }}
                                        >
                                            {cupon.codigo}
                                        </div>
                                    </div>

                                    {/* Título */}
                                    <h5 className="card-title" style={{ color: '#2E8B57' }}>
                                        {cupon.titulo}
                                    </h5>

                                    {/* Categoría */}
                                    <Badge bg="secondary" className="mb-3">
                                        {cupon.categoria}
                                    </Badge>

                                    {/* Información de vencimiento */}
                                    <div className="mb-2">
                                        <small className="text-muted">
                                            <i className="bi bi-calendar-event me-1"></i>
                                            Válido hasta: {formatearFecha(cupon.fechaVencimiento)}
                                        </small>
                                    </div>

                                    {/* Días restantes */}
                                    {dias > 0 && (
                                        <Alert 
                                            variant={esUrgente ? 'danger' : 'success'} 
                                            className="mb-0 small py-2"
                                        >
                                            <i className={`bi ${esUrgente ? 'bi-exclamation-triangle' : 'bi-clock'} me-1`}></i>
                                            {dias === 1 ? 
                                                '¡Último día!' : 
                                                `${dias} días restantes`
                                            }
                                        </Alert>
                                    )}

                                    {/* Cómo usar */}
                                    <div className="mt-3 p-2 bg-light rounded">
                                        <small className="text-muted">
                                            <i className="bi bi-info-circle me-1"></i>
                                            Copia el código y pégalo en tu carrito
                                        </small>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            {/* Instrucciones */}
            <Card className="mt-4 bg-light">
                <Card.Body>
                    <h5 className="text-center mb-3">
                        <i className="bi bi-question-circle me-2"></i>
                        ¿Cómo usar tus cupones?
                    </h5>
                    <Row className="text-center">
                        <Col md={4} className="mb-3 mb-md-0">
                            <div className="mb-2">
                                <i className="bi bi-1-circle-fill" style={{ fontSize: '2rem', color: '#2E8B57' }}></i>
                            </div>
                            <h6>Copia el código</h6>
                            <p className="small text-muted">
                                Selecciona y copia el código del cupón que deseas usar
                            </p>
                        </Col>
                        <Col md={4} className="mb-3 mb-md-0">
                            <div className="mb-2">
                                <i className="bi bi-2-circle-fill" style={{ fontSize: '2rem', color: '#2E8B57' }}></i>
                            </div>
                            <h6>Agrega productos</h6>
                            <p className="small text-muted">
                                Añade productos a tu carrito de compras
                            </p>
                        </Col>
                        <Col md={4}>
                            <div className="mb-2">
                                <i className="bi bi-3-circle-fill" style={{ fontSize: '2rem', color: '#2E8B57' }}></i>
                            </div>
                            <h6>Aplica el cupón</h6>
                            <p className="small text-muted">
                                Pega el código en el campo de cupón y aplícalo
                            </p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
}

export default CuponesDisponibles;
