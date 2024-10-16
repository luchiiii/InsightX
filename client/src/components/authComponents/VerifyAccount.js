import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useVerifyUserMutation } from "../../lib/userApis";
import Error from "../../commons/Error";
import "../../Styles/VerifyAccount.css";

const VerifyAccount = () => {
  const [verificationToken, setVerificationToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [verifyUser, { isLoading, error, isSuccess, isError }] =
    useVerifyUserMutation();

  const handleVerification = async (e) => {
    e.preventDefault();

    if (!verificationToken) {
      return;
    }

    return await verifyUser({ verificationToken });
  };

  useEffect(() => {
    if (isSuccess) {
      // Redirect to login page after successful verification
      navigate("/auth/login");
    }
  }, [isSuccess]);

  return (
    <div className="verify-account-container">
      <div className="verify-account-card">
        <h3 className="text-center">Verify Your Account</h3>

        {isError && (
          <Error errorMessage={error?.data?.error || "something went wrong"} />
        )}
        {errorMessage && <Error errorMessage={errorMessage} />}
        <form onSubmit={handleVerification}>
          <div className="mb-3">
            <input
              type="text"
              value={verificationToken}
              onChange={(e) => setVerificationToken(e.target.value)}
              className="form-control"
              placeholder="Enter your verification token"
              required
            />
          </div>
          <button
            type="submit"
            className="submit-btn"
            value={isLoading ? "Please wait ..." : "Verify"}
          >
            Verify
          </button>
        </form>
        <p className="mt-3 text-center">
          Didn't receive a token?{" "}
          <Link to="/resend-token" className="resend-token-link">
            Resend Token
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyAccount;
