const BOOKS = [
  'DraftKings',
  'FanDuel',
  'BetMGM',
  'Caesars',
  'PointsBet',
  'WynnBET',
  'Barstool',
  'BetOnline',
  'Bovada',
  'MyBookie',
  'BetRivers',
  'Hard Rock Bet',
]

export default function BookStrip() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-[#2a2a32]">
      <p className="text-center text-xs text-[#4a4a55] uppercase tracking-widest font-mono mb-8">
        Books we watch · 24/7
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {BOOKS.map(book => (
          <span
            key={book}
            className="px-3 py-1.5 rounded border border-[#2a2a32] bg-[#0d0d10] text-[#6b6b80] text-sm font-medium hover:border-[#3a3a45] hover:text-[#9999aa] transition-colors"
          >
            {book}
          </span>
        ))}
      </div>
    </section>
  )
}
