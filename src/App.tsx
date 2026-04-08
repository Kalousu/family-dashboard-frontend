import ProfileSelectPage from './pages/ProfileSelectPage';
import RegisterPage from './pages/RegisterPage';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import TestPage from './pages/TestPage';
import TestPageToDo from './pages/TestPageToDo';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProfileSelectPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/test-todo" element={<TestPageToDo />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App