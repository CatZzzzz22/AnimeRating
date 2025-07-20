from flask import Blueprint, request, jsonify, session
from db.connection import get_db_connection

watchlist_bp = Blueprint("watchlist", __name__)

# Returns a list of anime IDs in current user's watchlist
@watchlist_bp.route("/api/watchlist", methods=["GET"])
def get_watchlist():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    uid = session["user_id"]
    try:
        query = "SELECT aid FROM Watchlist WHERE uid = %s"
        cursor.execute(query, (uid,))
        watchlist = [row["aid"] for row in cursor.fetchall()]
        
        ## If watchlist result is empty
        if not watchlist:
            return jsonify({"message": "No anime in your watchlist."}), 200
        
        return jsonify(watchlist), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


# Add an anime to the current user's watchlist
@watchlist_bp.route("/api/watchlist", methods=["POST"])
def insert_watchlist():
    uid = session["user_id"]
    data = request.get_json()
    aid = data.get("aid")

    if not aid:
        return jsonify({"error": "Missing anime ID."}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = "INSERT IGNORE INTO Watchlist (uid, aid) VALUES (%s, %s)"
        cursor.execute(query, (uid, aid,))
        conn.commit()
        
        return jsonify({"message": "Anime successfully added to watchlist"}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# Remove an anime from user's watchlist
@watchlist_bp.route("/api/watchlist", methods=["DELETE"])
def remove_watchlist():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    uid = session["user_id"]
    aid = request.args.get("aid")
    try:
        if not aid:
            return jsonify({"error": "Missing anime ID."}), 400

        query = "DELETE FROM Watchlist WHERE uid = %s AND aid = %s"
        cursor.execute(query, (uid, aid,))
        conn.commit()
        
        return jsonify({"message": "Anime successfully deleted from the watchlist"}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# Get all anime details from the watchlist of current user
@watchlist_bp.route("/api/watchlist/view", methods=["GET"])
def get_watchlist_details():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    uid = session["user_id"]
    try:
        query = "SELECT * FROM Watchlist_anime WHERE uid = %s"
        cursor.execute(query, (uid,))
        watchlist = cursor.fetchall()
        
        ## If watchlist result is empty
        if not watchlist:
            return jsonify({"message": "No anime in your watchlist."}), 200
        
        return jsonify(watchlist), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()
