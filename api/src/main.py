"""Punto inicial de la aplicacion"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import importlib
import pkgutil
import uvicorn
from dotenv import load_dotenv

from utils.path import Path


app = FastAPI(version= "1.0.0",
              title= "My Chat",
              description= "Chat aplication")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

load_dotenv()
for _, module_name, _ in pkgutil.iter_modules([Path.ROUTERS]):
    module = importlib.import_module(f"routers.{module_name}")
    if hasattr(module, "router"):
        app.include_router(module.router)


if __name__ == "__main__":
    uvicorn.run(app="main:app", host="0.0.0.0", port=8000, reload=True)
