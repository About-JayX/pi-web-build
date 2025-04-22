import type { RootState, AppDispatch } from './index'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

// 导出类型安全的 hooks
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector 