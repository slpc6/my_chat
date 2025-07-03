from pydantic import BaseModel


class Usuario(BaseModel):
    nombre: str
    email: str
    password: str


class UsuarioLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "Bearer"


class UsuarioConectado(BaseModel):
    nombre: str
    email: str
    conectado: bool
