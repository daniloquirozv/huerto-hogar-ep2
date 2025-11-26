/**
 * EJEMPLOS DE USO - Sistema de Validación de Token y Rol
 * 
 * Este archivo contiene ejemplos de cómo implementar validaciones
 * de autenticación y rol de administrador en diferentes escenarios.
 */

// ============================================
// EJEMPLO 1: Validar en un Componente
// ============================================

import React from 'react';
import { isAdmin, hasValidSession, getUser } from '../utils/authUtils';

function MiComponente() {
    const usuario = getUser();
    const esAdmin = isAdmin(usuario);
    const sesionValida = hasValidSession();

    return (
        <div>
            {sesionValida && (
                <h2>Bienvenido, {usuario.name}</h2>
            )}
            
            {esAdmin && sesionValida && (
                <button>Botón Solo Para Admins</button>
            )}
        </div>
    );
}

// ============================================
// EJEMPLO 2: Proteger una Función
// ============================================

import { esAdministrador, tienesSesionValida } from '../service/ApiUsuario';

async function eliminarUsuario(id) {
    // Validar permisos antes de ejecutar acción crítica
    if (!esAdministrador() || !tienesSesionValida()) {
        console.error('⚠️ Acción no permitida: Requiere permisos de administrador');
        alert('No tienes permisos para realizar esta acción');
        return;
    }

    try {
        // Ejecutar acción administrativa
        const resultado = await usuariosApi.delete(`/api/v1/usuario/${id}/eliminar`);
        console.log('✅ Usuario eliminado:', resultado);
    } catch (error) {
        console.error('❌ Error al eliminar usuario:', error);
    }
}

// ============================================
// EJEMPLO 3: Validar en useEffect
// ============================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdminFromStorage, hasValidSession } from '../utils/authUtils';

function PaginaAdministrativa() {
    const navigate = useNavigate();
    const [puedeAcceder, setPuedeAcceder] = useState(false);

    useEffect(() => {
        // Validar acceso al cargar el componente
        const esAdmin = isAdminFromStorage();
        const sesionValida = hasValidSession();

        if (!esAdmin || !sesionValida) {
            console.warn('⚠️ Acceso denegado - Redirigiendo...');
            navigate('/');
            return;
        }

        setPuedeAcceder(true);
    }, [navigate]);

    if (!puedeAcceder) {
        return <div>Validando permisos...</div>;
    }

    return (
        <div>
            <h1>Panel Administrativo</h1>
            {/* Contenido solo para admins */}
        </div>
    );
}

// ============================================
// EJEMPLO 4: Menú Condicional
// ============================================

function MenuUsuario({ usuario }) {
    const esAdmin = isAdmin(usuario);
    const sesionValida = hasValidSession();

    return (
        <nav>
            <ul>
                <li>Inicio</li>
                <li>Productos</li>
                
                {sesionValida && (
                    <>
                        <li>Mi Perfil</li>
                        <li>Mis Pedidos</li>
                    </>
                )}

                {esAdmin && sesionValida && (
                    <>
                        <li>Panel Admin</li>
                        <li>Gestión Usuarios</li>
                        <li>Gestión Productos</li>
                    </>
                )}
            </ul>
        </nav>
    );
}

// ============================================
// EJEMPLO 5: Petición HTTP con Token Automático
// ============================================

import { usuariosApi } from '../service/api';

async function obtenerDatosAdministrativos() {
    try {
        // El token se agrega automáticamente por el interceptor
        const response = await usuariosApi.get('/api/v1/usuario/admin/estadisticas');
        console.log('📊 Estadísticas:', response.data);
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            console.error('🔒 Token inválido o expirado');
            // Limpiar sesión y redirigir
            localStorage.removeItem('huertoHogarUser');
            window.location.href = '/';
        }
        throw error;
    }
}

// ============================================
// EJEMPLO 6: Hook Personalizado
// ============================================

import { useState, useEffect } from 'react';
import { getUser, isAdmin, hasValidSession } from '../utils/authUtils';

function useAuth() {
    const [auth, setAuth] = useState({
        usuario: null,
        esAdmin: false,
        sesionValida: false,
        cargando: true
    });

    useEffect(() => {
        const usuario = getUser();
        const esAdmin = isAdmin(usuario);
        const sesionValida = hasValidSession();

        setAuth({
            usuario,
            esAdmin,
            sesionValida,
            cargando: false
        });
    }, []);

    return auth;
}

// Uso del hook
function ComponenteConHook() {
    const { usuario, esAdmin, sesionValida, cargando } = useAuth();

    if (cargando) return <div>Cargando...</div>;

    return (
        <div>
            <p>Usuario: {usuario?.name || 'Invitado'}</p>
            {esAdmin && <p>✅ Eres administrador</p>}
            {!sesionValida && <p>⚠️ Por favor, inicia sesión</p>}
        </div>
    );
}

// ============================================
// EJEMPLO 7: Validar Antes de Enviar Formulario
// ============================================

function FormularioAdministrativo() {
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar permisos
        if (!esAdministrador()) {
            alert('⚠️ No tienes permisos de administrador');
            return;
        }

        if (!tienesSesionValida()) {
            alert('⚠️ Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            return;
        }

        // Continuar con el envío
        try {
            const formData = new FormData(e.target);
            await usuariosApi.post('/api/v1/usuario/admin/accion', formData);
            alert('✅ Acción completada exitosamente');
        } catch (error) {
            console.error('❌ Error:', error);
            alert('Error al procesar la acción');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Campos del formulario */}
            <button type="submit">Ejecutar Acción Administrativa</button>
        </form>
    );
}

// ============================================
// EJEMPLO 8: Debugging en Consola
// ============================================

/**
 * Para debugging rápido, puedes usar window.debugAuth en la consola:
 * 
 * window.debugAuth.verUsuario()        // Ver toda la info del usuario
 * window.debugAuth.esAdmin()           // Verificar si es admin
 * window.debugAuth.obtenerToken()      // Ver el token
 * window.debugAuth.sesionValida()      // Verificar sesión
 * window.debugAuth.limpiarSesion()     // Hacer logout
 */

// ============================================
// EJEMPLO 9: Renderizado Condicional Avanzado
// ============================================

function ComponenteCondicional() {
    const usuario = getUser();
    const esAdmin = isAdmin(usuario);

    // Diferentes vistas según el rol
    const renderizarVista = () => {
        if (!usuario) {
            return <VistaInvitado />;
        }

        if (esAdmin) {
            return <VistaAdministrador usuario={usuario} />;
        }

        return <VistaCliente usuario={usuario} />;
    };

    return (
        <div className="container">
            {renderizarVista()}
        </div>
    );
}

// ============================================
// EJEMPLO 10: Middleware de Navegación
// ============================================

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RutasProtegidasMiddleware() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const rutasProtegidas = ['/admin', '/usuarios/editar', '/productos/eliminar'];
        
        if (rutasProtegidas.some(ruta => location.pathname.startsWith(ruta))) {
            if (!esAdministrador() || !tienesSesionValida()) {
                console.warn(`⚠️ Acceso denegado a: ${location.pathname}`);
                navigate('/', { replace: true });
            }
        }
    }, [location, navigate]);

    return null; // Este componente solo valida, no renderiza nada
}

export {
    MiComponente,
    eliminarUsuario,
    PaginaAdministrativa,
    MenuUsuario,
    obtenerDatosAdministrativos,
    useAuth,
    ComponenteConHook,
    FormularioAdministrativo,
    ComponenteCondicional,
    RutasProtegidasMiddleware
};
