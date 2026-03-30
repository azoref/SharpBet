import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// No Next.js cache — we want fresh data from Supabase on every request
export const revalidate = 0

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Pull last 24h of whale signals, biggest first
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString()

    const { data, error } = await supabase
      .from('whale_signals')
      .select('*')
      .gte('traded_at', since)
      .order('usd_size', { ascending: false })
      .limit(30)

    if (error) {
      console.error('[signals API] Supabase error:', error.message)
      return NextResponse.json({ signals: [], error: error.message })
    }

    const signals = (data ?? []).map(row => ({
      wallet:      row.wallet,
      pseudonym:   row.pseudonym || `${row.wallet.slice(0, 6)}...${row.wallet.slice(-4)}`,
      side:        row.side,
      outcome:     row.outcome,
      price:       row.price,
      usdSize:     row.usd_size,
      title:       row.title,
      slug:        row.event_slug || row.slug,
      timestamp:   Math.floor(new Date(row.traded_at).getTime() / 1000),
      txHash:      row.tx_hash,
      impliedProb: Math.round(row.price * 100),
    }))

    return NextResponse.json({
      signals,
      updatedAt: new Date().toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json(
      { signals: [], error: err.message },
      { status: 500 }
    )
  }
}
