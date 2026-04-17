import ProfileSelectPage from './pages/ProfileSelectPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import TestPage from './pages/TestWeatherPage';
import TestTimetablePage from './pages/TestTimetablePage';
import TestPageToDo from './pages/TestPageToDo';
import WidgetPage from './pages/WidgetPage';
import UserProfileEditPage from './pages/UserProfileEditPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProfileSelectPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/testtimetable" element={<TestTimetablePage />} />
          <Route path="/test-todo" element={<TestPageToDo />} />
          <Route path="/dashboard" element={<WidgetPage />} />
          <Route path="/profile/edit" element={<UserProfileEditPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App