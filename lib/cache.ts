// src/lib/cache.ts
import { Redis } from '@upstash/redis';
import { PlayerFUTStats } from './mapStats';

// Initialisation du client Redis si les clés sont présentes
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const CACHE_TTL_SECONDS = 3600; // Cache valide pendant 1 heure (3600s)

/**
 * Tente de récupérer la carte depuis le cache Redis
 */
export async function getCachedCard(username: string): Promise<PlayerFUTStats | null> {
  if (!redis) return null;
  try {
    const cached = await redis.get<PlayerFUTStats>(`card:${username.toLowerCase()}`);
    return cached;
  } catch (error) {
    console.warn('Erreur de lecture du cache Redis:', error);
    return null;
  }
}

/**
 * Enregistre la carte calculée dans le cache Redis
 */
export async function setCachedCard(username: string, data: PlayerFUTStats): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(`card:${username.toLowerCase()}`, data, {
      ex: CACHE_TTL_SECONDS,
    });
  } catch (error) {
    console.warn("Erreur d'écriture dans le cache Redis:", error);
  }
}