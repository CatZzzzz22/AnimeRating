from flask import Blueprint, jsonify, request
from db.connection import get_db_connection
from constants import CREATE_TABLES_FPATH, LOAD_DATA_FPATH

anime_bp = Blueprint("anime", __name__)

def read_commands_from_file(fpath):
    sql_commands = []
    try:
        with open(fpath, "r") as f:
            lines = f.read()

        for command in lines.split(";"):
            command = command.strip()
            if command:
                sql_commands.append(command)

        return sql_commands
    
    except Exception as e:
        print("Error while reading commands from file:", e)
        return sql_commands

## Create the schemas. Should all be created when you starting running the app.
## Test if tables are created:
##    1. run Flask app with debug mode
##    2. open another terminal and run: 
##       curl -X POST http://localhost:5050/api/anime/create-tables
## should see: {"message": "Tables created successfully."}
@anime_bp.route("/api/anime/create-tables", methods=["POST"])
def create_tables():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        sql_commands = read_commands_from_file(CREATE_TABLES_FPATH)

        if sql_commands:
            for command in sql_commands:
                cursor.execute(command)

            conn.commit()
            return jsonify({"message": "Tables created successfully."}), 201
        else:
            raise Exception("No SQL commands found in file or the file path is wrong.")

    except Exception as e:
        print("Error while creating tables:", e)
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    
    finally:
        cursor.close()
        conn.close()

## Load data to schemas. Should already be loaded when you start running the app.
## Test if data is loaded:
##    1. run Flask app with debug mode
##    2. open another terminal and run: 
##       curl -X POST http://localhost:5050/api/anime/load-data
## should see: {"message": "Load data successfully."}
@anime_bp.route("/api/anime/load-data", methods=["POST"])
def load_data():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        sql_commands = read_commands_from_file(LOAD_DATA_FPATH)

        if sql_commands:
            for command in sql_commands:
                cursor.execute(command)
            
            conn.commit()
            return jsonify({"message": "Load data successfully."}), 201
        else:
            raise Exception("No SQL commands found in file or the file path is wrong.")
    
    except Exception as e:
        print("Error while loading data:", e)
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    
    finally:
        cursor.close()
        conn.close()

# Example API requests:
# GET /api/anime?sort_by=rating&order=desc
# GET /api/anime?sort_by=title&order=asc
# GET /api/anime
@anime_bp.route("/api/anime", methods=["GET"])
def get_anime():
    # Read query parameters from the URL
    sort_by = request.args.get("sort_by", default="aid")
    order = request.args.get("order", default="asc")

    # Prevent SQL injection by allowing only certain fields
    allowed_fields = ["rating", "aired"]  # users can sort Anime table by rating or aired
    if sort_by not in allowed_fields:
        sort_by = "aid"
    if order.lower() not in ["asc", "desc"]:
        order = "asc"
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Create the query with validated values
    query = f"SELECT * FROM anime ORDER BY {sort_by} {order.upper()}"
    cursor.execute(query)
    results = cursor.fetchall()
    conn.close()

    return jsonify(results)