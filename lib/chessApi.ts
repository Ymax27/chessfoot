export interface ChessProfile {
    username: string;
    player_if: number;
    title?: string; //GM, IM, FM ...
    status: string;
    avatar?: string;
    location?: string;
    joined: number;
}

export interface chessStats {
    chess_daily?: { last: { rating: number } };
    chess_rapid?: { last: { rating: number}; record: { win: number; loss: number; draw: number } };
    chess_bullet?: { last: { rating: number } };
    chess_blitz?: { last: { rating: number } };
    tatics?: { highest: { rating: number } };
    puzzle_rush?: { best: { total_attemps: number; score: number } };

}

export interface PlayerData {
    profile: ChessProfile;
    stats: chessStats;
}

const USER_AGENT = 'ChessFoot App(https://github.com/ymax27/chessfoot';

export async function getPlayerData(username: string): Promise<PlayerData | null> {
    const cleanUsername = username.trim().toLowerCase();
    
    try {
        const headers = {'User-Agent': USER_AGENT};
        const [profileRes, statRes] = await Promise.all([
            fetch(`https://api.chess.com/pub/player/${cleanUsername}`, { headers }),
            fetch(`https://api.chess.com/pub/player/${cleanUsername}/stats`, { headers })
        ]);

        if (profileRes.status === 404 || statRes.status === 404) {
            return null;
        }

        if (!profileRes.ok || !statRes.ok) {
            throw new Error(`Erreur HTTP: ${profileRes.status}`);
        }

        const profile: ChessProfile = await profileRes.json();
        const stats: chessStats = await statRes.json();

        return { profile, stats };
    } catch (error) {
        console.error('Erreur lors de la recuperation des donnees chess com', error);
        return null;
    }
}