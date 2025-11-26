import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAdmin, hasValidSession, getUser } from '../utils/authUtils';

/**
 * Componente para proteger rutas que requieren autenticación
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente hijo a renderizar si está autorizado
 * @param {boolean} props.requireAdmin - Si requiere rol de administrador
 * @param {string} props.redirectTo - Ruta a la que redirigir si no está autorizado
 */
export default function ProtectedRoute({ 
    children, 
    requireAdmin = false, 
    redirectTo = '/' 
}) {
    const user = getUser();
    const hasSession = hasValidSession();

    // Si no hay sesión válida, redirigir
    if (!hasSession) {
        console.warn('⚠️ Acceso denegado: No hay sesión válida');
        return <Navigate to={redirectTo} replace />;
    }

    // Si requiere admin y no es admin, redirigir
    if (requireAdmin && !isAdmin(user)) {
        console.warn('⚠️ Acceso denegado: Requiere permisos de administrador');
        return <Navigate to={redirectTo} replace />;
    }

    // Si pasa todas las validaciones, renderizar el componente
    return children;
}
