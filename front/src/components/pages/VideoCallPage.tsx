import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Box,
  Container,
  Paper,
  Typography,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  Send,
  Wifi,
  WifiOff,
  Error as ErrorIcon
} from '@mui/icons-material';

interface ChatMessage {
  userName: string;
  message: string;
  timestamp: string;
}

interface User {
  socketId: string;
  userName: string;
}

interface VideoCallPageProps {
  userName: string;
  onLeave: () => void;
}

// Detectar URL del servidor automáticamente
const getSocketURL = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  
  // Si estamos en localhost, usar localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  
  // Si estamos en otro dispositivo, usar la IP del servidor actual
  // El usuario deberá configurar esto o usar la IP de su máquina
  const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}:3001`;
};

const SOCKET_URL = getSocketURL();

export default function VideoCallPage({ userName }: VideoCallPageProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Inicializar socket y conexiones
  useEffect(() => {
    // Función para crear conexión peer (dentro del useEffect para usar socketRef)
    const createPeerConnection = (socketId: string): RTCPeerConnection => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      // Agregar stream local
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      // Manejar ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit('ice-candidate', {
            target: socketId,
            candidate: event.candidate
          });
        }
      };

      // Manejar stream remoto
      pc.ontrack = (event) => {
        const remoteVideo = remoteVideosRef.current.get(socketId);
        if (remoteVideo && event.streams[0]) {
          remoteVideo.srcObject = event.streams[0];
        }
      };

      return pc;
    };

    // Inicializar cámara y micrófono
    const initMedia = async () => {
      // Verificar si getUserMedia está disponible
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const errorMsg = 'Tu navegador no soporta acceso a cámara/micrófono. ' +
          (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost'
            ? 'Intenta acceder usando HTTPS o desde localhost.'
            : 'Por favor, usa un navegador moderno.');
        setMediaError(errorMsg);
        console.error('getUserMedia no está disponible:', {
          mediaDevices: !!navigator.mediaDevices,
          getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
          protocol: window.location.protocol,
          hostname: window.location.hostname
        });
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setMediaError(null);
      } catch (error: any) {
        let errorMsg = '';
        if (error.name === 'NotAllowedError') {
          errorMsg = 'Permisos de cámara/micrófono denegados. Por favor, permite el acceso en la configuración del navegador.';
        } else if (error.name === 'NotFoundError') {
          errorMsg = 'No se encontró cámara o micrófono.';
        } else if (error.name === 'NotReadableError') {
          errorMsg = 'No se puede acceder a la cámara/micrófono. Puede estar siendo usado por otra aplicación.';
        } else if (error.name === 'OverconstrainedError') {
          errorMsg = 'Las restricciones de video/audio no se pueden cumplir.';
        } else if (error.name === 'SecurityError') {
          errorMsg = 'Error de seguridad. Asegúrate de estar usando HTTPS o localhost.';
        } else {
          errorMsg = `Error accediendo a medios: ${error.message || error.name || 'Error desconocido'}`;
        }
        setMediaError(errorMsg);
        console.error('Error accediendo a medios:', error);
      }
    };

    initMedia();

    console.log('Conectando a:', SOCKET_URL);
    setConnectionStatus('connecting');
    setConnectionError(null);

    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket conectado:', newSocket.id);
      setConnectionStatus('connected');
      setConnectionError(null);
      newSocket.emit('join', userName);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket desconectado:', reason);
      setConnectionStatus('disconnected');
      if (reason === 'io server disconnect') {
        setConnectionError('Servidor desconectó la conexión');
      } else if (reason === 'io client disconnect') {
        setConnectionError('Conexión cerrada por el cliente');
      } else {
        setConnectionError('Conexión perdida. Intentando reconectar...');
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
      setConnectionStatus('error');
      setConnectionError(`No se pudo conectar al servidor: ${error.message}. Verifica que el servidor esté corriendo en ${SOCKET_URL}`);
    });

    // Lista de usuarios conectados
    newSocket.on('users-list', (users: User[]) => {
      setConnectedUsers(users.filter(u => u.socketId !== newSocket.id));
      
      // Crear conexiones peer con usuarios existentes
      users.forEach(async (user) => {
        if (user.socketId !== newSocket.id && !peerConnectionsRef.current.has(user.socketId)) {
          const pc = createPeerConnection(user.socketId);
          peerConnectionsRef.current.set(user.socketId, pc);

          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            newSocket.emit('offer', {
              target: user.socketId,
              offer
            });
          } catch (error) {
            console.error('Error creando offer:', error);
          }
        }
      });
    });

    // Usuario nuevo se unió
    newSocket.on('user-joined', async ({ socketId }: { socketId: string }) => {
      // Evitar crear conexión duplicada
      if (peerConnectionsRef.current.has(socketId)) {
        return;
      }

      const pc = createPeerConnection(socketId);
      peerConnectionsRef.current.set(socketId, pc);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      newSocket.emit('offer', {
        target: socketId,
        offer
      });
    });

    // Recibir offer
    newSocket.on('offer', async ({ offer, sender }: { offer: RTCSessionDescriptionInit; sender: string }) => {
      let pc = peerConnectionsRef.current.get(sender);
      if (!pc) {
        pc = createPeerConnection(sender);
        peerConnectionsRef.current.set(sender, pc);
      }

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      newSocket.emit('answer', {
        target: sender,
        answer
      });
    });

    // Recibir answer
    newSocket.on('answer', async ({ answer, sender }: { answer: RTCSessionDescriptionInit; sender: string }) => {
      const pc = peerConnectionsRef.current.get(sender);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    // Recibir ICE candidate
    newSocket.on('ice-candidate', async ({ candidate, sender }: { candidate: RTCIceCandidateInit; sender: string }) => {
      const pc = peerConnectionsRef.current.get(sender);
      if (pc && candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    // Usuario se desconectó
    newSocket.on('user-left', ({ socketId }: { socketId: string }) => {
      const pc = peerConnectionsRef.current.get(socketId);
      if (pc) {
        pc.close();
        peerConnectionsRef.current.delete(socketId);
      }
      remoteVideosRef.current.delete(socketId);
      setConnectedUsers(prev => prev.filter(u => u.socketId !== socketId));
    });

    // Mensajes de chat
    newSocket.on('chat-message', (message: ChatMessage) => {
      setChatMessages(prev => [...prev, message]);
    });

    return () => {
      newSocket.close();
      socketRef.current = null;
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      peerConnectionsRef.current.forEach(pc => pc.close());
      peerConnectionsRef.current.clear();
    };
  }, [userName]);

  // Scroll automático en chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Toggle cámara
  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isCameraOn;
        setIsCameraOn(!isCameraOn);
      }
    }
  };

  // Toggle micrófono
  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
        setIsMicOn(!isMicOn);
      }
    }
  };

  // Enviar mensaje
  const sendMessage = () => {
    if (messageInput.trim() && socket) {
      socket.emit('chat-message', messageInput.trim());
      setMessageInput('');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Indicadores de estado */}
      {connectionError && (
        <Alert severity="error" sx={{ mb: 2 }} icon={<ErrorIcon />}>
          {connectionError}
        </Alert>
      )}
      {mediaError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {mediaError}
        </Alert>
      )}
      {connectionStatus === 'connecting' && (
        <Alert severity="info" sx={{ mb: 2 }} icon={<CircularProgress size={20} />}>
          Conectando al servidor...
        </Alert>
      )}
      {connectionStatus === 'connected' && (
        <Alert severity="success" sx={{ mb: 2 }} icon={<Wifi />}>
          Conectado al servidor
        </Alert>
      )}
      {connectionStatus === 'disconnected' && (
        <Alert severity="warning" sx={{ mb: 2 }} icon={<WifiOff />}>
          Desconectado. Intentando reconectar...
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 32px)', flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Área de video */}
        <Box sx={{ flex: { xs: '1 1 auto', md: '0 0 66.666%' }, display: 'flex', flexDirection: 'column' }}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Videollamada - {userName}
            </Typography>
            
            <Box sx={{ flexGrow: 1, display: 'flex', flexWrap: 'wrap', gap: 2, overflow: 'auto' }}>
              {/* Video local */}
              <Box sx={{ position: 'relative', minWidth: 300, flex: '1 1 300px' }}>
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    backgroundColor: '#000'
                  }}
                />
                <Chip
                  label={userName}
                  color="primary"
                  size="small"
                  sx={{ position: 'absolute', bottom: 8, left: 8 }}
                />
              </Box>

              {/* Videos remotos */}
              {connectedUsers.map((user) => (
                <Box
                  key={user.socketId}
                  sx={{ position: 'relative', minWidth: 300, flex: '1 1 300px' }}
                >
                  <video
                    ref={(el) => {
                      if (el) remoteVideosRef.current.set(user.socketId, el);
                    }}
                    autoPlay
                    playsInline
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      backgroundColor: '#000'
                    }}
                  />
                  <Chip
                    label={user.userName}
                    color="secondary"
                    size="small"
                    sx={{ position: 'absolute', bottom: 8, left: 8 }}
                  />
                </Box>
              ))}
            </Box>

            {/* Controles */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
              <IconButton
                color={isCameraOn ? 'primary' : 'error'}
                onClick={toggleCamera}
                size="large"
              >
                {isCameraOn ? <Videocam /> : <VideocamOff />}
              </IconButton>
              <IconButton
                color={isMicOn ? 'primary' : 'error'}
                onClick={toggleMic}
                size="large"
              >
                {isMicOn ? <Mic /> : <MicOff />}
              </IconButton>
            </Box>
          </Paper>
        </Box>

        {/* Área de chat */}
        <Box sx={{ flex: { xs: '1 1 auto', md: '0 0 33.333%' }, display: 'flex', flexDirection: 'column' }}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Chat
            </Typography>
            
            <List sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
              {chatMessages.map((msg, idx) => (
                <ListItem key={idx} alignItems="flex-start">
                  <Avatar sx={{ mr: 1, bgcolor: msg.userName === userName ? 'primary.main' : 'secondary.main' }}>
                    {msg.userName[0].toUpperCase()}
                  </Avatar>
                  <ListItemText
                    primary={msg.userName}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          {msg.message}
                        </Typography>
                        <Typography component="span" variant="caption" display="block" color="text.secondary">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
              <div ref={chatEndRef} />
            </List>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Escribe un mensaje..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
              />
              <IconButton color="primary" onClick={sendMessage}>
                <Send />
              </IconButton>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

