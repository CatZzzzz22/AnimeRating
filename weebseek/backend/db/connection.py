from dotenv import load_dotenv
import os
import mysql.connector

load_dotenv()  # Load .env file

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database="AnimeRatingApp"
    )