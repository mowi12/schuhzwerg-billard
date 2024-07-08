import json
import math

OLD_FILE = "results.json"
NEW_FILE = "data.json"

class EloRatingSystem:
    def __init__(self, k_factor=32):
        self.k_factor = k_factor
    
    def __init__(self, k_factor=32):
        self.k_factor = k_factor

    def expected_score(self, rating_a, rating_b):
        return 1 / (1 + math.pow(10, (rating_b - rating_a) / 400))

    def update_ratings(self, rating_a, rating_b, score_a):
        expected_score_a = self.expected_score(rating_a, rating_b)
        expected_score_b = self.expected_score(rating_b, rating_a)

        new_rating_a = rating_a + self.k_factor * (score_a - expected_score_a)
        new_rating_b = rating_b + self.k_factor * ((1 - score_a) - expected_score_b)

        return int(round(new_rating_a)), int(round(new_rating_b))
    
elosystem = EloRatingSystem()

with open(OLD_FILE) as old_file:
    old_file_json = json.load(old_file)

    old_players = old_file_json["players"]
    old_highscore = old_file_json["highscore"]
    old_games = old_file_json["games"]

    players = []
    games = []
    highscores = [
        {
            "name": "most_games",
            "value": 0,
            "player": ""
        },
        {
            "name": "most_wins",
            "value": 0,
            "player": ""
        },
        {
            "name": "highest_elo",
            "value": 1000,
            "player": ""
        },
        {
            "name": "longest_win_streak",
            "value": 0,
            "player": ""
        }    
    ]

    for player in old_players:
        players.append({
            "name": player["name"], # Done
            "games": 0, # Done
            "wins": 0, # Done
            "losses": 0, # Done
            "draws": 0, # Done
            "elo": 1000, # Done
            "lowest_elo": 1000, # Done
            "highest_elo": 1000, # Done
            "winrate": 0, # Done
            "current_win_streak": 0, # Done
            "longest_win_streak": 0 # Done
        })
    
    for game in old_games:
        for player in players:
            # Check if player is in the game
            if game["players"][0] != player["name"] and game["players"][1] != player["name"]:
                continue
          
            player["games"] += 1

            # Check if player won the game, update wins, losses, draws, winrate
            if game["winner"] == player["name"]:
                player["wins"] += 1
                player["current_win_streak"] += 1
                if player["current_win_streak"] > player["longest_win_streak"]:
                    player["longest_win_streak"] = player["current_win_streak"]
            elif game["winner"] == "":
                player["draws"] += 1
                player["current_win_streak"] = 0
            else:
                player["losses"] += 1
                player["current_win_streak"] = 0

        # Update elo, lowest_elo, highest_elo
        player1_rating = 0
        player2_rating = 0

        if game["winner"] == "":
            player1_score = 0.5
        else:
            player1_score = game["winner"] == game["players"][0]
        
        for player in players:
            if player["name"] == game["players"][0]:
                player1_rating = player["elo"]
            if player["name"] == game["players"][1]:
                player2_rating = player["elo"]
            
        new_player1_rating, new_player2_rating = elosystem.update_ratings(player1_rating, player2_rating, player1_score)

        for player in players:
            if player["name"] == game["players"][0]:
                player["elo"] = new_player1_rating
                if new_player1_rating < player["lowest_elo"]:
                    player["lowest_elo"] = new_player1_rating
                if new_player1_rating > player["highest_elo"]:
                    player["highest_elo"] = new_player1_rating
            if player["name"] == game["players"][1]:
                player["elo"] = new_player2_rating
                if new_player2_rating < player["lowest_elo"]:
                    player["lowest_elo"] = new_player2_rating
                if new_player2_rating > player["highest_elo"]:
                    player["highest_elo"] = new_player2_rating
    
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
    
    with open(NEW_FILE, "w") as new_file:
        json.dump({
            "players": players,
            "highscores": highscores,
            "games": old_games
        }, new_file, indent=4)