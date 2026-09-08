# Endpoints configurados no FastAPI com a rota /api
from fastapi import APIRouter
from service import F1Service

router = APIRouter(prefix="/api", tags=["F1 HUB API"])

@router.get("/pilotos-destaque")
def listar_pilotos_destaque():
    data = F1Service.get_pilotos_destaque()
    
    return {"success": True, "data": data}

@router.get("/ranking")
def listar_ranking():
    data = F1Service.get_ranking()

    return {"success": True, "data": data}

@router.get("/equipes")
def listar_equipes():
    data = F1Service.get_equipes()

    return {"success": True, "data": data}

@router.get("/noticias")
def obter_noticia():
    data = F1Service.get_noticias()

    return {"success": True, "data": data}