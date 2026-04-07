import ProfileSelectPage from './pages/ProfileSelectPage';
import RegisterPage from './pages/RegisterPage';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import TestPage from './pages/TestPage';
import WidgetPage from './pages/WidgetPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProfileSelectPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/dashboard" element={<WidgetPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App