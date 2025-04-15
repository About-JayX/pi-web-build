import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '@/config/axios'
import { TokenList } from '@/api/types'
import { RootState } from '@/store'

interface TokenResponse {
  token_id: number
  token_name: string
  token_symbol: string
  token_address: string
  total_supply: number
  total_transactions: number
  mint_percent: number
  created_at: string
}

interface MintToken {
  id: number
  name: string
  symbol: string
  address: string
  totalSupply: string
  participants: number
  progress: number
  image: string
  target: string
  raised: string
  presaleRate: string
  created_at: string
}

interface TokenState {
  tokenList: MintToken[]
  selectedToken: MintToken | null
  loading: boolean
  error: string | null
}

const initialState: TokenState = {
  tokenList: [],
  selectedToken: null,
  loading: false,
  error: null,
}

export const fetchTokenList = createAsyncThunk(
  'token/fetchTokenList',
  async () => {
    const data: TokenList = await axios.get('/api/token/list')

    return data.map(token => ({
      id: token.token_id,
      name: token.token_name,
      symbol: token.token_symbol,
      address: token.token_address,
      totalSupply: token.total_supply.toString(),
      participants: token.total_transactions,
      progress: token.mint_percent,
      image: '/token-logo.png',
      target: '100%',
      raised: `${token.mint_percent}%`,
      presaleRate: '1:1',
      created_at: token.created_at,
    }))
  }
)

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setSelectedToken: (state, action) => {
      state.selectedToken = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTokenList.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTokenList.fulfilled, (state, action) => {
        state.loading = false
        state.tokenList = action.payload
        state.error = null
      })
      .addCase(fetchTokenList.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch token list'
      })
  },
})

// Selectors
export const selectToken = (state: RootState) => ({
  token: state.token.selectedToken,
  loading: state.token.loading,
  error: state.token.error,
})

export const selectTokenByAddress = (address: string) => (state: RootState) => {
  const token = state.token.tokenList.find(token => token.address === address)
  return {
    token,
    loading: state.token.loading,
    error: token ? null : 'Token not found',
  }
}

export const { setSelectedToken } = tokenSlice.actions
export default tokenSlice.reducer
