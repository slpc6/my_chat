"""Modulo para la gestion de usuarios"""

#Librerias externas
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
import os

#Librerias internas
from models.usuario import Usuario, Token, UsuarioConectado
from data.mongodb import MongoDBClientSingleton
from utils.data_enum import DatabaseEnum, CollectionEnum


router = APIRouter(prefix="/usuario", 
                   tags=["usuario"])
OA2 = OAuth2PasswordBearer(tokenUrl="/usuario/login")
MONGO = MongoDBClientSingleton()
DATA = MONGO.get_collection(DatabaseEnum.MYCHAT, CollectionEnum.USUARIOS)
CHAT_DATA = MONGO.get_collection(DatabaseEnum.MYCHAT, CollectionEnum.CHATS)
USERS_ONLINE = MONGO.get_collection(DatabaseEnum.MYCHAT, CollectionEnum.ONLINE)
SECRET_KEY = os.getenv("SECRET_KEY", "default_secret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")


@router.post(path="/registrar")
def registrar(usuario: Usuario) -> JSONResponse:
    """Metodo para crear un usuario nuevo
    
    Args:
    - Usuario: Datos del usuario que se esta registrando
    
    Returns:
    - JSONResponse: Respuesta de la API
    
    """
    try:
        
        if DATA.find_one({"email": str(usuario.model_dump()["email"])}):
            return JSONResponse(status_code=400, content={"msg": "Ya existe un usuario con ese correo"})
        
        usuario_dict = usuario.model_dump()
        hashed_password = bcrypt.hashpw(usuario_dict["password"].encode('utf-8'), bcrypt.gensalt())
        usuario_dict["password"] = hashed_password.decode('utf-8')
        DATA.insert_one(usuario_dict)
        return JSONResponse(status_code=201, content={"msg": "Usuario registrado correctamente"})
    
    except Exception as e:
        return JSONResponse(status_code=500, content={"msg": f"Error al registrar el usuario: {e}"})


@router.post(path='/login', response_model= Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()) -> JSONResponse:
    """Metodo para iniciar sesion
    :args:
    - UsuarioLogin: Datos del usuario que se esta iniciando sesion
    
    :returns:
    - JSONResponse: Respuesta de la API
    
    """
    try:
        mongo_singleton = MongoDBClientSingleton()
        collection = mongo_singleton.get_collection(DatabaseEnum.MYCHAT, CollectionEnum.USUARIOS)
        user = collection.find_one({"email": str(form_data.username)} )

        if not user:
            return JSONResponse(status_code=400, content={"msg": "Usuario no encontrado"})
        if not bcrypt.checkpw(form_data.password.encode('utf-8'), user["password"].encode('utf-8')):
            return JSONResponse(status_code=400, content={"msg": "Contraseña incorrecta"})
        
        SECRET_KEY = os.getenv("SECRET_KEY")
        ALGORITHM = os.getenv("ALGORITHM", "HS256")
        expire = datetime.now(timezone.utc) + timedelta(hours=2)
        payload = {
            "sub": str(user["_id"]),
            "email": user["email"],
            "exp": expire
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        USERS_ONLINE.insert_one({'usuario': form_data.username, 'status': 'online'})
        return Token(access_token=token)
    except Exception as e:
        return JSONResponse(status_code=500, content={"msg": f"Error al iniciar sesion: {e}"})


def get_current_user(token: str = Depends(OA2)) -> dict:
    """Metodo para obtener el usuario autenticado
    
    Args:
    - token: Token de autenticación
    
    Returns:
    - dict: Datos del usuario autenticado
    
    """

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code= 401, detail= "Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code= 401, detail= "Token inválido")


@router.get("/me")
def get_me(token: str = Depends(OA2)) -> JSONResponse:
    """Devuelve la información del usuario autenticado
    
    Args:
    - token: Token de autenticación
    
    Returns:
    - JSONResponse: Respuesta de la API
    
    """
    user_data = get_current_user(token)
    try:
        
        user = DATA.find_one({"email": user_data["email"]}, {"password": 0})

        if not user:
            return JSONResponse(status_code=404, content={"msg": "Usuario no encontrado"})
        
        user["_id"] = str(user["_id"])
        return JSONResponse(status_code=200, content={"usuario": user})
    
    except Exception as e:
        return JSONResponse(status_code=500, content={"msg": f"Error al obtener la información del usuario: {e}"})


@router.get('/conectados', response_model=list[UsuarioConectado])
def usuarios_conectados(token: str = Depends(OA2)) -> JSONResponse:
    """Devuelve la lista de usuarios y su estado de conexión (simulado: todos conectados)"""
    try:
        usuarios: list[UsuarioConectado] = list(USERS_ONLINE.find({}))
        print(usuarios)
        for u in usuarios:
            u["_id"] = str(u["_id"])
        return JSONResponse(usuarios, status_code= 200)
    except Exception as e:
        return JSONResponse(status_code=500, content={"msg": f"Error al obtener usuarios conectados: {e}"})


@router.post('/logout')
def loguot(token: str = Depends(OA2)) -> JSONResponse:
    try:
        user = get_me(token)
        USERS_ONLINE.delete_one({'username': user['email']})
        token = ''
        return JSONResponse({'token': token}, status_code=200)
    
    except Exception as e:
        JSONResponse(status_code=500, content={"msg": f"Error al obtener usuarios conectados: {e}"})
