export interface LeaderboardEntry {
    elo: number;
    name: string;
    winrate: number;
    wins: number;
    participations: number;
}

export interface Games {
    id: number;
    players: string[];
    winner: string;
}

export interface LeadboardData {
    minimumParticipationThreshold: number;
    singleLeaderboard: LeaderboardEntry[];
    games: Games[];
}
