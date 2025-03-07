// src/pages/instructor/ExerciseEditor.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import apiClient from '../../api/client';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CodeEditor from '../../components/learning/CodeEditor';

const ExerciseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!id;
  
  // Parse query params for new exercises
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('courseId');
  const moduleId = queryParams.get('moduleId');
  const lessonId = queryParams.get('lessonId');
  
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [options, setOptions] = useState([]);
  const [hints, setHints] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses for the dropdown
        const coursesResponse = await apiClient.get('/instructor/courses');
        setCourses(coursesResponse.data.courses);
        
        if (isEditMode) {
          // Fetch exercise data if editing
          const exerciseResponse = await apiClient.get(`/instructor/exercises/${id}`);
          const exerciseData = exerciseResponse.data.exercise;
          setExercise(exerciseData);
          
          // Set initial form values
          formik.setValues({
            title: exerciseData.title || '',
            instructions: exerciseData.instructions || '',
            type: exerciseData.type || 'coding',
            difficulty: exerciseData.difficulty || 'medium',
            course: exerciseData.course || '',
            language: exerciseData.language || 'javascript',
            codeTemplate: exerciseData.codeTemplate || '',
            solution: exerciseData.solution || '',
            points: exerciseData.points || 10,
            timeLimit: exerciseData.timeLimit || 300
          });
          
          // Set test cases, options, and hints
          setTestCases(exerciseData.testCases || []);
          setOptions(exerciseData.options || []);
          setHints(exerciseData.hints || []);
        } else if (courseId) {
          // Set initial course if provided in query params
          formik.setFieldValue('course', courseId);
        }
        
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode, courseId]);
  
  const formik = useFormik({
    initialValues: {
      title: '',
      instructions: '',
      type: 'coding',
      difficulty: 'medium',
      course: courseId || '',
      language: 'javascript',
      codeTemplate: '',
      solution: '',
      points: 10,
      timeLimit: 300
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      instructions: Yup.string().required('Instructions are required'),
      type: Yup.string().oneOf(['coding', 'multiple-choice', 'fill-in-blank']).required('Type is required'),
      difficulty: Yup.string().oneOf(['easy', 'medium', 'hard']).required('Difficulty is required'),
      course: Yup.string().required('Course is required'),
      language: Yup.string().when('type', {
        is: 'coding',
        then: Yup.string().oneOf(['javascript', 'python', 'go']).required('Language is required')
      }),
      codeTemplate: Yup.string().when('type', {
        is: 'coding',
        then: Yup.string().required('Code template is required')
      }),
      solution: Yup.string().required('Solution is required'),
      points: Yup.number().min(1).required('Points are required'),
      timeLimit: Yup.number().min(1).required('Time limit is required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // For multiple-choice, ensure we have at least one correct option
        if (values.type === 'multiple-choice' && !options.some(opt => opt.isCorrect)) {
          setError('At least one option must be marked as correct.');
          setSubmitting(false);
          return;
        }
        
        // Prepare exercise data
        const exerciseData = {
          ...values,
          testCases: values.type === 'coding' ? testCases : [],
          options: values.type === 'multiple-choice' ? options : [],
          hints
        };
        
        if (isEditMode) {
          await apiClient.put(`/instructor/exercises/${id}`, exerciseData);
        } else {
          // If creating a new exercise and have lesson context, attach it to that lesson
          if (moduleId && lessonId) {
            exerciseData.moduleId = moduleId;
            exerciseData.lessonId = lessonId;
          }
          
          await apiClient.post('/instructor/exercises', exerciseData);
        }
        
        // Navigate back to course editor or exercises list
        if (courseId) {
          navigate(`/instructor/courses/${courseId}/edit`);
        } else {
          navigate('/instructor/courses');
        }
      } catch (error) {
        setError('Failed to save exercise. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  });
  
  // Test Cases Management
  const handleAddTestCase = () => {
    setTestCases([
      ...testCases,
      { input: '', expectedOutput: '', isHidden: false }
    ]);
  };
  
  const handleUpdateTestCase = (index, field, value) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index] = {
      ...updatedTestCases[index],
      [field]: value
    };
    setTestCases(updatedTestCases);
  };
  
  const handleDeleteTestCase = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };
  
  // Options Management (for multiple choice)
  const handleAddOption = () => {
    setOptions([
      ...options,
      { text: '', isCorrect: false }
    ]);
  };
  
  const handleUpdateOption = (index, field, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: value
    };
    setOptions(updatedOptions);
  };
  
  const handleDeleteOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };
  
  // Hints Management
  const handleAddHint = () => {
    setHints([...hints, '']);
  };
  
  const handleUpdateHint = (index, value) => {
    const updatedHints = [...hints];
    updatedHints[index] = value;
    setHints(updatedHints);
  };
  
  const handleDeleteHint = (index) => {
    setHints(hints.filter((_, i) => i !== index));
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
        <h1 className="text-3xl font-bold text-gray-900">{isEditMode ? 'Edit Exercise' : 'Create Exercise'}</h1>
        <p className="text-lg text-gray-600">
          {isEditMode 
            ? 'Update your exercise details and test cases' 
            : 'Create a new exercise for your course'}
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={formik.handleSubmit}>
          <div className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Exercise Title</label>
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
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700">Course</label>
                  <select
                    id="course"
                    name="course"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    {...formik.getFieldProps('course')}
                    disabled={!!courseId} // Disable if courseId is provided
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                  </select>
                  {formik.touched.course && formik.errors.course ? (
                    <div className="mt-1 text-sm text-red-600">{formik.errors.course}</div>
                  ) : null}
                </div>
              </div>
              
              <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
                <textarea
                  id="instructions"
                  name="instructions"
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Provide detailed instructions for the exercise..."
                  {...formik.getFieldProps('instructions')}
                ></textarea>
                {formik.touched.instructions && formik.errors.instructions ? (
                  <div className="mt-1 text-sm text-red-600">{formik.errors.instructions}</div>
                ) : null}
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">Exercise Type</label>
                  <select
                    id="type"
                    name="type"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    {...formik.getFieldProps('type')}
                  >
                    <option value="coding">Coding</option>
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="fill-in-blank">Fill in the Blank</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty</label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    {...formik.getFieldProps('difficulty')}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                
                {formik.values.type === 'coding' && (
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
                    <select
                      id="language"
                      name="language"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      {...formik.getFieldProps('language')}
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="go">Go</option>
                    </select>
                    {formik.touched.language && formik.errors.language ? (
                      <div className="mt-1 text-sm text-red-600">{formik.errors.language}</div>
                    ) : null}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="points" className="block text-sm font-medium text-gray-700">Points</label>
                  <input
                    id="points"
                    name="points"
                    type="number"
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    {...formik.getFieldProps('points')}
                  />
                  {formik.touched.points && formik.errors.points ? (
                    <div className="mt-1 text-sm text-red-600">{formik.errors.points}</div>
                  ) : null}
                </div>
                
                <div>
                  <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700">Time Limit (seconds)</label>
                  <input
                    id="timeLimit"
                    name="timeLimit"
                    type="number"
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    {...formik.getFieldProps('timeLimit')}
                  />
                  {formik.touched.timeLimit && formik.errors.timeLimit ? (
                    <div className="mt-1 text-sm text-red-600">{formik.errors.timeLimit}</div>
                  ) : null}
                </div>
              </div>
              
              {/* Code Editor for Coding Exercises */}
              {formik.values.type === 'coding' && (
                <>
                  <div>
                    <label htmlFor="codeTemplate" className="block text-sm font-medium text-gray-700 mb-2">Code Template</label>
                    <CodeEditor
                      code={formik.values.codeTemplate}
                      language={formik.values.language}
                      onCodeChange={(code) => formik.setFieldValue('codeTemplate', code)}
                    />
                    {formik.touched.codeTemplate && formik.errors.codeTemplate ? (
                      <div className="mt-1 text-sm text-red-600">{formik.errors.codeTemplate}</div>
                    ) : null}
                  </div>
                  
                  <div>
                    <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-2">Solution</label>
                    <CodeEditor
                      code={formik.values.solution}
                      language={formik.values.language}
                      onCodeChange={(code) => formik.setFieldValue('solution', code)}
                    />
                    {formik.touched.solution && formik.errors.solution ? (
                      <div className="mt-1 text-sm text-red-600">{formik.errors.solution}</div>
                    ) : null}
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Test Cases</label>
                      <Button 
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddTestCase}
                      >
                        Add Test Case
                      </Button>
                    </div>
                    
                    {testCases.length === 0 ? (
                      <div className="text-center py-4 bg-gray-50 rounded-md">
                        <p className="text-gray-500">No test cases added yet. Add test cases to validate student solutions.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {testCases.map((testCase, index) => (
                          <div key={index} className="border border-gray-200 rounded-md p-4">
                            <div className="flex justify-between mb-3">
                              <h3 className="text-sm font-medium text-gray-700">Test Case #{index + 1}</h3>
                              <button
                                type="button"
                                onClick={() => handleDeleteTestCase(index)}
                                className="text-red-600 hover:text-red-900 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Input</label>
                                <textarea
                                  value={testCase.input}
                                  onChange={(e) => handleUpdateTestCase(index, 'input', e.target.value)}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                                  rows="2"
                                  placeholder="Input value for test"
                                ></textarea>
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Expected Output</label>
                                <textarea
                                  value={testCase.expectedOutput}
                                  onChange={(e) => handleUpdateTestCase(index, 'expectedOutput', e.target.value)}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                                  rows="2"
                                  placeholder="Expected output"
                                ></textarea>
                              </div>
                            </div>
                            
                            <div className="mt-2">
                              <label className="inline-flex items-center">
                                <input
                                  type="checkbox"
                                  checked={testCase.isHidden}
                                  onChange={(e) => handleUpdateTestCase(index, 'isHidden', e.target.checked)}
                                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">Hide this test case from students</span>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {/* Multiple Choice Options */}
              {formik.values.type === 'multiple-choice' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Options</label>
                    <Button 
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddOption}
                    >
                      Add Option
                    </Button>
                  </div>
                  
                  {options.length === 0 ? (
                    <div className="text-center py-4 bg-gray-50 rounded-md">
                      <p className="text-gray-500">No options added yet. Add answer options for the multiple choice question.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {options.map((option, index) => (
                        <div key={index} className="flex items-center">
                          <div className="flex-1 flex items-center">
                            <input
                              type="checkbox"
                              checked={option.isCorrect}
                              onChange={(e) => handleUpdateOption(index, 'isCorrect', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) => handleUpdateOption(index, 'text', e.target.value)}
                              className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              placeholder="Option text"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteOption(index)}
                            className="ml-2 text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Fill in the Blank */}
              {formik.values.type === 'fill-in-blank' && (
                <div>
                  <label htmlFor="solution" className="block text-sm font-medium text-gray-700">Correct Answer</label>
                  <input
                    id="solution"
                    name="solution"
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    {...formik.getFieldProps('solution')}
                  />
                  {formik.touched.solution && formik.errors.solution ? (
                    <div className="mt-1 text-sm text-red-600">{formik.errors.solution}</div>
                  ) : null}
                </div>
              )}
              
              {/* Hints for all exercise types */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Hints</label>
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddHint}
                  >
                    Add Hint
                  </Button>
                </div>
                
                {hints.length === 0 ? (
                  <div className="text-center py-4 bg-gray-50 rounded-md">
                    <p className="text-gray-500">No hints added yet. Add hints to help students solve the exercise.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {hints.map((hint, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Hint #{index + 1}</span>
                          </div>
                          <textarea
                            value={hint}
                            onChange={(e) => handleUpdateHint(index, e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            rows="2"
                            placeholder="Provide a helpful hint..."
                          ></textarea>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteHint(index)}
                          className="ml-2 text-red-600 hover:text-red-900 mt-6"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (courseId) {
                      navigate(`/instructor/courses/${courseId}/edit`);
                    } else {
                      navigate('/instructor/courses');
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={formik.isSubmitting}
                  disabled={formik.isSubmitting}
                >
                  {isEditMode ? 'Update Exercise' : 'Create Exercise'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExerciseEditor;