import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import ProfileSelectPage from './pages/ProfileSelectPage';
import RegisterPage from './pages/RegisterPage';
import TestPage from './pages/TestPage';
import TestTimetablePage from './pages/TestTimetablePage';
import TestPageToDo from './pages/TestPageToDo';
import WidgetPage from './pages/WidgetPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<ProfileSelectPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <WidgetPage />
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
          
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
