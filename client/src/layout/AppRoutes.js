import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProtectedRoutes from "./ProtectedRoutes";
import LandingPage from "../pages/LandingPage";
import AuthPage from "../pages/AuthPage";
import PublicFormPage from "../pages/PublicFormPage";
import Login from "../components/authComponents/Login";
import Signup from "../components/authComponents/Signup";
import VerifyAccount from "../components/authComponents/VerifyAccount";
import VerificationSuccess from "../components/authComponents/VerificationSuccess";
import Dashboard from "../components/homeComponents/Dashboard";

const AppRoutes = () => {
  const { user } = useSelector((state) => state.userState);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/auth" element={<AuthPage />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="verify" element={<VerifyAccount />} />
        <Route path="verification-success" element={<VerificationSuccess />} />
      </Route>

      <Route path="/form/:shareableLink" element={<PublicFormPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoutes user={user}>
            <Dashboard />
          </ProtectedRoutes>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
