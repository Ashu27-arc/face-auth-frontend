import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import FaceLoginPage from "./pages/FaceLoginPage";
import FaceRegisterPage from "./pages/FaceRegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCreateUser from "./pages/AdminCreateUser";
import AdminFaceRegister from "./pages/AdminFaceRegister";
import AdminAnalytics from "./pages/AdminAnalytics";
import Profile from "./pages/Profile";



function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/face-login" element={<FaceLoginPage />} />
          <Route path="/face-register" element={<FaceRegisterPage />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/create-user" element={<ProtectedRoute><AdminCreateUser /></ProtectedRoute>} />
          <Route
            path="/admin/register-face/:id"
            element={<ProtectedRoute><AdminFaceRegister /></ProtectedRoute>}
          />
          <Route path="/admin/analytics"
            element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute><Profile /></ProtectedRoute>}
          />
          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
