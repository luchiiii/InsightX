import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

let baseUrl = process.env.REACT_APP_API_BASE_URL;

export const feedbackApi = createApi({
  reducerPath: "feedbackApi",
  baseQuery: fetchBaseQuery({ baseUrl }),

  endpoints: (builder) => ({
    createNewFeedback: builder.mutation({
      query: (feedbackData) => ({
        url: "/feedback/create",
        method: "POST",
        body: feedbackData,
        credentials: "include",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzBlNmM1NjkxODQ1MTZkMGFkZDljMWIiLCJpYXQiOjE3MjkwODI4MjksImV4cCI6MTczMTY3NDgyOX0.Yh7ORui4Gd3tffNpA10L0bWvqIZr7dFrEmfZWQ_kIEs`,
        },
      }),
    }),

    getAllFeedback: builder.mutation({
      query: (token) => ({
        url: "/feedback/all",
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}}`,
        },
      }),
    }),
  }),
});

export const { useCreateNewFeedbackMutation, useGetAllFeedbackMutation } =
  feedbackApi;
