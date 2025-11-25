import { useState, useRef, useEffect } from "react";
import { Mail } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useVerifyUserMutation } from "../../lib/userApis";
import Error from "../../commons/Error";

const VerifyAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledEmail = location.state?.email || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const inputRefs = useRef([]);

  const [verifyUser, { isLoading, error, isSuccess, isError }] = useVerifyUserMutation();

  // Autofocus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setInputDisabled(true);
      return;
    }
    const interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleChange = (index, value) => {
    if (value.length > 1) value = value[0];
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const verificationToken = code.join("");
    if (verificationToken.length !== 6) return;

    try {
      await verifyUser({ verificationToken, email: prefilledEmail }).unwrap();
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };

  // Navigate to login after successful verification
  useEffect(() => {
    if (isSuccess) {
      navigate("/auth/login", { replace: true });
    }
  }, [isSuccess, navigate]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl mb-4 shadow-md">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Verify Your Email</h1>
            <p className="text-gray-600">
              We've sent a verification code to {prefilledEmail || "your email"}
            </p>
            <p className="text-sm text-gray-500 mt-2">Time remaining: {formatTime(timeLeft)}</p>
          </div>

          {isError && <Error errorMessage={error?.data?.error || "Something went wrong"} />}

          <div className="space-y-6">
            <div className="flex justify-center gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={inputDisabled || isLoading}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 outline-none"
                />
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={code.some((d) => !d) || inputDisabled || isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? "Verifying..." : "Verify Account"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button
                disabled={isLoading}
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
