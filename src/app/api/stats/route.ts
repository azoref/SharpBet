import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const revalidate = 30

export async function GET() {
  try {
    const supabase = await createServiceClient()
    const since = new Date()
    since.setHours(0, 0, 0, 0)

    const [todayResult, marginResult, allTimeResult] = await Promise.all([
      supabase
        .from('arbs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', since.toISOString()),
      supabase
        .from('arbs')
        .select('profit_margin, book_a, book_b')
        .gte('created_at', since.toISOString()),
      supabase
        .from('arbs')
        .select('*', { count: 'exact', head: true }),
    ])

    const arbs = marginResult.data ?? []
    const avgMargin = arbs.length > 0
      ? arbs.reduce((sum, a) => sum + a.profit_margin, 0) / arbs.length
      : 0

    const books = new Set(arbs.flatMap(a => [a.book_a, a.book_b]))

    return NextResponse.json({
      today: todayResult.count ?? 0,
      avgMargin: parseFloat(avgMargin.toFixed(2)),
      booksMonitored: Math.max(books.size, 12), // show at least 12 even if no arbs today
      allTime: allTimeResult.count ?? 0,
    })
  } catch {
    return NextResponse.json({ today: 0, avgMargin: 0, booksMonitored: 12, allTime: 0 })
  }
}
