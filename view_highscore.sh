#!/bin/bash

file="results.json"

if [[ ! -f "$file" ]]; then
    echo "Error: $file not found."
    exit 1
fi

highscore_value=$(jq '.highscore.elo' "$file")
highscore_player=$(jq -r '.highscore.player' "$file")

echo "Player $highscore_player has the highest elo with a value of $highscore_value"

