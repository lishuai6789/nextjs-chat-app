import { createSlice } from "@reduxjs/toolkit";

export interface UiInterface {
  toggleProfile: boolean;

}
const initialState: UiInterface = {
  toggleProfile: false
}
export const uiSlice = createSlice({
  name: 'uiToggle',
  initialState,
  reducers: {
    openProfile: (state: UiInterface) => {
      state.toggleProfile = true
    },
    closeProfile: (state: UiInterface) => {
      state.toggleProfile = false
    }
  }
})
export const { openProfile, closeProfile } = uiSlice.actions
export default uiSlice.reducer;