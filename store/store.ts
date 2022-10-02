import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { uiSlice } from './uiSlice';
import { userSlice } from './userSlice';
const makeStore = () => configureStore({
  reducer: {
    [uiSlice.name]: uiSlice.reducer,
    [userSlice.name]: userSlice.reducer
  },
});
export type store = ReturnType<typeof makeStore>
export type RootState = ReturnType<store['getState']>
export const wrapper = createWrapper<store>(makeStore);