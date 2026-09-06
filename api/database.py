# Inicializa o banco de dados SQLite (f1_hub.db) e carrega o conteúdo do arquivo F1_data.json caso o banco esteja vazio
import sqlite3
import json
import os

FILE_DB_NAME = "f1_hub.db"
JSON_FILE = "F1_data.json"

def get_connection():
    connect = sqlite3.connect(FILE_DB_NAME)
    connect.row_factory = sqlite3.Row
    return connect

def init_db():
    connect = get_connection()
    cursor = connect.cursor()

    # Criar as tabelas
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pilotos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rank INTEGER,
            nome TEXT,
            sobrenome TEXT,
            equipe TEXT,
            pts TEXT,
            img TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ranking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rank INTEGER,
            nome TEXT,
            equipe TEXT,
            icon TEXT,
            pts TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS equipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            sub TEXT,
            pos TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS noticias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT,
            resumo TEXT,
            tempo TEXT,
            img TEXT
        )
    """)

    connect.commit()

    # Popula o banco com os dados do JSON se a tabela de pilotos estiver vazia
    cursor.execute("SELECT COUNT(*) FROM pilotos")
    if cursor.fetchone()[0] == 0 and os.path.exists(JSON_FILE):
        with open(JSON_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)

        for p in data.get("pilotos", []):
            cursor.execute("INSERT INTO pilotos (rank, nome, sobrenome, equipe, pts, img) VALUES (?, ?, ?, ?, ?, ?)",
                           (p['rank'], p['nome'], p['sobrenome'], p['equipe'], p['pts'], p['img']))

        for r in data.get("ranking", []):
            cursor.execute("INSERT INTO ranking (rank, nome, equipe, icon, pts) VALUES (?, ?, ?, ?, ?)",
                           (r['rank'], r['nome'], r['equipe'], r['icon'], r['pts']))

        for e in data.get("equipes", []):
            cursor.execute("INSERT INTO equipes (nome, sub, pos) VALUES (?, ?, ?)",
                           (e['nome'], e['sub'], e['pos']))

        n = data.get("noticia", {})
        if n:
            cursor.execute("INSERT INTO noticias (titulo, resumo, tempo, img) VALUES (?, ?, ?, ?)",
                           (n['titulo'], n['resumo'], n['tempo'], n['img']))

        connect.commit()

    connect.close()