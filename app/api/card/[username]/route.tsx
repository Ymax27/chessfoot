// src/app/api/card/[username]/route.tsx
import { ImageResponse } from 'next/og';
import { getPlayerData } from '@/lib/chessApi';
import { mapChessToFUT } from '@/lib/mapStats';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params;
    const data = await getPlayerData(username);

    if (!data) {
      return new Response('Joueur introuvable', { status: 404 });
    }

    const card = mapChessToFUT(data.profile, data.stats);

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#020617',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Carte FIFA en Image Response */}
          <div
            style={{
              width: '320px',
              height: '480px',
              borderRadius: '24px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'linear-gradient(to bottom, #fef08a, #f59e0b, #92400e)',
              border: '4px solid #fde047',
              color: '#451a03',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '48px', fontWeight: '900', color: '#020617', lineHeight: 1 }}>
                  {card.overall}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', marginTop: '4px' }}>
                  {card.role}
                </span>
                {card.title ? (
                  <span
                    style={{
                      marginTop: '6px',
                      padding: '2px 6px',
                      backgroundColor: '#451a03',
                      color: '#fde047',
                      fontSize: '10px',
                      fontWeight: '900',
                      borderRadius: '4px',
                    }}
                  >
                    {card.title}
                  </span>
                ) : null}
              </div>

              {/* Avatar */}
              <img
                src={card.avatar}
                alt={card.username}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '16px',
                  objectFit: 'cover',
                  border: '2px solid #fde047',
                }}
              />
            </div>

            {/* Username */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0', borderBottom: '2px solid rgba(69, 26, 3, 0.2)', paddingBottom: '4px' }}>
              <span style={{ fontSize: '22px', fontWeight: '900', textTransform: 'uppercase', color: '#020617' }}>
                {card.username}
              </span>
            </div>

            {/* Grille Stats */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(69, 26, 3, 0.1)',
                borderRadius: '12px',
                padding: '12px',
              }}
            >
              <div style={{ width: '48%', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#78350f', fontSize: '12px', fontWeight: '900' }}>PAC</span>
                <span style={{ fontSize: '14px', fontWeight: '900' }}>{card.stats.pac}</span>
              </div>
              <div style={{ width: '48%', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#78350f', fontSize: '12px', fontWeight: '900' }}>DRI</span>
                <span style={{ fontSize: '14px', fontWeight: '900' }}>{card.stats.dri}</span>
              </div>
              <div style={{ width: '48%', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#78350f', fontSize: '12px', fontWeight: '900' }}>SHO</span>
                <span style={{ fontSize: '14px', fontWeight: '900' }}>{card.stats.sho}</span>
              </div>
              <div style={{ width: '48%', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#78350f', fontSize: '12px', fontWeight: '900' }}>DEF</span>
                <span style={{ fontSize: '14px', fontWeight: '900' }}>{card.stats.def}</span>
              </div>
              <div style={{ width: '48%', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#78350f', fontSize: '12px', fontWeight: '900' }}>PAS</span>
                <span style={{ fontSize: '14px', fontWeight: '900' }}>{card.stats.pas}</span>
              </div>
              <div style={{ width: '48%', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#78350f', fontSize: '12px', fontWeight: '900' }}>PHY</span>
                <span style={{ fontSize: '14px', fontWeight: '900' }}>{card.stats.phy}</span>
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'center', fontSize: '10px', textTransform: 'uppercase', fontWeight: '800', opacity: 0.8 }}>
              ChessFoot • Dynamic Card
            </div>
          </div>
        </div>
      ),
      {
        width: 400,
        height: 560,
      }
    );
  } catch (error) {
    console.error('Erreur ImageResponse:', error);
    return new Response("Erreur lors de la génération de l'image", { status: 500 });
  }
}