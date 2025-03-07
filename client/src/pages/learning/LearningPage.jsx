// src/pages/learning/LearningPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import apiClient from '../../api/client';
import Exercise from '../../components/learning/Exercise';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';

const LearningPage = () => {
  const { courseSlug, lessonId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await apiClient.get(`/courses/${courseSlug}`);
        const courseData = response.data.course;
        setCourse(courseData);
        
        // If lessonId is provided, find that lesson
        if (lessonId) {
          const [moduleId, lesson] = lessonId.split('-');
          const foundModule = courseData.modules.find(m => m._id === moduleId);
          
          if (foundModule) {
            setCurrentModule(foundModule);
            const foundLesson = foundModule.lessons.find(l => l._id === lesson);
            
            if (foundLesson) {
              setCurrentLesson(foundLesson);
            } else {
              // If lesson not found, default to first lesson in module
              setCurrentLesson(foundModule.lessons[0]);
            }
          }
        } else {
          // Default to first module and lesson
          const firstModule = courseData.modules[0];
          setCurrentModule(firstModule);
          setCurrentLesson(firstModule?.lessons[0]);
        }
        
        setLoading(false);
      } catch (error) {
        setError('Failed to load course content. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseSlug, lessonId]);
  
  const handleLessonSelect = (moduleId, lesson) => {
    setCurrentModule(course.modules.find(m => m._id === moduleId));
    setCurrentLesson(lesson);
    navigate(`/learn/${courseSlug}/${moduleId}-${lesson._id}`);
    setSidebarOpen(false);
  };
  
  const handleNextLesson = () => {
    // Find current module and lesson index
    const moduleIndex = course.modules.findIndex(m => m._id === currentModule._id);
    const lessonIndex = currentModule.lessons.findIndex(l => l._id === currentLesson._id);
    
    // Check if there's another lesson in the current module
    if (lessonIndex < currentModule.lessons.length - 1) {
      const nextLesson = currentModule.lessons[lessonIndex + 1];
      handleLessonSelect(currentModule._id, nextLesson);
    } 
    // Check if there's another module
    else if (moduleIndex < course.modules.length - 1) {
      const nextModule = course.modules[moduleIndex + 1];
      handleLessonSelect(nextModule._id, nextModule.lessons[0]);
    }
    // No more lessons or modules
    else {
      // Course completed
      alert('Congratulations! You have completed this course.');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  if (!course || !currentModule || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p>Could not find the requested course or lesson.</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md text-gray-600 hover:text-gray-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-10 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto`}>
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 truncate">{course.title}</h1>
        </div>
        
        <div className="py-4">
          {course.modules.map((module, moduleIndex) => (
            <div key={module._id} className="mb-4">
              <div className="px-4 py-2 flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-900">
                  {moduleIndex + 1}. {module.title}
                </h2>
              </div>
              
              <div className="mt-1">
                {module.lessons.map((lesson, lessonIndex) => (
                  <button
                    key={lesson._id}
                    onClick={() => handleLessonSelect(module._id, lesson)}
                    className={`w-full px-6 py-2 text-left text-sm ${
                      currentLesson._id === lesson._id
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{moduleIndex + 1}.{lessonIndex + 1}</span>
                      <span className="truncate">{lesson.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentLesson.title}</h2>
              
              <div className="prose prose-blue max-w-none mb-6">
                <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
              </div>
              
              {currentLesson.exercises && currentLesson.exercises.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Exercises</h3>
                  
                  <div className="space-y-6">
                    {currentLesson.exercises.map((exerciseId) => (
                      <Exercise 
                        key={exerciseId} 
                        exerciseId={exerciseId}
                        onComplete={() => {
                          // In a real app, you would update user progress here
                          console.log('Exercise completed!');
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-6 py-3 flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
              
              <Button
                variant="primary"
                onClick={handleNextLesson}
              >
                Next Lesson
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;