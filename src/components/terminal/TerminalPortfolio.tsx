'use client'

import { useEffect, useState } from 'react'

interface PaperTrade {
  id: string
  detected_at: string
  wallet: string
  wallet_score: number
  question: string
  outcome: string
  direction: string
  entry_price: number
  usdc_size: number
  real_trade_size: number
  status: 'open' | 'won' | 'lost'
  exit_price: number | null
  pnl_usd: number | null
}

interface PortfolioStats {
  total: number
  open: number
  won: number
  lost: number
  winRate: number | null
  totalPnl: number
}

function StatBox({ label, value, accent }: { label: string; value: string; accent?: 'green' | 'red' | 'default' }) {
  const color = accent === 'green' ? 'text-[#00c805]' : accent === 'red' ? 'text-red-400' : 'text-[#e8e8f0]'
  return (
    <div className="flex flex-col gap-0.5 px-4 py-3 border-r border-[#1f1f1f] last:border-0">
      <span className={`font-mono text-sm font-bold tabular-nums ${color}`}>{value}</span>
      <span className="text-[9px] font-mono text-[#444444] uppercase tracking-widest">{label}</span>
    </div>
  )
}

export default function TerminalPortfolio() {
  const [trades, setTrades] = useState<PaperTrade[]>([])
  const [stats, setStats] = useState<PortfolioStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portfolio')
      .then(r => r.json())
      .then(d => {
        setTrades(d.trades ?? [])
        setStats(d.stats ?? null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-[10px] font-mono text-[#333333] animate-pulse">LOADING PORTFOLIO...</span>
      </div>
    )
  }

  const isEmpty = trades.length === 0

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Stats bar */}
      {stats && (
        <div className="flex border-b border-[#1f1f1f] shrink-0 bg-[#050505]">
          <StatBox label="Open" value={String(stats.open)} />
          <StatBox label="Won" value={String(stats.won)} accent="green" />
          <StatBox label="Lost" value={String(stats.lost)} accent="red" />
          <StatBox
            label="Win rate"
            value={stats.winRate !== null ? `${stats.winRate.toFixed(0)}%` : '--'}
            accent={stats.winRate !== null ? (stats.winRate >= 50 ? 'green' : 'red') : 'default'}
          />
          <StatBox
            label="Paper P&L"
            value={stats.totalPnl >= 0 ? `+$${stats.totalPnl.toFixed(0)}` : `-$${Math.abs(stats.totalPnl).toFixed(0)}`}
            accent={stats.totalPnl >= 0 ? 'green' : 'red'}
          />
        </div>
      )}

      {/* Trade list */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
            <span className="text-2xl">🤖</span>
            <p className="text-xs font-mono text-[#444444] uppercase tracking-widest">Bot active</p>
            <p className="text-[11px] text-[#333333] max-w-xs leading-relaxed">
              Paper trades will appear here automatically when a top-scored wallet makes a significant move.
            </p>
          </div>
        ) : (
          trades.map(t => (
            <div key={t.id} className="border-b border-[#111111] px-3 py-2.5 hover:bg-[#0d0d0d] transition-colors">
              {/* Row 1: status + market */}
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  t.status === 'open' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                  t.status === 'won'  ? 'bg-green-500/10 text-[#00c805] border border-green-500/20' :
                                        'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {t.status === 'open' ? 'OPEN' : t.status === 'won' ? 'WON' : 'LOST'}
                </span>
                <span className="text-[11px] text-[#cccccc] font-medium truncate flex-1">
                  {t.question || 'Unknown market'}
                </span>
              </div>

              {/* Row 2: outcome + prices */}
              <div className="flex items-center gap-3 text-[10px] font-mono text-[#555555] mb-1">
                <span className="text-green-500/70">{t.outcome}</span>
                <span>Entry {t.entry_price.toFixed(3)}</span>
                {t.exit_price !== null && <span>Exit {t.exit_price.toFixed(3)}</span>}
                <span className="ml-auto text-[#333333]">${t.usdc_size} paper</span>
              </div>

              {/* Row 3: wallet + P&L */}
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="text-[#333333]">{t.wallet.slice(0, 10)}...</span>
                <span className="text-[#444444]">score {t.wallet_score?.toFixed(1)}</span>
                {t.pnl_usd !== null && (
                  <span className={`ml-auto font-bold ${t.pnl_usd >= 0 ? 'text-[#00c805]' : 'text-red-400'}`}>
                    {t.pnl_usd >= 0 ? '+' : ''}{t.pnl_usd.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
