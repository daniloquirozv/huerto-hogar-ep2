import { usuariosApi } from './api';


// Ya no necesitamos definir API_BASE_URL aquí, usamos la instancia configurada de api.js

export const guardarUsuario = async(usuarioData)=> {
    try{
        const response = await usuariosApi.post('/guardar', usuarioData);
        return response.data;
    } catch(error){
        throw error;
    }
};


export const obtenerUsuarios = async() => {
    try {
        const response = await usuariosApi.get('/listar');
        return response.data;
    } catch(error) {
        throw error;
    }
};

export const actualizarUsuario = async(id,usuarioData)=>{
    try{
        const response = await usuariosApi.put(`/${id}/actualizar`, usuarioData);
        return response.data;
    } catch(error){
        throw error;
    }
};

export const eliminarUsuario = async(id)=> {
    try {
        const response = await usuariosApi.delete(`/${id}/eliminar`);
        return response.data;
    }catch (error){
        throw error;
    }
};

//CAMBIOS LOGIN
export const loginUsuario = async(correo, contrasena) =>{
    try{
        const response = await usuariosApi.post('/login',{correo,contrasena});
        const datosRespuesta = response.data;

        console.log('📥 Respuesta del backend:', datosRespuesta);

        // Importar función de decodificación JWT
        const { decodeJWT, extractUserFromToken, debugToken } = await import('../utils/jwtUtils');
        
        let usuarioCompleto;

        // CASO 1: Backend solo devuelve token (como string)
        if (typeof datosRespuesta === 'string') {
            console.log('🔐 Backend devolvió solo token, decodificando...');
            const userInfo = extractUserFromToken(datosRespuesta);
            
            if (!userInfo) {
                throw new Error('No se pudo decodificar el token');
            }

            usuarioCompleto = {
                ...userInfo,
                token: datosRespuesta
            };
        }
        // CASO 2: Backend devuelve objeto con token
        else if (datosRespuesta.token && typeof datosRespuesta.token === 'string') {
            console.log('🔐 Backend devolvió objeto con token, decodificando...');
            const userInfo = extractUserFromToken(datosRespuesta.token);
            
            // Combinar datos del token con datos del objeto (prioridad al token)
            usuarioCompleto = {
                ...datosRespuesta,
                ...userInfo,
                token: datosRespuesta.token
            };
        }
        // CASO 3: Backend devuelve usuario completo sin token
        else {
            console.log('✅ Backend devolvió usuario completo');
            usuarioCompleto = datosRespuesta;
        }

        // Validar que tengamos la estructura mínima necesaria
        if (!usuarioCompleto.id && !usuarioCompleto.id_usuario) {
            console.error('❌ No se pudo obtener ID de usuario');
        }

        // Guardar usuario completo en localStorage
        localStorage.setItem('huertoHogarUser', JSON.stringify(usuarioCompleto));
        
        // Log para debugging
        console.log('✅ Usuario autenticado:', {
            id: usuarioCompleto.id || usuarioCompleto.id_usuario,
            nombre: usuarioCompleto.name || usuarioCompleto.nombre || 'Sin nombre',
            email: usuarioCompleto.email || usuarioCompleto.correo || 'Sin email',
            rol: usuarioCompleto.rol?.nombre_rol || 'Sin rol',
            id_rol: usuarioCompleto.rol?.id_rol,
            tieneToken: !!usuarioCompleto.token
        });

        // Debug del token si existe
        if (usuarioCompleto.token) {
            debugToken(usuarioCompleto.token);
        }
        
        return usuarioCompleto;
    }catch(error){
        console.error('❌ Error en login:', error);
        throw error;
    }
};

/**
 * Verificar si el usuario actual es administrador
 * Valida tanto desde el objeto usuario como del token JWT
 * @returns {boolean}
 */
export const esAdministrador = () => {
    try {
        const userData = localStorage.getItem('huertoHogarUser');
        if (!userData) return false;
        
        const usuario = JSON.parse(userData);
        
        // Verificar en el objeto usuario
        if (usuario?.rol?.id_rol === 1) {
            return true;
        }

        // Si tiene token, validar también desde el token
        if (usuario?.token) {
            import('../utils/jwtUtils').then(({ extractUserFromToken }) => {
                const tokenUser = extractUserFromToken(usuario.token);
                return tokenUser?.rol?.id_rol === 1;
            });
        }
        
        return false;
    } catch (error) {
        console.error('Error al verificar rol de administrador:', error);
        return false;
    }
};

/**
 * Obtener el token del usuario actual
 * @returns {string|null}
 */
export const obtenerToken = () => {
    try {
        const userData = localStorage.getItem('huertoHogarUser');
        if (!userData) return null;
        
        const usuario = JSON.parse(userData);
        return usuario?.token || null;
    } catch (error) {
        console.error('Error al obtener token:', error);
        return null;
    }
};

/**
 * Verificar si el usuario tiene una sesión válida
 * @returns {boolean}
 */
export const tienesSesionValida = () => {
    try {
        const userData = localStorage.getItem('huertoHogarUser');
        if (!userData) return false;
        
        const usuario = JSON.parse(userData);
        // Verificar que tenga datos básicos
        return !!(usuario && (usuario.id || usuario.id_usuario));
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        return false;
    }
};

