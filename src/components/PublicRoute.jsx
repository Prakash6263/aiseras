// components/PublicRoute.jsx
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/landing" />; // or any protected route
  }

  return children;
};

export default PublicRoute;
