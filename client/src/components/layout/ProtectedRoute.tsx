import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function getToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const expiry = localStorage.getItem("expiry");
  if (expiry && Date.now() > parseInt(expiry)) {
    localStorage.removeItem("token");
    localStorage.removeItem("expiry");
    return null;
  }
  return token;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const tokenExists = getToken();
  if (!tokenExists) {
    return null;
  }

  return <>{children}</>;
};


export default ProtectedRoute;
