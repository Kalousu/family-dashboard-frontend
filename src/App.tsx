import ProfileSelectPage from './pages/ProfileSelectPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import WidgetPage from './pages/WidgetPage';
import { DarkModeProvider } from './context/DarkModeContext';
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';
import UserProfileEditPage from './pages/UserProfileEditPage';
import NewFamilyRegisterPage from './pages/newFamilyRegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <DarkModeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<ProfileSelectPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />

              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={["USER"]}>
                  <WidgetPage />
                </ProtectedRoute>
              } />

              <Route path="/profile/edit" element={<UserProfileEditPage />} />
              <Route path="/newfamily" element={<NewFamilyRegisterPage />} />
              <Route path="/admin" element={<SystemAdminPage />} />
            </Routes>
          </BrowserRouter>
        </DarkModeProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export default App
