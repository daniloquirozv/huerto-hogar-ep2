import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col, Alert, Badge } from 'react-bootstrap';
import { productos as productosIniciales } from '../../data/productos';

function AdminProductos() {
    const [productos, setProductos] = useState(productosIniciales);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProducto, setCurrentProducto] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceOrder, setPriceOrder] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const [modalAlert, setModalAlert] = useState({ show: false, message: '', variant: '' });

    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        precio: '',
        unidad: '',
        stock: '',
        categoria: '',
        descripcion: ''
    });

    const categorias = [
        'Frutas Frescas',
        'Verduras',
        'Productos Orgánicos',
        'Productos Lácteos'
    ];

    const unidades = ['kg', 'bolsa', 'frasco 500g', 'paquete 500g', 'botella 1L'];

    // Función para obtener color ecológico según categoría
    const getCategoriaColor = (categoria) => {
        const coloresEcologicos = {
            'Frutas Frescas': '#FF6B6B',      // Rojo suave (fresas, manzanas)
            'Verduras': '#51CF66',             // Verde brillante (lechuga, espinaca)
            'Productos Orgánicos': '#8B4513',  // Marrón tierra
            'Productos Lácteos': '#74C0FC'     // Azul claro (leche)
        };
        return coloresEcologicos[categoria] || '#2E8B57';
    };

    const showAlert = (message, variant = 'success') => {
        setAlert({ show: true, message, variant });
        setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
    };

    const showModalAlert = (message, variant = 'danger') => {
        setModalAlert({ show: true, message, variant });
        setTimeout(() => setModalAlert({ show: false, message: '', variant: '' }), 5000);
    };

    const handleShowModal = (producto = null) => {
        // Limpiar alerta del modal al abrir
        setModalAlert({ show: false, message: '', variant: '' });

        if (producto) {
            setIsEditing(true);
            setCurrentProducto(producto);
            setFormData({
                codigo: producto.codigo,
                nombre: producto.nombre,
                precio: producto.precio,
                unidad: producto.unidad,
                stock: producto.stock,
                categoria: producto.categoria,
                descripcion: producto.descripcion

            });
        } else {
            setIsEditing(false);
            setCurrentProducto(null);
            setFormData({
                codigo: '',
                nombre: '',
                precio: '',
                unidad: 'kg',
                stock: '',
                categoria: categorias[0],
                descripcion: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setCurrentProducto(null);
        setModalAlert({ show: false, message: '', variant: '' });
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
            const updatedProductos = productos.map(p =>
                p.codigo === currentProducto.codigo
                    ? { ...formData, precio: parseFloat(formData.precio), stock: parseInt(formData.stock) }
                    : p
            );
            setProductos(updatedProductos);
            showAlert('Producto actualizado exitosamente', 'success');
            handleCloseModal();
        } else {
            const codigoExiste = productos.some(p => p.codigo === formData.codigo);
            if (codigoExiste) {
                showModalAlert('⚠️ El código del producto ya existe. Por favor, ingresa un código único.', 'danger');
                return;
            }
            const nuevoProducto = {
                ...formData,
                precio: parseFloat(formData.precio),
                stock: parseInt(formData.stock)
            };
            setProductos([...productos, nuevoProducto]);
            showAlert('Producto agregado exitosamente', 'success');
            handleCloseModal();
        }
    };

    const handleDelete = (codigo) => {
        if (window.confirm('¿Está seguro de eliminar este producto?')) {
            setProductos(productos.filter(p => p.codigo !== codigo));
            showAlert('Producto eliminado exitosamente', 'warning');
        }
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setPriceOrder('');
        setStockFilter('');
    };

    // Filtrado avanzado de productos
    const filteredProductos = (() => {
        let filtered = productos;

        // Filtro por término de búsqueda
        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(producto =>
                producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtro por categoría
        if (selectedCategory) {
            filtered = filtered.filter(producto => producto.categoria === selectedCategory);
        }

        // Filtro por stock
        if (stockFilter === 'bajo') {
            filtered = filtered.filter(producto => producto.stock < 50);
        } else if (stockFilter === 'alto') {
            filtered = filtered.filter(producto => producto.stock >= 50);
        }

        // Ordenar por precio
        if (priceOrder === 'asc') {
            filtered = [...filtered].sort((a, b) => a.precio - b.precio);
        } else if (priceOrder === 'desc') {
            filtered = [...filtered].sort((a, b) => b.precio - a.precio);
        }

        return filtered;
    })();

    return (
        <div className="admin-productos">
            {alert.show && (
                <Alert variant={alert.variant} dismissible onClose={() => setAlert({ show: false })}>
                    {alert.message}
                </Alert>
            )}

            <Row className="mb-4">
                <Col md={8}>
                    <h2 className="section-title">
                        <i className="bi bi-box-seam"></i> Gestión de Productos
                    </h2>
                </Col>
                <Col md={4} className="text-end">
                    <Button
                        variant="success"
                        onClick={() => handleShowModal()}
                        className="btn-admin-add"
                    >
                        <i className="bi bi-plus-circle"></i> Agregar Producto
                    </Button>
                </Col>
            </Row>

            {/* Barra de búsqueda y filtros */}
            <Row className="mb-3">
                <Col md={12}>
                    <Form.Control
                        type="text"
                        placeholder="🔍 Buscar por nombre, código o categoría..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input mb-3"
                        size="lg"
                    />
                </Col>
            </Row>

            <Row className="mb-3 align-items-end">
                <Col md={3}>
                    <Form.Group>
                        <Form.Label className="fw-bold text-muted">
                            <i className="bi bi-funnel"></i> Categoría
                        </Form.Label>
                        <Form.Select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Todas las categorías</option>
                            {categorias.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label className="fw-bold text-muted">
                            <i className="bi bi-sort-numeric-down"></i> Precio
                        </Form.Label>
                        <Form.Select
                            value={priceOrder}
                            onChange={(e) => setPriceOrder(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Sin ordenar</option>
                            <option value="asc">Menor a Mayor</option>
                            <option value="desc">Mayor a Menor</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label className="fw-bold text-muted">
                            <i className="bi bi-box"></i> Stock
                        </Form.Label>
                        <Form.Select
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Todos los niveles</option>
                            <option value="bajo">Stock Bajo (&lt; 50)</option>
                            <option value="alto">Stock Alto (≥ 50)</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    {(searchTerm || selectedCategory || priceOrder || stockFilter) && (
                        <Button
                            variant="outline-secondary"
                            onClick={handleClearFilters}
                            className="w-100"
                        >
                            <i className="bi bi-x-circle"></i> Limpiar Filtros
                        </Button>
                    )}
                </Col>
            </Row>

            <Row className="mb-3">
                <Col className="text-end">
                    <Badge bg="primary" className="stats-badge">
                        Mostrando: {filteredProductos.length} de {productos.length} productos
                    </Badge>
                </Col>
            </Row>

            <div className="table-responsive">
                <Table striped hover className="admin-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Unidad</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProductos.map(producto => (
                            <tr key={producto.codigo}>
                                <td><strong>{producto.codigo}</strong></td>
                                <td>{producto.nombre}</td>
                                <td>
                                    <Badge
                                        style={{
                                            backgroundColor: getCategoriaColor(producto.categoria),
                                            color: 'white',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {producto.categoria}
                                    </Badge>
                                </td>
                                <td>${producto.precio.toLocaleString('es-CL')}</td>
                                <td>
                                    <Badge bg={producto.stock < 50 ? 'danger' : 'success'}>
                                        {producto.stock}
                                    </Badge>
                                </td>
                                <td>{producto.unidad}</td>
                                <td className="text-center">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleShowModal(producto)}
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDelete(producto.codigo)}
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
                        {isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalAlert.show && (
                        <Alert
                            variant={modalAlert.variant}
                            dismissible
                            onClose={() => setModalAlert({ show: false })}
                            className="mb-3"
                        >
                            <strong>{modalAlert.message}</strong>
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Código *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="codigo"
                                        value={formData.codigo}
                                        onChange={handleInputChange}
                                        disabled={isEditing}
                                        required
                                        placeholder="Ej: FR001"
                                        className={modalAlert.show && modalAlert.variant === 'danger' ? 'border-danger' : ''}
                                    />
                                    {!isEditing && (
                                        <Form.Text className="text-muted">
                                            El código debe ser único para cada producto
                                        </Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Nombre del producto"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Precio *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="precio"
                                        value={formData.precio}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Stock *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        placeholder="0"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Unidad *</Form.Label>
                                    <Form.Select
                                        name="unidad"
                                        value={formData.unidad}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {unidades.map(unidad => (
                                            <option key={unidad} value={unidad}>
                                                {unidad}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Categoría *</Form.Label>
                            <Form.Select
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleInputChange}
                                required
                            >
                                {categorias.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Descripción *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                                required
                                placeholder="Descripción del producto..."
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>URL de la imagen</Form.Label>
                            <Form.Control
                                type="text"
                                name="imagen"
                                value={formData.imagen}
                                onChange={handleInputChange}
                                placeholder="URL de la imagen del producto"
                            />
                        </Form.Group>

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

export default AdminProductos;
