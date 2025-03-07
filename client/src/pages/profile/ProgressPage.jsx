// src/pages/profile/ProgressPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import apiClient from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProgressPage = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await apiClient.get('/courses/user/enrolled');
        setProgress(response.data.enrolledCourses);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch your learning progress. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchProgress();
  }, []);
  
  const filteredProgress = filter === 'all'
    ? progress
    : filter === 'completed'
    ? progress.filter(item => item.progress === 100)
    : filter === 'in-progress'
    ? progress.filter(item => item.progress > 0 && item.progress < 100)
    : progress.filter(item => item.progress === 0);
  
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
        <h1 className="text-3xl font-bold text-gray-900">My Learning Progress</h1>
        <p className="text-lg text-gray-600">Track your progress across all enrolled courses</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFilter('all')}
          >
            All Courses
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === 'completed'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === 'in-progress'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFilter('in-progress')}
          >
            In Progress
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === 'not-started'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFilter('not-started')}
          >
            Not Started
          </button>
        </div>
      </div>
      
      {filteredProgress.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No courses found</h3>
          <p className="mt-2 text-gray-600">
            {filter === 'all'
              ? "You haven't enrolled in any courses yet."
              : filter === 'completed'
              ? "You haven't completed any courses yet."
              : filter === 'in-progress'
              ? "You don't have any courses in progress."
              : "You don't have any courses waiting to be started."}
          </p>
          
          {filter === 'all' && (
            <div className="mt-4">
              <Link to="/courses" className="text-primary-600 hover:text-primary-700 font-medium">
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredProgress.map((item) => (
            <div key={item.course._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-xl font-bold text-gray-900">{item.course.title}</h2>
                    <p className="text-gray-600 mt-1">{item.course.description}</p>
                    
                    <div className="flex items-center mt-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.course.difficulty === 'beginner' ? 'bg-blue-100 text-blue-800' : 
                        item.course.difficulty === 'intermediate' ? 'bg-green-100 text-green-800' : 
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {item.course.difficulty.charAt(0).toUpperCase() + item.course.difficulty.slice(1)}
                      </span>
                      
                      <span className="ml-2 text-sm text-gray-600">
                        {item.course.modules.reduce((total, module) => total + module.lessons.length, 0)} lessons
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="flex items-center mb-2">
                      <span className="text-lg font-medium text-gray-900 mr-2">{item.progress}%</span>
                      {item.progress === 100 ? (
                        <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                          Completed
                        </span>
                      ) : item.progress > 0 ? (
                        <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                          In Progress
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                          Not Started
                        </span>
                      )}
                    </div>
                    
                    <Link
                      to={`/learn/${item.course.slug}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {item.progress === 0 ? 'Start Learning' : 'Continue Learning'} →
                    </Link>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        item.progress === 100 ? 'bg-green-600' : 'bg-primary-600'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                {item.lastAccessed && (
                  <div className="mt-4 text-sm text-gray-600">
                    Last accessed: {new Date(item.lastAccessed.timestamp).toLocaleDateString()} at {new Date(item.lastAccessed.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
              
              {item.progress > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Completed Lessons</h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        {item.course.modules.reduce((total, module) => {
                          const completedLessonsInModule = module.lessons.filter(lesson => {
                            return item.completedLessons?.some(cl => 
                              cl.moduleId === module._id && cl.lessonId === lesson._id
                            );
                          }).length;
                          return total + completedLessonsInModule;
                        }, 0)} 
                        / 
                        {item.course.modules.reduce((total, module) => total + module.lessons.length, 0)}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Completed Exercises</h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        {item.completedExercises?.length || 0} 
                        / 
                        {item.course.modules.reduce((total, module) => {
                          return total + module.lessons.reduce((lessonTotal, lesson) => {
                            return lessonTotal + (lesson.exercises?.length || 0);
                          }, 0);
                        }, 0)}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Time Spent</h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        {Math.floor(item.timeSpent / 60)} hrs {item.timeSpent % 60} mins
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressPage;