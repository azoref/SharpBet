import { NextResponse } from 'next/server'

export const revalidate = 60 // cache for 60 seconds

const GAMMA_API = 'https://gamma-api.polymarket.com'
const DATA_API = 'https://data-api.polymarket.com'
const WHALE_THRESHOLD_USD = 3000 // flag trades above this size

interface PolyTrade {
  proxyWallet: string
  side: string
  size: number
  price: number
  timestamp: number
  title: string
  slug: string
  outcome: string
  pseudonym: string
  transactionHash: string
}

interface PolyMarket {
  conditionId: string
  clobTokenIds: string[]
  outcomePrices: string[]
  outcomes: string[]
  question: string
  volume: number
  liquidity: number
  startDate: string
  endDate: string
}

async function getNBAMarkets(): Promise<PolyMarket[]> {
  try {
    const res = await fetch(`${GAMMA_API}/events?active=true&closed=false&tag_slug=nba&limit=20`, {
      next: { revalidate: 120 },
    })
    if (!res.ok) return []
    const events = await res.json()

    const markets: PolyMarket[] = []
    for (const event of events) {
      if (event.markets) {
        for (const m of event.markets) {
          if (m.clobTokenIds && m.active && !m.closed) {
            markets.push(m)
          }
        }
      }
    }
    return markets.slice(0, 10)
  } catch {
    return []
  }
}

async function getRecentTrades(tokenId: string): Promise<PolyTrade[]> {
  try {
    const res = await fetch(`${DATA_API}/trades?market=${tokenId}&limit=100`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

async function getWalletStats(wallet: string) {
  try {
    const res = await fetch(`${DATA_API}/value?user=${wallet}`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const markets = await getNBAMarkets()

    if (markets.length === 0) {
      return NextResponse.json({ signals: [], markets: [] })
    }

    const signals: Array<{
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
    }> = []

    // Fetch trades for each market's first token (home team)
    await Promise.all(
      markets.slice(0, 6).map(async (market) => {
        if (!market.clobTokenIds?.length) return
        const tokenId = market.clobTokenIds[0]
        const trades = await getRecentTrades(tokenId)

        for (const trade of trades) {
          const usdSize = trade.size * trade.price
          if (usdSize >= WHALE_THRESHOLD_USD) {
            signals.push({
              wallet: trade.proxyWallet,
              pseudonym: trade.pseudonym || trade.proxyWallet.slice(0, 6) + '...' + trade.proxyWallet.slice(-4),
              side: trade.side,
              outcome: trade.outcome,
              price: trade.price,
              usdSize,
              title: trade.title,
              slug: trade.slug,
              timestamp: trade.timestamp,
              txHash: trade.transactionHash,
              impliedProb: trade.price * 100,
            })
          }
        }
      })
    )

    // Sort by size descending, dedupe by wallet+market
    const seen = new Set<string>()
    const deduped = signals
      .sort((a, b) => b.usdSize - a.usdSize)
      .filter(s => {
        const key = `${s.wallet}-${s.slug}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .slice(0, 20)

    return NextResponse.json({
      signals: deduped,
      markets: markets.map(m => ({
        question: m.question,
        volume: m.volume,
        liquidity: m.liquidity,
        outcomePrices: m.outcomePrices,
        outcomes: m.outcomes,
      })),
      updatedAt: new Date().toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
