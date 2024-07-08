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

        print(f"Elo delta: {int(round(new_rating_a - rating_a))}")
        return int(round(new_rating_a)), int(round(new_rating_b))
    

def check_and_manage_new_players(player1_name, player2_name, players):
    found_p1 = False
    found_p2 = False

    for player in players:
        if player["name"] == player1_name:
            found_p1 = True
        if player["name"] == player2_name:
            found_p2 = True

    if found_p1 == False:
        players.append({
            "name": player1_name,
            "games": 0,
            "wins": 0,
            "losses": 0,
            "draws": 0,
            "elo": 1000,
            "lowest_elo": 1000,
            "highest_elo": 1000,
            "winrate": 0,
            "current_win_streak": 0,
            "longest_win_streak": 0
        })
    if found_p2 == False:
        players.append({
            "name": player2_name,
            "games": 0,
            "wins": 0,
            "losses": 0,
            "draws": 0,
            "elo": 1000,
            "lowest_elo": 1000,
            "highest_elo": 1000,
            "winrate": 0,
            "current_win_streak": 0,
            "longest_win_streak": 0
        })


def update_elo(player1_name, player2_name, winner, players, elosystem):
    player1_rating = 0
    player2_rating = 0

    if winner == "":
        player1_score = 0.5
    else:
        player1_score = winner == player1_name
    
    for player in players:
        if player["name"] == player1_name:
            player1_rating = player["elo"]
        if player["name"] == player2_name:
            player2_rating = player["elo"]
        
    new_player1_rating, new_player2_rating = elosystem.update_ratings(player1_rating, player2_rating, player1_score)

    for player in players:
        if player["name"] == player1_name:
            player["elo"] = new_player1_rating
            if new_player1_rating > player["highest_elo"]:
                player["highest_elo"] = new_player1_rating
            if new_player1_rating < player["lowest_elo"]:
                player["lowest_elo"] = new_player1_rating
        if player["name"] == player2_name:
            player["elo"] = new_player2_rating
            if new_player2_rating > player["highest_elo"]:
                player["highest_elo"] = new_player2_rating
            if new_player2_rating < player["lowest_elo"]:
                player["lowest_elo"] = new_player2_rating


def update_other_stats(players, highscores):
    for player in players:
        player["winrate"] = round(player["wins"] / player["games"], 2)
        if player["games"] > highscores[0]["value"]:
            highscores[0]["value"] = player["games"]
            highscores[0]["player"] = player["name"]
        if player["wins"] > highscores[1]["value"]:
            highscores[1]["value"] = player["wins"]
            highscores[1]["player"] = player["name"]
        if player["highest_elo"] > highscores[2]["value"]:
            highscores[2]["value"] = player["highest_elo"]
            highscores[2]["player"] = player["name"]
        if player["longest_win_streak"] > highscores[3]["value"]:
            highscores[3]["value"] = player["longest_win_streak"]
            highscores[3]["player"] = player["name"]


def main():
    elosystem = EloRatingSystem()
    data = json.loads(open("./data.json").read())
    players = data["players"]
    games = data["games"]
    highscores = data["highscores"]

    parser = argparse.ArgumentParser()
    parser.add_argument("p1", help="Name of first player.")
    parser.add_argument("p2", help="Name of second player.")
    parser.add_argument("-w", default="", help="Name of winner, omit if draw. Has to be name of p1 or p2.")
    args = parser.parse_args()

    # Check if players are the same
    if (args.p1 == args.p2):
        print("Players cannot be the same!")
        return
    # Check if winner is one of the players
    if args.w:
        if (args.w != args.p1 and args.w != args.p2):
            print("Winner must be one of the players!")
            return
    
    check_and_manage_new_players(args.p1, args.p2, players)

    for player in players:
        if player["name"] != args.p1 and player["name"] != args.p2:
            continue
        
        player["games"] += 1

        if args.w == player["name"]:
            player["wins"] += 1
            player["current_win_streak"] += 1
            if player["current_win_streak"] > player["longest_win_streak"]:
                player["longest_win_streak"] = player["current_win_streak"]
        elif args.w == "":
            player["draws"] += 1
            player["current_win_streak"] = 0
        else:
            player["losses"] += 1
            player["current_win_streak"] = 0
    
    update_elo(args.p1, args.p2, args.w, players, elosystem)
    update_other_stats(players, highscores)

    games.append({
        "players": [args.p1, args.p2],
        "winner": args.w
    })

    with open("./data.json", "w") as file:
        json.dump({"players": players, "highscores": highscores, "games": games}, file, indent=4)

    print("Game successfully added!")

if __name__ == "__main__":
    main()
