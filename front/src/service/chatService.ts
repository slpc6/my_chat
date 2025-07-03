import api from './api';


export const chatService = {

    getMensajesChat: async () => {
        const response = await api.get('/chat/');
        return response.data;
    },

    enviarMensajeChat: async (mensaje: { usuario: string; mensaje: string; timestamp: string }) => {
        const response = await api.post('/chat/', mensaje);
        return response.data;
    }
}
