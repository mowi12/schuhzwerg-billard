#!/usr/bin/env python3
import json


def main():
    results = json.loads(open("./results.json").read())

    lastgame = results["games"][-1]

    for player in lastgame["players"]:
        for entry in results["players"]:
            if player == entry["name"]:
                entry["games"] -= 1

    for entry in results["players"]:
        if lastgame["winner"] == entry["name"]:
            entry["wins"] -= 1

    for i in range(len(results["players"])):
        if results["players"][i]["games"] == 0:
            del results["players"][i]

    del results["games"][-1]

    with open("./results.json", "w") as f:
        f.write(json.dumps(results, indent=4))

    print("Done!")


if __name__ == "__main__":
    main()
