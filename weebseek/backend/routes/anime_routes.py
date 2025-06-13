from flask import Blueprint, jsonify
from db.connection import get_db_connection

anime_bp = Blueprint("anime", __name__)

@anime_bp.route("/api/anime", methods=["GET"])
def get_anime():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM anime")
    results = cursor.fetchall()
    conn.close()
    return jsonify(results)