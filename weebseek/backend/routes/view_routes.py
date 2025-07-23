from flask import Blueprint, request, jsonify, session
from db.connection import get_db_connection

view_bp = Blueprint("view", __name__)

# Add or update viewed anime of current user
@view_bp.route("/api/user/view", methods=["POST"])
def update_view_history():
    uid = session.get("user_id")

    if not uid:
        return jsonify({"error": "User not logged in."}), 401

    data = request.get_json()
    aid = data.get("aid")

    if not aid:
        return jsonify({"error": "Missing anime ID."}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
            INSERT INTO ViewHistory (uid, aid, viewed_date)
            VALUES (%s, %s, NOW())
            ON DUPLICATE KEY UPDATE viewed_date = NOW()
        """
        cursor.execute(query, (uid, aid))
        conn.commit()
        return jsonify({"message": "View history updated."}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()