import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLoginUserMutation } from "../../lib/authApis";
import { useGetCurrentUserMutation } from "../../lib/userApis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faApple } from "@fortawesome/free-brands-svg-icons";
import Error from "../../commons/Error";
import useFormValidation from "../../hooks/useFormValidation";

import "../../Styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formIsValid, formError] = useFormValidation(email, password);
  const navigate = useNavigate();

  const [loginUser, { isLoading, error, isSuccess, isError }] =
    useLoginUserMutation();

  const [getCurrentUser, { isSuccess: getUserSuccess, error: getUserError }] =
    useGetCurrentUserMutation();

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (!formIsValid || formError) {
      return;
    }

    return await loginUser({ email, password });
  };

  useEffect(() => {
    if (isSuccess) {
      // Redirect to dashboard page after successful login
      getCurrentUser();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (getUserSuccess) {
      navigate("/dashboard");
    }
  }, [getUserSuccess]);

  console.log(getUserError);
  return (
    <div className="container login-container mt-5">
      <div className="login-card">
        <h3 className="text-center">Login</h3>
        <div className="social-login d-flex justify-content-between mb-4">
          <button className="btn google-btn">
            <FontAwesomeIcon icon={faGoogle} /> Login with Google
          </button>
          <button className="btn apple-btn">
            <FontAwesomeIcon icon={faApple} /> Login with Apple
          </button>
        </div>
        <div className="text-center mb-4">or Login with</div>
        {isError && (
          <Error errorMessage={error?.data?.error || "something went wrong"} />
        )}
        {formError && <Error errorMessage={formError} />}
        <form onSubmit={formSubmitHandler}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Your Email"
            required
          />
          <div className="input-group mb-3">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Your Password"
              required
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <div>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember" className="ml-2">
                Remember me
              </label>
            </div>
            <Link to="#" className="forgot-password">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="btn submit-btn"
            value={isLoading ? "Please wait..." : "Signin"}
          >
            Submit
          </button>
        </form>
        <p className="mt-3 text-center">
          Don't have an account?{" "}
          <Link to="/auth/signup" className="signup-link">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
