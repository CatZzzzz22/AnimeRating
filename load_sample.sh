#!/usr/bin/env bash

# Usage:
#   ./load_sample.sh input.csv output_sample.csv

if [ $# -ne 2 ]; then
  echo "Usage: $0 <input_csv> <output_csv>"
  exit 1
fi

INPUT_CSV="$1"
OUTPUT_CSV="$2"

head -n 30 "$INPUT_CSV" > "$OUTPUT_CSV"

echo "Created sample '$OUTPUT_CSV' with the first 30 lines of '$INPUT_CSV'."
