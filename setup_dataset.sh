#!/bin/bash

set -e

# Configuration
INITIALIZE_SQL_FILE="../sql/create_tables.sql"
LOAD_DATA_SQL_FILE="../sql/load_data.sql"
DATABASE="AnimeRatingApp"
DATA_DIR="./data"

# Go into data directory
cd "$DATA_DIR"

# Prompt user for credentials
read -p "Enter MySQL username: " MYSQL_USER
read -s -p "Enter MySQL password: " MYSQL_PASS
echo

# Create database and table (adjust table schema as needed)
echo "Setting up MySQL database and table..."

mysql --local-infile=1 -u "$MYSQL_USER" -p"$MYSQL_PASS" < "$INITIALIZE_SQL_FILE"
mysql --local-infile=1 -u "$MYSQL_USER" -p"$MYSQL_PASS" < "$LOAD_DATA_SQL_FILE"
mysql --local-infile=1 -u "$MYSQL_USER" -p"$MYSQL_PASS" -D "$DATABASE" -e "SELECT * FROM Anime" > table_anime.txt
mysql --local-infile=1 -u "$MYSQL_USER" -p"$MYSQL_PASS" -D "$DATABASE" -e "SELECT * FROM Genre" > table_genre.txt
mysql --local-infile=1 -u "$MYSQL_USER" -p"$MYSQL_PASS" -D "$DATABASE" -e "SELECT * FROM AnimeGenre" > table_anime_genre.txt
mysql --local-infile=1 -u "$MYSQL_USER" -p"$MYSQL_PASS" -D "$DATABASE" -e "SELECT * FROM User" > table_user.txt
mysql --local-infile=1 -u "$MYSQL_USER" -p"$MYSQL_PASS" -D "$DATABASE" -e "SELECT * FROM Rating" > table_rating.txt
mysql --local-infile=1 -u "$MYSQL_USER" -p"$MYSQL_PASS" -D "$DATABASE" -e "SELECT * FROM Watchlist" > table_watchlist.txt

echo "Dataset successfully imported into MySQL."