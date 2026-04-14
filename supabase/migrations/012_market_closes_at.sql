-- Add market close date to whale_signals so resolved markets can be filtered out
ALTER TABLE public.whale_signals
  ADD COLUMN IF NOT EXISTS market_closes_at timestamptz;

-- Index for filtering open markets
CREATE INDEX IF NOT EXISTS whale_signals_closes_at_idx
  ON public.whale_signals (market_closes_at);
