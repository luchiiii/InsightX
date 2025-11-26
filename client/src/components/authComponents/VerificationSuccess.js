import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VerificationSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      navigate('/auth/login');
    }
  }, [countdown, navigate]);

  const handleSkip = () => {
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Email Verified!
          </h1>

          <p className="text-gray-600 mb-2">
            Your email has been successfully verified.
          </p>

          <p className="text-gray-500 text-sm mb-8">
            Your InsightX account is now active and ready to use.
          </p>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-purple-900">
              <span className="font-semibold">Next Step:</span> Sign in with your email and password to access your dashboard.
            </p>
          </div>

          <button
            onClick={handleSkip}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-medium shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mb-4"
          >
            Go to Login Now
          </button>

          <p className="text-gray-500 text-sm">
            Redirecting in <span className="font-bold text-purple-600">{countdown}s</span>
          </p>
        </div>

        
      </div>
    </div>
  );
};

export default VerificationSuccess;