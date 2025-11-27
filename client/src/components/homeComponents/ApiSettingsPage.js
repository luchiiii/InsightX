import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGenerateApiTokenMutation } from "../../lib/userApis";
import { Copy, RefreshCw, Eye, EyeOff, AlertCircle } from "lucide-react";

const ApiSettingsPage = () => {
  const { user } = useSelector((state) => state.userState);
  const [generateApiToken, { isLoading }] = useGenerateApiTokenMutation();
  const [apiKey, setApiKey] = useState(user?.apiToken || "");
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setApiKey(user?.apiToken || "");
  }, [user]);

  const handleGenerateNewKey = async () => {
    if (
      !window.confirm(
        "Generating a new API key will invalidate the old one. Continue?"
      )
    )
      return;

    setError("");
    setSuccess("");

    try {
      const result = await generateApiToken().unwrap();
      if (result?.apiKey) {
        setApiKey(result.apiKey);
        setSuccess("API key generated successfully");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setError(err?.data?.error || "Failed to generate API key");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">API Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your API keys and integration settings
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-900 flex gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-900 flex gap-3">
          <span className="text-xl">✓</span>
          <p>{success}</p>
        </div>
      )}

      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your API Key</h2>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between group">
            <code className="text-gray-300 font-mono text-sm break-all flex-1">
              {showApiKey ? apiKey : "•".repeat(50)}
            </code>
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="ml-4 p-2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showApiKey ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <Copy className="w-4 h-4" />
              {copied ? "Copied!" : "Copy Key"}
            </button>
            <button
              onClick={handleGenerateNewKey}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Generate New Key
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-900">
            <strong>⚠️ Warning:</strong> Keep your API key secure. Don't share
            it publicly or commit it to version control.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Quick Integration Guide
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              1. Submit Feedback
            </h3>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-gray-300 text-sm font-mono">{`curl -X POST https://api.insightx.com/feedback/submit \\
  -H "Content-Type: application/json" \\
  -d '{
    "formId": "your-form-id",
    "responses": [
      {
        "questionId": "q1",
        "question": "How satisfied are you?",
        "answer": 9,
        "type": "rating"
      }
    ]
  }'`}</pre>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              2. Get Analytics
            </h3>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-gray-300 text-sm font-mono">{`curl https://api.insightx.com/feedback/form-id/analytics \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</pre>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              📖 <strong>Full Documentation:</strong> Visit our{" "}
              <a
                href="https://documenter.getpostman.com/view/36998674/2sAXxV5pbd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                API Reference
              </a>{" "}
              for complete endpoint documentation and code examples.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiSettingsPage;
