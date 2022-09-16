import { configureStore } from "@reduxjs/toolkit";
import UiReducer from './uiSlice'
import UserSlice from './userSlice'
export const store = configureStore({
  reducer: {
    ui: UiReducer,
    user: UserSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch