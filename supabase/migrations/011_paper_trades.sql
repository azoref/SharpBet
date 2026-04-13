CREATE TABLE IF NOT EXISTS paper_trades (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  detected_at     timestamptz NOT NULL DEFAULT now(),
  wallet          text NOT NULL,
  wallet_score    numeric,
  token_id        text,
  market_slug     text,
  question        text,
  outcome         text,
  direction       text NOT NULL DEFAULT 'BUY',
  entry_price     numeric NOT NULL,
  usdc_size       numeric NOT NULL DEFAULT 100,
  real_trade_size numeric,
  tx_hash         text UNIQUE,
  status          text NOT NULL DEFAULT 'open',
  exit_price      numeric,
  pnl_usd         numeric,
  resolved_at     timestamptz
);

CREATE INDEX IF NOT EXISTS idx_paper_trades_status ON paper_trades(status);
CREATE INDEX IF NOT EXISTS idx_paper_trades_wallet ON paper_trades(wallet);
CREATE INDEX IF NOT EXISTS idx_paper_trades_detected ON paper_trades(detected_at DESC);

ALTER TABLE paper_trades ENABLE ROW LEVEL SECURITY;

-- Public read (anyone can see the portfolio)
CREATE POLICY "paper_trades_read" ON paper_trades FOR SELECT USING (true);
-- Only service role can write
