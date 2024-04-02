#!/usr/bin/env python3
import argparse
import json
import math


class EloRatingSystem:
    def __init__(self, k_factor=32):
        self.k_factor = k_factor
    
    def expected_score(self, rating_a, rating_b):
        return 1 / (1 + math.pow(10, (rating_b - rating_a) / 400))
    
    def update_ratings(self, rating_a, rating_b, score_a):
        expected_score_a = self.expected_score(rating_a, rating_b)
        expected_score_b = self.expected_score(rating_b, rating_a)
        
        new_rating_a = rating_a + self.k_factor * (score_a - expected_score_a)
        new_rating_b = rating_b + self.k_factor * ((1 - score_a) - expected_score_b)
        
        print(f"Elo delta: {new_rating_a - rating_a}")
        return int(round(new_rating_a)), int(round(new_rating_b))
    

def main():
    elo_system = EloRatingSystem()
    parser = argparse.ArgumentParser()

    parser.add_argument("p1")
    parser.add_argument("p2")
    parser.add_argument("w")

    args = parser.parse_args()

    if (args.p1 == args.p2):
        print("Players cannot be the same!")
        return
    if (args.w != args.p1 and args.w != args.p2):
        print("Winner must be one of the players!")
        return

    results = json.loads(open("./results.json").read())

    found_p1 = False
    found_p2 = False

    for player in results["players"]:
        if player["name"] == args.p1:
            player["games"] += 1
            found_p1 = True
        if player["name"] == args.p2:
            player["games"] += 1
            found_p2 = True
        if player["name"] == args.w:
            player["wins"] += 1

    if not found_p1:
        results["players"].append({"name": args.p1, "games": 1, "wins": 0, "elo": 1000})
    if not found_p2:
        results["players"].append({"name": args.p2, "games": 1, "wins": 0, "elo": 1000})

    if not found_p1 or not found_p2:
      if (not found_p1 and args.w == args.p1) or (not found_p2 and args.w == args.p2):
        for player in results["players"]:
            if player["name"] == args.w:
                player["wins"] += 1

    player1_rating = 0
    player2_rating = 0
    
    player1_score = args.w == args.p1
    if args.w == args.p1:
        player1_score = 1
    else:
        player1_score = 0

    for player in results["players"]:
        if player["name"] == args.p1:
            player1_rating = player["elo"]
        if player["name"] == args.p2:
            player2_rating = player["elo"]

    new_player1_rating, new_player2_rating = elo_system.update_ratings(player1_rating, player2_rating, player1_score)

    for player in results["players"]:
        if player["name"] == args.p1:
            player["elo"] = new_player1_rating
        if player["name"] == args.p2:
            player["elo"] = new_player2_rating

    results["games"].append({"players":[args.p1, args.p2], "winner": args.w})

    with open("./results.json", "w") as f:
        f.write(json.dumps(results, indent=4))

    print("Done!")


if __name__ == "__main__":
    main()
