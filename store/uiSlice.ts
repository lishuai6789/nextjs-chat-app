import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from 'next-redux-wrapper'
export interface UiInterface {
  toggleProfile: boolean;
  toggleAddFridend: boolean;
  toggleNotLoginWarm: boolean;
}
const initialState: UiInterface = {
  toggleProfile: false,
  toggleAddFridend: false,
  toggleNotLoginWarm: false,
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
    },
    openNotLogin: (state: UiInterface) => {
      state.toggleNotLoginWarm = true
    },
    closeNotLogin: (state: UiInterface) => {
      state.toggleNotLoginWarm = false
    }
  },
  extraReducers: {// FIXME: 具体的原理是什么？
    [HYDRATE]: (state, action) => {
      state.toggleProfile = action.payload.ui.toggleProfile
    }
  }
})
export const { openProfile, closeProfile, openAddFriend, closeAddFriend, openNotLogin, closeNotLogin } = uiSlice.actions
export default uiSlice.reducer;