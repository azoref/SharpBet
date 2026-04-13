import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createServiceClient()

    const { data: trades } = await supabase
      .from('paper_trades')
      .select('*')
      .order('detected_at', { ascending: false })
      .limit(50)

    const rows = trades ?? []
    const open  = rows.filter(r => r.status === 'open').length
    const won   = rows.filter(r => r.status === 'won').length
    const lost  = rows.filter(r => r.status === 'lost').length
    const resolved = won + lost
    const winRate = resolved >= 3 ? Math.round((won / resolved) * 100) : null
    const totalPnl = rows.reduce((sum, r) => sum + (r.pnl_usd ?? 0), 0)

    return NextResponse.json({
      trades: rows,
      stats: { total: rows.length, open, won, lost, winRate, totalPnl: parseFloat(totalPnl.toFixed(2)) },
    })
  } catch {
    return NextResponse.json({ trades: [], stats: null })
  }
}
