import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import TeacherDashboard from "./pages/Teacher/Dashboard";
import StudentLobby from "./pages/Student/Lobby";
import StudentLiveClass from "./pages/Student/LiveClass";

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
        <Route path="/student/live" element={<StudentLiveClass />} />

        {/* Catch-all: route unknown paths back home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
