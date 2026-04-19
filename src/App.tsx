import ProfileSelectPage from './pages/ProfileSelectPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import WidgetPage from './pages/WidgetPage';
import { DarkModeProvider } from './context/DarkModeContext';
import { UserProvider } from './context/UserContext';
import { CalendarProvider } from './context/CalendarContext';
import UserProfileEditPage from './pages/UserProfileEditPage';
import NewFamilyRegisterPage from './pages/newFamilyRegisterPage';

function App() {
  return (
    <UserProvider>
    <CalendarProvider>
    <DarkModeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<ProfileSelectPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<WidgetPage />} />
          <Route path="/profile/edit" element={<UserProfileEditPage />} />
          <Route path="/newfamily" element={<NewFamilyRegisterPage />} />
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
    </CalendarProvider>
    </UserProvider>
  )
}

export default App