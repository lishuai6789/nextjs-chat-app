import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface UserInterface {
  username: string;
}
const initialState: UserInterface = {
  username: ''
}
export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    updateUsername: (state: UserInterface, action: PayloadAction<string>) => {
      state.username = action.payload
    }
  }
})
export default userSlice.reducer;
export const { updateUsername } = userSlice.actions;