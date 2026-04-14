import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#060608',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 64px',
          fontFamily: 'monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(74,222,128,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.025) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Green glow center-left */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '-100px',
            transform: 'translateY(-50%)',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 65%)',
          }}
        />

        {/* Top: logo + status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#e8e8f0', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px' }}>SHARP</span>
            <span style={{ color: '#4ade80', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px' }}>BET</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(74,222,128,0.06)',
              border: '1px solid rgba(74,222,128,0.15)',
              borderRadius: '999px',
              padding: '8px 18px',
            }}
          >
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80' }} />
            <span style={{ color: 'rgba(74,222,128,0.7)', fontSize: '12px', letterSpacing: '2.5px' }}>BOT ACTIVE</span>
          </div>
        </div>

        {/* Main copy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
          <span style={{ color: 'rgba(74,222,128,0.4)', fontSize: '13px', letterSpacing: '3px' }}>
            AUTOMATED PAPER TRADING
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: '#e8e8f0', fontSize: '68px', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-2px' }}>
              We analyzed 86M trades.
            </span>
            <span style={{ color: '#4ade80', fontSize: '68px', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-2px' }}>
              The bot does the rest.
            </span>
          </div>
          <p style={{ color: '#555566', fontSize: '22px', margin: 0, lineHeight: 1.5, maxWidth: '680px' }}>
            The top 200 wallets on Polymarket, watched 24/7. Every trade mirrored automatically as a paper position.
          </p>
        </div>

        {/* Bottom stats */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            borderTop: '1px solid #111116',
            paddingTop: '28px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', gap: '48px' }}>
            {[
              { label: 'TRADES ANALYZED', value: '86M',  green: false },
              { label: 'WIN RATE',         value: '78%',  green: true  },
              { label: 'WALLETS WATCHED',  value: '200',  green: false },
              { label: 'MONTHLY COST',     value: '$29',  green: false },
            ].map(({ label, value, green }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ color: '#2a2a3a', fontSize: '10px', letterSpacing: '2px' }}>{label}</span>
                <span style={{ color: green ? '#4ade80' : '#e8e8f0', fontSize: '24px', fontWeight: 700 }}>{value}</span>
              </div>
            ))}
          </div>
          <span style={{ color: '#2a2a3a', fontSize: '15px' }}>getsharpbet.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
