#!/bin/bash

set -e

# Prompt for MySQL credentials
read -p "Enter MySQL username: " MYSQL_USER
read -s -p "Enter MySQL password: " MYSQL_PASS
echo

# Define file paths
SQL_FILE="$1"
OUT_FILE="$2"
DB_NAME="AnimeRatingApp"

# Run SQL file and capture output
echo "Running $SQL_FILE and writing output to $OUT_FILE..."
mysql -u "$MYSQL_USER" -p"$MYSQL_PASS" "$DB_NAME" < "$SQL_FILE" > "$OUT_FILE"

echo "Done. Output written to $OUT_FILE."
