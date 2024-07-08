import { LeadboardData, LeaderboardEntry } from "@site/src/types/leaderboard";
import fs from "fs";

const minimumParticipationThreshold = 5;

interface GameData {
    players: {
        name: string;
        elo: number;
        lowest_elo: number;
        highest_elo: number;
        winrate: number;
        games: number;
        wins: number;
        losses: number;
        draws: number;
        current_win_streak: number;
        longest_win_streak: number;
    }[];
}

interface ContentWrapper {
    content: GameData;
    actions: {
        setGlobalData(data: LeadboardData): void;
    };
}

function sortLeaderBoard(a: LeaderboardEntry, b: LeaderboardEntry): number {
    // People who have only played a few games are ranked at the bottom of the list
    let minimumParticipationComparison =
        a.games < minimumParticipationThreshold ? 1 : 0;
    minimumParticipationComparison -=
        b.games < minimumParticipationThreshold ? 1 : 0;
    if (minimumParticipationComparison !== 0) {
        return minimumParticipationComparison;
    }

    // High Elo, high winrate, high wins, low participations
    const eloComparison = b.elo - a.elo;
    if (eloComparison !== 0) {
        return eloComparison;
    }

    const winrateComparison = b.winrate - a.winrate;
    if (winrateComparison !== 0) {
        return winrateComparison;
    }

    const winsComparison = b.wins - a.wins;
    if (winsComparison !== 0) {
        return winsComparison;
    }

    const participationsComparison = a.games - b.games;
    if (participationsComparison !== 0) {
        return participationsComparison;
    }

    return 0;
}

function fillLeaderboardData(data: GameData): LeaderboardEntry[] {
    const leaderboard: LeaderboardEntry[] = [];

    for (const player of data.players) {
        const entry: LeaderboardEntry = {
            place: 0,
            name: player.name,
            elo: player.elo,
            lowest_elo: player.lowest_elo,
            highest_elo: player.highest_elo,
            winrate: player.winrate,
            games: player.games,
            wins: player.wins,
            losses: player.losses,
            draws: player.draws,
            current_win_streak: player.current_win_streak,
            longest_win_streak: player.longest_win_streak,
        };
        leaderboard.push(entry);
    }

    leaderboard.sort(sortLeaderBoard);

    for (let i = 0; i < leaderboard.length; i++) {
        leaderboard[i].place = i + 1;
    }

    return leaderboard;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function leaderboardPlugin(_context: unknown, _options: unknown) {
    return {
        name: "leaderboard-plugin",
        async loadContent() {
            const data = fs.readFileSync("./data.json", "utf8");
            return JSON.parse(data);
        },
        async contentLoaded(wrapper: ContentWrapper) {
            const { content, actions } = wrapper;
            const { setGlobalData } = actions;

            // Calculate points and metrics
            const singleLeaderboard = fillLeaderboardData(content);

            setGlobalData({
                minimumParticipationThreshold,
                singleLeaderboard,
            });
        },
    };
}

export default leaderboardPlugin;
