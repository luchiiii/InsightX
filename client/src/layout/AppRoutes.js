import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProtectedRoutes from "./ProtectedRoutes";
import AuthPage from "../pages/AuthPage";
import Login from "../components/authComponents/Login";
import Signup from "../components/authComponents/Signup";
import VerifyAccount from "../components/authComponents/VerifyAccount";
import DashboardPage from "../pages/DashboardPage";
import ResultPage from "../pages/ResultPage";

const AppRoutes = () => {
  const { user } = useSelector((state) => state.userState);

  return (
    <Routes>
      {/* Redirect from root ("/") to login page by default */}
      <Route path="/" element={<Navigate to="/auth/login" />} />
      <Route path="/auth" element={<AuthPage />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="verify" element={<VerifyAccount />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoutes user={user}>
            <DashboardPage />
          </ProtectedRoutes>
        }
      />

      <Route path="/result" element={<ResultPage />} />
    </Routes>
  );
};

export default AppRoutes;
