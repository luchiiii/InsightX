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
        body: { questions: feedbackData.questions },
        credentials: "include",
        headers: {
          Authorization: `Bearer ${feedbackData.apiKey}`,
        },
      }),
    }),

    getAllFeedback: builder.mutation({
      query: (apiKey) => ({
        url: "/feedback/all",
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }),
    }),
  }),
});

export const { useCreateNewFeedbackMutation, useGetAllFeedbackMutation } =
  feedbackApi;
