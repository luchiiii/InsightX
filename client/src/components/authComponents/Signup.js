import { useEffect, useState } from "react";
import { useCreateNewUserMutation } from "../../lib/userApis";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faApple } from "@fortawesome/free-brands-svg-icons";
import Error from "../../commons/Error";
import useFormValidation from "../../hooks/useFormValidation";
import "../../Styles/Signup.css";

const Signup = () => {
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formIsValid, formError] = useFormValidation(orgName, email, password);
  const navigate = useNavigate();

  const [createNewUser, { isLoading, error, isSuccess, isError }] =
    useCreateNewUserMutation();

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (!formIsValid || formError) {
      return;
    }

    return await createNewUser({ organizationName: orgName, email, password });
  };

  useEffect(() => {
    if (isSuccess) {
      // Redirect to verify page after successful signup
      navigate("/auth/verify");
    }
  }, [isSuccess]);

  return (
    <div className="container signup-container mt-5">
      <div className="signup-card">
        <h3 className="text-center">Sign Up</h3>
        <div className="social-signup d-flex justify-content-between mb-4">
          <button className="btn google-btn">
            <FontAwesomeIcon icon={faGoogle} /> Sign up with Google
          </button>
          <button className="btn apple-btn">
            <FontAwesomeIcon icon={faApple} /> Sign up with Apple
          </button>
        </div>
        <div className="text-center mb-4">or Sign up with</div>
        {isError && (
          <Error errorMessage={error?.data?.error || "something went wrong"} />
        )}
        {formError && <Error errorMessage={formError} />}
        <form onSubmit={formSubmitHandler}>
          <input
            type="text"
            name="orgName"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="form-control"
            placeholder="Organization Name"
            required
          />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control mt-3"
            placeholder="Your Email"
            required
          />
          <div className="input-group mt-3">
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
          <button
            type="submit"
            className="btn submit-btn mt-4"
            value={isLoading ? "Please wait..." : "Signup"}
          >
            Sign Up
          </button>
        </form>
        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link to="/auth/login" className="login-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Signup;
