import { createSlice } from "@reduxjs/toolkit";
import {HYDRATE} from 'next-redux-wrapper'
export interface UiInterface {
  toggleProfile: boolean;
  toggleAddFridend: boolean;
}
const initialState: UiInterface = {
  toggleProfile: false,
  toggleAddFridend: false,
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
    },
    openAddFriend: (state: UiInterface) => {
      state.toggleAddFridend = true;
    },
    closeAddFriend: (state: UiInterface) => {
      state.toggleAddFridend = false
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      state.toggleProfile = action.payload.ui.toggleProfile
    }
  }
})
export const { openProfile, closeProfile, openAddFriend, closeAddFriend } = uiSlice.actions
export default uiSlice.reducer;