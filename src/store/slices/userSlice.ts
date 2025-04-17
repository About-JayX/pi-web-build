import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserInfo as ApiUserInfo, SignInInfo } from '@/api/types'

interface UserInfo extends ApiUserInfo {}

interface UserState {
  userInfo: UserInfo | null
  authToken: string | null
  isLoggedIn: boolean
  signInInfo: SignInInfo | null
}

const initialState: UserState = {
  userInfo: null,
  authToken: null,
  isLoggedIn: false,
  signInInfo: null,
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
      state.signInInfo = null
      // 清除localStorage中的token
      localStorage.removeItem('token')
    },
    setSignInInfo: (state, action: PayloadAction<SignInInfo>) => {
      state.signInInfo = action.payload
    },
  },
})

export const { setUser, clearUser, setSignInInfo } = userSlice.actions

export default userSlice.reducer
