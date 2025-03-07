// src/pages/instructor/InstructorCourses.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import apiClient from '../../api/client';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiClient.get('/instructor/courses');
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch your courses. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  const handlePublishToggle = async (courseId, currentStatus) => {
    try {
      await apiClient.put(`/instructor/courses/${courseId}/publish`, {
        isPublished: !currentStatus
      });
      
      // Update courses list
      setCourses(courses.map(course => 
        course._id === courseId 
          ? { ...course, isPublished: !course.isPublished } 
          : course
      ));
    } catch (error) {
      setError('Failed to update course status. Please try again.');
    }
  };
  
  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }
    
    try {
      await apiClient.delete(`/instructor/courses/${courseId}`);
      
      // Remove course from the list
      setCourses(courses.filter(course => course._id !== courseId));
    } catch (error) {
      setError('Failed to delete course. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-lg text-gray-600">Manage and create courses</p>
        </div>
        
        <Link to="/instructor/courses/new">
          <Button variant="primary">
            Create New Course
          </Button>
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No courses found</h3>
          <p className="mt-2 text-gray-600">Get started by creating your first course.</p>
          <div className="mt-4">
            <Link to="/instructor/courses/new">
              <Button variant="primary">
                Create New Course
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {course.thumbnail ? (
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className={`w-full h-48 bg-gradient-to-r from-${
                  course.difficulty === 'beginner' ? 'blue-500 to-indigo-600' : 
                  course.difficulty === 'intermediate' ? 'green-500 to-teal-500' : 
                  'purple-500 to-pink-500'
                }`}></div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    course.difficulty === 'beginner' ? 'bg-blue-100 text-blue-800' : 
                    course.difficulty === 'intermediate' ? 'bg-green-100 text-green-800' : 
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                  </span>
                  
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    course.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Students:</span>
                    <span className="font-medium">{course.enrolledStudents?.length || 0}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Modules:</span>
                    <span className="font-medium">{course.modules?.length || 0}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-medium flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {course.averageRating?.toFixed(1) || '-'} ({course.ratings?.length || 0})
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                  <div className="flex space-x-2">
                    <Link to={`/instructor/courses/${course._id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button 
                      variant={course.isPublished ? "outline" : "primary"} 
                      size="sm"
                      onClick={() => handlePublishToggle(course._id, course.isPublished)}
                    >
                      {course.isPublished ? 'Unpublish' : 'Publish'}
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link to={`/courses/${course.slug}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteCourse(course._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorCourses;