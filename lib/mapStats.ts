// src/lib/mapStats.ts
import { ChessProfile, ChessStats } from './chessApi';

export interface PlayerFUTStats {
  username: string;
  avatar: string;
  title?: string;
  overall: number;
  role: 'Reine' | 'Tour' | 'Cavalier' | 'Fou' | 'Roi';
  stats: {
    pac: number; // Rapidité (Bullet / Blitz)
    sho: number; // Finition (Taux de victoires Rapid)
    pas: number; // Vision & Régularité (Volume de parties)
    dri: number; // Technique (Tactique / Puzzles)
    def: number; // Solidité (Résistance / Ratio victoires/défaites)
    phy: number; // Endurance (Ancienneté du compte)
  };
}

/**
 * Normalise un score Elo/valeur entre une borne min et max vers une note entre 40 et 88 (hors légende)
 */
function normalizeRating(value: number, min = 400, max = 2400): number {
  const capped = Math.min(Math.max(value, min), max);
  const scaled = 40 + ((capped - min) / (max - min)) * 48; // Max standard à 88
  return Math.round(scaled);
}

export function mapChessToFUT(profile: ChessProfile, stats: ChessStats): PlayerFUTStats {
  // 1. PAC (Rythme) -> Basé sur les ratings Bullet / Blitz
  const bulletRating = stats.chess_bullet?.last?.rating || 800;
  const blitzRating = stats.chess_blitz?.last?.rating || 800;
  const pacSpeed = Math.max(bulletRating, blitzRating);
  let pac = normalizeRating(pacSpeed, 600, 2500);

  // 2. SHO (Finition) -> Basé sur le taux de victoire en Rapid
  const rapidRecord = stats.chess_rapid?.record;
  let sho = 60;
  if (rapidRecord) {
    const totalRapid = rapidRecord.win + rapidRecord.loss + rapidRecord.draw;
    const winRate = totalRapid > 0 ? (rapidRecord.win / totalRapid) * 100 : 50;
    sho = Math.round(40 + (winRate / 100) * 48);
  }

  // 3. PAS (Vision) -> Basé sur le rating Rapid
  const rapidRating = stats.chess_rapid?.last?.rating || 800;
  let pas = normalizeRating(rapidRating, 600, 2400);

  // 4. DRI (Technique) -> Basé sur la tactique / puzzles
  const puzzleRating = stats.tactics?.highest?.rating || 800;
  let dri = normalizeRating(puzzleRating, 800, 2800);

  // 5. DEF (Solidité) -> Basé sur le ratio global victoires/défaites
  let def = 65;
  if (rapidRecord) {
    const ratio = rapidRecord.loss > 0 ? rapidRecord.win / rapidRecord.loss : 1;
    def = normalizeRating(Math.round(ratio * 1000), 500, 2000);
  }

  // 6. PHY (Endurance) -> Basé sur l'ancienneté du compte en années
  const yearsJoined = (Date.now() / 1000 - profile.joined) / (365 * 24 * 3600);
  let phy = Math.min(Math.round(50 + yearsJoined * 6), 88);

  // --- BONUS LÉGENDAIRE (Palier 90+) ---
  // Si le joueur possède un titre officiel FIDE (GM, IM, FM, NM)
  const isLegend = Boolean(profile.title);
  if (isLegend) {
    pac = Math.min(pac + 10, 99);
    sho = Math.min(sho + 10, 99);
    pas = Math.min(pas + 10, 99);
    dri = Math.min(dri + 10, 99);
    def = Math.min(def + 10, 99);
    phy = Math.min(phy + 10, 99);
  }

  // Score global (Overall)
  const overall = Math.round((pac + sho + pas + dri + def + phy) / 6);

  // --- RÔLE D'ÉCHECS ---
  let role: PlayerFUTStats['role'] = 'Roi';
  const maxStat = Math.max(pac, sho, pas, dri, def);

  if (maxStat === pac) role = 'Cavalier';      // Vitesse & imprévisibilité
  else if (maxStat === sho) role = 'Reine';    // Attaquant polyvalent & finisseur
  else if (maxStat === dri) role = 'Fou';      // Technique & finesse de calcul
  else if (maxStat === def) role = 'Tour';     // Bloc solide & défense
  else role = 'Roi';                           // Patience & vision globale

  return {
    username: profile.username,
    avatar: profile.avatar || 'https://images.chesscomfiles.com/uploads/v1/user/0.penguin.png',
    title: profile.title,
    overall,
    role,
    stats: { pac, sho, pas, dri, def, phy },
  };
}