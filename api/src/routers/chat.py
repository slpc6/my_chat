from fastapi import APIRouter, HTTPException, status, Depends, Body
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import JSONResponse


from models.chat import MensajeChat
from data.mongodb import MongoDBClientSingleton
from utils.data_enum import DatabaseEnum, CollectionEnum


router = APIRouter(prefix='/chat',
                   tags=['chat'])
OA2 = OAuth2PasswordBearer(tokenUrl="/usuario/login")
MONGO = MongoDBClientSingleton()
CHAT_DATA = MONGO.get_collection(DatabaseEnum.MYCHAT, CollectionEnum.CHATS)


@router.get('/', response_model=list[MensajeChat])
def obtener_chat(token: str = Depends(OA2)) -> JSONResponse:
    """Devuelve todos los mensajes del chat"""
    try:
        mensajes = list(CHAT_DATA.find({}))
        for m in mensajes:
            m["_id"] = str(m["_id"])
        return mensajes
    except Exception as e:
        return JSONResponse(status_code=500, content={"msg": f"Error al obtener mensajes: {e}"})


@router.post('/', response_model=MensajeChat)
def guardar_mensaje(mensaje: MensajeChat = Body(...), token: str = Depends(OA2)) -> JSONResponse:
    """Guarda un mensaje en el chat"""
    try:
        CHAT_DATA.insert_one(mensaje.model_dump())
        return mensaje
    except Exception as e:
        return JSONResponse(status_code=500, content={"msg": f"Error al guardar mensaje: {e}"})
