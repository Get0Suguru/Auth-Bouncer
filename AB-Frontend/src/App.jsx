import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import AuthBouncer from "./components/auth/AuthBouncer";
import OAuthCallback from "./components/auth/OAuthCallback";
import RoleSelection from "./components/dashboard/RoleSelection";
import UserDashboard from "./components/dashboard/UserDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import AdminCreation from "./components/admin/AdminCreation";
import PasswordChange from "./components/user/PasswordChange";

function AppRoutes() {
  const { isLoggedIn, logout } = useAuthContext();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const hasOAuthCode = urlParams.get('code');

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isLoggedIn ? 
            <RoleSelection /> : 
            <AuthBouncer isLogin={true} />
        } 
      />
      <Route 
        path="/register" 
        element={
          isLoggedIn ? 
            <RoleSelection /> : 
            <AuthBouncer isLogin={false} />
        } 
      />
      <Route 
        path="/oauth/callback" 
        element={<OAuthCallback />} 
      />
      <Route 
        path="/user-dashboard" 
        element={
          isLoggedIn ? 
            <UserDashboard onLogout={logout} /> : 
            <AuthBouncer isLogin={true} />
        } 
      />
      <Route 
        path="/admin-dashboard" 
        element={
          isLoggedIn ? 
            <AdminDashboard onLogout={logout} /> : 
            <AuthBouncer isLogin={true} />
        } 
      />
      <Route 
        path="/become-admin" 
        element={
          isLoggedIn ? 
            <AdminCreation /> : 
            <AuthBouncer isLogin={true} />
        } 
      />
      <Route 
        path="/change-password" 
        element={
          isLoggedIn ? 
            <PasswordChange /> : 
            <AuthBouncer isLogin={true} />
        } 
      />
      <Route 
        path="/" 
        element={
          hasOAuthCode ? 
            <OAuthCallback /> : 
            (isLoggedIn ? 
              <RoleSelection /> : 
              <AuthBouncer isLogin={true} />
            )
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
