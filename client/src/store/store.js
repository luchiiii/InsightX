import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "../lib/authApis";
import { userApi } from "../lib/userApis";
import { feedbackApi } from "../lib/feedbackApi";
import userSlice from "../lib/redux/userSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [feedbackApi.reducerPath]: feedbackApi.reducer,
    userState: userSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      feedbackApi.middleware
    ),
});

setupListeners(store.dispatch);
