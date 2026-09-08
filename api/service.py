# Realiza a leitura dos dados diretamente do SQLite.
from database import get_connection

class F1Service:
    @staticmethod
    def get_pilotos_destaque():
        connect = get_connection()
        cursor = connect.cursor()
        cursor.execute("SELECT id, rank, nome, sobrenome, equipe, pts, img FROM pilotos ORDER BY rank ASC")
        rows = cursor.fetchall()
        connect.close()

        return [dict(row) for row in rows]

    @staticmethod
    def get_ranking():
        connect = get_connection()
        cursor = connect.cursor()
        cursor.execute("SELECT id, rank, nome, equipe, icon, pts FROM ranking ORDER BY rank ASC")
        rows = cursor.fetchall()
        connect.close()

        return [dict(row) for row in rows]

    @staticmethod
    def get_equipes():
        connect = get_connection()
        cursor = connect.cursor()
        cursor.execute("SELECT id, nome, sub, pos FROM equipes")
        rows = cursor.fetchall()
        connect.close()

        return [dict(row) for row in rows]

    @staticmethod
    def get_noticias():
        connect = get_connection()
        cursor = connect.cursor()
        cursor.execute("SELECT id, titulo, resumo, tempo, img FROM noticias ORDER BY id DESC LIMIT 1")
        row = cursor.fetchone()
        connect.close()

        return dict(row) if row else {}

    @staticmethod
    def criar_piloto(piloto):
        return F1Service._criar("pilotos", piloto, ("rank", "nome", "sobrenome", "equipe", "pts", "img"))

    @staticmethod
    def criar_ranking(item):
        return F1Service._criar("ranking", item, ("rank", "nome", "equipe", "icon", "pts"))

    @staticmethod
    def criar_equipe(equipe):
        return F1Service._criar("equipes", equipe, ("nome", "sub", "pos"))

    @staticmethod
    def criar_noticia(noticia):
        return F1Service._criar("noticias", noticia, ("titulo", "resumo", "tempo", "img"))

    @staticmethod
    def excluir_piloto(id):
        return F1Service._excluir("pilotos", id)

    @staticmethod
    def excluir_ranking(id):
        return F1Service._excluir("ranking", id)

    @staticmethod
    def excluir_equipe(id):
        return F1Service._excluir("equipes", id)

    @staticmethod
    def excluir_noticia(id):
        return F1Service._excluir("noticias", id)

    @staticmethod
    def _criar(tabela, dados, campos):
        valores = tuple(dados[campo] for campo in campos)
        marcadores = ", ".join("?" for _ in campos)

        connect = get_connection()
        cursor = connect.cursor()
        cursor.execute(
            f"INSERT INTO {tabela} ({', '.join(campos)}) VALUES ({marcadores})",
            valores,
        )
        novo_id = cursor.lastrowid
        connect.commit()
        connect.close()

        return {"id": novo_id, **dados}

    @staticmethod
    def _excluir(tabela, id):
        connect = get_connection()
        cursor = connect.cursor()
        cursor.execute(f"DELETE FROM {tabela} WHERE id = ?", (id,))
        removido = cursor.rowcount > 0
        connect.commit()
        connect.close()

        return removido
