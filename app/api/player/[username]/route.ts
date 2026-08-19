// src/app/api/player/[username]/route.ts
import { NextResponse } from 'next/server';
import { getPlayerData } from '@/lib/chessApi';
import { mapChessToFUT } from '@/lib/mapStats';
import { getCachedCard, setCachedCard } from '@/lib/cache';

export async function GET(
  request: Request,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params;

    if (!username) {
      return NextResponse.json({ error: 'Pseudo manquant' }, { status: 400 });
    }

    const cleanUser = username.trim().toLowerCase();

    // 1. Vérifier si la carte est déjà en cache Redis
    const cachedCard = await getCachedCard(cleanUser);
    if (cachedCard) {
      return NextResponse.json(cachedCard);
    }

    // 2. Si pas en cache, récupérer sur Chess.com
    const data = await getPlayerData(cleanUser);

    if (!data) {
      return NextResponse.json(
        { error: 'Joueur introuvable sur Chess.com' },
        { status: 404 }
      );
    }

    // 3. Calculer les statistiques
    const futCard = mapChessToFUT(data.profile, data.stats);

    // 4. Mettre en cache pour 1 heure
    await setCachedCard(cleanUser, futCard);

    return NextResponse.json(futCard);
  } catch (error) {
    console.error('Erreur serveur API Route:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}