import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface UserInterface {
  username: string;
  nickname: string;
  signature: string;
  avatarUrl: string;
}
const initialState: UserInterface = {
  username: '',
  nickname: '',
  signature: '',
  avatarUrl: '',
}
export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    updateUsername: (state: UserInterface, action: PayloadAction<string>) => {
      state.username = action.payload
    },
    updateNickname: (state: UserInterface, action: PayloadAction<string>) => {
      state.nickname = action.payload
    },
    updateSignature: (state: UserInterface, action: PayloadAction<string>) => {
      state.signature = action.payload
    },
    updateAvatar: (state: UserInterface, action: PayloadAction<string>):void => {
      state.avatarUrl = action.payload;
    }
  }
})
export default userSlice.reducer;
export const { updateUsername, updateNickname, updateSignature, updateAvatar } = userSlice.actions;