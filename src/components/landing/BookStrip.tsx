const BOOKS = [
  { name: 'DraftKings', color: '#53d337', bg: '#0d1f0a', abbr: 'DK' },
  { name: 'FanDuel', color: '#1493ff', bg: '#091520', abbr: 'FD' },
  { name: 'BetMGM', color: '#c8a96e', bg: '#1a1510', abbr: 'MGM' },
  { name: 'Caesars', color: '#b8973a', bg: '#181410', abbr: 'CZR' },
  { name: 'PointsBet', color: '#ff3b3b', bg: '#1a0909', abbr: 'PB' },
  { name: 'WynnBET', color: '#c9a84c', bg: '#181510', abbr: 'WYN' },
  { name: 'Barstool', color: '#e8e8f0', bg: '#111114', abbr: 'BST' },
  { name: 'BetOnline', color: '#00c46e', bg: '#091a12', abbr: 'BOL' },
  { name: 'Bovada', color: '#f5a623', bg: '#1a1409', abbr: 'BOV' },
  { name: 'MyBookie', color: '#7b68ee', bg: '#110f1e', abbr: 'MB' },
  { name: 'BetRivers', color: '#00b4d8', bg: '#091518', abbr: 'BR' },
  { name: 'Hard Rock', color: '#e8222a', bg: '#1a0909', abbr: 'HR' },
]

export default function BookStrip() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-[#2a2a32]">
      <p className="text-center text-xs text-[#4a4a55] uppercase tracking-widest font-mono mb-10">
        Books we watch · 24 / 7
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {BOOKS.map(book => (
          <div
            key={book.name}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all hover:scale-105"
            style={{
              borderColor: `${book.color}30`,
              backgroundColor: book.bg,
            }}
          >
            {/* Logo mark */}
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold font-mono shrink-0"
              style={{ backgroundColor: `${book.color}20`, color: book.color }}
            >
              {book.abbr}
            </div>
            <span className="text-sm font-medium text-[#9999aa]">{book.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
