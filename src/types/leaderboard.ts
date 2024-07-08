export interface LeaderboardEntry {
    place: number;
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
}

export interface LeadboardData {
    minimumParticipationThreshold: number;
    singleLeaderboard: LeaderboardEntry[];
}
