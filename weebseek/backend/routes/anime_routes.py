from flask import Blueprint, jsonify, request
from db.connection import get_db_connection

anime_bp = Blueprint("anime", __name__)

## Query anime by sorting and filtering.
## Sort anime by aid by default. Can be sorted by score or aired once specified.
## Filter anime by genre or type.
@anime_bp.route("/api/anime/query", methods=["GET"])
def query_anime():
    # Read query parameters from the URL
    sort_by = request.args.get("sort_by", default="aid")
    order = request.args.get("order", default="asc")
    allowed_ordering_fields = ["score", "aired"]  # users can sort Anime table by rating or aired
    
    filter_by = request.args.get("filter_by", default="genre")
    genre = request.args.get("genre")
    anime_type = request.args.get("type")
    allowed_filtering_fields = ["genre", "type"] # users can filter Anime table by genre or type

    if sort_by not in allowed_ordering_fields:
        sort_by = "aid"
    if order.lower() not in ["asc", "desc"]:
        order = "asc"

    filters = []
    values = []

    if (filter_by == "genre" or filter_by not in allowed_filtering_fields) and genre:
        filters.append("LOWER(gname) = LOWER(%s)")
        values.append(genre)
    elif filter_by == "type" and anime_type:
        filters.append("LOWER(type) = LOWER(%s)")
        values.append(anime_type)

    where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""

    if sort_by == "aired":
        order_clause = f"ORDER BY {sort_by} IS NULL, {sort_by} {order.upper()}"
    else:
        order_clause = f"ORDER BY {sort_by} {order.upper()}"

    query = f"SELECT * FROM Anime_genre {where_clause} {order_clause}"
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(query, tuple(values))
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

