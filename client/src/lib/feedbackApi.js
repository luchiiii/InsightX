import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

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
          Authorization: `Bearer ${feedbackData.token}`,
        }
      }),
    }),
  }),
});

export const { useCreateNewFeedbackMutation } = feedbackApi;
