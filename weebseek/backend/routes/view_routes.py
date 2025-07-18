from flask import Blueprint, request, jsonify, session
from db.connection import get_db_connection

view_bp = Blueprint("view", __name__)

# Add or update viewed anime of current user
@view_bp.route("/api/user/view", methods=["POST"])
def update_view_history():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    uid = session["user_id"]
    data = request.get_json()
    aid = data.get("aid")
    if not aid:
        return jsonify({"error": "Missing anime ID."}), 400

    try:
        query = """
            INSERT INTO ViewHistory (uid, aid, viewed_date)
            VALUES (%s, %s, NOW())
            ON DUPLICATE KEY UPDATE viewed_date = NOW()
        """
        cursor.execute(query, (uid, aid,))
        conn.commit()
        return jsonify({"message": "View history updated."}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()