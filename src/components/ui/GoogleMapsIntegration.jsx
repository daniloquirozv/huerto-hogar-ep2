import React from 'react';
import { tiendas } from '../../data/tiendas';
import '../../assets/style/principal/principal-base-style.css';
import '../../assets/style/principal/principal-maps-style.css';

const GoogleMapsIntegration = ({ 
    selectedStore, 
    onStoreSelect, 
    width = "100%", 
    height = "350px",
    className = ""
}) => {
    // URL del mapa embebido (versión pública para visualización)
    const mapEmbedUrl = "https://www.google.com/maps/d/embed?mid=16NlqHEBeBW25AW-x576Unqn466E82QU";

    const handleStoreClick = (idx) => {
        if (onStoreSelect) {
            onStoreSelect(idx);
        }
    };

    const openInGoogleMaps = (tienda) => {
        // Abrir la tienda específica en Google Maps
        window.open(tienda.googleMapsUrl, '_blank');
    };

    const openFullMap = () => {
        // Abrir el mapa completo de Google My Maps
        window.open('https://www.google.com/maps/d/viewer?mid=16NlqHEBeBW25AW-x576Unqn466E82QU&usp=sharing', '_blank');
    };

    return (
        <div className={`google-maps-container ${className}`} style={{ width, height }}>
            {/* Header del mapa */}
            <div className="maps-header">
                <div className="maps-title">
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    <span>Ubicaciones HuertoHogar</span>
                </div>
                <button 
                    className="btn-fullscreen"
                    onClick={openFullMap}
                    title="Ver mapa completo"
                >
                    <i className="bi bi-arrows-fullscreen"></i>
                </button>
            </div>

            {/* Contenedor principal */}
            <div className="maps-content">
                {/* Mapa embebido */}
                <div className="maps-embed-container">
                    <iframe
                        src={mapEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0, borderRadius: '12px' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Mapa de Tiendas HuertoHogar"
                    ></iframe>
                    
                    {/* Overlay con información de tienda seleccionada */}
                    {selectedStore !== null && (
                        <div className="store-info-overlay">
                            <div className="store-info-card">
                                <div className="store-info-header">
                                    <h6>
                                        <i className="bi bi-shop text-success me-2"></i>
                                        {tiendas[selectedStore].nombre}
                                    </h6>
                                    <button 
                                        className="btn-close-info"
                                        onClick={() => onStoreSelect(null)}
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                </div>
                                <div className="store-info-body">
                                    <p className="store-address">
                                        <i className="bi bi-geo-alt me-2 text-primary"></i>
                                        {tiendas[selectedStore].direccion}
                                    </p>
                                    <p className="store-phone">
                                        <i className="bi bi-telephone me-2 text-success"></i>
                                        {tiendas[selectedStore].telefono}
                                    </p>
                                    <div className="store-actions">
                                        <button 
                                            className="btn-directions"
                                            onClick={() => openInGoogleMaps(tiendas[selectedStore])}
                                        >
                                            <i className="bi bi-navigation me-2"></i>
                                            Cómo llegar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Lista de tiendas lateral */}
                <div className="stores-sidebar">
                    <div className="sidebar-header">
                        <i className="bi bi-list-ul me-2"></i>
                        <span>Nuestras Tiendas</span>
                    </div>
                    <div className="stores-list">
                        {tiendas.map((tienda, idx) => (
                            <div
                                key={tienda.nombre}
                                className={`store-item ${selectedStore === idx ? 'selected' : ''}`}
                                onClick={() => handleStoreClick(idx)}
                            >
                                <div className="store-marker">
                                    <i className="bi bi-geo-alt-fill"></i>
                                </div>
                                <div className="store-details">
                                    <div className="store-name">{tienda.nombre}</div>
                                    <div className="store-address-short">{tienda.direccion}</div>
                                    <div className="store-phone-short">{tienda.telefono}</div>
                                </div>
                                <div className="store-actions-sidebar">
                                    <button 
                                        className="btn-maps-small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openInGoogleMaps(tienda);
                                        }}
                                        title="Abrir en Google Maps"
                                    >
                                        <i className="bi bi-box-arrow-up-right"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer del mapa */}
            <div className="maps-footer">
                <div className="maps-legend">
                    <div className="legend-item">
                        <div className="legend-dot selected"></div>
                        <span>Tienda seleccionada</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-dot available"></div>
                        <span>Tiendas disponibles</span>
                    </div>
                </div>
                <div className="maps-powered">
                    <span>Powered by Google Maps</span>
                </div>
            </div>
        </div>
    );
};

export default GoogleMapsIntegration;