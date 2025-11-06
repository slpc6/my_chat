import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Almacenar usuarios conectados (sin persistencia)
const users = new Map();

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Usuario se une con su nombre
  socket.on('join', (userName) => {
    users.set(socket.id, { userName, socketId: socket.id });
    socket.userName = userName;
    
    // Notificar a otros usuarios
    socket.broadcast.emit('user-joined', {
      socketId: socket.id,
      userName
    });

    // Enviar lista de usuarios conectados al nuevo usuario
    const connectedUsers = Array.from(users.values()).map(u => ({
      socketId: u.socketId,
      userName: u.userName
    }));
    socket.emit('users-list', connectedUsers);
  });

  // Señalización WebRTC
  socket.on('offer', (data) => {
    socket.to(data.target).emit('offer', {
      offer: data.offer,
      sender: socket.id,
      senderName: socket.userName
    });
  });

  socket.on('answer', (data) => {
    socket.to(data.target).emit('answer', {
      answer: data.answer,
      sender: socket.id
    });
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.target).emit('ice-candidate', {
      candidate: data.candidate,
      sender: socket.id
    });
  });

  // Chat
  socket.on('chat-message', (message) => {
    io.emit('chat-message', {
      userName: socket.userName,
      message,
      timestamp: new Date().toISOString()
    });
  });

  // Usuario desconectado
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
    const userName = users.get(socket.id)?.userName;
    users.delete(socket.id);
    
    socket.broadcast.emit('user-left', {
      socketId: socket.id,
      userName
    });
  });
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0'; // Escuchar en todas las interfaces

httpServer.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
  console.log(`Accesible desde la red local en: http://TU_IP_LOCAL:${PORT}`);
});

