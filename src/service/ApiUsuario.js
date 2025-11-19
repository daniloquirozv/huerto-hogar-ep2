import axios from "axios";


const API_BASE_URL ='/api/v1/usuario';

export const guardarUsuario = async(usuarioData)=> {
    try{
        const response = await axios.post(`${API_BASE_URL}/guardar`, usuarioData);
        return response.data;
    } catch(error){
        throw error;
    }
};


export const obtenerUsuarios = async() => {
    try {
        const response = await axios.get(`${API_BASE_URL}/listar`);
        return response.data;
    } catch(error) {
        throw error;
    }
};

export const actualizarUsuario = async(id,usuarioData)=>{
    try{
        const response = await axios.put(`${API_BASE_URL}/${id}/actualizar`, usuarioData);
        return response.data;
    } catch(error){
        throw error;
    }
};

export const eliminarUsuario = async(id)=> {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${id}/eliminar`);
        return response.data;
    }catch (error){
        throw error;
    }
}