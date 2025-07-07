from flask import Blueprint, request, jsonify, session
from db.connection import get_db_connection
from datetime import datetime
import bcrypt

auth_bp = Blueprint("auth", __name__)

## User registration
@auth_bp.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    uname = data.get("uname")
    gender = data.get("gender")
    age = data.get("age")
    location = data.get("location")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    
    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        ## Check if username already exists
        cursor.execute("SELECT * FROM User WHERE username = %s", (username,))
        if cursor.fetchone():
            return jsonify({"error": "Username already exists"}), 409

        cursor.execute("""
            INSERT INTO User (username, password, uname, gender, age, location, joinedDate)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, 
            (
                username,
                hashed_pw,
                uname,
                gender,
                age,
                location,
                datetime.today().date()
            ))
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    
    finally:
        cursor.close()
        conn.close()

## User login
@auth_bp.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM User WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user and bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
        session["user_id"] = user["uid"]
        session["username"] = user["username"]
        return jsonify({
            "message": "Login successful.", 
            "user_id": user["uid"], 
            "username": user["username"]
        })
    else:
        return jsonify({"error": "Invalid credentials."}), 401

## User log out
@auth_bp.route("/api/auth/logout", methods=["POST"])
def logout():
    session.pop("user_id", None)
    return jsonify({"message": "Logged out successfully."})

## Check session cookie
@auth_bp.route("/api/auth/me", methods=["GET"])
def check_cookie():
    if "user_id" in session:
        return jsonify({"cookie": True, "user_id": session["user_id"], "username": session["username"]})
    else:
        return jsonify({"cookie": False})

