import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup, Alert } from 'react-bootstrap';
import { blogPosts, categoriasBlogs, promocionesActivas } from '../../data/blogPosts';
import '../../assets/style/principal/blog-style.css';

const Blog = () => {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
    const [busqueda, setBusqueda] = useState('');
    const [postSeleccionado, setPostSeleccionado] = useState(null);
    const [cuponCopiado, setCuponCopiado] = useState('');

    // Filtrar posts por categoría y búsqueda
    const postsFiltrados = blogPosts.filter(post => {
        const coincideCategoria = categoriaSeleccionada === 'todas' || post.categoria === categoriaSeleccionada;
        const coincideBusqueda = post.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
            post.resumen.toLowerCase().includes(busqueda.toLowerCase());
        return coincideCategoria && coincideBusqueda;
    });

    // Función para copiar cupón
    const copiarCupon = (codigo) => {
        navigator.clipboard.writeText(codigo);
        setCuponCopiado(codigo);
        setTimeout(() => setCuponCopiado(''), 3000);
    };

    // Función para calcular días restantes
    const diasRestantes = (fechaVencimiento) => {
        const hoy = new Date();
        const vencimiento = new Date(fechaVencimiento);
        const diferencia = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
        return diferencia;
    };

    // Vista de post individual
    if (postSeleccionado) {
        return (
            <Container className="blog-container py-5">
                <Button
                    variant="outline-secondary"
                    className="mb-4"
                    onClick={() => setPostSeleccionado(null)}
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Volver al Blog
                </Button>

                <article className="post-individual">
                    <header className="post-header text-center mb-4">
                        <div className='post-imagen-principal-container'>
                            <img
                                src={postSeleccionado.imagen}
                                alt={postSeleccionado.titulo}
                                className="post-imagen-principal"
                            />
                        </div>
                        <div className="post-meta mt-4">
                            <Badge bg="primary" className="me-2">{postSeleccionado.categoria}</Badge>
                            <small className="text-muted">
                                Por {postSeleccionado.autor} • {new Date(postSeleccionado.fecha).toLocaleDateString('es-ES')}
                            </small>
                        </div>
                        <h1 className="post-titulo mt-3">{postSeleccionado.titulo}</h1>
                    </header>

                    <div className="post-contenido"
                        dangerouslySetInnerHTML={{ __html: postSeleccionado.contenido }}>
                    </div>

                    {/* Cupón de descuento si existe */}
                    {postSeleccionado.codigoCupon && (
                        <Alert variant="success" className="cupon-alert mt-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Alert.Heading className="h5">
                                        🎟️ ¡Aprovecha tu descuento del {postSeleccionado.descuento}%!
                                    </Alert.Heading>
                                    <p className="mb-0">
                                        Código: <strong>{postSeleccionado.codigoCupon}</strong>
                                        <br />
                                        <small>Válido hasta: {new Date(postSeleccionado.fechaVencimiento).toLocaleDateString('es-ES')}</small>
                                        <br />
                                        <small className="text-success">
                                            ⏰ {diasRestantes(postSeleccionado.fechaVencimiento) > 0
                                                ? `${diasRestantes(postSeleccionado.fechaVencimiento)} días restantes`
                                                : '¡Oferta vencida!'}
                                        </small>
                                    </p>
                                </div>
                                <Button
                                    variant="success"
                                    onClick={() => copiarCupon(postSeleccionado.codigoCupon)}
                                    disabled={diasRestantes(postSeleccionado.fechaVencimiento) <= 0}
                                >
                                    {cuponCopiado === postSeleccionado.codigoCupon ?
                                        <><i className="bi bi-check"></i> ¡Copiado!</> :
                                        <><i className="bi bi-clipboard"></i> Copiar Código</>
                                    }
                                </Button>
                            </div>
                        </Alert>
                    )}
                </article>
            </Container>
        );
    }

    // Vista principal del blog
    return (
        <Container className="blog-container py-5">
            {/* Header del Blog */}
            <header className="blog-header text-center mb-5">
                <h1 className="display-4 text-success fw-bold">
                    <i className="bi bi-newspaper me-3"></i>
                    Blog HuertoHogar
                </h1>
                <p className="lead text-muted">
                    Consejos, noticias y las mejores ofertas para tu alimentación saludable
                </p>
            </header>

            {/* Banner de Promociones Activas */}
            {promocionesActivas.length > 0 && (
                <Alert variant="warning" className="promociones-banner mb-4">
                    <div className="d-flex align-items-center justify-content-center text-center">
                        <i className="bi bi-lightning-fill fs-2 text-warning me-3"></i>
                        <div>
                            <Alert.Heading className="h5 mb-1">
                                ¡{promocionesActivas.length} Promociones Activas!
                            </Alert.Heading>
                            <p className="mb-0">
                                No te pierdas nuestras ofertas especiales. Ahorra hasta un 50% en productos seleccionados.
                            </p>
                        </div>
                    </div>
                </Alert>
            )}

            {/* Filtros y Búsqueda */}
            <Row className="mb-4">
                <Col md={8}>
                    <InputGroup>
                        <InputGroup.Text>
                            <i className="bi bi-search"></i>
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Buscar en el blog..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={4}>
                    <Form.Select
                        value={categoriaSeleccionada}
                        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    >
                        {categoriasBlogs.map(categoria => (
                            <option key={categoria.valor} value={categoria.valor}>
                                {categoria.nombre}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            {/* Grid de Posts */}
            <Row>
                {postsFiltrados.map(post => (
                    <Col lg={4} md={6} className="mb-4" key={post.id}>
                        <Card className={`post-card h-100 ${post.destacado ? 'destacado' : ''} ${post.urgente ? 'urgente' : ''}`}>
                            {post.destacado && (
                                <div className="badge-destacado">
                                    <Badge bg="warning" text="dark">
                                        <i className="bi bi-star-fill me-1"></i>
                                        Destacado
                                    </Badge>
                                </div>
                            )}
                            {post.urgente && (
                                <div className="badge-urgente">
                                    <Badge bg="danger">
                                        <i className="bi bi-lightning-fill me-1"></i>
                                        ¡Urgente!
                                    </Badge>
                                </div>
                            )}


                            <Card.Img
                                variant="top"
                                src={post.imagen}
                                className="post-imagen"
                                style={{ height: '200px', objectFit: 'cover', borderRadius: '15px 15px 0 0' }}
                            />



                            <Card.Body className="d-flex flex-column">
                                <div className="post-meta mb-2">
                                    <Badge bg="primary" className="me-2">{post.categoria}</Badge>
                                    <small className="text-muted">
                                        {new Date(post.fecha).toLocaleDateString('es-ES')}
                                    </small>
                                </div>

                                <Card.Title className="post-titulo">
                                    {post.titulo}
                                </Card.Title>

                                <Card.Text className="post-resumen flex-grow-1">
                                    {post.resumen}
                                </Card.Text>

                                {/* Descuento si existe */}
                                {post.descuento && (
                                    <div className="descuento-info mb-3">
                                        <Badge bg="success" className="fs-6">
                                            🎟️ {post.descuento}% OFF
                                        </Badge>
                                        <small className="d-block text-muted mt-1">
                                            Código: {post.codigoCupon}
                                        </small>
                                        <small className="text-success">
                                            ⏰ {diasRestantes(post.fechaVencimiento) > 0
                                                ? `${diasRestantes(post.fechaVencimiento)} días restantes`
                                                : '¡Oferta vencida!'}
                                        </small>
                                    </div>
                                )}

                                <div className="d-flex gap-2">
                                    <Button
                                        variant="outline-primary"
                                        className="flex-grow-1"
                                        onClick={() => setPostSeleccionado(post)}
                                    >
                                        Leer Más
                                    </Button>
                                    {post.codigoCupon && diasRestantes(post.fechaVencimiento) > 0 && (
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={() => copiarCupon(post.codigoCupon)}
                                        >
                                            {cuponCopiado === post.codigoCupon ?
                                                <i className="bi bi-check"></i> :
                                                <i className="bi bi-clipboard"></i>
                                            }
                                        </Button>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Mensaje si no hay posts */}
            {postsFiltrados.length === 0 && (
                <Row>
                    <Col className="text-center py-5">
                        <i className="bi bi-search display-1 text-muted"></i>
                        <h3 className="text-muted mt-3">No se encontraron posts</h3>
                        <p className="text-muted">
                            Intenta con otros términos de búsqueda o cambia la categoría.
                        </p>
                    </Col>
                </Row>
            )}

            {/* Newsletter Signup */}
            <Row className="mt-5">
                <Col lg={8} className="mx-auto">
                    <Card className="newsletter-card text-center">
                        <Card.Body className="p-4">
                            <h4 className="text-success mb-3">
                                <i className="bi bi-envelope-heart me-2"></i>
                                ¡Suscríbete a nuestro Newsletter!
                            </h4>
                            <p className="mb-4">
                                Recibe las mejores ofertas, consejos de cultivo y novedades directamente en tu email.
                            </p>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    type="email"
                                    placeholder="tu@email.com"
                                    size="lg"
                                />
                                <Button variant="success" size="lg">
                                    <i className="bi bi-send me-2"></i>
                                    Suscribirse
                                </Button>
                            </InputGroup>
                            <small className="text-muted">
                                🎁 Al suscribirte recibes un 10% OFF en tu primera compra
                            </small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Blog;