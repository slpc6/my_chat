# MyChat - Documentación

## Introducción
MyChat es una plataforma de chat en tiempo real que permite a los usuarios comunicarse, ver quién está conectado y mantener un historial de mensajes. El sistema está construido con un frontend en React y un backend en FastAPI, usando MongoDB como base de datos.

## Estructura del Proyecto
- **/front**: Aplicación React (TypeScript) con Material UI.
- **/api**: Backend FastAPI, modelos, routers y lógica de negocio.
- **/doc**: Documentación paginada del proyecto.

## Tecnologías principales
- **Frontend**: React, TypeScript, Material UI
- **Backend**: FastAPI, Python, Pydantic
- **Base de datos**: MongoDB

## Funcionalidades
- Registro y autenticación de usuarios
- Chat general con historial persistente
- Visualización de usuarios conectados
- Logout y gestión de sesiones

## Primeros pasos
1. Instala las dependencias en `/front` y `/api`.
2. Configura las variables de entorno para la conexión a MongoDB y el backend.
3. Ejecuta el backend (`uvicorn api.src.main:app --reload`)
4. Ejecuta el frontend (`npm run dev` en `/front`)

## Navegación de la documentación
- [main.md](main.md): Introducción y guía general (este archivo)
- (Crea más archivos en `/doc` para detallar endpoints, modelos, arquitectura, etc.)

---

¿Tienes dudas? Consulta los siguientes archivos en `/doc` para más detalles sobre cada parte del sistema.
