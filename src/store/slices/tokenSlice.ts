import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '@/config/axios'
import { MintToken, TokenList } from '@/api/types'
import { RootState } from '@/store'
import BigNumber from 'bignumber.js'
import {
  formatTokenAmountByDecimals,
  calculateMintingPrice,
  formatTokenAmount,
} from '@/utils'

interface TokenParams {
  page: number
  limit: number
  category?: string
  order: string
  sort_by: string
}

interface TokenResponse {
  token_id: number
  token_name: string
  token_symbol: string
  token_address: string
  token_decimal: number
  total_supply: number
  total_transactions: number
  progress: number
  net_volume: number
  created_at: string
  first_trade_time: string
  last_trade_time: string
  logo: string
  minter_counts: number
  buy_transactions: number
  sell_transactions: number
  total_buy_amount: number
  total_sell_amount: number
  net_quote_amount: number
  liquidity_amount: number
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

// 根据代币精度正确格式化代币数量
const formatTokenAmount = (amount: number, decimals: number): string => {
  return new BigNumber(amount).div(10 ** decimals).toFixed(2)
}

export const fetchTokenList = createAsyncThunk(
  'token/fetchTokenList',
  async (params: TokenParams, { rejectWithValue, dispatch }) => {
    try {
      const data: TokenList = await axios.get('/token/list', { params })

      console.log(data, 'data_')

      if (!data || !Array.isArray(data)) {
        return rejectWithValue('服务器返回的数据格式无效，请稍后再试')
      }

      return data.map(token => {
        // 根据代币的精度格式化各种金额
        const tokenDecimal = token.token_decimal || 6
        const divisor = 10 ** tokenDecimal

        // 转换为SOL单位（9位小数）
        const solDivisor = 10 ** 9

        // 使用liquidity_amount作为铸造总额
        const liquidityAmount = token.liquidity_amount
          ? new BigNumber(token.liquidity_amount).div(solDivisor).toFixed(2)
          : '0'

        // 使用net_quote_amount作为已铸额度
        const netQuoteAmount = token.net_quote_amount
          ? new BigNumber(token.net_quote_amount).div(solDivisor).toFixed(2)
          : '0'

        // 计算总供应量 - 修正：不再硬编码单位，保留原始数值
        // 第一性原理：链上原始总供应量 / 10^tokenDecimal = 实际显示总供应量
        const totalSupplyValue = new BigNumber(token.total_supply)
          .div(divisor)
          .toFixed()

        // 动态计算铸造价格，不再使用固定的1:1比例
        const networkCurrency = 'SOL' // 可以从配置或上下文获取

        return {
          id: token.token_id,
          name: token.token_name,
          symbol: token.token_symbol,
          address: token.token_address,
          tokenDecimal: tokenDecimal,
          totalSupply: totalSupplyValue,
          progress: Number(token.progress.toFixed(2)),
          net_volume: new BigNumber(token.net_volume).div(divisor).toNumber(),
          logo: token.logo,
          image: token.logo,
          target: `${liquidityAmount} ${networkCurrency}`,
          raised: `${netQuoteAmount} ${networkCurrency}`,
          created_at: token.created_at,
          minterCounts: token.minter_counts,
          buyTransactions: token.buy_transactions,
          sellTransactions: token.sell_transactions,
          totalBuyAmount: new BigNumber(token.total_buy_amount)
            .div(divisor)
            .toNumber(),
          totalSellAmount: new BigNumber(token.total_sell_amount)
            .div(divisor)
            .toNumber(),
          firstTradeTime: token.first_trade_time,
          lastTradeTime: token.last_trade_time,
          currencyUnit: networkCurrency,
        } as MintToken
      })
    } catch (error: any) {
      console.error('获取代币列表失败:', error)

      if (error.response) {
        // 服务器响应错误
        const status = error.response.status

        if (status === 500) {
          return rejectWithValue('服务器内部错误，请稍后重试')
        } else if (status === 404) {
          return rejectWithValue('请求的资源不存在')
        } else if (status === 401) {
          return rejectWithValue('未授权，请重新登录')
        } else {
          return rejectWithValue(`服务器返回错误: ${status}`)
        }
      } else if (error.request) {
        // 网络错误
        return rejectWithValue('网络连接失败，请检查您的网络连接并重试')
      } else {
        // 请求配置错误
        return rejectWithValue('请求配置错误: ' + (error.message || '未知错误'))
      }
    }
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
