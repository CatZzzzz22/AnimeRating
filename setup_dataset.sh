#!/bin/bash

set -e

# Configuration
GITHUB_URL="https://raw.githubusercontent.com/CatZzzzz22/AnimeRating/refs/heads/main/sample_anime.csv"
CSV_FILE="dataset.csv"
TARGET_DIR="./data"
DB_NAME="AnimeRatingApp"
TABLE_NAME="AnimeRating"

# Prompt user for credentials
read -p "Enter MySQL username: " MYSQL_USER
read -s -p "Enter MySQL password: " MYSQL_PASS
echo


# Create data directory
mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

# Download CSV
echo "Downloading dataset..."
curl -L "$GITHUB_URL" -o "$CSV_FILE"

# Create database and table (adjust table schema as needed)
echo "Setting up MySQL database and table..."

mysql --local-infile=1 -u "$MYSQL_USER" -p"$MYSQL_PASS" <<EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME;
USE $DB_NAME;

DROP TABLE IF EXISTS $TABLE_NAME;
CREATE TABLE $TABLE_NAME (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    genre VARCHAR(255),
    type VARCHAR(100),
    episodes INT,
    rating FLOAT,
    members INT
);
EOF

# Rename to match table name for mysqlimport
cp "$CSV_FILE" "$TABLE_NAME.csv"

# Load CSV into MySQL
echo "Importing CSV into MySQL..."
mysqlimport --local --fields-terminated-by=',' --ignore-lines=1 \
  -u "$MYSQL_USER" -p"$MYSQL_PASS" "$DB_NAME" "$TABLE_NAME.csv"

echo "Dataset successfully imported into MySQL."