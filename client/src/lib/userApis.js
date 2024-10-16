import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCurrentUser } from "./redux/userSlice";

let baseUrl = process.env.REACT_APP_API_BASE_URL;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl }),

  endpoints: (builder) => ({
    createNewUser: builder.mutation({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: userData,
      }),
    }),

    verifyUser: builder.mutation({
      query: (verificationToken) => ({
        url: "/users/verify",
        method: "PUT",
        body: verificationToken,
      }),
    }),

    getCurrentUser: builder.mutation({
      query: () => ({
        url: "/users/me",
        method: "GET",
        credentials: "include",
      }),
      //automatically update user state if get current user function is successful
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCurrentUser(data?.currentUser));
        } catch (error) {
          //implement a function to send request to new access token endpoint
          //or if we get back expired token or error 403 status code
          // Log detailed error information to debug the conflict
          if (error?.error?.status === 409) {
            console.error(
              "Conflict error (409): Possible session or user conflict",
              error
            );
          } else {
            console.error("Error fetching current user", error);
          }
        }
      },
    }),

    generateApiToken: builder.mutation({
      query: () => ({
        url: "/users/token",
        method: "GET",
        credentials: "include",
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await dispatch(userApi.endpoints.getCurrentUser.initiate());
        } catch (error) {
          console.error("Error generating API token", error);
        }
      },
    }),
  }),
});

export const {
  useCreateNewUserMutation,
  useVerifyUserMutation,
  useGetCurrentUserMutation,
  useGenerateApiTokenMutation,
} = userApi;
