import {
    Games,
    LeadboardData,
    LeaderboardEntry,
} from "@site/src/types/leaderboard";
import fs from "fs";

const minimumParticipationThreshold = 3;

interface GameData {
    games: Games[];
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
        a.participations < minimumParticipationThreshold ? 1 : 0;
    minimumParticipationComparison -=
        b.participations < minimumParticipationThreshold ? 1 : 0;
    if (minimumParticipationComparison !== 0) {
        return minimumParticipationComparison;
    }

    const winrateComparison = b.winrate - a.winrate;
    if (winrateComparison !== 0) {
        return winrateComparison;
    }

    const winsComparison = b.wins - a.wins;
    if (winsComparison !== 0) {
        return winsComparison;
    }

    const participationsComparison = a.participations - b.participations;
    if (participationsComparison !== 0) {
        return participationsComparison;
    }

    return 0;
}

function initializeParticipants(leaderboard: LeaderboardEntry[], games: Games) {
    for (const participant of games.players) {
        let match = leaderboard.find((player) => player.name === participant);
        if (match === undefined) {
            // If there's no match, create a new entry with default values
            match = {
                name: participant,
                winrate: 0,
                wins: 0,
                participations: 0,
                place: 0,
            };
            leaderboard.push(match);
        }
        match.participations++;
        match.wins += games.winner === participant ? 1 : 0;
        match.winrate = match.wins / match.participations;
    }
}

function fillLeaderboardData(data: GameData): LeaderboardEntry[] {
    const leaderboard: LeaderboardEntry[] = [];

    // Add points to players
    for (const game of data.games) {
        initializeParticipants(leaderboard, game);
    }

    leaderboard.sort(sortLeaderBoard);

    for (let i = 0; i < leaderboard.length; i++) {
        const entry = leaderboard[i];
        entry.place = i + 1;
    }

    return leaderboard;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function leaderboardPlugin(_context: unknown, _options: unknown) {
    return {
        name: "leaderboard-plugin",
        async loadContent() {
            const data = fs.readFileSync("./results.json", "utf8");
            return JSON.parse(data);
        },
        async contentLoaded(wrapper: ContentWrapper) {
            const { content, actions } = wrapper;
            const { setGlobalData } = actions;

            // Calculate points and metrics
            const singleLeaderboard = fillLeaderboardData(content);

            for (let i = 0; i < content.games.length; i++) {
                const game = content.games[i];
                game.id = i;
            }

            setGlobalData({
                singleLeaderboard,
                games: content.games,
            });
        },
    };
}

export default leaderboardPlugin;
