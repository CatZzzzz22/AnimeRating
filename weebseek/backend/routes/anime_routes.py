from flask import Blueprint, jsonify, request
from db.connection import get_db_connection
from constants import INIT_DB_FPATH, LOAD_DATA_FPATH

anime_bp = Blueprint("anime", __name__)

## Sort anime by aid by default. Can be sorted by score or aired once specified.
@anime_bp.route("/api/anime/sort", methods=["GET"])
def sort_anime():
    # Read query parameters from the URL
    sort_by = request.args.get("sort_by", default="aid")
    order = request.args.get("order", default="asc")

    # Prevent SQL injection by allowing only certain fields
    allowed_fields = ["score", "aired"]  # users can sort Anime table by rating or aired
    if sort_by not in allowed_fields:
        sort_by = "aid"
    if order.lower() not in ["asc", "desc"]:
        order = "asc"
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        if sort_by == "aired":
            query = f"""
                SELECT * FROM Anime_genre
                ORDER BY {sort_by} IS NULL, {sort_by} {order.upper()}
            """
        else:
            query = f"""
                SELECT * FROM Anime_genre
                ORDER BY {sort_by} {order.upper()}
            """
            
        cursor.execute(query)
        results = cursor.fetchall()

        ## If anime result is empty
        if not results:
            return jsonify({"message": "No anime found."}), 200

        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

## Filter anime by genre or type
@anime_bp.route("/api/anime/filter", methods=["GET"])
def filter_anime():
    filter_by = request.args.get("filter_by", default="genre")
    genre = request.args.get("genre")
    anime_type = request.args.get("type")
    allowed_fields = ["genre", "type"]
    if filter_by not in allowed_fields:
        filter_by = "genre"
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        if filter_by == "genre":
            if not genre:
                return jsonify({"error": "Genre is required for genre filtering"}), 400

            query = f"SELECT * FROM Anime_genre WHERE LOWER(gname) = LOWER(%s)"
            cursor.execute(query, (genre,))
        else:
            if not anime_type:
                return jsonify({"error": "Type is required for anime type filtering"}), 400
            query = f"SELECT * FROM Anime_genre WHERE LOWER(type) = LOWER(%s)"
            cursor.execute(query, (anime_type,))
        
        results = cursor.fetchall()

        ## If anime result is empty
        if not results:
            return jsonify({"message": "No anime found."}), 200
        
        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

## Access all available genre
@anime_bp.route("/api/anime/genre", methods=["GET"])
def genre():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = f"SELECT * FROM Genre ORDER BY gname ASC"
        cursor.execute(query)
        genres = cursor.fetchall()
        
        ## If genre result is empty
        if not genres:
            return jsonify({"message": "No genre found."}), 200
        
        return jsonify(genres), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


## Search anime by name
@anime_bp.route("/api/anime/search", methods=["GET"])
def search_anime():
    name = request.args.get("aname")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = f"SELECT * FROM Anime_genre WHERE LOWER(aname) LIKE %s"
        cursor.execute(query, (f"%{name.lower()}%",))
        results = cursor.fetchall()

        ## If search result is empty
        if not results:
            return jsonify({"message": "No anime found."}), 200
        
        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    finally:
        cursor.close()
        conn.close()

