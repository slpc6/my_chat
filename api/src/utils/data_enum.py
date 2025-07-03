from enum import Enum


class DatabaseEnum(str, Enum):
    MYCHAT = "MyChat"


class CollectionEnum(str, Enum):
    USUARIOS = "usuarios"
    CHATS = "chats"
    ONLINE = "online"