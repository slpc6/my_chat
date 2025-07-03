"""Modulo para manejar las rutas de la aplicacion"""

import os


class Path:
    ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
    ROUTERS = os.path.join(ROOT, "routers")
    MODELS = os.path.join(ROOT, "models")
    UTILS = os.path.join(ROOT, "utils")
    CONFIG = os.path.join(ROOT, "config")
    DATA = os.path.join(ROOT, "data")
    LOGS = os.path.join(ROOT, "logs")
    TEMPLATES = os.path.join(ROOT, "templates")
    STATIC = os.path.join(ROOT, "static")
