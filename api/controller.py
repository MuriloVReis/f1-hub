# Endpoints configurados no FastAPI com a rota /api
from typing import Annotated

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from service import F1Service

router = APIRouter(prefix="/api", tags=["F1 HUB API"])

Texto = Annotated[str, Field(min_length=1)]


class PilotoCriacao(BaseModel):
    rank: int = Field(ge=1)
    nome: Texto
    sobrenome: Texto
    equipe: Texto
    pts: Texto
    img: Texto


class RankingCriacao(BaseModel):
    rank: int = Field(ge=1)
    nome: Texto
    equipe: Texto
    icon: Texto
    pts: Texto


class EquipeCriacao(BaseModel):
    nome: Texto
    sub: str = ""
    pos: Texto


class NoticiaCriacao(BaseModel):
    titulo: Texto
    resumo: Texto
    tempo: Texto
    img: Texto


def dados_modelo(modelo: BaseModel):
    """Compatibilidade entre Pydantic v1 e v2."""
    return modelo.model_dump() if hasattr(modelo, "model_dump") else modelo.dict()

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


@router.post("/pilotos-destaque", status_code=status.HTTP_201_CREATED)
def criar_piloto(piloto: PilotoCriacao):
    data = F1Service.criar_piloto(dados_modelo(piloto))
    return {"success": True, "data": data}


@router.delete("/pilotos-destaque/{id}")
def excluir_piloto(id: int):
    if not F1Service.excluir_piloto(id):
        raise HTTPException(status_code=404, detail="Piloto não encontrado.")
    return {"success": True, "message": "Piloto removido com sucesso."}


@router.post("/ranking", status_code=status.HTTP_201_CREATED)
def criar_item_ranking(item: RankingCriacao):
    data = F1Service.criar_ranking(dados_modelo(item))
    return {"success": True, "data": data}


@router.delete("/ranking/{id}")
def excluir_item_ranking(id: int):
    if not F1Service.excluir_ranking(id):
        raise HTTPException(status_code=404, detail="Item do ranking não encontrado.")
    return {"success": True, "message": "Item do ranking removido com sucesso."}


@router.post("/equipes", status_code=status.HTTP_201_CREATED)
def criar_equipe(equipe: EquipeCriacao):
    data = F1Service.criar_equipe(dados_modelo(equipe))
    return {"success": True, "data": data}


@router.delete("/equipes/{id}")
def excluir_equipe(id: int):
    if not F1Service.excluir_equipe(id):
        raise HTTPException(status_code=404, detail="Equipe não encontrada.")
    return {"success": True, "message": "Equipe removida com sucesso."}


@router.post("/noticias", status_code=status.HTTP_201_CREATED)
def criar_noticia(noticia: NoticiaCriacao):
    data = F1Service.criar_noticia(dados_modelo(noticia))
    return {"success": True, "data": data}


@router.delete("/noticias/{id}")
def excluir_noticia(id: int):
    if not F1Service.excluir_noticia(id):
        raise HTTPException(status_code=404, detail="Notícia não encontrada.")
    return {"success": True, "message": "Notícia removida com sucesso."}
