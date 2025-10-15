import { productosMasVendidos as productosData } from "../../data/productosMasVendidos";
import { Container, Row, Col, Card } from "react-bootstrap";
import '../../assets/style/principal/principal-base-style.css';
import '../../assets/style/principal/principal-podio-style.css';

export default function Podio() {
    return (
        <section id="podio" className="podio-section">
            <Container>
                <h2 className="text-center mb-5 podio-title">
                    <i className="bi bi-trophy podio-trophy"></i>
                    Productos más vendidos
                </h2>
                <Row className="justify-content-center align-items-end">
                    {/* Plata */}
                    <Col xs={12} md={4} className="podio-col podio-silver text-center">
                        <div className="podio-step podio-step-silver"></div>
                        <Card className="podio-card podio-card-silver">
                            <Card.Img variant="top" src={productosData[1].imagen} alt={productosData[1].nombre} className="podio-img" />
                            <Card.Body>
                                <Card.Title className="podio-title-silver"> <i className="bi bi-trophy"></i> {productosData[1].nombre}</Card.Title>
                                <Card.Text>{productosData[1].descripcion}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    {/* Oro */}
                    <Col xs={12} md={4} className="podio-col podio-gold text-center">
                        <div className="podio-step podio-step-gold"></div>
                        <Card className="podio-card podio-card-gold">
                            <Card.Img variant="top" src={productosData[0].imagen} alt={productosData[0].nombre} className="podio-img" />
                            <Card.Body>
                                <Card.Title className="podio-title-gold"> <i className="bi bi-trophy"></i> {productosData[0].nombre}</Card.Title>
                                <Card.Text>{productosData[0].descripcion}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    {/* Bronce */}
                    <Col xs={12} md={4} className="podio-col podio-bronze text-center">
                        <div className="podio-step podio-step-bronze"></div>
                        <Card className="podio-card podio-card-bronze">
                            <Card.Img variant="top" src={productosData[2].imagen} alt={productosData[2].nombre} className="podio-img" />
                            <Card.Body>
                                <Card.Title className="podio-title-bronze"> <i className="bi bi-trophy"></i> {productosData[2].nombre}</Card.Title>
                                <Card.Text>{productosData[2].descripcion}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}