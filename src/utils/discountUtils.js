/**
 * Utilidades para gestionar cupones de descuento del blog
 */

import { blogPosts } from '../data/blogPosts';

/**
 * Obtiene todos los cupones disponibles del blog
 * @returns {Array} Lista de cupones con su información
 */
export const getAllCoupons = () => {
    return blogPosts
        .filter(post => post.codigoCupon && post.descuento && post.fechaVencimiento)
        .map(post => ({
            codigo: post.codigoCupon,
            descuento: post.descuento,
            fechaVencimiento: post.fechaVencimiento,
            titulo: post.titulo,
            categoria: post.categoria
        }));
};

/**
 * Valida si un cupón existe y está vigente
 * @param {string} codigoCupon - Código del cupón a validar
 * @returns {Object} Objeto con información de validación
 */
export const validateCoupon = (codigoCupon) => {
    if (!codigoCupon || codigoCupon.trim() === '') {
        return {
            valid: false,
            message: 'Por favor ingresa un código de cupón',
            coupon: null
        };
    }

    // Normalizar el código (mayúsculas y sin espacios)
    const normalizedCode = codigoCupon.trim().toUpperCase();

    // Buscar el cupón en los posts del blog
    const blogPost = blogPosts.find(
        post => post.codigoCupon && post.codigoCupon.toUpperCase() === normalizedCode
    );

    if (!blogPost) {
        return {
            valid: false,
            message: 'Código de cupón no válido',
            coupon: null
        };
    }

    // Verificar fecha de vencimiento
    const fechaActual = new Date();
    const fechaVencimiento = new Date(blogPost.fechaVencimiento + 'T23:59:59');

    if (fechaActual > fechaVencimiento) {
        return {
            valid: false,
            message: `Este cupón expiró el ${formatDate(blogPost.fechaVencimiento)}`,
            coupon: null
        };
    }

    // Cupón válido
    return {
        valid: true,
        message: `¡Cupón aplicado! ${blogPost.descuento}% de descuento`,
        coupon: {
            codigo: blogPost.codigoCupon,
            descuento: blogPost.descuento,
            fechaVencimiento: blogPost.fechaVencimiento,
            titulo: blogPost.titulo
        }
    };
};

/**
 * Calcula el descuento aplicado
 * @param {number} subtotal - Subtotal antes del descuento
 * @param {number} porcentajeDescuento - Porcentaje de descuento a aplicar
 * @returns {Object} Objeto con información del descuento
 */
export const calculateDiscount = (subtotal, porcentajeDescuento) => {
    const montoDescuento = Math.round((subtotal * porcentajeDescuento) / 100);
    const total = subtotal - montoDescuento;

    return {
        subtotal,
        porcentajeDescuento,
        montoDescuento,
        total
    };
};

/**
 * Formatea una fecha en formato dd/mm/yyyy
 * @param {string} fechaStr - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada
 */
const formatDate = (fechaStr) => {
    const fecha = new Date(fechaStr + 'T00:00:00');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
};

/**
 * Obtiene cupones vigentes
 * @returns {Array} Lista de cupones vigentes
 */
export const getActiveCoupons = () => {
    const fechaActual = new Date();
    
    return blogPosts
        .filter(post => {
            if (!post.codigoCupon || !post.fechaVencimiento) return false;
            const fechaVencimiento = new Date(post.fechaVencimiento + 'T23:59:59');
            return fechaActual <= fechaVencimiento;
        })
        .map(post => ({
            codigo: post.codigoCupon,
            descuento: post.descuento,
            fechaVencimiento: post.fechaVencimiento,
            titulo: post.titulo,
            categoria: post.categoria,
            urgente: post.urgente || false
        }))
        .sort((a, b) => b.descuento - a.descuento); // Ordenar por descuento descendente
};
