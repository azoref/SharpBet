'use client'
import { useEffect, useState } from 'react'

interface Signal {
  wallet: string
  pseudonym: string
  side: string
  outcome: string
  price: number
  usdSize: number
  title: string
  slug: string
  timestamp: number
  txHash: string
  impliedProb: number
}

interface SignalsData {
  signals: Signal[]
  updatedAt: string
  error?: string
}

function timeAgo(ts: number) {
  const diff = Math.floor(Date.now() / 1000) - ts
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

export default function SignalsTab() {
  const [data, setData] = useState<SignalsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/signals')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-[#4a4a55] font-mono text-sm">
        Scanning Polymarket...
      </div>
    )
  }

  if (!data || data.error || data.signals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-4xl mb-4">🐋</div>
        <p className="text-[#4a4a55] font-mono text-sm mb-2">No whale signals detected</p>
        <p className="text-[#3a3a45] text-xs max-w-sm">
          Signals appear when a wallet trades $10,000+ on an active NBA game market on Polymarket.
          Check back closer to tip-off.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[#4a4a55] font-mono">
            Tracking whale trades ($10K+) on Polymarket NBA markets · Powered by on-chain data
          </p>
        </div>
        {data.updatedAt && (
          <p className="text-[10px] text-[#3a3a45] font-mono">
            Updated {new Date(data.updatedAt).toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Signals */}
      <div className="space-y-3">
        {data.signals.map((signal, i) => (
          <div
            key={`${signal.wallet}-${signal.slug}-${i}`}
            className="bg-[#0d0d10] border border-[#1a1a1f] rounded-xl p-4 hover:border-[#2a2a32] transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Title + outcome */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-mono text-[#4a4a55]">🐋 WHALE</span>
                  <span className="text-sm font-semibold text-[#e8e8f0] truncate">{signal.title}</span>
                </div>

                {/* Trade details */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest ${
                    signal.side === 'BUY'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {signal.side}
                  </span>
                  <span className="text-sm font-medium text-[#e8e8f0]">{signal.outcome}</span>
                  <span className="text-sm font-mono text-green-400">@ {(signal.impliedProb).toFixed(1)}%</span>
                  <span className="text-xs text-[#4a4a55]">implied prob</span>
                </div>
              </div>

              {/* Right side: size + time */}
              <div className="text-right shrink-0">
                <p className="text-lg font-bold font-mono text-[#e8e8f0]">
                  ${signal.usdSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-[10px] text-[#4a4a55] font-mono mt-0.5">{timeAgo(signal.timestamp)}</p>
              </div>
            </div>

            {/* Wallet + tx */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#111114]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <span className="text-[8px] text-green-500">W</span>
                </div>
                <span className="text-[11px] font-mono text-[#6b6b80]">{signal.pseudonym}</span>
              </div>
              <a
                href={`https://polygonscan.com/tx/${signal.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono text-[#3a3a45] hover:text-green-500/60 transition-colors"
              >
                verify on-chain →
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-[#3a3a45] font-mono text-center pt-2">
        All trades are public on-chain · Polymarket · Polygon network
      </p>
    </div>
  )
}
