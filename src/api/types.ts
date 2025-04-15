export interface CreateTokenParams {
  name: string
  symbol: string
  file: File
  init_liquidity: number
  total_supply: string
}

export interface TokenInfo {
  token_id: number
  token_name: string
  token_symbol: string
  token_address: string
  token_decimal: number
  total_supply: number
  total_buy_amount: number
  buy_transactions: number
  total_sell_amount: number
  sell_transactions: number
  net_volume: number
  total_transactions: number
  last_trade_time: string | null
  first_trade_time: string | null
  created_at: string
  mint_percent: number
  buy_percent: number
  trading_activity: number
}

export type TokenList = TokenInfo[]
