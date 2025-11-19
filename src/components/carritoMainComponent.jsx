import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { validateCoupon, calculateDiscount } from '../utils/discountUtils';
import { procesarCompra } from '../services/productosService';

function CarritoMainComponent({
    cartItems = [],
    onUpdateQuantity = () => { },
    onRemoveItem = () => { },
    onClearCart = () => { }
}) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });
    const [processingPurchase, setProcessingPurchase] = useState(false);
    const [purchaseMessage, setPurchaseMessage] = useState({ type: '', text: '' });
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);

    // Calcular el subtotal del carrito
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);
    };

    // Calcular el total del carrito con descuento aplicado
    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        if (appliedCoupon) {
            const discount = calculateDiscount(subtotal, appliedCoupon.descuento);
            return discount.total;
        }
        return subtotal;
    };

    // Obtener el monto del descuento
    const getDiscountAmount = () => {
        if (appliedCoupon) {
            const subtotal = calculateSubtotal();
            const discount = calculateDiscount(subtotal, appliedCoupon.descuento);
            return discount.montoDescuento;
        }
        return 0;
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

    // Aplicar cupón de descuento
    const handleApplyCoupon = () => {
        const validation = validateCoupon(couponCode);
        
        if (validation.valid) {
            setAppliedCoupon(validation.coupon);
            setCouponMessage({ type: 'success', text: validation.message });
        } else {
            setAppliedCoupon(null);
            setCouponMessage({ type: 'danger', text: validation.message });
        }
    };

    // Remover cupón aplicado
    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponMessage({ type: '', text: '' });
    };

    // Manejar cambio en el input del cupón
    const handleCouponInputChange = (e) => {
        setCouponCode(e.target.value);
        // Limpiar mensaje al escribir
        if (couponMessage.text) {
            setCouponMessage({ type: '', text: '' });
        }
    };

    // Procesar el pago y actualizar stock en la BD
    const handleProcederAlPago = async () => {
        setProcessingPurchase(true);
        setPurchaseMessage({ type: '', text: '' });

        try {
            console.log('🛒 Iniciando proceso de compra...');
            console.log('Productos en carrito:', cartItems);

            // Preparar datos de compra
            const productosCompra = cartItems.map(item => {
                // Extraer el ID del código si no existe id directo
                let productId = item.id;
                if (!productId && item.codigo) {
                    // Si el código es "PROD001", extraer "1"
                    const match = item.codigo.match(/\d+/);
                    productId = match ? parseInt(match[0]) : null;
                }
                
                console.log(`Producto: ${item.nombre}, ID: ${productId}, Codigo: ${item.codigo}`);
                
                return {
                    id: productId,
                    codigo: item.codigo,
                    nombre: item.nombre,
                    quantity: item.quantity,
                    precio: item.precio
                };
            });
            
            console.log('Productos preparados para compra:', productosCompra);

            // Procesar compra (actualizar stock en BD)
            const resultado = await procesarCompra(productosCompra);

            if (resultado.success) {
                // Compra exitosa
                console.log('✅ Compra procesada exitosamente:', resultado);
                
                setPurchaseMessage({
                    type: 'success',
                    text: `¡Compra confirmada! Se han actualizado ${resultado.resultados.length} productos en el inventario.`
                });
                
                setShowPurchaseModal(true);
                
                // Esperar 2 segundos antes de vaciar el carrito
                setTimeout(() => {
                    onClearCart();
                    setShowPurchaseModal(false);
                }, 3000);
                
            } else {
                // Error en la compra
                console.error('❌ Error en la compra:', resultado);
                
                // Obtener detalles de los productos que fallaron
                const productosFallidos = resultado.resultados
                    .filter(r => !r.success)
                    .map(r => {
                        const errorMsg = typeof r.error === 'string' ? r.error : JSON.stringify(r.error);
                        return `${r.producto.nombre}: ${errorMsg}`;
                    })
                    .join('; ');
                
                console.error('Productos fallidos:', productosFallidos);
                console.error('Resultado completo:', JSON.stringify(resultado, null, 2));
                
                setPurchaseMessage({
                    type: 'danger',
                    text: productosFallidos || resultado.mensaje
                });
                
                setShowPurchaseModal(true);
            }

        } catch (error) {
            console.error('❌ Error al procesar el pago:', error);
            
            setPurchaseMessage({
                type: 'danger',
                text: 'Error al procesar el pago. Por favor, intente nuevamente.'
            });
            
            setShowPurchaseModal(true);
            
        } finally {
            setProcessingPurchase(false);
        }
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
                        <Button variant="success" size="lg" href="/productos" className="mt-3">
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
                                {/* Sección de cupón de descuento */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold">
                                        <i className="bi bi-ticket-perforated me-2"></i>
                                        ¿Tienes un cupón de descuento?
                                    </label>
                                    {!appliedCoupon ? (
                                        <div className="input-group">
                                            <Form.Control
                                                type="text"
                                                placeholder="Ingresa tu código"
                                                value={couponCode}
                                                onChange={handleCouponInputChange}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleApplyCoupon();
                                                    }
                                                }}
                                            />
                                            <Button
                                                variant="outline-success"
                                                onClick={handleApplyCoupon}
                                                disabled={!couponCode.trim()}
                                            >
                                                Aplicar
                                            </Button>
                                        </div>
                                    ) : (
                                        <Alert variant="success" className="mb-0 d-flex justify-content-between align-items-center">
                                            <div>
                                                <i className="bi bi-check-circle-fill me-2"></i>
                                                <strong>{appliedCoupon.codigo}</strong>
                                                <div className="small">
                                                    {appliedCoupon.descuento}% de descuento aplicado
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={handleRemoveCoupon}
                                            >
                                                <i className="bi bi-x"></i>
                                            </Button>
                                        </Alert>
                                    )}
                                    {couponMessage.text && !appliedCoupon && (
                                        <Alert variant={couponMessage.type} className="mt-2 mb-0 small">
                                            {couponMessage.text}
                                        </Alert>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Subtotal:</span>
                                        <span>${calculateSubtotal().toLocaleString('es-CL')} CLP</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Total de items:</span>
                                        <Badge bg="success">{totalItems()}</Badge>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="d-flex justify-content-between mb-2 text-success">
                                            <span>
                                                <i className="bi bi-tag-fill me-1"></i>
                                                Descuento ({appliedCoupon.descuento}%):
                                            </span>
                                            <span>-${getDiscountAmount().toLocaleString('es-CL')} CLP</span>
                                        </div>
                                    )}
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

                {/* <Alert variant="info" className="small">
                    <i className="bi bi-truck me-2"></i>
                    Envío gratis en compras superiores a $30.000
                </Alert> */}

                <Button
                    variant="success"
                    size="lg"
                    className="w-100 mb-2"
                    onClick={handleProcederAlPago}
                    disabled={processingPurchase}
                >
                    {processingPurchase ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                            />
                            Procesando compra...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-credit-card me-2"></i>
                            Proceder al Pago
                        </>
                    )}
                </Button>                                <Button
                                    variant="outline-success"
                                    className="w-100"
                                    href="/productos"
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

            {/* Modal de confirmación de compra */}
            <Modal 
                show={showPurchaseModal} 
                onHide={() => setShowPurchaseModal(false)} 
                centered
                backdrop="static"
            >
                <Modal.Header 
                    closeButton={!processingPurchase}
                    style={{ 
                        backgroundColor: purchaseMessage.type === 'success' ? '#198754' : '#dc3545', 
                        color: 'white' 
                    }}
                >
                    <Modal.Title>
                        {purchaseMessage.type === 'success' ? (
                            <>
                                <i className="bi bi-check-circle-fill me-2"></i>
                                ¡Compra Exitosa!
                            </>
                        ) : (
                            <>
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                Error en la Compra
                            </>
                        )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    {purchaseMessage.type === 'success' ? (
                        <>
                            <div className="mb-4">
                                <i className="bi bi-bag-check-fill" style={{ fontSize: '4rem', color: '#198754' }}></i>
                            </div>
                            <h5 className="mb-3">Tu compra ha sido procesada correctamente</h5>
                            <p className="text-muted">{purchaseMessage.text}</p>
                            <Alert variant="info" className="mt-3">
                                <i className="bi bi-info-circle me-2"></i>
                                El inventario ha sido actualizado en la base de datos.
                            </Alert>
                            <p className="text-muted small mt-3">
                                <Spinner animation="border" size="sm" className="me-2" />
                                Redirigiendo...
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="mb-4">
                                <i className="bi bi-x-circle-fill" style={{ fontSize: '4rem', color: '#dc3545' }}></i>
                            </div>
                            <h5 className="mb-3">No se pudo procesar tu compra</h5>
                            <p className="text-muted">{purchaseMessage.text}</p>
                            <Alert variant="warning" className="mt-3">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                Por favor, verifica el stock disponible y vuelve a intentarlo.
                            </Alert>
                        </>
                    )}
                </Modal.Body>
                {purchaseMessage.type !== 'success' && (
                    <Modal.Footer>
                        <Button 
                            variant="secondary" 
                            onClick={() => setShowPurchaseModal(false)}
                        >
                            Cerrar
                        </Button>
                        <Button 
                            variant="success" 
                            onClick={() => {
                                setShowPurchaseModal(false);
                                handleProcederAlPago();
                            }}
                        >
                            Reintentar
                        </Button>
                    </Modal.Footer>
                )}
            </Modal>
        </Container>
    );
}

export default CarritoMainComponent;