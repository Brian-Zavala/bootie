// src/components/learning/Exercise.jsx
import React, { useState } from 'react';
import apiClient from '../../api/client';
import CodeEditor from './CodeEditor';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const Exercise = ({ exercise, onComplete }) => {
  const [solution, setSolution] = useState(exercise.codeTemplate || '');
  const [results, setResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  
  const handleCodeChange = (code) => {
    setSolution(code);
  };
  
  const handleSubmit = async (code) => {
    setIsSubmitting(true);
    
    try {
      const response = await apiClient.post(`/exercises/${exercise._id}/submit`, {
        solution: code
      });
      
      setResults(response.data);
      
      // If exercise is completed successfully, notify parent component
      if (response.data.passed && onComplete) {
        onComplete(response.data);
      }
    } catch (error) {
      setResults({
        passed: false,
        error: error.response?.data?.message || 'An error occurred while submitting your solution'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const showNextHint = () => {
    if (currentHint < exercise.hints.length - 1) {
      setCurrentHint(currentHint + 1);
    }
  };
  
  const renderMultipleChoice = () => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    
    const handleOptionChange = (option) => {
      if (selectedOptions.includes(option)) {
        setSelectedOptions(selectedOptions.filter(item => item !== option));
      } else {
        setSelectedOptions([...selectedOptions, option]);
      }
    };
    
    const handleSubmitOptions = async () => {
      setIsSubmitting(true);
      
      try {
        const response = await apiClient.post(`/exercises/${exercise._id}/submit`, {
          solution: JSON.stringify(selectedOptions)
        });
        
        setResults(response.data);
        
        // If exercise is completed successfully, notify parent component
        if (response.data.passed && onComplete) {
          onComplete(response.data);
        }
      } catch (error) {
        setResults({
          passed: false,
          error: error.response?.data?.message || 'An error occurred while submitting your answer'
        });
      } finally {
        setIsSubmitting(false);
      }
    };
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          {exercise.options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                id={`option-${index}`}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={selectedOptions.includes(option.text)}
                onChange={() => handleOptionChange(option.text)}
                disabled={isSubmitting || results?.passed}
              />
              <label htmlFor={`option-${index}`} className="ml-2 block text-gray-700">
                {option.text}
              </label>
            </div>
          ))}
        </div>
        
        <Button
          onClick={handleSubmitOptions}
          variant="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting || selectedOptions.length === 0 || results?.passed}
        >
          Submit Answer
        </Button>
      </div>
    );
  };
  
  const renderFillInBlank = () => {
    const [answer, setAnswer] = useState('');
    
    const handleAnswerChange = (e) => {
      setAnswer(e.target.value);
    };
    
    const handleSubmitAnswer = async () => {
      setIsSubmitting(true);
      
      try {
        const response = await apiClient.post(`/exercises/${exercise._id}/submit`, {
          solution: answer
        });
        
        setResults(response.data);
        
        // If exercise is completed successfully, notify parent component
        if (response.data.passed && onComplete) {
          onComplete(response.data);
        }
      } catch (error) {
        setResults({
          passed: false,
          error: error.response?.data?.message || 'An error occurred while submitting your answer'
        });
      } finally {
        setIsSubmitting(false);
      }
    };
    
    return (
      <div className="space-y-4">
        <div>
          <input
            type="text"
            className="input"
            value={answer}
            onChange={handleAnswerChange}
            placeholder="Your answer..."
            disabled={isSubmitting || results?.passed}
          />
        </div>
        
        <Button
          onClick={handleSubmitAnswer}
          variant="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting || !answer.trim() || results?.passed}
        >
          Submit Answer
        </Button>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900">{exercise.title}</h2>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              exercise.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
              exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
            </span>
            <span className="text-gray-500 text-sm">{exercise.points} points</span>
          </div>
        </div>
        
        <div className="prose prose-blue max-w-none mb-6">
          <div dangerouslySetInnerHTML={{ __html: exercise.instructions }} />
        </div>
        
        {exercise.type === 'coding' && (
          <div className="mb-6">
            <CodeEditor
              code={solution}
              language={exercise.language}
              onCodeChange={handleCodeChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              readOnly={results?.passed}
            />
          </div>
        )}
        
        {exercise.type === 'multiple-choice' && (
          <div className="mb-6">
            {renderMultipleChoice()}
          </div>
        )}
        
        {exercise.type === 'fill-in-blank' && (
          <div className="mb-6">
            {renderFillInBlank()}
          </div>
        )}
        
        {isSubmitting && (
          <div className="mb-6">
            <LoadingSpinner />
            <p className="text-center text-gray-600">Running your code...</p>
          </div>
        )}
        
        {results && (
          <div className={`mb-6 p-4 rounded-md ${results.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h3 className={`text-lg font-semibold ${results.passed ? 'text-green-800' : 'text-red-800'}`}>
              {results.passed ? 'Success!' : 'Not quite right'}
            </h3>
            
            <div className="mt-2">
              {results.passed ? (
                <div className="text-green-700">
                  <p>Your solution passed all test cases. Great job!</p>
                  <p className="mt-2">You earned {results.score} points.</p>
                </div>
              ) : (
                <div className="text-red-700">
                  {results.error ? (
                    <p>{results.error}</p>
                  ) : (
                    <div>
                      <p>Your solution didn't pass all test cases. Let's look at what went wrong:</p>
                      <div className="mt-4 space-y-4">
                        {results.results && results.results.map((result, index) => (
                          <div key={index} className={`p-3 rounded ${result.passed ? 'bg-green-100' : 'bg-red-100'}`}>
                            <p className="font-medium">{`Test ${index + 1}: ${result.passed ? 'Passed' : 'Failed'}`}</p>
                            {!result.isHidden && (
                              <>
                                <p><span className="font-medium">Input:</span> {result.input}</p>
                                <p><span className="font-medium">Expected:</span> {JSON.stringify(result.expected)}</p>
                                {result.output && <p><span className="font-medium">Your output:</span> {JSON.stringify(result.output)}</p>}
                                {result.error && <p><span className="font-medium">Error:</span> {result.error}</p>}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {exercise.hints && exercise.hints.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHint(!showHint)}
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </Button>
              
              {showHint && exercise.hints.length > 1 && (
                <div className="text-gray-500 text-sm">
                  Hint {currentHint + 1} of {exercise.hints.length}
                </div>
              )}
            </div>
            
            {showHint && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-yellow-700">{exercise.hints[currentHint]}</p>
                
                {currentHint < exercise.hints.length - 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={showNextHint}
                  >
                    Next Hint
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercise;