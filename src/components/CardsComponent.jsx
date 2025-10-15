import React, { useState } from 'react'
import '../assets/style/productos/producto-styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { productos } from '../data/productos'

function CardsComponent({ onAddToCart }) {
    const [quantities, setQuantities] = useState({});

    const handleQuantityChange = (codigo, value) => {
        const numValue = parseInt(value) || 0;
        setQuantities(prev => ({
            ...prev,
            [codigo]: numValue > 0 ? numValue : 1
        }));
    };

    const handleAddToCart = (producto) => {
        const quantity = quantities[producto.codigo] || 1;
        onAddToCart(producto, quantity);
    };

    // Group products by category
    const categorias = {
        "Frutas Frescas": productos.filter(p => p.categoria === "Frutas Frescas"),
        "Verduras": productos.filter(p => p.categoria === "Verduras"),
        "Productos Orgánicos": productos.filter(p => p.categoria === "Productos Orgánicos"),
        "Productos Lácteos": productos.filter(p => p.categoria === "Productos Lácteos")
    };

    const descripcionesCategorias = {
        "Frutas Frescas": "Nuestra selección de frutas frescas ofrece una experiencia directa del campo a tu hogar. Estas frutas se cultivan y cosechan en el punto óptimo de madurez para asegurar su sabor y frescura. Disfruta de una variedad de frutas de temporada que aportan vitaminas y nutrientes esenciales a tu dieta diaria. Perfectas para consumir solas, en ensaladas o como ingrediente principal en postres y smoothies.",
        "Verduras": "Nuestra selección de verduras frescas ofrece una experiencia directa del campo a tu hogar. Estas verduras se cultivan y cosechan en el punto óptimo para asegurar su sabor y frescura. Disfruta de una variedad de verduras de temporada que aportan vitaminas y nutrientes esenciales a tu dieta diaria. Perfectas para consumir en ensaladas o como ingrediente principal en diversos platillos.",
        "Productos Orgánicos": "Nuestros productos orgánicos están elaborados con ingredientes naturales y procesados de manera responsable para mantener sus beneficios saludables. Desde aceites y miel hasta granos y semillas, ofrecemos una selección que apoya un estilo de vida saludable y respetuoso con el medio ambiente.",
        "Productos Lácteos": "Los productos lácteos de HuertoHogar provienen de granjas locales que se dedican a la producción responsable y de calidad. Ofrecemos una gama de leches, yogures y otros derivados que conservan su frescura y sabor auténtico. Ricos en calcio y nutrientes esenciales, nuestros lácteos son perfectos para complementar una dieta equilibrada, proporcionando el mejor sabor y nutrición para toda la familia."
    };

    return (

        <div className="container my-5">
            {Object.entries(categorias).map(([categoria, productosCategoria]) => (
                <section className="category-section" key={categoria}>
                    <div className="card">
                        <h2 className="category-title">{categoria}</h2>
                        <p className="category-description">
                            {descripcionesCategorias[categoria]}
                        </p>
                    </div>
                    <div className="row g-4">
                        {productosCategoria.map((producto) => (
                            <div className="col-lg-4 col-md-6" key={producto.codigo}>
                                <div className="card product-card">
                                    <div className="position-relative">
                                        <img src={producto.imagen} className="card-img-top" alt={producto.nombre} />
                                        <span className="product-code">{producto.codigo}</span>
                                        <span className="stock-badge">{producto.stock} {producto.unidad} disponibles</span>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="product-title">{producto.nombre}</h5>
                                        <div className="product-price">${producto.precio.toLocaleString('es-CL')} CLP/{producto.unidad}</div>
                                        <p className="product-stock"> En stock - {producto.stock} {producto.unidad}</p>
                                        <p className="product-description">
                                            {producto.descripcion}
                                        </p>
                                        <div className="input-group mb-2">
                                            <span className="input-group-text">Cantidad</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                min="1"
                                                max={producto.stock}
                                                value={quantities[producto.codigo] || 1}
                                                onChange={(e) => handleQuantityChange(producto.codigo, e.target.value)}
                                            />
                                            <span className="input-group-text">{producto.unidad}</span>
                                        </div>
                                        <button
                                            className="btn btn-success btn-add-cart"
                                            onClick={() => handleAddToCart(producto)}
                                        >
                                            <i className="bi bi-cart-plus me-2"></i>
                                            Agregar al Carrito
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    )
}

export default CardsComponent