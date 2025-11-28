import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Plus, Eye, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetUserFormsQuery } from "../../lib/feedbackApi";

const OverviewPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userState);
  const { data: formsData, isLoading } = useGetUserFormsQuery();
  const [showApiKey, setShowApiKey] = useState(false);
  const [averageNps, setAverageNps] = useState(0);
  const [npsLoading, setNpsLoading] = useState(false);

  const forms = formsData?.data || [];

  useEffect(() => {
    if (forms.length > 0) {
      fetchAndCalculateNps();
    }
  }, [forms]);

  const fetchAndCalculateNps = async () => {
    setNpsLoading(true);
    try {
      let totalNps = 0;
      let formsWithData = 0;

      for (const form of forms) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/feedback/${form._id}/analytics`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (response.ok) {
            const result = await response.json();
            if (result.data?.nps?.npsScore !== undefined) {
              totalNps += result.data.nps.npsScore;
              formsWithData++;
            }
          }
        } catch (err) {
          console.error(`Error fetching analytics for form ${form._id}:`, err);
        }
      }

      if (formsWithData > 0) {
        setAverageNps(Math.round(totalNps / formsWithData));
      } else {
        setAverageNps(0);
      }
    } catch (error) {
      console.error("Error calculating NPS:", error);
      setAverageNps(0);
    } finally {
      setNpsLoading(false);
    }
  };

  const calculateStats = () => {
    let totalResponses = 0;
    let formCount = forms.length;

    forms.forEach((form) => {
      totalResponses += form.responseCount || 0;
    });

    return {
      totalForms: formCount,
      totalResponses,
    };
  };

  const stats = calculateStats();
  const apiKey = user?.apiToken || "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.organizationName}
          </h1>
          <p className="text-gray-600">
            Here's an overview of your feedback collection system
          </p>
        </div>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.organizationName}
        </h1>
        <p className="text-gray-600">
          Here's an overview of your feedback collection system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Forms</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalForms}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Total Responses
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalResponses}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Average NPS</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {npsLoading ? (
                  <span className="text-lg text-gray-400">...</span>
                ) : (
                  averageNps
                )}
              </p>
              {stats.totalForms > 0 && !npsLoading && (
                <p className="text-xs text-gray-500 mt-1">
                  from {stats.totalForms} form{stats.totalForms > 1 ? "s" : ""}
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Forms</h2>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                View All →
              </button>
            </div>

            {forms.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No forms created yet</p>
                <button
                  onClick={() => {
                    window.location.href = "/dashboard";
                    setTimeout(() => {
                      document
                        .querySelector('button:has-text("Forms")')
                        .click();
                    }, 100);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Form
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {forms.slice(0, 5).map((form) => (
                  <div
                    key={form._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{form.title}</p>
                      <p className="text-sm text-gray-500">
                        {form.responseCount || 0} responses
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/form/${form.shareableLink}`)}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">API Key</h2>
          <div className="space-y-4">
            {apiKey ? (
              <>
                <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-gray-300 break-all relative">
                  {showApiKey ? apiKey : "•".repeat(40)}
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-300"
                  >
                    {showApiKey ? "👁️" : "🔒"}
                  </button>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  📋 Copy Key
                </button>
              </>
            ) : (
              <p className="text-gray-600 text-sm">
                No API key generated yet. Go to API Settings to generate one.
              </p>
            )}
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-900 font-medium mb-2">
              📖 Quick Start
            </p>
            <p className="text-xs text-purple-700">
              Need help? Check our API documentation to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
