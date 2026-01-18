import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentLobby from './pages/StudentLobby';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* This tells React: When URL is "/", show Landing page */}
        <Route path="/" element={<Landing />} />
        
        {/* When URL is "/teacher", show Teacher Dashboard */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        
        {/* When URL is "/student", show Student Lobby */}
        <Route path="/student" element={<StudentLobby />} />
      </Routes>
    </BrowserRouter>
  );
}