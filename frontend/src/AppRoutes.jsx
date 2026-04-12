import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public & Authentication Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import ResetPassword from './pages/auth/ResetPassword';
import UpdateUsername from './pages/auth/UpdateUsername';

// Dashboard Pages
import SuperAdminDashboard from './pages/operations-admin/SuperAdminDashboard';

import AcademicAdminDashboard from './pages/operations-admin/AcademicAdminDashboard';
import AcademicTeachersManagement from './pages/operations-admin/AcademicTeachersManagement';
import AcademicSubjectsManagement from './pages/operations-admin/AcademicSubjectsManagement';
import AcademicClassAssignments from './pages/operations-admin/AcademicClassAssignments';

import StudentAdminDashboard from './pages/operations-admin/StudentAdminDashboard';
import FinanceAdminDashboard from './pages/operations-admin/FinanceAdminDashboard';
import OperationsAdminDashboard from './pages/operations-admin/OperationsAdminDashboard';
import TeacherDashboard from './pages/operations-admin/TeacherDashboard';
import StudentDashboard from './pages/operations-admin/StudentDashboard';
import StudentProfile from './pages/operations-admin/StudentProfile';
import StudentAttendance from './pages/operations-admin/StudentAttendance';
import Application from './pages/operations-admin/Application';
import StudentAssignments from './pages/operations-admin/StudentAssignments';
import TeacherAttendanceMark from './pages/operations-admin/TeacherAttendanceMark';
import TeacherApplicationReview from './pages/operations-admin/TeacherApplicationReview';
import TeacherAssignments from "./pages/operations-admin/TeacherAssignments";
import TeacherMyClasses from "./pages/operations-admin/TeacherMyClasses";

import Events from "./pages/operations-admin/Events";
import TeacherManagement from "./pages/operations-admin/TeacherManagement";
import StudentManagement from "./pages/operations-admin/StudentManagement";
import AdminManager from './pages/operations-admin/AdminManager';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        <Route path="/update-username" element={<UpdateUsername />} />

        {/* Secure Role-Based Dashboard Routes */}
        <Route path="/super-admin" element={<SuperAdminDashboard />} />

        <Route path="/academic-admin" element={<AcademicAdminDashboard />} />
        <Route path="/academic-admin/teachers" element={<AcademicTeachersManagement />} />
        <Route path="/academic-admin/subjects" element={<AcademicSubjectsManagement />} />
        <Route path="/academic-admin/classes" element={<AcademicClassAssignments />} />

        <Route path="/student-admin" element={<StudentAdminDashboard />} />
        <Route path="/finance-admin" element={<FinanceAdminDashboard />} />
        <Route path="/operations-admin" element={<OperationsAdminDashboard />} />
      
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/attendanceMark" element={<TeacherAttendanceMark />} />
        <Route path="/teacher/application" element={<TeacherApplicationReview/>} />
        <Route path="/teacher/assignments" element={<TeacherAssignments />} />
        <Route path="/teacher/myclasses" element={<TeacherMyClasses />} />
        
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/attendance" element={<StudentAttendance />} />
        <Route path="/student/application" element={<Application />} />
        <Route path="/student/assignments" element={<StudentAssignments />} />

        <Route path="/operations-admin/events" element={<Events />} />
        <Route path="/teachers" element={<TeacherManagement />} />
        <Route path="/students" element={<StudentManagement />} />
        <Route path="/manage/:role" element={<AdminManager />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;