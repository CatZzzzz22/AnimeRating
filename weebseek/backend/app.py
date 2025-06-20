from flask import Flask
from flask_cors import CORS
from routes.anime_routes import anime_bp
from db.connection import get_db_connection
from constants import REQUIRED_TABLES, INIT_DB_FPATH, LOAD_DATA_FPATH

app = Flask("WeebSeek")
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Create the database and tables automatically
def init_database():
    conn = get_db_connection(with_db=False)
    cursor = conn.cursor()

    cursor.execute("CREATE DATABASE IF NOT EXISTS AnimeRatingApp")
    cursor.execute("USE AnimeRatingApp")
    cursor.execute("SHOW TABLES")
    existing_tables = set(row[0] for row in cursor.fetchall())
    if REQUIRED_TABLES.issubset(existing_tables):
        print("Database and all required tables already exists, skipping creation.")
        return

    try:
        with open(INIT_DB_FPATH, "r") as f:
            sql_commands = f.read()

        for command in sql_commands.split(";"):
            command = command.strip()
            if command:
                cursor.execute(command)

        conn.commit()
        print("Database and tables created (initial setup once per device).")

    except Exception as e:
        conn.rollback()
        print("Error creating database and tables:", e)

    finally:
        cursor.close()
        conn.close()

def load_data():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check if all tables have data
        all_have_data = True
        for table in REQUIRED_TABLES:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            if count == 0:
                print(f"Table '{table}' is empty.")
                all_have_data = False
                break

        if all_have_data:
            print("All tables already have data. Skipping data load.")
            return

        # Load SQL from file
        with open(LOAD_DATA_FPATH, "r") as f:
            sql_commands = f.read()

        for command in sql_commands.split(";"):
            command = command.strip()
            if command:
                cursor.execute(command)

        conn.commit()
        print("Sample data loaded successfully.")

    except Exception as e:
        conn.rollback()
        print("Error loading data:", e)

    finally:
        cursor.close()
        conn.close()

init_database()
load_data()
app.register_blueprint(anime_bp)

if __name__ == "__main__":
    app.run(port=5050, debug=True)