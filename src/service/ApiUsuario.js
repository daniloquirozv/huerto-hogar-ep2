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

export const loginUsuario = async(correo, contrasena) =>{
    try{
        const response = await usuariosApi.post('/login',{correo,contrasena});
            return response.data;
        }catch(error){
            throw error;
        }

};

