import React, { useState } from "react";
import { Plus, Eye, Edit2, Trash2, Copy, AlertCircle, X, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useGetUserFormsQuery,
  useCreateFormMutation,
  useDeleteFormMutation,
  useUpdateFormMutation,
} from "../../lib/feedbackApi";

const FormsPage = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFormId, setEditingFormId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: [],
  });
  const [copiedId, setCopiedId] = useState(null);
  const [error, setError] = useState("");
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "rating",
    required: true,
  });

  const {
    data: formsData,
    isLoading,
    error: fetchError,
  } = useGetUserFormsQuery();
  const [createForm, { isLoading: isCreating }] = useCreateFormMutation();
  const [updateForm, { isLoading: isUpdating }] = useUpdateFormMutation();
  const [deleteForm, { isLoading: isDeleting }] = useDeleteFormMutation();

  const forms = formsData?.data || [];

  const openEditModal = (form) => {
    setEditingFormId(form._id);
    setFormData({
      title: form.title,
      description: form.description,
      questions: form.questions || [],
    });
    setShowCreateModal(true);
    setError("");
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingFormId(null);
    setFormData({ title: "", description: "", questions: [] });
    setNewQuestion({ text: "", type: "rating", required: true });
    setError("");
  };

  const handleCreateForm = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Form title is required");
      return;
    }

    const questionsToCreate =
      formData.questions.length > 0
        ? formData.questions
        : [
            {
              questionId: "q1",
              text: "How satisfied are you?",
              type: "rating",
              required: true,
            },
          ];

    try {
      if (editingFormId) {
        // Update existing form - pass formId and formData separately
        await updateForm({
          formId: editingFormId,
          formData: {
            title: formData.title,
            description: formData.description,
            questions: questionsToCreate,
          },
        }).unwrap();
      } else {
        // Create new form
        await createForm({
          title: formData.title,
          description: formData.description,
          questions: questionsToCreate,
        }).unwrap();
      }

      closeModal();
    } catch (err) {
      setError(err?.data?.error || "Failed to save form");
    }
  };

  const addQuestion = () => {
    if (!newQuestion.text.trim()) {
      setError("Question text is required");
      return;
    }
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          questionId: `q${Date.now()}`,
          text: newQuestion.text,
          type: newQuestion.type,
          required: newQuestion.required,
        },
      ],
    });
    setNewQuestion({ text: "", type: "rating", required: true });
    setError("");
  };

  const removeQuestion = (index) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index),
    });
  };

  const handleDeleteForm = async (formId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this form? All responses will be deleted."
      )
    )
      return;

    try {
      await deleteForm(formId).unwrap();
    } catch (err) {
      setError(err?.data?.error || "Failed to delete form");
    }
  };

  const copyShareableLink = (shareableLink) => {
    const link = `${window.location.origin}/form/${shareableLink}`;
    navigator.clipboard.writeText(link);
    setCopiedId(shareableLink);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Feedback Forms</h1>
            <p className="text-gray-600 mt-1">
              Create and manage your feedback collection forms
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-500">Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feedback Forms</h1>
          <p className="text-gray-600 mt-1">
            Create and manage your feedback collection forms
          </p>
        </div>
        <button
          onClick={() => {
            setEditingFormId(null);
            setFormData({ title: "", description: "", questions: [] });
            setShowCreateModal(true);
            setError("");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Form
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-900 flex gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {fetchError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-900 flex gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>Failed to load forms</p>
        </div>
      )}

      {forms.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No forms yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first feedback form to start collecting responses
          </p>
          <button
            onClick={() => {
              setEditingFormId(null);
              setFormData({ title: "", description: "", questions: [] });
              setShowCreateModal(true);
              setError("");
            }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create First Form
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {forms.map((form) => (
            <div
              key={form._id}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {form.title}
                  </h3>
                  {form.description && (
                    <p className="text-gray-600 mt-1">{form.description}</p>
                  )}
                  <div className="flex gap-4 mt-4 text-sm text-gray-600">
                    <span>📝 {form.questions?.length || 0} questions</span>
                    <span>📊 {form.responseCount || 0} responses</span>
                    <span>
                      📅 {new Date(form.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyShareableLink(form.shareableLink)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
                    title="Copy shareable link"
                  >
                    {copiedId === form.shareableLink ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => navigate(`/form/${form.shareableLink}`)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
                    title="Preview form"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/forms/${form._id}/analytics`)}
                    className="p-2 hover:bg-purple-100 rounded-lg text-purple-600 hover:text-purple-700 transition-colors"
                    title="View analytics"
                  >
                    <BarChart3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openEditModal(form)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
                    title="Edit form"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteForm(form._id)}
                    disabled={isDeleting}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                    title="Delete form"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingFormId ? "Edit Form" : "Create New Form"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Form Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Customer Satisfaction Survey"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe what this form is for"
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-4">Questions</h3>

                {formData.questions.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {formData.questions.map((q, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{q.text}</p>
                          <p className="text-xs text-gray-500">
                            {q.type} • {q.required ? "Required" : "Optional"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeQuestion(idx)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-3 p-3 bg-blue-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text
                    </label>
                    <input
                      type="text"
                      value={newQuestion.text}
                      onChange={(e) =>
                        setNewQuestion({ ...newQuestion, text: e.target.value })
                      }
                      placeholder="e.g., How satisfied are you?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={newQuestion.type}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            type: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="rating">Rating (1-10)</option>
                        <option value="text">Text</option>
                        <option value="multiple-choice">Multiple Choice</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newQuestion.required}
                          onChange={(e) =>
                            setNewQuestion({
                              ...newQuestion,
                              required: e.target.checked,
                            })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Required
                        </span>
                      </label>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    Add Question
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-900 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50"
                >
                  {isCreating || isUpdating
                    ? "Saving..."
                    : editingFormId
                    ? "Update Form"
                    : "Create Form"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormsPage;