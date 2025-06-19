from dotenv import load_dotenv
import os
import mysql.connector

load_dotenv()  # Load DB credentials from .env file

def get_db_connection(with_db=True):
    config = {
        "host": "localhost",
        "user": os.getenv("DB_USER"),
        "password": os.getenv("DB_PASSWORD"),
        "allow_local_infile": True
    }

    if not config["user"] or not config["password"]:
        raise RuntimeError("DB_USER or DB_PASSWORD not set in environment")

    if with_db:
        config["database"] = "AnimeRatingApp"

    return mysql.connector.connect(**config)
