# Inicia o banco de dados, configura o servidor FastAPI e executa com Uvicorn.
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from database import init_db
from controller import router

# Inicializa o banco SQLite e migra os dados do JSON
init_db()

app = FastAPI(
    title="F1 HUB API (SQLite & Uvicorn)",
    version="1.0.0"
)

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)