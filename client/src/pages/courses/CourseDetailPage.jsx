// src/pages/courses/CourseDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/client';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CourseDetailPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  // Fetch course details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await apiClient.get(`/courses/${slug}`);
        setCourse(response.data.course);
        setLoading(false);
        
        // Check if user is enrolled
        if (user && response.data.course.enrolledStudents) {
          setIsEnrolled(response.data.course.enrolledStudents.includes(user._id));
        }
      } catch (error) {
        setError('Failed to fetch course details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchCourseDetails();
  }, [slug, user]);
  
  const handleEnroll = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: `/courses/${slug}` } });
      return;
    }
    
    setEnrolling(true);
    
    try {
      await apiClient.post(`/courses/${course._id}/enroll`);
      setIsEnrolled(true);
      setEnrolling(false);
      
      // Redirect to learning page
      navigate(`/learn/${slug}`);
    } catch (error) {
      setEnrolling(false);
      
      if (error.response?.status === 403 && error.response?.data?.message === 'Subscription required for this course') {
        // Redirect to subscription page
        navigate('/subscription', { state: { from: `/courses/${slug}` } });
      } else {
        setError(error.response?.data?.message || 'Failed to enroll in course');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="page-container">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
        <Link to="/courses" className="text-primary-600 hover:text-primary-700">
          ← Back to courses
        </Link>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <p className="text-gray-600 mb-6">The course you're looking for does not exist or has been removed.</p>
          <Link to="/courses" className="text-primary-600 hover:text-primary-700">
            Browse all courses
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <div className="mb-6">
        <Link to="/courses" className="text-primary-600 hover:text-primary-700">
          ← Back to courses
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Course Header */}
        <div className="relative">
          {course.thumbnail ? (
            <img 
              src={course.thumbnail} 
              alt={course.title} 
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className={`w-full h-64 bg-gradient-to-r from-${
              course.difficulty === 'beginner' ? 'blue-500 to-indigo-600' : 
              course.difficulty === 'intermediate' ? 'green-500 to-teal-500' : 
              'purple-500 to-pink-500'
            }`}></div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-white/90 ${
                course.difficulty === 'beginner' ? 'text-blue-800' : 
                course.difficulty === 'intermediate' ? 'text-green-800' : 
                'text-purple-800'
              }`}>
                {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
              </span>
              {course.price.free ? (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Free</span>
              ) : (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">${course.price.amount}</span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'curriculum'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Curriculum
            </button>
            <button
              onClick={() => setActiveTab('instructor')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'instructor'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Instructor
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Course</h2>
                <div className="prose prose-blue max-w-none mb-6">
                  <p>{course.description}</p>
                </div>
                
                {course.requirements && course.requirements.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      {course.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {course.tags && course.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{course.duration} minutes of content</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                      <span className="text-gray-700">
                        {course.modules.length} modules • {course.modules.reduce((total, module) => total + module.lessons.length, 0)} lessons
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                      <span className="text-gray-700">Certificate of completion</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-gray-700">{course.averageRating.toFixed(1)} average rating</span>
                    </div>
                  </div>
                  
                  {isEnrolled ? (
                    <div>
                      <Link to={`/learn/${slug}`}>
                        <Button
                          variant="primary"
                          size="lg"
                          className="w-full"
                        >
                          Continue Learning
                        </Button>
                      </Link>
                      <p className="text-center text-sm text-gray-600 mt-2">
                        You're enrolled in this course
                      </p>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={handleEnroll}
                      isLoading={enrolling}
                      disabled={enrolling}
                    >
                      {course.price.free ? 'Enroll for Free' : `Enroll for $${course.price.amount}`}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Curriculum Tab */}
          {activeTab === 'curriculum' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
              
              {course.modules.length === 0 ? (
                <p className="text-gray-600">No curriculum available for this course yet.</p>
              ) : (
                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => (
                    <div key={moduleIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                          {moduleIndex + 1}. {module.title}
                        </h3>
                        <span className="text-sm text-gray-600">
                          {module.lessons.length} {module.lessons.length === 1 ? 'lesson' : 'lessons'}
                        </span>
                      </div>
                      
                      <div className="divide-y divide-gray-200">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div key={lessonIndex} className="px-4 py-3 flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="text-gray-600 mr-2">{moduleIndex + 1}.{lessonIndex + 1}</span>
                              <span className="text-gray-900">{lesson.title}</span>
                            </div>
                            
                            <div className="flex items-center">
                              {lesson.exercises.length > 0 && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
                                  {lesson.exercises.length} {lesson.exercises.length === 1 ? 'exercise' : 'exercises'}
                                </span>
                              )}
                              
                              {isEnrolled ? (
                                <Link to={`/learn/${slug}/${module._id}-${lesson._id}`} className="text-primary-600 hover:text-primary-700 text-sm">
                                  View
                                </Link>
                              ) : (
                                <span className="text-gray-400 text-sm">Locked</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Instructor Tab */}
          {activeTab === 'instructor' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">About the Instructor</h2>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {course.instructor.profileImage ? (
                    <img
                      src={course.instructor.profileImage}
                      alt={`${course.instructor.firstName} ${course.instructor.lastName}`}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                      {course.instructor.firstName?.charAt(0) || course.instructor.username?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {course.instructor.firstName && course.instructor.lastName 
                      ? `${course.instructor.firstName} ${course.instructor.lastName}`
                      : course.instructor.username}
                  </h3>
                  
                  {course.instructor.bio && (
                    <div className="mt-2 text-gray-600">
                      <p>{course.instructor.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Student Reviews</h2>
                
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star}
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 ${star <= Math.round(course.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-900 font-medium">{course.averageRating.toFixed(1)}</span>
                  <span className="text-gray-600 ml-1">({course.ratings.length} {course.ratings.length === 1 ? 'review' : 'reviews'})</span>
                </div>
              </div>
              
              {course.ratings.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No reviews yet for this course.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {course.ratings.map((rating, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-3">
                            {rating.user.username?.charAt(0) || '?'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{rating.user.username}</div>
                            <div className="text-sm text-gray-600">
                              {new Date(rating.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg 
                              key={star}
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-5 w-5 ${star <= rating.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      
                      {rating.review && (
                        <p className="text-gray-600">{rating.review}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {isEnrolled && (
                <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
                  <p className="text-gray-600 mb-4">Share your experience with this course to help other students.</p>
                  <Link to={`/courses/${slug}/review`}>
                    <Button variant="primary">
                      Write a Review
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;