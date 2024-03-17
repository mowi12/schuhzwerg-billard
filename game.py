#!/usr/bin/env python3
import argparse
import json


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument("-p1")
    parser.add_argument("-p2")
    parser.add_argument("-w")

    args = parser.parse_args()

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
        results["players"].append({"name": args.p1, "games": 1, "wins": 0})
    if not found_p2:
        results["players"].append({"name": args.p2, "games": 1, "wins": 0})

    if not found_p1 or not found_p2:
        if (not found_p1 and args.w == args.p1) or (not found_p2 and args.w == args.p2):
            for player in results["players"]:
                if player["name"] == args.w:
                    player["wins"] += 1

    results["games"].append({"players":[args.p1, args.p2], "winner": args.w})

    with open("./results.json", "w") as f:
        f.write(json.dumps(results, indent=4))

    print("Done!")


def check_args(args):
    pass


if __name__ == "__main__":
    main()
