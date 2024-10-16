import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  initialState,
  name: "userState",
  reducers: {
    setCurrentUser: (state, action) => {
      state.user = action.payload;
    },
    clearCurrentUser: (state, action) => {
      state.user = null;
    },
  },
});

export default userSlice.reducer;

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;
