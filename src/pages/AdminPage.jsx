import React, { useState } from 'react';
import { Container, Row, Col, Tab, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AdminProductos from '../components/admin/AdminProductos';
import AdminUsuarios from '../components/admin/AdminUsuarios';
import '../assets/style/admin/admin-styles.css'
import logotipo from '../assets/images/principal/LogoTipo.png';

function AdminPage() {
    const [activeTab, setActiveTab] = useState('productos');

    return (
        <div className="admin-page">
            
            <Navbar expand="lg" className="admin-navbar">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img
                            src={logotipo}
                            alt="Huerto Hogar"
                            title="Huerto Hogar"
                            width={100}
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="admin-navbar-nav" />
                    <Navbar.Collapse id="admin-navbar-nav">
                        <Nav className="me-auto">
                            <Navbar.Text className="text-white fw-bold d-flex align-items-center">
                                Panel de Administración
                            </Navbar.Text>

                        </Nav>

                        <Nav>
                            <Nav.Link as={Link} to="/" className="text-white">
                                <i className="bi bi-arrow-left-circle me-2"></i>
                                Volver a la Tienda
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="mt-4">
                <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                    <Row>
                        <Col xs={12} className="admin-sidebar">
                            <Nav variant="pills" className="admin-nav">
                                <Nav.Item>
                                    <Nav.Link eventKey="productos" className="admin-nav-link">
                                        <i className="bi bi-box-seam"></i>
                                        <span>Productos</span>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="usuarios" className="admin-nav-link">
                                        <i className="bi bi-people"></i>
                                        <span>Usuarios</span>
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} className="admin-main">
                            <Tab.Content>
                                <Tab.Pane eventKey="productos">
                                    <AdminProductos />
                                </Tab.Pane>
                                <Tab.Pane eventKey="usuarios">
                                    <AdminUsuarios />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Container>
        </div>
    );
}

export default AdminPage;
