// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PlayerCard from '@/components/PlayerCard';
import { PlayerFUTStats } from '@/lib/mapStats';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('hikaru');
  const [searchInput, setSearchInput] = useState('hikaru');
  
  // États Duel
  const [duelUser1, setDuelUser1] = useState('hikaru');
  const [duelUser2, setDuelUser2] = useState('magnuscarlsen');

  const [card, setCard] = useState<PlayerFUTStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchCard = async (targetUser: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/player/${targetUser}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Joueur introuvable');
      }

      setCard(data);
    } catch (err: any) {
      setError(err.message);
      setCard(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCard('hikaru');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setUsername(searchInput.trim());
      fetchCard(searchInput.trim());
    }
  };

  const handleStartDuel = (e: React.FormEvent) => {
    e.preventDefault();
    if (duelUser1.trim() && duelUser2.trim()) {
      router.push(`/duel/${duelUser1.trim()}/${duelUser2.trim()}`);
    }
  };

  const copyMarkdown = () => {
    if (!card) return;
    const markdown = `![ChessFoot Card](https://chessfoot.com/api/card/${card.username})`;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="p-8 font-sans bg-slate-950 text-white min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-extrabold mb-2 text-amber-400 tracking-tight">
        ChessFoot
      </h1>
      <p className="text-slate-400 mb-8 text-sm text-center max-w-sm">
        Transforme n&apos;importe quel profil Chess.com en carte FIFA Ultimate Team.
      </p>

      {/* Recherche Solo */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4 w-full max-w-md">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Entre un pseudo Chess.com..."
          className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500 transition-colors"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-amber-500 hover:bg-amber-600 font-bold rounded-xl text-slate-950 transition-colors"
        >
          Chercher
        </button>
      </form>

      {/* Formulaire Duel */}
      <form onSubmit={handleStartDuel} className="flex gap-2 mb-8 w-full max-w-md bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
        <input
          type="text"
          value={duelUser1}
          onChange={(e) => setDuelUser1(e.target.value)}
          placeholder="Joueur 1"
          className="w-1/2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
        />
        <span className="text-xs font-black text-red-500 flex items-center">VS</span>
        <input
          type="text"
          value={duelUser2}
          onChange={(e) => setDuelUser2(e.target.value)}
          placeholder="Joueur 2"
          className="w-1/2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
        />
        <button
          type="submit"
          className="px-4 py-1.5 bg-red-600 hover:bg-red-700 font-bold text-xs rounded-lg text-white transition-colors"
        >
          Duel
        </button>
      </form>

      {/* Rendu des états */}
      {loading && (
        <p className="text-amber-400 animate-pulse font-semibold my-12">
          Génération de la carte pour {username}...
        </p>
      )}

      {error && !loading && (
        <div className="p-4 bg-red-950/80 border border-red-500 rounded-xl text-center max-w-md my-8">
          <p className="text-red-400 font-bold mb-1">Erreur</p>
          <p className="text-sm text-slate-300">{error}</p>
        </div>
      )}

      {!loading && card && (
        <div className="flex flex-col items-center gap-6">
          <PlayerCard data={card} />
          
          <button
            onClick={copyMarkdown}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold rounded-lg text-slate-300 transition-colors"
          >
            {copied ? '✓ Lien Markdown copié !' : '📋 Copier le badge pour GitHub (README.md)'}
          </button>
        </div>
      )}
    </main>
  );
}