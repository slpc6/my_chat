import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, TextField, Button, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import { usuarioService } from '../../service/usuarioService';
import { chatService } from '../../service/chatService';
import { useNavigate } from 'react-router-dom';

interface MensajeChat {
  usuario: string;
  mensaje: string;
  timestamp: string;
}

interface UsuarioConectado {
  nombre: string;
  email: string;
  conectado: boolean;
}

const Main: React.FC = () => {
  const [mensajes, setMensajes] = useState<MensajeChat[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioConectado[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Obtener usuario actual del localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const username = user?.nombre || user?.email || 'Anónimo';

  // Cargar mensajes
  const fetchMensajes = async () => {
    setLoading(true);
    try {
      const msgs = await chatService.getMensajesChat();
      setMensajes(msgs);
    } catch (e) {
      // Manejo de error
    }
    setLoading(false);
  };

  // Cargar usuarios conectados
  const fetchUsuarios = async () => {
    try {
      const usrs = await usuarioService.getUsuariosConectados();
      setUsuarios(usrs);
    } catch (e) {
      // Manejo de error
    }
  };

  useEffect(() => {
    fetchMensajes();
    fetchUsuarios();
  }, []);

  // Scroll automático al final
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensajes]);

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim()) return;
    setEnviando(true);
    const nuevoMensaje: MensajeChat = {
      usuario: username,
      mensaje,
      timestamp: new Date().toISOString(),
    };
    try {
      await chatService.enviarMensajeChat(nuevoMensaje);
      setMensaje('');
      await fetchMensajes(); // Recarga mensajes después de enviar
    } catch (e) {
      // Manejo de error
    }
    setEnviando(false);
  };

  const handleLogout = async () => {
    try {
      await usuarioService.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      await fetchUsuarios();
      navigate('/login');
    } catch (e) {
      // Manejo de error
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Chat principal */}
      <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Typography variant="h4" gutterBottom>Chat General</Typography>
        <Paper ref={chatRef} sx={{ flex: 1, overflowY: 'auto', mb: 2, p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 2 }}>
          {loading ? <CircularProgress /> : (
            mensajes.length === 0 ? <Typography color="text.secondary">No hay mensajes aún.</Typography> :
              mensajes.map((msg, idx) => (
                <Box key={idx} sx={{ mb: 1, display: 'flex', flexDirection: 'column', alignItems: msg.usuario === username ? 'flex-end' : 'flex-start' }}>
                  <Paper sx={{ p: 1.5, bgcolor: msg.usuario === username ? '#e3f2fd' : '#f7f7fa', borderRadius: 2, minWidth: 180 }}>
                    <Typography variant="subtitle2" color="primary">{msg.usuario}</Typography>
                    <Typography variant="body1">{msg.mensaje}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ float: 'right' }}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                  </Paper>
                </Box>
              ))
          )}
        </Paper>
        <Box component="form" onSubmit={handleEnviar} sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Escribe un mensaje..."
            value={mensaje}
            onChange={e => setMensaje(e.target.value)}
            disabled={enviando}
            autoFocus
          />
          <Button type="submit" variant="contained" disabled={enviando || !mensaje.trim()}>Enviar</Button>
        </Box>
      </Box>
      {/* Usuarios conectados */}
      <Box sx={{ flex: 1, bgcolor: '#fff', p: 2, borderLeft: '1px solid #eee', display: 'flex', flexDirection: 'column', minWidth: 220 }}>
        <Typography variant="h6" gutterBottom>Usuarios conectados</Typography>
        <Divider sx={{ mb: 1 }} />
        <Button variant="outlined" color="secondary" onClick={handleLogout} sx={{ mb: 2 }}>
          Cerrar sesión
        </Button>
        <List>
          {usuarios.length === 0 ? <ListItem><ListItemText primary="Sin usuarios" /></ListItem> :
            usuarios.map((u, idx) => (
              <ListItem key={idx} sx={{ color: u.conectado ? 'green' : 'gray' }}>
                <ListItemText primary={u.nombre || u.email} secondary={u.conectado ? 'Conectado' : 'Desconectado'} />
              </ListItem>
            ))}
        </List>
      </Box>
    </Box>
  );
};

export default Main;
