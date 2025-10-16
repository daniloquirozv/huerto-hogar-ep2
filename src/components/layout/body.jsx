import { Badge, Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import '../../assets/style/principal/principal-style.css';
import '../../assets/style/principal/principal-blog-style.css';
import fondo from '../../assets/images/principal/fondo3.avif';
import logotipo from '../../assets/images/principal/LogoTipo.png';
import Carrusel from "../ui/carrusel";
import Podio from "../ui/podio";
import BannerDescuentos from "../ui/BannerDescuentos";


export default function Body() {

    return (
        <main>
            {/* Hero Section */}
            <section className="hero bg-light position-relative overflow-hidden" id="hero">
                <div className="hero-background position-absolute w-100 h-100" style={{
                    backgroundImage: `url(${fondo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    opacity: 0.1,
                    zIndex: 1
                }}></div>
                <Container className="position-relative" style={{ zIndex: 2 }}>
                    <Row className="align-items-center min-vh-50 py-5">
                        <Col lg={8} className="mx-auto text-center">
                            <Badge bg="success" className="mb-3 fs-6">
                                Cultivo Urbano
                            </Badge>
                            <h1 className="display-4 fw-bold text-primary mb-3">
                                Bienvenido a <span className="text-success">HuertoHogar</span>
                            </h1>
                            <p className="lead text-muted mb-4 fs-5">
                                Tu tienda en línea de productos frescos y orgánicos del campo. Cultivados con dedicación
                                por agricultores locales y entregados directamente a tu hogar.
                            </p>
                            <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                                <Button
                                    variant="success"
                                    size="lg"
                                    className="shadow-lg px-4 py-3"
                                    href="/productos"
                                >
                                    <i className="fas fa-seedling me-2"></i>
                                    Explorar Productos
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            
            {/* Banner de Descuentos Dinámico */}
            <BannerDescuentos />
            {/* Catálogo Section */}
            <Carrusel />
            {/* Podio de Productos Más Vendidos */}
            <Podio />
            
            {/* Sección de Blog y Promociones Mejorada */}
            <section className="blog-promo-mejorada">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6} className="blog-promo-content">
                            <div className="promo-badge mb-3">
                                <Badge bg="warning" text="dark" className="fs-6">
                                    <i className="bi bi-megaphone-fill me-2"></i>
                                    ¡Nuevas Ofertas!
                                </Badge>
                            </div>
                            <h2 className="blog-promo-title-new">
                                <i className="bi bi-newspaper me-3 text-success"></i>
                                Descubre Nuestro Blog
                            </h2>
                            <h5 className="blog-promo-subtitle-new">
                                Consejos, noticias y ofertas exclusivas
                            </h5>
                            <p className="blog-promo-text-new">
                                Mantente al día con nuestros consejos de cultivo, noticias 
                                y las mejores promociones en productos frescos. 
                                <strong> ¡No te pierdas nuestros descuentos especiales!</strong>
                            </p>
                            
                            <div className="blog-promo-stats mb-4">
                                <Row>
                                    <Col xs={4} className="text-center">
                                        <div className="stat-item">
                                            <div className="stat-number">6</div>
                                            <div className="stat-label">Ofertas Activas</div>
                                        </div>
                                    </Col>
                                    <Col xs={4} className="text-center">
                                        <div className="stat-item">
                                            <div className="stat-number">50%</div>
                                            <div className="stat-label">Descuento Máx</div>
                                        </div>
                                    </Col>
                                    <Col xs={4} className="text-center">
                                        <div className="stat-item">
                                            <div className="stat-number">24h</div>
                                            <div className="stat-label">Flash Sales</div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            
                            <div className="blog-promo-actions">
                                <Button 
                                    as={Link} 
                                    to="/blog" 
                                    variant="success" 
                                    size="lg"
                                    className="blog-promo-btn-new me-3 mb-3"
                                >
                                    <i className="bi bi-book-half me-2"></i>
                                    Explorar Blog
                                </Button>
                                <Button 
                                    variant="outline-success" 
                                    size="lg"
                                    className="ofertas-btn"
                                    href="/productos"
                                >
                                    <i className="bi bi-tags-fill me-2"></i>
                                    Ver Ofertas
                                </Button>
                            </div>
                            
                            <div className="blog-promo-news-new">
                                <div className="news-badge">
                                    <i className="bi bi-lightning-fill text-warning"></i>
                                    <strong>¡Última Hora!</strong>
                                </div>
                                <span className="news-text">
                                    Flash Sale: 50% OFF en productos orgánicos - Solo 48h 
                                    <span className="news-emojis"><i className="bi bi-hourglass-split"></i></span>
                                </span>
                            </div>
                        </Col>
                        
                        <Col lg={6} className="blog-promo-visual">
                            <div className="promo-image-container">
                                <img
                                    src={logotipo}
                                    alt="HuertoHogar Blog"
                                    className="blog-promo-logo-new"
                                />
                                <div className="floating-badges">
                                    <Badge bg="danger" className="floating-badge badge-1">
                                        <i className="bi bi-fire"></i> HOT
                                    </Badge>
                                    <Badge bg="warning" text="dark" className="floating-badge badge-2">
                                        <i className="bi bi-percent"></i> -50%
                                    </Badge>
                                    <Badge bg="info" className="floating-badge badge-3">
                                        <i className="bi bi-clock"></i> 24H
                                    </Badge>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </main>
    )
}