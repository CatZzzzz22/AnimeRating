from flask import Blueprint, request, jsonify, session
from db.connection import get_db_connection

rating_bp = Blueprint("rating", __name__)

# Returns all anime scores that rated by current user
@rating_bp.route("/api/rating", methods=["GET"])
def get_rating():
    uid = session["user_id"]

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = "SELECT * FROM Rating WHERE uid = %s"
        cursor.execute(query, (uid,))
        ratings = cursor.fetchall()

        return jsonify(ratings), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# POST /api/rating - adds or updates rating for the user, body - { aid: 5, score: 9 }
@rating_bp.route("/api/rating", methods=["POST"])
def update_rating():
    uid = session["user_id"]
    data = request.get_json()
    aid = data.get("aid")
    score = data.get("score")

    if not aid or score is None:
        return jsonify({"error": "Missing aid or score"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
            INSERT INTO Rating (uid, aid, ratedDate, score)
            VALUES (%s, %s, NOW(), %s) 
            ON DUPLICATE KEY UPDATE 
                ratedDate = NOW(),
                score = %s
            """
        cursor.execute(query, (uid, aid, score, score))
        conn.commit()

        return jsonify({"message": f"Rating for anime {aid} submitted successfully."}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

