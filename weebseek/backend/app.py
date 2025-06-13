from dotenv import load_dotenv
import os
import mysql.connector

load_dotenv()  # Load .env file

try:
    conn = mysql.connector.connect(
        host="localhost",
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database="AnimeRatingApp"
    )
    print("Connected successfully!")
except mysql.connector.Error as err:
    print("Connection error:", err)
