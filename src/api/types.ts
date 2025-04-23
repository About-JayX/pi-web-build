export interface CreateTokenParams {
  name: string
  symbol: string
  file: File
  init_liquidity: number
  total_supply: string
  description?: string
}

export interface TokenInfo {
  token_id: number
  token_name: string
  token_symbol: string
  token_address: string
  token_decimal: number
  logo: string
  total_supply: number
  total_buy_amount: number
  buy_transactions: number
  total_sell_amount: number
  sell_transactions: number
  net_volume: number
  total_transactions: number
  minter_counts: number
  last_trade_time: string
  first_trade_time: string
  created_at: string
  progress: number
  liquidity_amount: number
  net_quote_amount: number
}

export interface MintToken
  extends Omit<
    TokenInfo,
    | 'token_id'
    | 'token_name'
    | 'token_symbol'
    | 'token_address'
    | 'token_decimal'
    | 'total_supply'
    | 'total_buy_amount'
    | 'buy_transactions'
    | 'total_sell_amount'
    | 'sell_transactions'
    | 'minter_counts'
    | 'last_trade_time'
    | 'first_trade_time'
  > {
  id: number // from token_id
  name: string // from token_name
  symbol: string // from token_symbol
  address: string // from token_address
  tokenDecimal: number // from token_decimal
  totalSupply: string // formatted total_supply
  totalBuyAmount: number // formatted total_buy_amount
  buyTransactions: number // from buy_transactions
  totalSellAmount: number // formatted total_sell_amount
  sellTransactions: number // from sell_transactions
  minterCounts: number // from minter_counts
  lastTradeTime: string // from last_trade_time
  firstTradeTime: string // from first_trade_time
  image: string // same as logo
  target: string // formatted from liquidity_amount
  raised: string // formatted from net_quote_amount
  currencyUnit?: string
}

export type TokenList = TokenInfo[]

export interface UserInfo {
  userId: number
  nickname: string
  avatar_url: string
  twitterId: string | null
  telegramId: string | null
  token: string
  status: number
  free_power: number
  ip_address: string
  create_time: number
  last_time: number
  os: string
  version: string
  code: string
  solana_wallet: string
  pi_network: string | null
  from_type: string
}

export interface LoginResponse {
  success: boolean
  code: number
  msg: string
  data: {
    user: UserInfo
    authToken: string
  } | null
}

export interface SolanaLoginParams {
  publicKey: string
  message: string
  signature: number[]
  code: string
}

export interface RankItem {
  rank: number
  userId: number
  token: string
  nickname: string
  avatar_url: string
  solana_wallet?: string
}

export interface RankResponse {
  success: boolean
  msg?: string
  data: {
    total: string
    data: RankItem[]
    userRank: number | null
  }
}

interface SignInReward {
  day: number
  signedIn: boolean | null
}

interface SignInTask {
  day: number
  type: 'continuous' | 'accumulation'
  reward: string
  canClaim: boolean
}

export interface SignInInfo {
  currentStreak: number
  todaySignedIn: boolean
  Dailyrewards: string
  rewards: SignInReward[]
  task: SignInTask[]
  message: string
  status: boolean
}

export interface SignInInfoResponse {
  success: boolean
  msg?: string
  data: SignInInfo
}
