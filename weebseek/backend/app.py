from flask import Flask
from flask_cors import CORS
from routes.anime_routes import anime_bp
from db.connection import get_db_connection

app = Flask(__name__)
CORS(app)

# Create the tables automatically only once for setup
# Will skip creating tables next time
def create_tables():
    required_tables = {"Anime", "Genre", "AnimeGenre", "User", "Rating", "Watchlist"}
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

create_tables()
app.register_blueprint(anime_bp)

if __name__ == "__main__":
    app.run(port=5050, debug=True)