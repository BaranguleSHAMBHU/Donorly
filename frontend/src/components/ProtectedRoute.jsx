import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, role = "donor" }) => {
  const location = useLocation();

  if (role === "org") {
    // 🏥 Organization Protection Logic
    const token = localStorage.getItem("orgToken");
    return token 
      ? children 
      : <Navigate to="/org-login" replace state={{ fromProtected: true }} />;
  } else {
    // ❤️ Donor Protection Logic (Default)
    const token = localStorage.getItem("donorToken");
    return token 
      ? children 
      : <Navigate to="/donor-login" replace state={{ fromProtected: true }} />;
  }
};

export default ProtectedRoute;