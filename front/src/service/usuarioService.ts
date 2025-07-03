import api from './api';
import type { Usuario, UsuarioLogin } from '../types/usuarios';


export const usuarioService = {

    login: async (email: string, password: string): Promise<UsuarioLogin> => {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const response = await api.post<UsuarioLogin>('/usuario/login', formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
          return response.data;
    },

    register: async (usuario: Usuario) => {
        const response = await api.post('/usuario/registrar', usuario);
        return response.data;
    },

    getUsuariosConectados: async () => {
        const response = await api.get('/usuario/conectados');
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/usuario/logout');
        return response.data;
    }

}