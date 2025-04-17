import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserInfo as ApiUserInfo } from '@/api/types'

interface UserInfo extends ApiUserInfo {}

interface UserState {
  userInfo: UserInfo | null
  authToken: string | null
  isLoggedIn: boolean
}

const initialState: UserState = {
  userInfo: null,
  authToken: null,
  isLoggedIn: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        user: UserInfo
        authToken: string
      }>
    ) => {
      state.userInfo = action.payload.user
      state.authToken = action.payload.authToken
      state.isLoggedIn = true
      // 保存token到localStorage
      localStorage.setItem('token', action.payload.authToken)
    },
    clearUser: state => {
      state.userInfo = null
      state.authToken = null
      state.isLoggedIn = false
      // 清除localStorage中的token
      localStorage.removeItem('token')
    },
  },
})

export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer
