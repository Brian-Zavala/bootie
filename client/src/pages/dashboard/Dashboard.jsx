// src/pages/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/client';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await apiClient.get('/courses/user/enrolled');
        setEnrolledCourses(response.data.enrolledCourses);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch your courses. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchEnrolledCourses();
  }, []);
  
  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome back, {user?.firstName || user?.username}!</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Learning</h2>
          
          {enrolledCourses.length === 0 ? (
            <div className="text-center py-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="mt-2 text-gray-600">You haven't enrolled in any courses yet.</p>
              <Link to="/courses" className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrolledCourses.slice(0, 3).map((item) => (
                <div key={item.course._id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{item.course.title}</h3>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full" 
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-600">{item.progress}% complete</span>
                    <Link to={`/learn/${item.course.slug}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Continue
                    </Link>
                  </div>
                </div>
              ))}
              
              {enrolledCourses.length > 3 && (
                <Link to="/my-courses" className="block text-center text-primary-600 hover:text-primary-700 font-medium">
                  View all courses
                </Link>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Progress</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Courses Completed</p>
                <p className="text-2xl font-bold text-gray-900">{enrolledCourses.filter(c => c.progress === 100).length}</p>
              </div>
              <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Courses In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length}</p>
              </div>
              <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Not Started</p>
                <p className="text-2xl font-bold text-gray-900">{enrolledCourses.filter(c => c.progress === 0).length}</p>
              </div>
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Link to="/progress">
              <Button variant="outline" className="w-full">
                View Detailed Progress
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
          
          <div className="space-y-3">
            <Link to="/courses" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="font-medium text-gray-900">Browse Courses</span>
              </div>
            </Link>
            
            <Link to="/profile" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium text-gray-900">My Profile</span>
              </div>
            </Link>
            
            <Link to="/subscription" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="font-medium text-gray-900">Subscription</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Courses</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* This would typically fetch from an API based on user preferences */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div className="p-4">
              <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">Beginner</span>
              <h3 className="mt-2 font-bold text-gray-900">JavaScript Fundamentals</h3>
              <p className="mt-1 text-sm text-gray-600">Learn the basics of JavaScript programming</p>
              <Link to="/courses/javascript-fundamentals" className="mt-3 inline-block text-primary-600 hover:text-primary-700 text-sm font-medium">
                View Course →
              </Link>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-green-500 to-teal-500"></div>
            <div className="p-4">
              <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Intermediate</span>
              <h3 className="mt-2 font-bold text-gray-900">React for Beginners</h3>
              <p className="mt-1 text-sm text-gray-600">Build modern user interfaces with React</p>
              <Link to="/courses/react-beginners" className="mt-3 inline-block text-primary-600 hover:text-primary-700 text-sm font-medium">
                View Course →
              </Link>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <div className="p-4">
              <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">Advanced</span>
              <h3 className="mt-2 font-bold text-gray-900">Node.js Backend Development</h3>
              <p className="mt-1 text-sm text-gray-600">Create scalable backend applications</p>
              <Link to="/courses/nodejs-backend" className="mt-3 inline-block text-primary-600 hover:text-primary-700 text-sm font-medium">
                View Course →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;