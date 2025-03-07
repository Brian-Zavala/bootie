// src/pages/courses/CoursesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import apiClient from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    difficulty: '',
    tag: '',
    search: '',
    sort: 'newest'
  });
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const queryParams = new URLSearchParams();
        
        if (filters.difficulty) {
          queryParams.append('difficulty', filters.difficulty);
        }
        
        if (filters.tag) {
          queryParams.append('tag', filters.tag);
        }
        
        if (filters.search) {
          queryParams.append('search', filters.search);
        }
        
        if (filters.sort) {
          queryParams.append('sort', filters.sort);
        }
        
        const response = await apiClient.get(`/courses?${queryParams.toString()}`);
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch courses. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [filters]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // The search is already handled by the useEffect dependency
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
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Courses</h1>
        <p className="text-lg text-gray-600">
          Discover our comprehensive library of programming courses designed to help you master in-demand skills.
        </p>
      </div>
      
      <div className="mb-8 bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="md:w-1/3">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search courses..."
                  className="input pr-10"
                  value={filters.search}
                  onChange={handleFilterChange}
                />
                <button type="submit" className="absolute right-3 top-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
          
          <div className="md:w-1/3">
            <select 
              name="difficulty" 
              className="input"
              value={filters.difficulty}
              onChange={handleFilterChange}
            >
              <option value="">All Difficulty Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div className="md:w-1/3">
            <select 
              name="sort" 
              className="input"
              value={filters.sort}
              onChange={handleFilterChange}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating-high">Highest Rated</option>
              <option value="rating-low">Lowest Rated</option>
            </select>
          </div>
        </div>
      </div>
      
      {courses.length === 0 ? (
        <div className="text-center py-12 bg-white shadow rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No courses found</h3>
          <p className="mt-2 text-gray-600">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <div key={course._id} className="bg-white rounded-lg shadow overflow-hidden">
              {course.thumbnail ? (
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className={`h-48 w-full bg-gradient-to-r from-${
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
                  {course.price.free ? (
                    <span className="text-green-600 font-bold">Free</span>
                  ) : (
                    <span className="text-gray-900 font-bold">${course.price.amount}</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-gray-600">{course.averageRating.toFixed(1)}</span>
                  </div>
                  <Link to={`/courses/${course.slug}`} className="text-primary-600 hover:text-primary-700 font-medium">
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;