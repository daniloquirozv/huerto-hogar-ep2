import React, { useState } from 'react';
import { Table, Button, Modal, Form, Row, Col, Alert, Badge } from 'react-bootstrap';

function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState([
        {
            id: 1,
            nombre: 'Juan Pérez',
            email: 'juan.perez@email.com',
            rol: 'Cliente',
            estado: 'Activo',
            fechaRegistro: '2024-01-15'
        },
        {
            id: 2,
            nombre: 'María González',
            email: 'maria.gonzalez@email.com',
            rol: 'Cliente',
            estado: 'Activo',
            fechaRegistro: '2024-02-20'
        },
        {
            id: 3,
            nombre: 'Carlos Rodríguez',
            email: 'carlos.rodriguez@email.com',
            rol: 'Administrador',
            estado: 'Activo',
            fechaRegistro: '2023-12-10'
        },
        {
            id: 4,
            nombre: 'Ana Martínez',
            email: 'ana.martinez@email.com',
            rol: 'Cliente',
            estado: 'Inactivo',
            fechaRegistro: '2024-03-05'
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUsuario, setCurrentUsuario] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        rol: 'Cliente',
        estado: 'Activo',
        password: ''
    });

    const roles = ['Cliente', 'Administrador'];
    const estados = ['Activo', 'Inactivo'];

    // Función para obtener color según rol
    const getRolColor = (rol) => {
        const coloresRol = {
            'Cliente': '#51CF66',        // Verde natural (usuario común)
            'Administrador': '#DC143C'   // Rojo carmesí (autoridad y poder)
        };
        return coloresRol[rol] || '#2E8B57';
    };

    const showAlert = (message, variant = 'success') => {
        setAlert({ show: true, message, variant });
        setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
    };

    const handleShowModal = (usuario = null) => {
        if (usuario) {
            setIsEditing(true);
            setCurrentUsuario(usuario);
            setFormData({
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                estado: usuario.estado,
                password: ''
            });
        } else {
            setIsEditing(false);
            setCurrentUsuario(null);
            setFormData({
                nombre: '',
                email: '',
                rol: 'Cliente',
                estado: 'Activo',
                password: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setCurrentUsuario(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            const updatedUsuarios = usuarios.map(u =>
                u.id === currentUsuario.id
                    ? { ...currentUsuario, ...formData }
                    : u
            );
            setUsuarios(updatedUsuarios);
            showAlert('Usuario actualizado exitosamente', 'success');
        } else {
            const emailExiste = usuarios.some(u => u.email === formData.email);
            if (emailExiste) {
                showAlert('El email ya está registrado', 'danger');
                return;
            }
            const nuevoUsuario = {
                id: Math.max(...usuarios.map(u => u.id)) + 1,
                ...formData,
                fechaRegistro: new Date().toISOString().split('T')[0]
            };
            setUsuarios([...usuarios, nuevoUsuario]);
            showAlert('Usuario agregado exitosamente', 'success');
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Está seguro de eliminar este usuario?')) {
            setUsuarios(usuarios.filter(u => u.id !== id));
            showAlert('Usuario eliminado exitosamente', 'warning');
        }
    };

    const toggleEstado = (id) => {
        const updatedUsuarios = usuarios.map(u =>
            u.id === id
                ? { ...u, estado: u.estado === 'Activo' ? 'Inactivo' : 'Activo' }
                : u
        );
        setUsuarios(updatedUsuarios);
        showAlert('Estado actualizado', 'info');
    };

    const filteredUsuarios = usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.rol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalActivos = usuarios.filter(u => u.estado === 'Activo').length;
    const totalAdmins = usuarios.filter(u => u.rol === 'Administrador').length;

    return (
        <div className="admin-usuarios">
            {alert.show && (
                <Alert variant={alert.variant} dismissible onClose={() => setAlert({ show: false })}>
                    {alert.message}
                </Alert>
            )}

            <Row className="mb-4">
                <Col md={8}>
                    <h2 className="section-title">
                        <i className="bi bi-people"></i> Gestión de Usuarios
                    </h2>
                </Col>
                <Col md={4} className="text-end">
                    <Button
                        variant="success"
                        onClick={() => handleShowModal()}
                        className="btn-admin-add"
                    >
                        <i className="bi bi-person-plus"></i> Agregar Usuario
                    </Button>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre, email o rol..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </Col>
                <Col md={6} className="text-end">
                    <Badge bg="primary" className="stats-badge me-2">
                        Total: {filteredUsuarios.length}
                    </Badge>
                    <Badge bg="success" className="stats-badge me-2">
                        Activos: {totalActivos}
                    </Badge>
                    <Badge
                        className="stats-badge"
                        style={{
                            backgroundColor: '#DC143C',
                            color: 'white'
                        }}
                    >
                        <i className="bi bi-shield-fill me-1"></i>
                        Admins: {totalAdmins}
                    </Badge>
                </Col>
            </Row>

            <div className="table-responsive">
                <Table striped hover className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Fecha Registro</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsuarios.map(usuario => (
                            <tr key={usuario.id}>
                                <td><strong>#{usuario.id}</strong></td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.email}</td>
                                <td>
                                    <Badge
                                        style={{
                                            backgroundColor: getRolColor(usuario.rol),
                                            color: 'white',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        {usuario.rol === 'Administrador' && <i className="bi bi-shield-fill me-1"></i>}
                                        {usuario.rol}
                                    </Badge>
                                </td>
                                <td>
                                    <Badge
                                        bg={usuario.estado === 'Activo' ? 'success' : 'secondary'}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => toggleEstado(usuario.id)}
                                    >
                                        {usuario.estado}
                                    </Badge>
                                </td>
                                <td>{usuario.fechaRegistro}</td>
                                <td className="text-center">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleShowModal(usuario)}
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDelete(usuario.id)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton className="modal-header-admin">
                    <Modal.Title>
                        {isEditing ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre completo *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Nombre completo del usuario"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={isEditing}
                                        required
                                        placeholder="correo@ejemplo.com"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {!isEditing && (
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Contraseña *</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required={!isEditing}
                                            placeholder="Contraseña"
                                            minLength={6}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        )}

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Rol *</Form.Label>
                                    <Form.Select
                                        name="rol"
                                        value={formData.rol}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {roles.map(rol => (
                                            <option key={rol} value={rol}>{rol}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Estado *</Form.Label>
                                    <Form.Select
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {estados.map(estado => (
                                            <option key={estado} value={estado}>{estado}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        {isEditing && (
                            <Alert variant="info">
                                <i className="bi bi-info-circle"></i> Deja la contraseña en blanco si no deseas cambiarla.
                            </Alert>
                        )}

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancelar
                            </Button>
                            <Button variant="success" type="submit">
                                {isEditing ? 'Actualizar' : 'Guardar'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default AdminUsuarios;
