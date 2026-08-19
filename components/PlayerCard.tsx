// src/components/PlayerCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PlayerFUTStats } from '@/lib/mapStats';

interface PlayerCardProps {
  data: PlayerFUTStats;
}

export default function PlayerCard({ data }: PlayerCardProps) {
  const { username, avatar, title, overall, role, stats } = data;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="relative w-80 h-[480px] rounded-3xl p-6 flex flex-col justify-between shadow-2xl bg-gradient-to-b from-amber-200 via-amber-500 to-amber-800 text-amber-950 border-4 border-amber-300 select-none overflow-hidden"
    >
      {/* Motif de fond style échiquier discret */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Entête : Note globale, Titre & Avatar */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex flex-col items-center">
          <span className="text-5xl font-black tracking-tighter leading-none text-slate-950">
            {overall}
          </span>
          <span className="text-sm font-extrabold uppercase tracking-widest mt-1 text-amber-900">
            {role}
          </span>
          {title && (
            <span className="mt-2 px-2 py-0.5 bg-amber-950 text-amber-300 text-xs font-black rounded uppercase">
              {title}
            </span>
          )}
        </div>

        {/* Photo de profil / Avatar avec next/image */}
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-amber-300/60 bg-amber-900/20 shadow-inner">
          <Image
            src={avatar}
            alt={username}
            fill
            sizes="112px"
            className="object-cover"
            unoptimized
          />
        </div>
      </div>

      {/* Nom du joueur */}
      <div className="relative z-10 text-center my-2">
        <h2 className="text-2xl font-black uppercase tracking-wide truncate text-slate-950 border-b-2 border-amber-950/20 pb-1">
          {username}
        </h2>
      </div>

      {/* Grille des 6 Statistiques */}
      <div className="relative z-10 grid grid-cols-2 gap-x-6 gap-y-2 text-base font-black px-2 py-3 bg-amber-950/10 rounded-xl border border-amber-950/10">
        <div className="flex justify-between items-center">
          <span className="text-amber-900 text-xs uppercase">PAC</span>
          <span className="text-slate-950">{stats.pac}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-amber-900 text-xs uppercase">DRI</span>
          <span className="text-slate-950">{stats.dri}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-amber-900 text-xs uppercase">SHO</span>
          <span className="text-slate-950">{stats.sho}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-amber-900 text-xs uppercase">DEF</span>
          <span className="text-slate-950">{stats.def}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-amber-900 text-xs uppercase">PAS</span>
          <span className="text-slate-950">{stats.pas}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-amber-900 text-xs uppercase">PHY</span>
          <span className="text-slate-950">{stats.phy}</span>
        </div>
      </div>

      {/* Branding ChessFoot au bas */}
      <div className="relative z-10 text-center">
        <span className="text-[10px] uppercase font-black tracking-widest text-amber-900/70">
          ChessFoot • Official Card
        </span>
      </div>
    </motion.div>
  );
}