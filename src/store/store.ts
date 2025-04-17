import { configureStore } from '@reduxjs/toolkit'
import tokenReducer from './slices/tokenSlice'
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
