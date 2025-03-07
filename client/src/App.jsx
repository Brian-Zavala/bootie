// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import PrivateRoute from './components/PrivateRoute';

// Public pages
import HomePage from './pages/home/HomePage';
import CoursesPage from './pages/courses/CoursesPage';
import CourseDetailPage from './pages/courses/CourseDetailPage';
// import PricingPage from './pages/PricingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
// import ForgotPassword from './pages/auth/ForgotPassword';
// import ResetPassword from './pages/auth/ResetPassword';

// Protected pages
// import Dashboard from './pages/dashboard/Dashboard';
// import LearningPage from './pages/learning/LearningPage';
// import ProfilePage from './pages/profile/ProfilePage';
// import SubscriptionPage from './pages/profile/SubscriptionPage';
// import ProgressPage from './pages/profile/ProgressPage';

// Instructor pages
// import InstructorDashboard from './pages/instructor/InstructorDashboard';
// import InstructorCourses from './pages/instructor/InstructorCourses';
// import CourseEditor from './pages/instructor/CourseEditor';
// import ExerciseEditor from './pages/instructor/ExerciseEditor';

// Admin pages
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AdminUsers from './pages/admin/AdminUsers';
// import AdminCourses from './pages/admin/AdminCourses';

// Error pages
// import NotFound from './pages/NotFound';
// import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:slug" element={<CourseDetailPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            
            {/* Student Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="my-courses" element={<Dashboard />} />
              <Route path="learn/:courseSlug/:lessonId?" element={<LearningPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="subscription" element={<SubscriptionPage />} />
              <Route path="progress" element={<ProgressPage />} />
            </Route>
            
            {/* Instructor Routes */}
            <Route element={<PrivateRoute requiredRoles={['instructor', 'admin']} />}>
              <Route path="instructor" element={<InstructorDashboard />} />
              <Route path="instructor/courses" element={<InstructorCourses />} />
              <Route path="instructor/courses/new" element={<CourseEditor />} />
              <Route path="instructor/courses/:id/edit" element={<CourseEditor />} />
              <Route path="instructor/exercises/new" element={<ExerciseEditor />} />
              <Route path="instructor/exercises/:id/edit" element={<ExerciseEditor />} />
            </Route>
            
            {/* Admin Routes */}
            <Route element={<PrivateRoute requiredRoles={['admin']} />}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/users" element={<AdminUsers />} />
              <Route path="admin/courses" element={<AdminCourses />} />
            </Route>
            
            {/* Error Pages */}
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;