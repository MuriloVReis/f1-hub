# Realiza a leitura dos dados diretamente do SQLite.
from database import get_connection

class F1Service:
    @staticmethod
    def get_pilotos_destaque():
        connect = get_connection()
        cursor = connect.cursor()
        cursor.execute("SELECT rank, nome, sobrenome, equipe, pts, img FROM pilotos ORDER BY rank ASC LIMIT 3")
        rows = cursor.fetchall()
        connect.close()

        return [dict(row) for row in rows]

    @staticmethod
    def get_ranking():
        connect = get_connection()
        cursor = connect.cursor()
        cursor.execute("SELECT rank, nome, equipe, icon, pts FROM ranking ORDER BY rank ASC LIMIT 5")
        rows = cursor.fetchall()
        connect.close()

        return [dict(row) for row in rows]

    @staticmethod
    def get_equipes():
        connect = get_connection()
        cursor = connect.cursor()
        cursor.execute("SELECT nome, sub, pos FROM equipes")
        rows = cursor.fetchall()
        connect.close()

        return [dict(row) for row in rows]

    @staticmethod
    def get_noticias():
        connect = get_connection()
        cursor = connect.cursor()
        cursor.execute("SELECT titulo, resumo, tempo, img FROM noticias ORDER BY id DESC LIMIT 1")
        row = cursor.fetchone()
        connect.close()

        return dict(row) if row else {}