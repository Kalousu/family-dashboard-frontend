import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfileSelectPage from './pages/ProfileSelectPage';
import TestPage from './pages/TestPage';
import TestTimetablePage from './pages/TestTimetablePage';
import TestPageToDo from './pages/TestPageToDo';
import WidgetPage from './pages/WidgetPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <WidgetPage />
            </ProtectedRoute>
          } />
          
          <Route path="/profile-select" element={
            <ProtectedRoute>
              <ProfileSelectPage />
            </ProtectedRoute>
          } />
          
          <Route path="/test" element={
            <ProtectedRoute>
              <TestPage />
            </ProtectedRoute>
          } />
          
          <Route path="/testtimetable" element={
            <ProtectedRoute>
              <TestTimetablePage />
            </ProtectedRoute>
          } />
          
          <Route path="/test-todo" element={
            <ProtectedRoute>
              <TestPageToDo />
            </ProtectedRoute>
          } />
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
