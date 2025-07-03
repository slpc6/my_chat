from pydantic import BaseModel

class MensajeChat(BaseModel):
    usuario: str
    mensaje: str
    timestamp: str
