import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../config/axios'

interface TokenState {
  tokenList: any[]
}

const initialState: TokenState = {
  tokenList: [],
}

export const fetchTokenList = createAsyncThunk(
  'token/fetchTokenList',
  async () => {
    const response: Array<any> = await axios.get('/token/list')

    return response
  }
)

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchTokenList.fulfilled, (state, action) => {
      state.tokenList = action.payload
    })
  },
})

export default tokenSlice.reducer
