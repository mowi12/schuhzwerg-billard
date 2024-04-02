export interface LeaderboardEntry {
    name: string;
    elo: number;
    winrate: number;
    wins: number;
    participations: number;
    place: number;
}

export interface Games {
    id: number;
    players: string[];
    winner: string;
}

export interface LeadboardData {
    singleLeaderboard: LeaderboardEntry[];
    games: Games[];
}
