from flask import Blueprint, request, jsonify, session
from db.connection import get_db_connection

user_bp = Blueprint("user", __name__)

####################### User's Page ##########################
# Include user's profile, watchlist, recently viewed history and anime recommendation
# Current user profile information
@user_bp.route("/api/user/profile", methods=["GET"])
def user_profile():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    uid = session["user_id"]

    try:
        query = "SELECT * FROM User WHERE uid = %s"
        cursor.execute(query, (uid,))
        profile = cursor.fetchone()
        
        ## If profile result is empty
        if not profile:
            return jsonify({"message": "User ID invalid."}), 200
        
        profile.pop("password", None)
        return jsonify(profile), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# Other users' profile
@user_bp.route("/api/user/profile", methods=["GET"])
def user_profile():
    uid = request.args.get("uid")

    if not uid or not uid.isdigit():
        return jsonify({"error": "Invalid or missing UID"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = "SELECT * FROM User WHERE uid = %s"
        cursor.execute(query, (uid,))
        profile = cursor.fetchone()
        
        if not profile:
            return jsonify({"error": "User not found."}), 404
        
        profile.pop("password", None)
        return jsonify(profile), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# Get the watchlist of current user
@user_bp.route("/api/user/watchlist", methods=["GET"])
def user_watchlist():
    uid = session["user_id"]

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Check if uid exists
        cursor.execute("SELECT uid FROM User WHERE uid = %s", uid)
        if cursor.fetchone() is None:
            return jsonify({"error": "User ID does not exist."}), 404

        query = "SELECT * FROM Watchlist_anime WHERE uid = %s"
        cursor.execute(query, (uid,))
        watchlist = cursor.fetchall()

        if not watchlist:
            return jsonify({"message": f"User {uid} has no anime in their watchlist."}), 200

        return jsonify(watchlist), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


# Get current user's recently viewed anime
@user_bp.route("/api/user/recent-viewed", methods=["GET"])
def user_recent_viewed():
    uid = session["user_id"]

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = "SELECT * FROM Recent_viewed WHERE uid = %s ORDER BY viewed_date DESC LIMIT 10"
        cursor.execute(query, (uid,))
        history = cursor.fetchall()

        if not history:
            return jsonify({"message": f"User {uid} has not viewed any anime."}), 200

        return jsonify(history), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# Anime recommendation for current user based on genres in the watchlist
@user_bp.route("/api/user/recommendation/anime", methods=["GET"])
def recommend_anime():
    uid = session["user_id"]

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
            SELECT ag.*, COUNT(*) AS most_genre
            FROM Anime_genre ag
            JOIN AnimeGenre ag2 ON ag.aid = ag2.aid
            WHERE ag2.gid IN (
                SELECT ag3.gid
                FROM Watchlist w
                JOIN AnimeGenre ag3 ON w.aid = ag3.aid
                WHERE w.uid = %s
            )
            AND ag.aid NOT IN (
                SELECT aid FROM Watchlist WHERE uid = %s
            )
            GROUP BY ag.aid
            ORDER BY most_genre DESC, ag.score DESC
            LIMIT 5;
        """
        cursor.execute(query, (uid, uid))
        recommendations = cursor.fetchall()
        return jsonify(recommendations), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

######################### Follow/Unfollow ##########################
# Include follow/unfollow features, get followers/followees and follow recommendation
# Follow other users
@user_bp.route("/api/user/follow", methods=["POST"])
def follow_user():
    data = request.get_json()
    followeeUid = data.get("followeeUid")
    followerUid = session.get("user_id")
    
    if not followerUid or not followeeUid:
        return jsonify({"error": "Missing follower or followee UID."}), 400
    if followerUid == followeeUid:
        return jsonify({"error": "Cannot follow yourself."}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Check if followee exists
        cursor.execute("SELECT uid FROM User WHERE uid = %s", followeeUid)
        if cursor.fetchone() is None:
            return jsonify({"error": "Followee does not exist."}), 404

        query = "INSERT IGNORE INTO UserFollow (followerUid, followeeUid) VALUES (%s, %s)"
        cursor.execute(query, (followerUid, followeeUid))
        conn.commit()

        return jsonify({"message": f"User {followerUid} now follows {followeeUid}."}), 201

    except Exception as e:
        conn.rollback()
        if e.args and "1644" in str(e):  # Trigger SIGNAL, client error
            return jsonify({"error": str(e)}), 400

        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# Unfollow user with :uid
@user_bp.route("/api/user/<int:uid>/unfollow", methods=["POST"])
def unfollow_user(uid):
    data = request.get_json()
    followerUid = session.get("user_id")    
    followeeUid = uid

    if not followerUid or not followeeUid:
        return jsonify({"error": "Missing follower or followee UID."}), 400
    if followerUid == followeeUid:
        return jsonify({"error": "Cannot unfollow yourself."}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Check if follow record exists
        cursor.execute("""
            SELECT * FROM UserFollow
            WHERE followerUid = %s AND followeeUid = %s
        """, (followerUid, followeeUid))
        if cursor.fetchone() is None:
            return jsonify({"message": "You are not following this user."}), 404

        # Delete follow record
        cursor.execute("""
            DELETE FROM UserFollow
            WHERE followerUid = %s AND followeeUid = %s
        """, (followerUid, followeeUid))
        conn.commit()

        return jsonify({"message": f"User {followerUid} unfollowed {followeeUid}."}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# Get followers of current user
@user_bp.route("/api/user/followers", methods=["GET"])
def get_followers():
    uid = session["user_id"]

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
            SELECT u.*
            FROM UserFollow f
            JOIN User u ON f.followerUid = u.uid
            WHERE f.followeeUid = %s
        """
        cursor.execute(query, (uid,))
        followers = cursor.fetchall()

        for user in followers:
            user.pop("password", None)
        return jsonify(followers), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# Get the users that the current user is following
@user_bp.route("/api/user/following", methods=["GET"])
def get_following():
    uid = session["user_id"]

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
            SELECT u.*
            FROM UserFollow f
            JOIN User u ON f.followeeUid = u.uid
            WHERE f.followerUid = %s
        """
        cursor.execute(query, (uid,))
        following = cursor.fetchall()

        for user in following:
            user.pop("password", None)
        return jsonify(following), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# User follow recommendation
@user_bp.route("/api/user/recommendations/user", methods=["GET"])
def recursive_recommendations():
    uid = session["user_id"]

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Check if user has followed anyone
        cursor.execute("SELECT 1 FROM UserFollow WHERE followerUid = %s LIMIT 1", (uid,))
        has_followed = cursor.fetchone()

        if has_followed:
            # Recursive recommendations from follow graph
            query = """
                WITH RECURSIVE FollowGraph AS (
                  SELECT followeeUid, 1 AS level
                  FROM UserFollow
                  WHERE followerUid = %s

                  UNION

                  SELECT uf.followeeUid, fg.level + 1
                  FROM UserFollow uf
                  JOIN FollowGraph fg ON uf.followerUid = fg.followeeUid
                  WHERE fg.level < 4
                )
                SELECT DISTINCT u.uid, u.username, u.uname, u.gender, u.age, u.location, u.joinedDate
                FROM FollowGraph fg
                JOIN User u ON u.uid = fg.followeeUid
                WHERE u.uid != %s
                  AND u.uid NOT IN (
                    SELECT followeeUid FROM UserFollow WHERE followerUid = %s
                  )
                LIMIT 10;
            """
            cursor.execute(query, (uid, uid, uid))
        else:
            # Suggest random users if no follows yet
            query = """
                SELECT uid, username, uname, gender, age, location, joinedDate
                FROM User
                WHERE uid != %s
                ORDER BY RAND()
                LIMIT 10;
            """
            cursor.execute(query, (uid,))

        recommendations = cursor.fetchall()
        return jsonify(recommendations), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()
