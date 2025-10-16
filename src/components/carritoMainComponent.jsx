import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Modal, Alert } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

function CarritoMainComponent({
    cartItems = [],
    onUpdateQuantity = () => { },
    onRemoveItem = () => { },
    onClearCart = () => { }
}) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Calcular el total del carrito
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);
    };

    // Calcular total de items
    const totalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Manejar cambio de cantidad
    const handleQuantityChange = (codigo, newQuantity) => {
        if (newQuantity > 0) {
            onUpdateQuantity(codigo, newQuantity);
        }
    };

    // Incrementar cantidad
    const incrementQuantity = (item) => {
        if (item.quantity < item.stock) {
            onUpdateQuantity(item.codigo, item.quantity + 1);
        }
    };

    // Decrementar cantidad
    const decrementQuantity = (item) => {
        if (item.quantity > 1) {
            onUpdateQuantity(item.codigo, item.quantity - 1);
        }
    };

    // Mostrar detalles del producto
    const showProductDetails = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    // Cerrar modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    return (
        <Container className="my-5">
            {/* Header del Carrito */}
            <div className="text-center mb-4">
                <h1 style={{ color: '#2E8B57', fontWeight: 'bold' }}>
                    <i className="bi bi-cart-fill me-3"></i>
                    Mi Carrito de Compras
                </h1>
                <p className="text-muted">Gestiona tus productos y finaliza tu compra</p>
            </div>

            {cartItems.length === 0 ? (
                // Carrito vacío
                <Card className="text-center p-5 shadow-sm">
                    <Card.Body>
                        <i className="bi bi-cart-x" style={{ fontSize: '5rem', color: '#6c757d' }}></i>
                        <h3 className="mt-4 text-muted">Tu carrito está vacío</h3>
                        <p className="text-muted">Agrega productos para comenzar tu compra</p>
                        <Button variant="success" size="lg" href="/producto" className="mt-3">
                            <i className="bi bi-shop me-2"></i>
                            Ir a la Tienda
                        </Button>
                    </Card.Body>
                </Card>
            ) : (
                <Row>
                    {/* Lista de productos del carrito */}
                    <Col lg={8} md={12}>
                        <Card className="shadow-sm mb-4">
                            <Card.Header style={{ backgroundColor: '#2E8B57', color: 'white' }}>
                                <h5 className="mb-0">
                                    <i className="bi bi-bag-check me-2"></i>
                                    Productos en tu carrito ({totalItems()} items)
                                </h5>
                            </Card.Header>
                            <Card.Body className="p-0">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.codigo}
                                        className="border-bottom p-3"
                                        style={{ transition: 'background-color 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                    >
                                        <Row className="align-items-center">
                                            {/* Imagen del producto */}
                                            <Col xs={12} sm={3} className="text-center mb-3 mb-sm-0">
                                                <img
                                                    src={item.imagen}
                                                    alt={item.nombre}
                                                    style={{
                                                        width: '100%',
                                                        maxWidth: '120px',
                                                        height: '120px',
                                                        objectFit: 'cover',
                                                        borderRadius: '10px',
                                                        cursor: 'pointer',
                                                        border: '2px solid #e9ecef'
                                                    }}
                                                    onClick={() => showProductDetails(item)}
                                                />
                                            </Col>

                                            {/* Información del producto */}
                                            <Col xs={12} sm={4}>
                                                <h5
                                                    style={{ color: '#2E8B57', cursor: 'pointer' }}
                                                    onClick={() => showProductDetails(item)}
                                                >
                                                    {item.nombre}
                                                </h5>
                                                <Badge bg="secondary" className="mb-2">{item.categoria}</Badge>
                                                <p className="mb-1">
                                                    <strong>Código:</strong> {item.codigo}
                                                </p>
                                                <p className="mb-1 text-success">
                                                    <strong>${item.precio.toLocaleString('es-CL')}</strong> CLP/{item.unidad}
                                                </p>
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="p-0 text-info"
                                                    onClick={() => showProductDetails(item)}
                                                >
                                                    <i className="bi bi-info-circle me-1"></i>
                                                    Ver detalles
                                                </Button>
                                            </Col>

                                            {/* Controles de cantidad */}
                                            <Col xs={12} sm={3} className="text-center my-3 my-sm-0">
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => decrementQuantity(item)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <i className="bi bi-dash"></i>
                                                    </Button>
                                                    <Form.Control
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => handleQuantityChange(item.codigo, parseInt(e.target.value) || 1)}
                                                        min="1"
                                                        max={item.stock}
                                                        className="mx-2 text-center"
                                                        style={{ width: '70px' }}
                                                    />
                                                    <Button
                                                        variant="outline-success"
                                                        size="sm"
                                                        onClick={() => incrementQuantity(item)}
                                                        disabled={item.quantity >= item.stock}
                                                    >
                                                        <i className="bi bi-plus"></i>
                                                    </Button>
                                                </div>
                                                <small className="text-muted d-block mt-2">
                                                    Stock: {item.stock} {item.unidad}
                                                </small>
                                            </Col>

                                            {/* Subtotal y eliminar */}
                                            <Col xs={12} sm={2} className="text-center">
                                                <h5 className="text-success mb-3">
                                                    ${(item.precio * item.quantity).toLocaleString('es-CL')}
                                                </h5>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => onRemoveItem(item.codigo)}
                                                >
                                                    <i className="bi bi-trash me-1"></i>
                                                    Eliminar
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                ))}
                            </Card.Body>
                        </Card>

                        {/* Botón para vaciar carrito */}
                        <div className="text-end" >
                            <Button
                                variant="outline-danger"
                                onClick={onClearCart}
                                style={{
                                    backgroundColor: 'white',
                                    borderColor: '#dc3545',
                                    color: '#dc3545',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#dc3545';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.color = '#dc3545';
                                }}
                            >
                                <i className="bi bi-trash3 me-2" ></i>
                                Vaciar Carrito
                            </Button>
                        </div>
                    </Col>

                    {/* Resumen del pedido */}
                    <Col lg={4} md={12}>
                        <Card className="shadow-sm sticky-top" style={{ top: '20px' }}>
                            <Card.Header style={{ backgroundColor: '#2E8B57', color: 'white' }}>
                                <h5 className="mb-0">
                                    <i className="bi bi-receipt me-2"></i>
                                    Resumen del Pedido
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Subtotal:</span>
                                        <span>${calculateTotal().toLocaleString('es-CL')} CLP</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Total de items:</span>
                                        <Badge bg="success">{totalItems()}</Badge>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Envío:</span>
                                        <span className="text-success">Gratis</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <strong style={{ fontSize: '1.2rem' }}>Total:</strong>
                                        <strong style={{ fontSize: '1.2rem', color: '#2E8B57' }}>
                                            ${calculateTotal().toLocaleString('es-CL')} CLP
                                        </strong>
                                    </div>
                                </div>

                                <Alert variant="info" className="small">
                                    <i className="bi bi-truck me-2"></i>
                                    Envío gratis en compras superiores a $30.000
                                </Alert>

                                <Button
                                    variant="success"
                                    size="lg"
                                    className="w-100 mb-2"
                                >
                                    <i className="bi bi-credit-card me-2"></i>
                                    Proceder al Pago
                                </Button>

                                <Button
                                    variant="outline-success"
                                    className="w-100"
                                    href="/producto"
                                >
                                    <i className="bi bi-arrow-left me-2"></i>
                                    Seguir Comprando
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Modal de detalles del producto */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                {selectedProduct && (
                    <>
                        <Modal.Header closeButton style={{ backgroundColor: '#2E8B57', color: 'white' }}>
                            <Modal.Title>
                                <i className="bi bi-info-circle me-2"></i>
                                Detalles del Producto
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col md={5} className="text-center">
                                    <img
                                        src={selectedProduct.imagen}
                                        alt={selectedProduct.nombre}
                                        style={{
                                            width: '100%',
                                            maxWidth: '300px',
                                            height: '300px',
                                            objectFit: 'cover',
                                            borderRadius: '10px',
                                            border: '3px solid #2E8B57'
                                        }}
                                    />
                                </Col>
                                <Col md={7}>
                                    <h3 style={{ color: '#2E8B57' }}>{selectedProduct.nombre}</h3>
                                    <Badge bg="secondary" className="mb-3">{selectedProduct.categoria}</Badge>

                                    <div className="mb-3">
                                        <p><strong>Código:</strong> {selectedProduct.codigo}</p>
                                        <p><strong>Precio:</strong> <span className="text-success fs-5">${selectedProduct.precio.toLocaleString('es-CL')} CLP/{selectedProduct.unidad}</span></p>
                                        <p><strong>Stock disponible:</strong> {selectedProduct.stock} {selectedProduct.unidad}</p>
                                        <p><strong>Cantidad en carrito:</strong> {selectedProduct.quantity} {selectedProduct.unidad}</p>
                                    </div>

                                    <div className="mb-3">
                                        <h5>Descripción:</h5>
                                        <p className="text-muted">{selectedProduct.descripcion}</p>
                                    </div>

                                    <Alert variant="success">
                                        <strong>Subtotal en carrito:</strong> ${(selectedProduct.precio * selectedProduct.quantity).toLocaleString('es-CL')} CLP
                                    </Alert>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cerrar
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => {
                                    onRemoveItem(selectedProduct.codigo);
                                    handleCloseModal();
                                }}
                            >
                                <i className="bi bi-trash me-2"></i>
                                Eliminar del Carrito
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </Container>
    );
}

export default CarritoMainComponent;