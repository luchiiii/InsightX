import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ user, children }) => {
  if (!user) {
    //redirect to authentication page
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoutes;
