from flask import Flask
from flask_cors import CORS
from routes.anime_routes import anime_bp
from db.connection import get_db_connection

required_tables = {"Anime", "Genre", "AnimeGenre", "User", "Rating", "Watchlist"}

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Create the tables automatically only once for setup
# Will skip creating tables next time
def create_tables():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SHOW TABLES")
    existing_tables = set(row[0] for row in cursor.fetchall())
    if required_tables.issubset(existing_tables):
        print("All required tables already exists, skipping creation.")
        return

    try:
        with open("../../sql/create_tables.sql", "r") as f:
            sql_commands = f.read()

        for command in sql_commands.split(";"):
            command = command.strip()
            if command:
                cursor.execute(command)

        conn.commit()
        print("Tables created (initial setup once per device).")

    except Exception as e:
        conn.rollback()
        print("Error creating tables:", e)

    finally:
        cursor.close()
        conn.close()

def load_data():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check if all tables have data
        all_have_data = True
        for table in required_tables:
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
        with open("../../sql/load_data.sql", "r") as f:
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

create_tables()
load_data()
app.register_blueprint(anime_bp)

if __name__ == "__main__":
    app.run(port=5050, debug=True)