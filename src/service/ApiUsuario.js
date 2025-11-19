import axios from "axios";

//url para la api usuario
const API_BASE_URL ='/api/v1/usuario';

export const guardarUsuario = async(usuarioData)=> {
    try{
        const response = await axios.post(`${API_BASE_URL}/guardar`, usuarioData);
        return response.data;
    } catch(error){
        throw error;
    }
};
