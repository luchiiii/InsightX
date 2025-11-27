import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

let baseUrl = process.env.REACT_APP_API_BASE_URL;

export const feedbackApi = createApi({
  reducerPath: "feedbackApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Forms", "Responses", "Analytics"],

  endpoints: (builder) => ({
    createForm: builder.mutation({
      query: (formData) => ({
        url: "/feedback/create",
        method: "POST",
        body: formData,
        credentials: "include",
      }),
      invalidatesTags: ["Forms"],
    }),

    getUserForms: builder.query({
      query: () => ({
        url: "/feedback/user/forms",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Forms"],
    }),

    getFormByLink: builder.query({
      query: (shareableLink) => ({
        url: `/feedback/form/${shareableLink}`,
        method: "GET",
      }),
    }),

    submitFeedback: builder.mutation({
      query: (feedbackData) => ({
        url: "/feedback/submit",
        method: "POST",
        body: feedbackData,
      }),
      invalidatesTags: ["Responses", "Analytics"],
    }),

    getFormResponses: builder.query({
      query: (formId) => ({
        url: `/feedback/${formId}/responses`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Responses"],
    }),

    getFormAnalytics: builder.query({
      query: (formId) => ({
        url: `/feedback/${formId}/analytics`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Analytics"],
    }),

    updateForm: builder.mutation({
      query: ({ formId, formData }) => ({
        url: `/feedback/${formId}`,
        method: "PUT",
        body: formData,
        credentials: "include",
      }),
      invalidatesTags: ["Forms"],
    }),

    deleteForm: builder.mutation({
      query: (formId) => ({
        url: `/feedback/${formId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Forms"],
    }),
  }),
});

export const {
  useCreateFormMutation,
  useGetUserFormsQuery,
  useGetFormByLinkQuery,
  useSubmitFeedbackMutation,
  useGetFormResponsesQuery,
  useGetFormAnalyticsQuery,
  useUpdateFormMutation,
  useDeleteFormMutation,
} = feedbackApi;
