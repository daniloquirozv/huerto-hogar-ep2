import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateCoupon, calculateDiscount, getAllCoupons, getActiveCoupons } from '../../src/utils/discountUtils';

describe('discountUtils', () => {
    describe('validateCoupon', () => {
        it('debería rechazar códigos vacíos', () => {
            const result = validateCoupon('');
            expect(result.valid).toBe(false);
            expect(result.message).toContain('Por favor ingresa un código');
        });

        it('debería rechazar códigos que no existen', () => {
            const result = validateCoupon('CODIGOFALSO');
            expect(result.valid).toBe(false);
            expect(result.message).toContain('no válido');
        });

        it('debería aceptar código válido VERDURAS30', () => {
            const result = validateCoupon('VERDURAS30');
            expect(result.valid).toBe(true);
            expect(result.coupon).toBeDefined();
            expect(result.coupon.descuento).toBe(30);
        });

        it('debería aceptar código en minúsculas', () => {
            const result = validateCoupon('verduras30');
            expect(result.valid).toBe(true);
            expect(result.coupon.descuento).toBe(30);
        });

        it('debería aceptar código con espacios', () => {
            const result = validateCoupon('  VERDURAS30  ');
            expect(result.valid).toBe(true);
            expect(result.coupon.descuento).toBe(30);
        });

        it('debería validar código FLASH50', () => {
            const result = validateCoupon('FLASH50');
            expect(result.valid).toBe(true);
            expect(result.coupon.descuento).toBe(50);
        });

        it('debería validar código OTOÑO20', () => {
            const result = validateCoupon('OTOÑO20');
            // Este código puede estar vencido dependiendo de la fecha actual
            if (result.valid) {
                expect(result.coupon.descuento).toBe(20);
            }
        });

        it('debería validar código REMATE30', () => {
            const result = validateCoupon('REMATE30');
            expect(result.valid).toBe(true);
            expect(result.coupon.descuento).toBe(70);
        });
    });

    describe('calculateDiscount', () => {
        it('debería calcular correctamente un descuento del 30%', () => {
            const result = calculateDiscount(10000, 30);
            expect(result.subtotal).toBe(10000);
            expect(result.porcentajeDescuento).toBe(30);
            expect(result.montoDescuento).toBe(3000);
            expect(result.total).toBe(7000);
        });

        it('debería calcular correctamente un descuento del 50%', () => {
            const result = calculateDiscount(20000, 50);
            expect(result.subtotal).toBe(20000);
            expect(result.porcentajeDescuento).toBe(50);
            expect(result.montoDescuento).toBe(10000);
            expect(result.total).toBe(10000);
        });

        it('debería calcular correctamente un descuento del 70%', () => {
            const result = calculateDiscount(15000, 70);
            expect(result.subtotal).toBe(15000);
            expect(result.porcentajeDescuento).toBe(70);
            expect(result.montoDescuento).toBe(10500);
            expect(result.total).toBe(4500);
        });

        it('debería calcular con descuento 0%', () => {
            const result = calculateDiscount(5000, 0);
            expect(result.montoDescuento).toBe(0);
            expect(result.total).toBe(5000);
        });

        it('debería redondear correctamente los montos', () => {
            const result = calculateDiscount(9999, 33);
            expect(result.montoDescuento).toBe(3300);
            expect(result.total).toBe(6699);
        });
    });

    describe('getAllCoupons', () => {
        it('debería retornar una lista de cupones', () => {
            const coupons = getAllCoupons();
            expect(Array.isArray(coupons)).toBe(true);
            expect(coupons.length).toBeGreaterThan(0);
        });

        it('todos los cupones deberían tener propiedades requeridas', () => {
            const coupons = getAllCoupons();
            coupons.forEach(coupon => {
                expect(coupon).toHaveProperty('codigo');
                expect(coupon).toHaveProperty('descuento');
                expect(coupon).toHaveProperty('fechaVencimiento');
                expect(coupon).toHaveProperty('titulo');
                expect(coupon).toHaveProperty('categoria');
            });
        });
    });

    describe('getActiveCoupons', () => {
        it('debería retornar solo cupones vigentes', () => {
            const activeCoupons = getActiveCoupons();
            expect(Array.isArray(activeCoupons)).toBe(true);
            
            // Verificar que las fechas de vencimiento no hayan pasado
            const today = new Date();
            activeCoupons.forEach(coupon => {
                const expirationDate = new Date(coupon.fechaVencimiento + 'T23:59:59');
                expect(expirationDate >= today).toBe(true);
            });
        });

        it('debería ordenar por descuento descendente', () => {
            const activeCoupons = getActiveCoupons();
            for (let i = 0; i < activeCoupons.length - 1; i++) {
                expect(activeCoupons[i].descuento).toBeGreaterThanOrEqual(activeCoupons[i + 1].descuento);
            }
        });

        it('todos los cupones activos deberían tener propiedades requeridas', () => {
            const coupons = getActiveCoupons();
            coupons.forEach(coupon => {
                expect(coupon).toHaveProperty('codigo');
                expect(coupon).toHaveProperty('descuento');
                expect(coupon).toHaveProperty('fechaVencimiento');
                expect(coupon).toHaveProperty('urgente');
            });
        });
    });
});
