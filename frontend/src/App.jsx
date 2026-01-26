import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboard from "./pages/DonorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import OrgSignup from "./pages/OrgSignup.jsx";
import OrgLogin from "./pages/OrgLogin.jsx";
import OrgDashboard from "./pages/OrgDashboard.jsx";
import AddCamp from "./pages/AddCamp.jsx";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/donor-login" element={<Login />} />
        <Route path="/donor-signup" element={<Register />} />
        <Route path="/org-login" element={<OrgLogin />} />
        <Route path="/org-signup" element={<OrgSignup />} />

        {/* 🔒 Protected Donor Routes */}
        <Route
          path="/donor-dashboard"
          element={
            <ProtectedRoute role="donor">
              <DonorDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔒 Protected Organization Routes */}
        <Route
          path="/org-dashboard"
          element={
            <ProtectedRoute role="org">
              <OrgDashboard />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/org-add-camp" 
          element={
            <ProtectedRoute role="org">
              <AddCamp />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
