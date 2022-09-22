import { createSlice } from "@reduxjs/toolkit";
import {HYDRATE} from 'next-redux-wrapper'
export interface UiInterface {
  toggleProfile: boolean;
}
const initialState: UiInterface = {
  toggleProfile: false
}
export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openProfile: (state: UiInterface) => {
      state.toggleProfile = true
    },
    closeProfile: (state: UiInterface) => {
      state.toggleProfile = false
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      state.toggleProfile = action.payload.ui.toggleProfile
    }
  }
})
export const { openProfile, closeProfile } = uiSlice.actions
export default uiSlice.reducer;