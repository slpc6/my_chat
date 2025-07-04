from fastapi import APIRouter
from fastapi.responses import JSONResponse


router = APIRouter(prefix='/healt')

@router.get(path='/healthz')
def healt()-> JSONResponse:
    return JSONResponse(content={"msg": 'OK'}, status_code=200)
