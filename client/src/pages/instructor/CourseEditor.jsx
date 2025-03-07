// src/pages/instructor/CourseEditor.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import apiClient from '../../api/client';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [modules, setModules] = useState([]);
  
  useEffect(() => {
    if (isEditMode) {
      const fetchCourse = async () => {
        try {
          const response = await apiClient.get(`/instructor/courses/${id}`);
          const courseData = response.data.course;
          setCourse(courseData);
          setModules(courseData.modules || []);
          
          // Set initial form values
          formik.setValues({
            title: courseData.title || '',
            slug: courseData.slug || '',
            description: courseData.description || '',
            difficulty: courseData.difficulty || 'beginner',
            duration: courseData.duration || 0,
            isFree: courseData.price?.free || false,
            price: courseData.price?.amount || 0,
            requirements: courseData.requirements?.join('\n') || '',
            tags: courseData.tags?.join(', ') || ''
          });
          
          setLoading(false);
        } catch (error) {
          setError('Failed to fetch course details. Please try again later.');
          setLoading(false);
        }
      };
      
      fetchCourse();
    }
  }, [id, isEditMode]);
  
  const formik = useFormik({
    initialValues: {
      title: '',
      slug: '',
      description: '',
      difficulty: 'beginner',
      duration: 0,
      isFree: true,
      price: 0,
      requirements: '',
      tags: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      slug: Yup.string()
        .required('Slug is required')
        .matches(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
      description: Yup.string().required('Description is required'),
      difficulty: Yup.string().oneOf(['beginner', 'intermediate', 'advanced']),
      duration: Yup.number().min(0, 'Duration cannot be negative'),
      isFree: Yup.boolean(),
      price: Yup.number().when('isFree', {
        is: false,
        then: Yup.number().min(0.01, 'Price must be greater than 0')
      }),
      requirements: Yup.string(),
      tags: Yup.string()
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const courseData = {
          title: values.title,
          slug: values.slug,
          description: values.description,
          difficulty: values.difficulty,
          duration: values.duration,
          price: {
            free: values.isFree,
            amount: values.isFree ? 0 : values.price
          },
          requirements: values.requirements ? values.requirements.split('\n').filter(Boolean) : [],
          tags: values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
          modules: modules
        };
        
        if (isEditMode) {
          await apiClient.put(`/instructor/courses/${id}`, courseData);
        } else {
          await apiClient.post('/instructor/courses', courseData);
        }
        
        navigate('/instructor/courses');
      } catch (error) {
        setError('Failed to save course. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  });
  
  const handleAddModule = () => {
    setModules([
      ...modules,
      {
        _id: `temp-${Date.now()}`, // Temporary ID for new modules
        title: 'New Module',
        description: '',
        order: modules.length,
        lessons: []
      }
    ]);
  };
  
  const handleUpdateModule = (moduleId, field, value) => {
    setModules(modules.map(module => 
      module._id === moduleId 
        ? { ...module, [field]: value } 
        : module
    ));
  };
  
  const handleDeleteModule = (moduleId) => {
    setModules(modules.filter(module => module._id !== moduleId));
  };
  
  const handleAddLesson = (moduleId) => {
    setModules(modules.map(module => {
      if (module._id === moduleId) {
        return {
          ...module,
          lessons: [
            ...module.lessons,
            {
              _id: `temp-${Date.now()}`, // Temporary ID for new lessons
              title: 'New Lesson',
              content: '',
              order: module.lessons.length,
              exercises: []
            }
          ]
        };
      }
      return module;
    }));
  };
  
  const handleUpdateLesson = (moduleId, lessonId, field, value) => {
    setModules(modules.map(module => {
      if (module._id === moduleId) {
        return {
          ...module,
          lessons: module.lessons.map(lesson => 
            lesson._id === lessonId 
              ? { ...lesson, [field]: value } 
              : lesson
          )
        };
      }
      return module;
    }));
  };
  
  const handleDeleteLesson = (moduleId, lessonId) => {
    setModules(modules.map(module => {
      if (module._id === moduleId) {
        return {
          ...module,
          lessons: module.lessons.filter(lesson => lesson._id !== lessonId)
        };
      }
      return module;
    }));
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{isEditMode ? 'Edit Course' : 'Create New Course'}</h1>
        <p className="text-lg text-gray-600">
          {isEditMode 
            ? 'Update your course information and curriculum' 
            : 'Fill in the details to create a new course'}
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'basic'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Basic Info
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
          </nav>
        </div>
        
        <form onSubmit={formik.handleSubmit}>
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Course Title</label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      {...formik.getFieldProps('title')}
                    />
                    {formik.touched.title && formik.errors.title ? (
                      <div className="mt-1 text-sm text-red-600">{formik.errors.title}</div>
                    ) : null}
                  </div>
                  
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                      URL Slug
                      <span className="ml-1 text-xs text-gray-500">(e.g., javascript-fundamentals)</span>
                    </label>
                    <input
                      id="slug"
                      name="slug"
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      {...formik.getFieldProps('slug')}
                    />
                    {formik.touched.slug && formik.errors.slug ? (
                      <div className="mt-1 text-sm text-red-600">{formik.errors.slug}</div>
                    ) : null}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    {...formik.getFieldProps('description')}
                  ></textarea>
                  {formik.touched.description && formik.errors.description ? (
                    <div className="mt-1 text-sm text-red-600">{formik.errors.description}</div>
                  ) : null}
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty Level</label>
                    <select
                      id="difficulty"
                      name="difficulty"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      {...formik.getFieldProps('difficulty')}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                    <input
                      id="duration"
                      name="duration"
                      type="number"
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      {...formik.getFieldProps('duration')}
                    />
                  </div>
                  
                  <div>
                    <fieldset className="mt-4">
                      <legend className="block text-sm font-medium text-gray-700">Pricing</legend>
                      <div className="mt-1 space-y-2">
                        <div className="flex items-center">
                          <input
                            id="isFree"
                            name="isFree"
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            checked={formik.values.isFree}
                            onChange={() => formik.setFieldValue('isFree', !formik.values.isFree)}
                          />
                          <label htmlFor="isFree" className="ml-2 block text-sm text-gray-700">
                            Free Course
                          </label>
                        </div>
                        
                        {!formik.values.isFree && (
                          <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                              Price (USD)
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">
                                  $
                                </span>
                              </div>
                              <input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                className="block w-full pl-7 rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                                {...formik.getFieldProps('price')}
                              />
                            </div>
                            {formik.touched.price && formik.errors.price ? (
                              <div className="mt-1 text-sm text-red-600">{formik.errors.price}</div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </fieldset>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                    Requirements
                    <span className="ml-1 text-xs text-gray-500">(one per line)</span>
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Basic understanding of HTML and CSS"
                    {...formik.getFieldProps('requirements')}
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                    Tags
                    <span className="ml-1 text-xs text-gray-500">(comma separated)</span>
                  </label>
                  <input
                    id="tags"
                    name="tags"
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="javascript, web development, programming"
                    {...formik.getFieldProps('tags')}
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/instructor/courses')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab('curriculum')}
                  >
                    Next: Curriculum
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Curriculum Tab */}
          {activeTab === 'curriculum' && (
            <div className="p-6">
              <div className="mb-6">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleAddModule}
                >
                  Add Module
                </Button>
              </div>
              
              {modules.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No modules</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new module.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {modules.map((module, moduleIndex) => (
                    <div key={module._id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={module.title}
                              onChange={(e) => handleUpdateModule(module._id, 'title', e.target.value)}
                              className="block w-full border-0 bg-transparent font-medium text-gray-900 focus:ring-0 sm:text-lg"
                              placeholder="Module Title"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleAddLesson(module._id)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              Add Lesson
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteModule(module._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <input
                            type="text"
                            value={module.description || ''}
                            onChange={(e) => handleUpdateModule(module._id, 'description', e.target.value)}
                            className="block w-full border-0 bg-transparent text-gray-500 focus:ring-0 sm:text-sm"
                            placeholder="Module description (optional)"
                          />
                        </div>
                      </div>
                      
                      <div className="divide-y divide-gray-200">
                        {module.lessons.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            No lessons yet. Click "Add Lesson" to create your first lesson.
                          </div>
                        ) : (
                          module.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson._id} className="p-4">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <span className="text-gray-500 mr-2">{moduleIndex + 1}.{lessonIndex + 1}</span>
                                  <input
                                    type="text"
                                    value={lesson.title}
                                    onChange={(e) => handleUpdateLesson(module._id, lesson._id, 'title', e.target.value)}
                                    className="block w-full border-0 bg-transparent font-medium text-gray-900 focus:ring-0"
                                    placeholder="Lesson Title"
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Link to={`/instructor/exercises/new?courseId=${id || 'new'}&moduleId=${module._id}&lessonId=${lesson._id}`} className="text-blue-600 hover:text-blue-900">
                                    Add Exercise
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLesson(module._id, lesson._id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                              
                              <div className="mt-2">
                                <textarea
                                  value={lesson.content || ''}
                                  onChange={(e) => handleUpdateLesson(module._id, lesson._id, 'content', e.target.value)}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                                  rows="3"
                                  placeholder="Lesson content..."
                                ></textarea>
                              </div>
                              
                              {lesson.exercises && lesson.exercises.length > 0 && (
                                <div className="mt-3">
                                  <h4 className="text-sm font-medium text-gray-700">Exercises:</h4>
                                  <ul className="mt-1 text-sm text-gray-600">
                                    {lesson.exercises.map((exercise, index) => (
                                      <li key={index} className="flex items-center">
                                        <span className="mr-2">•</span>
                                        <span>{exercise.title || `Exercise ${index + 1}`}</span>
                                        <Link to={`/instructor/exercises/${exercise._id}/edit`} className="ml-2 text-xs text-primary-600 hover:text-primary-900">
                                          Edit
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('basic')}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={formik.isSubmitting}
                  disabled={formik.isSubmitting}
                >
                  {isEditMode ? 'Update Course' : 'Create Course'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CourseEditor;