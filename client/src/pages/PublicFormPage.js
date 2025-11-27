import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, AlertCircle } from "lucide-react";
import {
  useGetFormByLinkQuery,
  useSubmitFeedbackMutation,
} from "../lib/feedbackApi";

const PublicFormPage = () => {
  const { shareableLink } = useParams();
  const navigate = useNavigate();

  const {
    data: formData,
    isLoading,
    error: fetchError,
  } = useGetFormByLinkQuery(shareableLink);
  const [submitFeedback, { isLoading: isSubmitting }] =
    useSubmitFeedbackMutation();

  const form = formData?.data;
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleResponseChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form) return;

    const allAnswered = form.questions.every((q) =>
      q.required
        ? responses[q.questionId] !== undefined &&
          responses[q.questionId] !== ""
        : true
    );

    if (!allAnswered) {
      setError("Please answer all required questions");
      return;
    }

    setError("");

    try {
      const formattedResponses = form.questions.map((q) => ({
        questionId: q.questionId,
        question: q.text,
        answer: responses[q.questionId],
        type: q.type,
      }));

      await submitFeedback({
        formId: form._id,
        responses: formattedResponses,
      }).unwrap();

      setSubmitted(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError(
        err?.data?.error || "Failed to submit feedback. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!form || fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-md text-center shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Form Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            This form is no longer available or the link is incorrect
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-md text-center shadow-lg">
          <div className="text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-4">
            Your feedback has been submitted successfully.
          </p>
          <p className="text-sm text-gray-500">Redirecting in a moment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {form.title}
            </h1>
            {form.description && (
              <p className="text-gray-600">{form.description}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-900 flex gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {form.questions.map((question, index) => (
              <div key={question.questionId} className="space-y-3">
                <label className="text-lg font-semibold text-gray-900">
                  {question.text}
                  {question.required && (
                    <span className="text-red-600 ml-1">*</span>
                  )}
                </label>

                {question.type === "rating" && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                      <button
                        key={score}
                        type="button"
                        onClick={() =>
                          handleResponseChange(question.questionId, score)
                        }
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                          responses[question.questionId] === score
                            ? "bg-purple-600 text-white shadow-lg scale-105"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                )}

                {question.type === "multiple-choice" && (
                  <div className="space-y-2">
                    {question.options?.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="radio"
                          name={question.questionId}
                          value={option}
                          checked={responses[question.questionId] === option}
                          onChange={() =>
                            handleResponseChange(question.questionId, option)
                          }
                          className="w-4 h-4 text-purple-600"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === "text" && (
                  <textarea
                    value={responses[question.questionId] || ""}
                    onChange={(e) =>
                      handleResponseChange(question.questionId, e.target.value)
                    }
                    placeholder="Your feedback here..."
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition-all font-semibold"
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              Powered by{" "}
              <span className="font-semibold text-gray-700">InsightX</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicFormPage;
