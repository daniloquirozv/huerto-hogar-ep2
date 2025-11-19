import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col, Alert, Badge, Spinner } from 'react-bootstrap';
import { guardarUsuario, obtenerUsuarios ,actualizarUsuario,eliminarUsuario} from '../../service/ApiUsuario';

function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUsuario, setCurrentUsuario] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        region: '',
        contrasena: '',
        contrasena2: '',
        rol: { id_rol: 2 },
        estado: true
    });

    const regiones = [
        'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo',
        'Valparaíso', 'Región Metropolitana', "O'Higgins", 'Maule', 'Ñuble',
        'Biobío', 'Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes'
    ];

    const roles = [
        { id: 1, nombre: 'Administrador' },
        { id: 2, nombre: 'Cliente' }
    ];

    // Cargar usuarios al montar el componente 
    useEffect(() => {
        cargarUsuarios();
    }, []);

    // cargar usuarios desde la api
    const cargarUsuarios = async () => {
        setLoading(true);
        try {
            const data = await obtenerUsuarios();
            setUsuarios(data);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            showAlert('Error al cargar usuarios', 'danger');
        } finally {
            setLoading(false);
        }
    };
// mostrar alerta temporal
    const showAlert = (message, variant = 'success') => {
        setAlert({ show: true, message, variant });
        setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
    };

// abrir el modal para crear o editar
    const handleShowModal = (usuario = null) => {
        if (usuario) {
            setIsEditing(true);
            setCurrentUsuario(usuario);
            setFormData({
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo,
                region: usuario.region,
                contrasena: '',
                contrasena2: '',
                rol: { id_rol: usuario.rol?.id_rol || 2 },
                estado: usuario.estado
            });
        } else {
            setIsEditing(false);
            setCurrentUsuario(null);
            setFormData({
                nombre: '',
                apellido: '',
                correo: '',
                region: '',
                contrasena: '',
                contrasena2: '',
                rol: { id_rol: 2 },
                estado: true
            });
        }
        setShowModal(true);
    };
// cerrar modal
    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setCurrentUsuario(null);
    };
    //manejar cambios en los imputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'rol') {
            setFormData(prev => ({
                ...prev,
                rol: { id_rol: parseInt(value) }
            }));
        } else if (name === 'estado') {
            setFormData(prev => ({
                ...prev,
                estado: value === 'true'
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!isEditing && formData.contrasena !== formData.contrasena2) {
            showAlert('Las contraseñas no coinciden', 'danger');
            return;
        }

        if (!isEditing && formData.contrasena.length < 6) {
            showAlert('La contraseña debe tener al menos 6 caracteres', 'danger');
            return;
        }

        setLoading(true);
        try {
            if (isEditing) {
                // Actualizar usuario existente
                const usuarioData = {
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    correo: formData.correo,
                    region: formData.region,
                    estado: formData.estado,
                    rol: { id_rol: formData.rol.id_rol }
                };

                // Solo incluir contraseña si se ingresó una nueva
                if (formData.contrasena && formData.contrasena.trim() !== '') {
                    if (formData.contrasena !== formData.contrasena2) {
                        showAlert('Las contraseñas no coinciden', 'danger');
                        setLoading(false);
                        return;
                    }
                    usuarioData.contrasena = formData.contrasena;
                }

                await actualizarUsuario(currentUsuario.id_usuario, usuarioData);
                showAlert('Usuario actualizado exitosamente', 'success');
                await cargarUsuarios();
            } else {
                const usuarioData = {
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    correo: formData.correo,
                    region: formData.region,
                    contrasena: formData.contrasena,
                    fecha_registro: new Date().toISOString().split('T')[0],
                    estado: formData.estado,
                    rol: { id_rol: formData.rol.id_rol }
                };

                await guardarUsuario(usuarioData);
                showAlert('Usuario creado exitosamente', 'success');
                await cargarUsuarios(); // Recargar la lista
            }
            handleCloseModal();
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            if (error.response?.data?.message) {
                showAlert(`Error: ${error.response.data.message}`, 'danger');
            } else {
                showAlert('Error al guardar usuario', 'danger');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
            setLoading(true);
            try {
                await eliminarUsuario(id);
                showAlert('Usuario eliminado exitosamente', 'warning');
                await cargarUsuarios();
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
                showAlert('Error al eliminar usuario', 'danger');
            } finally {
                setLoading(false);
            }
        }
    };

    const toggleEstado = async (usuario) => {
        setLoading(true);
        try {
            const usuarioActualizado = {
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo,
                region: usuario.region,
                estado: !usuario.estado,
                rol: { id_rol: usuario.rol?.id_rol || 2 }
            };
            
            await actualizarUsuario(usuario.id_usuario, usuarioActualizado);
            showAlert(`Usuario ${!usuario.estado ? 'activado' : 'desactivado'} exitosamente`, 'info');
            await cargarUsuarios();
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            showAlert('Error al cambiar estado del usuario', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsuarios = usuarios.filter(usuario =>
        usuario.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.correo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalActivos = usuarios.filter(u => u.estado === true).length;
    const totalAdmins = usuarios.filter(u => u.rol?.id_rol === 1).length;

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
                        disabled={loading}
                    >
                        <i className="bi bi-person-plus"></i> Agregar Usuario
                    </Button>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre, apellido o correo..."
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
                    <Badge bg="danger" className="stats-badge">
                        Admins: {totalAdmins}
                    </Badge>
                </Col>
            </Row>

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Cargando usuarios...</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <Table striped hover className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Correo</th>
                                <th>Región</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Fecha Registro</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsuarios.map(usuario => (
                                <tr key={usuario.id_usuario}>
                                    <td><strong>#{usuario.id_usuario}</strong></td>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.apellido}</td>
                                    <td>{usuario.correo}</td>
                                    <td>{usuario.region}</td>
                                    <td>
                                        <Badge bg={usuario.rol?.id_rol === 1 ? 'danger' : 'success'}>
                                            {usuario.rol?.id_rol === 1 ? 'Administrador' : 'Cliente'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Badge
                                            bg={usuario.estado ? 'success' : 'secondary'}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => toggleEstado(usuario)}
                                        >
                                            {usuario.estado ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </td>
                                    <td>{usuario.fecha_registro}</td>
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
                                            onClick={() => handleDelete(usuario.id_usuario)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            {/* Modal para crear/editar */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Apellido *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Correo *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleInputChange}
                                        disabled={isEditing}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Región *</Form.Label>
                                    <Form.Select
                                        name="region"
                                        value={formData.region}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Seleccione región</option>
                                        {regiones.map(region => (
                                            <option key={region} value={region}>{region}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        {!isEditing && (
                            <>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Contraseña *</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="contrasena"
                                                value={formData.contrasena}
                                                onChange={handleInputChange}
                                                required
                                                minLength={6}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Confirmar Contraseña *</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="contrasena2"
                                                value={formData.contrasena2}
                                                onChange={handleInputChange}
                                                required
                                                minLength={6}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </>
                        )}

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Rol *</Form.Label>
                                    <Form.Select
                                        name="rol"
                                        value={formData.rol.id_rol}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {roles.map(rol => (
                                            <option key={rol.id} value={rol.id}>{rol.nombre}</option>
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
                                        <option value={true}>Activo</option>
                                        <option value={false}>Inactivo</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancelar
                            </Button>
                            <Button variant="success" type="submit" disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : (isEditing ? 'Actualizar' : 'Crear')}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default AdminUsuarios;