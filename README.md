# MyChat - Chat y Videollamada Simplificado

Aplicación web simplificada para chat y videollamadas en tiempo real usando WebRTC y WebSockets.

## Características

- ✅ Ingreso simple con nombre de usuario
- ✅ Videollamada en tiempo real (WebRTC)
- ✅ Controles de cámara y micrófono
- ✅ Chat en tiempo real
- ✅ Sin persistencia (todo en memoria)
- ✅ Interfaz simple y fácil de usar

## Estructura del Proyecto

```
my_chat/
├── backend/          # Servidor Node.js con Socket.io
│   ├── server.js     # Servidor principal
│   └── package.json  # Dependencias del backend
├── front/            # Frontend React + Material-UI
│   └── src/
│       └── components/
│           └── pages/
│               ├── Home.tsx          # Componente principal
│               ├── JoinScreen.tsx    # Pantalla de entrada
│               └── VideoCallPage.tsx # Videollamada y chat
└── README.md
```

## Instalación y Uso

### Backend

```bash
cd backend
npm install
npm start
```

El servidor se ejecutará en `http://localhost:3001`

### Frontend

```bash
cd front
npm install
npm run dev
```

La aplicación se abrirá en `http://localhost:5173` (o el puerto que Vite asigne)

### Variables de Entorno (Opcional)

Crea un archivo `.env` en la carpeta `front` para cambiar la URL del servidor:

```
VITE_SOCKET_URL=http://localhost:3001
```

## Cómo Usar

1. Abre la aplicación en tu navegador
2. Ingresa tu nombre
3. Permite el acceso a cámara y micrófono cuando el navegador lo solicite
4. ¡Listo! Ya puedes chatear y hacer videollamadas con otros usuarios conectados

## Tecnologías Utilizadas

- **Backend**: Node.js, Express, Socket.io
- **Frontend**: React, TypeScript, Material-UI, Socket.io-client
- **WebRTC**: Para videollamadas peer-to-peer
- **WebSockets**: Para señalización y chat en tiempo real

## Notas

- No hay persistencia de datos (todo se pierde al recargar)
- Los usuarios se conectan automáticamente cuando ingresan
- La aplicación usa STUN servers públicos de Google para NAT traversal
- Para producción, considera agregar TURN servers para mejor compatibilidad
