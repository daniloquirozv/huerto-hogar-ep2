/**
 * Utilidades para gestión de carritos por usuario en localStorage
 * 
 * Cada usuario tiene su propio carrito independiente que persiste
 * incluso después de cerrar sesión.
 */

const CART_PREFIX = 'huertoHogarCart_';
const GUEST_CART_KEY = 'huertoHogarCart'; // Carrito para usuarios no autenticados

/**
 * Obtener ID único del usuario
 * @param {Object} user - Usuario actual
 * @returns {string} - ID único o 'guest'
 */
function getUserId(user) {
    if (!user) return 'guest';
    return user.id || user.id_usuario || user.email || user.correo || 'guest';
}

/**
 * Obtener clave de localStorage para el carrito del usuario
 * @param {Object} user - Usuario actual
 * @returns {string} - Clave de localStorage
 */
function getCartKey(user) {
    if (!user) return GUEST_CART_KEY;
    const userId = getUserId(user);
    return userId === 'guest' ? GUEST_CART_KEY : `${CART_PREFIX}${userId}`;
}

/**
 * Obtener carrito del usuario actual
 * @param {Object} user - Usuario actual
 * @returns {Array} - Items del carrito
 */
export function getCartForUser(user) {
    try {
        const cartKey = getCartKey(user);
        const savedCart = localStorage.getItem(cartKey);
        
        if (savedCart) {
            const cart = JSON.parse(savedCart);
            console.log(`🛒 Carrito cargado para: ${getUserId(user)}, Items: ${cart.length}`);
            return cart;
        }
        
        return [];
    } catch (error) {
        console.error('Error al cargar carrito del usuario:', error);
        return [];
    }
}

/**
 * Guardar carrito del usuario actual
 * @param {Object} user - Usuario actual
 * @param {Array} cartItems - Items del carrito
 */
export function saveCartForUser(user, cartItems) {
    try {
        const cartKey = getCartKey(user);
        localStorage.setItem(cartKey, JSON.stringify(cartItems));
        console.log(`💾 Carrito guardado para: ${getUserId(user)}, Items: ${cartItems.length}`);
    } catch (error) {
        console.error('Error al guardar carrito del usuario:', error);
    }
}

/**
 * Limpiar carrito del usuario actual
 * @param {Object} user - Usuario actual
 */
export function clearCartForUser(user) {
    try {
        const cartKey = getCartKey(user);
        localStorage.removeItem(cartKey);
        console.log(`🗑️ Carrito eliminado para: ${getUserId(user)}`);
    } catch (error) {
        console.error('Error al limpiar carrito del usuario:', error);
    }
}

/**
 * Migrar carrito de invitado a usuario autenticado
 * Cuando un usuario inicia sesión, sus items de invitado se combinan con su carrito personal
 * @param {Object} user - Usuario recién autenticado
 * @returns {Array} - Carrito combinado
 */
export function migrateGuestCartToUser(user) {
    if (!user) return [];

    try {
        // Obtener carrito de invitado
        const guestCart = getCartForUser(null);
        
        // Obtener carrito del usuario
        const userCart = getCartForUser(user);
        
        if (guestCart.length === 0) {
            console.log('📦 No hay items de invitado para migrar');
            return userCart;
        }

        console.log(`🔄 Migrando ${guestCart.length} items de invitado a usuario: ${getUserId(user)}`);
        
        // Combinar carritos (evitar duplicados)
        const combinedCart = [...userCart];
        
        guestCart.forEach(guestItem => {
            const existingIndex = combinedCart.findIndex(
                item => item.codigo === guestItem.codigo
            );
            
            if (existingIndex !== -1) {
                // Si el producto ya existe, sumar las cantidades
                combinedCart[existingIndex].quantity += guestItem.quantity;
                console.log(`  ➕ Sumando cantidad de: ${guestItem.nombre || guestItem.codigo}`);
            } else {
                // Si es nuevo, agregarlo
                combinedCart.push(guestItem);
                console.log(`  ➕ Agregando: ${guestItem.nombre || guestItem.codigo}`);
            }
        });

        // Guardar carrito combinado
        saveCartForUser(user, combinedCart);
        
        // Limpiar carrito de invitado
        clearCartForUser(null);
        
        console.log(`✅ Migración completada. Total items: ${combinedCart.length}`);
        return combinedCart;
        
    } catch (error) {
        console.error('Error al migrar carrito de invitado:', error);
        return getCartForUser(user);
    }
}

/**
 * Obtener todos los carritos guardados (para debugging)
 * @returns {Object} - Objeto con todos los carritos
 */
export function getAllCarts() {
    const allCarts = {};
    
    try {
        // Iterar sobre todas las claves de localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            
            // Si es un carrito
            if (key === GUEST_CART_KEY || key.startsWith(CART_PREFIX)) {
                const cartData = localStorage.getItem(key);
                if (cartData) {
                    const cart = JSON.parse(cartData);
                    const userName = key === GUEST_CART_KEY ? 'Invitado' : key.replace(CART_PREFIX, '');
                    allCarts[userName] = {
                        items: cart,
                        cantidad: cart.length,
                        total: cart.reduce((sum, item) => sum + (item.quantity || 0), 0)
                    };
                }
            }
        }
        
        console.table(allCarts);
        return allCarts;
    } catch (error) {
        console.error('Error al obtener todos los carritos:', error);
        return {};
    }
}

/**
 * Limpiar todos los carritos (para debugging/mantenimiento)
 */
export function clearAllCarts() {
    try {
        const keysToRemove = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key === GUEST_CART_KEY || key.startsWith(CART_PREFIX)) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        console.log(`🗑️ Se eliminaron ${keysToRemove.length} carritos`);
    } catch (error) {
        console.error('Error al limpiar todos los carritos:', error);
    }
}

/**
 * Exportar funciones para consola del navegador
 */
if (typeof window !== 'undefined') {
    window.debugCart = {
        verTodosLosCarritos: getAllCarts,
        limpiarTodos: clearAllCarts,
        verCarritoUsuario: (user) => getCartForUser(user),
        verCarritoInvitado: () => getCartForUser(null)
    };
    
    console.log('🛒 Debug Carrito cargado. Usa window.debugCart para debugging');
}
