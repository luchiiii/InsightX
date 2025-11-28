import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, AlertCircle, BarChart3 } from "lucide-react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  useGetUserFormsQuery,
  useGetFormAnalyticsQuery,
  useGetFormResponsesQuery,
} from "../../lib/feedbackApi";

const FormAnalyticsPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("newest");

  const { data: formsData } = useGetUserFormsQuery();
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useGetFormAnalyticsQuery(formId);
  const {
    data: responsesData,
    isLoading: responsesLoading,
    error: responsesError,
  } = useGetFormResponsesQuery(formId);

  const forms = formsData?.data || [];
  const currentForm = forms.find((f) => f._id === formId);
  const analytics = analyticsData?.data;
  const responses = responsesData?.data || [];

  const nps = analytics?.nps || {};
  const questionStats = analytics?.questionStats || {};

  const handleDownloadCSV = () => {
    if (!responses || responses.length === 0) {
      alert("No responses to download");
      return;
    }

    let csvContent =
      "data:text/csv;charset=utf-8,Submission Date,Question,Answer\n";

    responses.forEach((response) => {
      const date = new Date(response.createdAt).toLocaleString();
      response.responses.forEach((resp) => {
        const question = resp.question || resp.questionId;
        const answer =
          typeof resp.answer === "object"
            ? JSON.stringify(resp.answer)
            : resp.answer;
        csvContent += `"${date}","${question}","${answer}"\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${currentForm?.title || "form"}-responses.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getNpsColor = (score) => {
    if (score >= 50) return "text-green-600";
    if (score >= 0) return "text-yellow-600";
    return "text-red-600";
  };

  // Prepare NPS donut chart data
  const npsChartData = [
    { name: "Promoters", value: nps.promoters || 0, color: "#10b981" },
    { name: "Passive", value: nps.passive || 0, color: "#f59e0b" },
    { name: "Detractors", value: nps.detractors || 0, color: "#ef4444" },
  ];

  // Prepare rating questions bar chart data
  const ratingQuestionsData = Object.entries(questionStats)
    .filter(([_, qData]) => qData.type === "rating")
    .map(([_, qData]) => ({
      question: qData.question.substring(0, 20) + "...", // Truncate long questions
      average: qData.average,
      fullQuestion: qData.question,
    }));

  if (!currentForm) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-900 flex gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>Form not found</p>
        </div>
      </div>
    );
  }

  if (analyticsLoading || responsesLoading) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {currentForm.title}
            </h1>
            {currentForm.description && (
              <p className="text-gray-600 mt-1">{currentForm.description}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          Download CSV
        </button>
      </div>

      {analyticsError || responsesError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-900 flex gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>Failed to load analytics</p>
        </div>
      ) : null}

      {/* NPS Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-600 text-sm font-medium">NPS Score</p>
          <p className={`text-4xl font-bold mt-2 ${getNpsColor(nps.npsScore)}`}>
            {nps.npsScore || 0}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Based on {nps.totalResponses || 0} responses
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Promoters</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {nps.promotersPercentage || 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {nps.promoters || 0} responses
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-green-600">+</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Passive</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {nps.passivePercentage || 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {nps.passive || 0} responses
              </p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-yellow-600">=</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Detractors</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {nps.detractorsPercentage || 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {nps.detractors || 0} responses
              </p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-red-600">−</span>
            </div>
          </div>
        </div>
      </div>

      {/* NPS Donut Chart */}
      {npsChartData.some((d) => d.value > 0) && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            NPS Distribution
          </h2>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={npsChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {npsChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Rating Questions Bar Chart */}
      {ratingQuestionsData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Average Ratings by Question
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingQuestionsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="question"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                }}
                formatter={(value) => `${value.toFixed(1)}/10`}
              />
              <Bar dataKey="average" fill="#667eea" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Question Stats */}
      {Object.keys(questionStats).length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">
              Question Insights
            </h2>
          </div>

          <div className="space-y-6">
            {Object.entries(questionStats).map(([qId, qData]) => (
              <div key={qId} className="border-b pb-6 last:border-b-0">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {qData.question}
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Type: {qData.type} • Responses: {qData.responses.length}
                </p>

                {qData.type === "rating" && qData.average > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Average Rating
                      </span>
                      <span className="font-semibold text-lg text-purple-600">
                        {qData.average}/10
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-purple-600 h-3 rounded-full"
                        style={{ width: `${(qData.average / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {qData.type === "text" && qData.responses.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {qData.responses.map((resp, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-gray-50 rounded border border-gray-200 text-sm text-gray-700"
                      >
                        "{resp}"
                      </div>
                    ))}
                  </div>
                )}

                {qData.type === "multiple-choice" &&
                  qData.responses.length > 0 && (
                    <div className="space-y-2">
                      {[...new Set(qData.responses)].map((option) => {
                        const count = qData.responses.filter(
                          (r) => r === option
                        ).length;
                        const percentage = Math.round(
                          (count / qData.responses.length) * 100
                        );
                        return (
                          <div key={option} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-700">{option}</span>
                              <span className="text-gray-600">
                                {count} ({percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Responses List */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">Recent Responses</h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {responses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No responses yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Share your form link to start collecting responses
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {responses.map((response, idx) => (
              <div
                key={response._id || idx}
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <p className="font-medium text-gray-900">
                    Response #{idx + 1}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(response.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="space-y-2">
                  {response.responses.map((resp, respIdx) => (
                    <div
                      key={respIdx}
                      className="text-sm border-l-2 border-purple-200 pl-3"
                    >
                      <p className="font-medium text-gray-700">
                        {resp.question}
                      </p>
                      <p className="text-gray-600">
                        {typeof resp.answer === "object"
                          ? JSON.stringify(resp.answer)
                          : resp.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormAnalyticsPage;
