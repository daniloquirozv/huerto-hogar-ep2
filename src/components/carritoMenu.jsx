import { Offcanvas, Button, ListGroup, ButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function CarritoMenu({ show, handleClose, carritoItems = [], onRemoveFromCart, onUpdateQuantity }) {
    const navigate = useNavigate();

    // Validación adicional para asegurar que carritoItems sea un array
    const validCarritoItems = Array.isArray(carritoItems) ? carritoItems : [];

    const total = validCarritoItems.reduce((sum, item) => {
        return sum + (item.precio * item.quantity)
    }, 0) // Agregamos valor inicial de 0

    const handleIncreaseQuantity = (codigo, currentQuantity) => {
        onUpdateQuantity(codigo, currentQuantity + 1);
    }

    const handleDecreaseQuantity = (codigo, currentQuantity) => {
        if (currentQuantity > 1){
            onUpdateQuantity(codigo, currentQuantity - 1);
        } else {
            onRemoveFromCart(codigo);
        }
    }
    
    const handleRemove = (codigo) => {
        if (window.confirm("¿Estás seguro de eliminar este producto del carrito?")) {
            onRemoveFromCart(codigo);
        }
    }

    return (
        <Offcanvas show={show} onHide={handleClose} placement="end">
            <Offcanvas.Header closeButton style={{ backgroundColor: '#2E8B57', color: 'white' }}>
                <Offcanvas.Title>
                    <i className="bi bi-cart3 me-2"></i>
                    Mi Carrito
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="d-flex flex-column">
                {validCarritoItems.length === 0 ? (
                    <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
                        <i className="bi bi-cart-x" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                        <p className="fw-bold mt-3">Tu carrito está vacío</p>
                        <p className="text-muted">Navega por las ofertas y categorías</p>
                        <Button variant="success" onClick={handleClose}>
                            Buscar productos
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex-grow-1 overflow-auto mb-3">
                            <ListGroup>
                                {validCarritoItems.map((item, idx) => (
                                    <ListGroup.Item key={idx} className="p-3">
                                        <div className="d-flex align-items-start">
                                            <img 
                                                src={item.imagen} 
                                                alt={item.nombre}
                                                style={{ 
                                                    width: '60px', 
                                                    height: '60px', 
                                                    objectFit: 'cover',
                                                    borderRadius: '8px'
                                                }}
                                                className="me-3"
                                            />
                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div>
                                                        <h6 className="mb-1">{item.nombre}</h6>
                                                        <small className="text-muted">
                                                            ${item.precio.toLocaleString('es-CL')} CLP/{item.unidad}
                                                        </small>
                                                    </div>
                                                    <Button 
                                                        variant="link" 
                                                        className="text-danger p-0"
                                                        onClick={() => handleRemove(item.codigo)}
                                                        style={{ fontSize: '1.2rem' }}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </Button>
                                                </div>
                                                
                                                <div className="d-flex justify-content-between align-items-center mt-2">
                                                    <ButtonGroup size="sm">
                                                        <Button 
                                                            variant="outline-success"
                                                            onClick={() => handleDecreaseQuantity(item.codigo, item.quantity)}
                                                        >
                                                            <i className="bi bi-dash"></i>
                                                        </Button>
                                                        <Button 
                                                            variant="outline-success" 
                                                            disabled
                                                            style={{ minWidth: '60px' }}
                                                        >
                                                            {item.quantity}
                                                        </Button>
                                                        <Button 
                                                            variant="outline-success"
                                                            onClick={() => handleIncreaseQuantity(item.codigo, item.quantity)}
                                                        >
                                                            <i className="bi bi-plus"></i>
                                                        </Button>
                                                    </ButtonGroup>
                                                    <div className="text-end">
                                                        <strong style={{ color: '#2E8B57', fontSize: '1.1rem' }}>
                                                            ${(item.precio * item.quantity).toLocaleString('es-CL')}
                                                        </strong>
                                                        <div className="text-muted small">CLP</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>
                        
                        <div className="border-top pt-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Total:</h5>
                                <h4 className="mb-0 text-success">
                                    ${total.toLocaleString('es-CL')} CLP
                                </h4>
                            </div>
                            <div className="d-flex gap-2">
                                <Button 
                                    variant="outline-success" 
                                    className="flex-grow-1"
                                    onClick={handleClose}
                                >
                                    Seguir comprando
                                </Button>
                                <Button 
                                    variant="success" 
                                    className="flex-grow-1"
                                    onClick={() => {
                                        handleClose();
                                        navigate('/carrito');
                                    }}
                                >
                                    <i className="bi bi-credit-card me-2"></i>
                                    Pagar
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
}