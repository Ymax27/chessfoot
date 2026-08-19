// src/app/duel/[user1]/[user2]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PlayerCard from '@/components/PlayerCard';
import { PlayerFUTStats } from '@/lib/mapStats';

export default function DuelPage() {
  const params = useParams();
  const user1 = params.user1 as string;
  const user2 = params.user2 as string;

  const [player1, setPlayer1] = useState<PlayerFUTStats | null>(null);
  const [player2, setPlayer2] = useState<PlayerFUTStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDuel() {
      try {
        setLoading(true);
        setError(null);

        const [res1, res2] = await Promise.all([
          fetch(`/api/player/${user1}`),
          fetch(`/api/player/${user2}`),
        ]);

        if (!res1.ok || !res2.ok) {
          throw new Error('Un des joueurs est introuvable');
        }

        const data1 = await res1.json();
        const data2 = await res2.json();

        setPlayer1(data1);
        setPlayer2(data2);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (user1 && user2) {
      loadDuel();
    }
  }, [user1, user2]);

  if (loading) {
    return (
      <main className="p-8 font-sans bg-slate-950 text-white min-h-screen flex items-center justify-center">
        <p className="text-amber-400 animate-pulse font-semibold">
          Préparation du duel {user1} VS {user2}...
        </p>
      </main>
    );
  }

  if (error || !player1 || !player2) {
    return (
      <main className="p-8 font-sans bg-slate-950 text-white min-h-screen flex items-center justify-center">
        <div className="p-6 bg-red-950/80 border border-red-500 rounded-xl text-center">
          <p className="text-red-400 font-bold">Erreur du mode Duel</p>
          <p className="text-sm text-slate-300 mt-1">{error || 'Données indisponibles'}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 font-sans bg-slate-950 text-white min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-black mb-8 text-amber-400 tracking-tight flex items-center gap-3">
        <span>{player1.username}</span>
        <span className="text-xl text-red-500 font-extrabold italic">VS</span>
        <span>{player2.username}</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        {/* Carte Joueur 1 */}
        <div className="flex flex-col items-center gap-2">
          {player1.overall > player2.overall && (
            <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-black rounded-full uppercase tracking-wider">
              👑 Vainqueur
            </span>
          )}
          <PlayerCard data={player1} />
        </div>

        {/* Panneau de comparaison */}
        <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 text-sm font-bold">
          <h3 className="text-center text-amber-400 uppercase tracking-widest text-xs border-b border-slate-800 pb-2">
            Comparatif des Stats
          </h3>

          {[
            { key: 'pac', label: 'PAC' },
            { key: 'sho', label: 'SHO' },
            { key: 'pas', label: 'PAS' },
            { key: 'dri', label: 'DRI' },
            { key: 'def', label: 'DEF' },
            { key: 'phy', label: 'PHY' },
          ].map(({ key, label }) => {
            const val1 = player1.stats[key as keyof typeof player1.stats];
            const val2 = player2.stats[key as keyof typeof player2.stats];

            return (
              <div key={key} className="flex justify-between items-center text-xs px-2 py-1.5 bg-slate-950/60 rounded-lg">
                <span className={val1 > val2 ? 'text-green-400 font-black' : 'text-slate-400'}>{val1}</span>
                <span className="text-amber-500/80 uppercase font-black">{label}</span>
                <span className={val2 > val1 ? 'text-green-400 font-black' : 'text-slate-400'}>{val2}</span>
              </div>
            );
          })}
        </div>

        {/* Carte Joueur 2 */}
        <div className="flex flex-col items-center gap-2">
          {player2.overall > player1.overall && (
            <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-black rounded-full uppercase tracking-wider">
              👑 Vainqueur
            </span>
          )}
          <PlayerCard data={player2} />
        </div>
      </div>
    </main>
  );
}