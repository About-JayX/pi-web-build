import { configureStore } from '@reduxjs/toolkit'
import tokenReducer from './slices/tokenSlice'
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    user: userReducer,
  },
})

// 导出 RootState 和 AppDispatch 类型
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
