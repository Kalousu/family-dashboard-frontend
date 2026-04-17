import ProfileSelectPage from './pages/ProfileSelectPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import WidgetPage from './pages/WidgetPage';
import { DarkModeProvider } from './context/DarkModeContext';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
    <DarkModeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<ProfileSelectPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<WidgetPage />} />
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
    </UserProvider>
  )
}

export default App