import { NextResponse } from 'next/server'

export const revalidate = 60 // cache for 60 seconds

export async function GET() {
  const apiKey = process.env.ODDS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'No API key' }, { status: 500 })
  }

  try {
    const url = new URL('https://api.the-odds-api.com/v4/sports/basketball_nba/odds/')
    url.searchParams.set('apiKey', apiKey)
    url.searchParams.set('regions', 'us')
    url.searchParams.set('markets', 'h2h,spreads,totals')
    url.searchParams.set('oddsFormat', 'american')

    const res = await fetch(url.toString(), { next: { revalidate: 60 } })
    if (!res.ok) {
      const body = await res.text()
      return NextResponse.json({ error: 'Odds API error', status: res.status, detail: body }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
