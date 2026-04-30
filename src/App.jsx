import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import StudentDashboard from './pages/student/Dashboard';
import AttendanceHistory from './pages/student/AttendanceHistory';
import StudentProfile from './pages/student/Profile';
import StudentResources from './pages/student/Resources';
import FacultyDashboard from './pages/faculty/Dashboard';
import MarkAttendance from './pages/faculty/MarkAttendance';
import FacultyReports from './pages/faculty/Reports';
import ManageResources from './pages/faculty/ManageResources';
import AdminDashboard from './pages/admin/Dashboard';
import StudentManagement from './pages/admin/StudentManagement';
import SubjectManagement from './pages/admin/SubjectManagement';
import AdminReports from './pages/admin/Reports';
import AdminCMS from './pages/admin/CMS';
import FacultyManagement from './pages/admin/FacultyManagement';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/history" element={<AttendanceHistory />} />
                <Route path="/student/profile" element={<StudentProfile />} />
                <Route path="/student/resources" element={<StudentResources />} />
              </Route>

              {/* Faculty Routes */}
              <Route element={<ProtectedRoute allowedRoles={['faculty', 'admin']} />}>
                <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
                <Route path="/faculty/mark" element={<MarkAttendance />} />
                <Route path="/faculty/reports" element={<FacultyReports />} />
                <Route path="/faculty/resources" element={<ManageResources />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/students" element={<StudentManagement />} />
                <Route path="/admin/faculty" element={<FacultyManagement />} />
                <Route path="/admin/subjects" element={<SubjectManagement />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/cms" element={<AdminCMS />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
