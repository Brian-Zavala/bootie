// src/components/learning/CodeEditor.jsx
import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Button from '../common/Button';

const CodeEditor = ({ 
  code, 
  language, 
  onCodeChange, 
  onSubmit, 
  isSubmitting = false, 
  readOnly = false
}) => {
  const [editorCode, setEditorCode] = useState(code);
  
  const handleCodeChange = (e) => {
    setEditorCode(e.target.value);
    if (onCodeChange) {
      onCodeChange(e.target.value);
    }
  };
  
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(editorCode);
    }
  };
  
  const handleReset = () => {
    setEditorCode(code);
    if (onCodeChange) {
      onCodeChange(code);
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-2 text-gray-400 text-sm">
            {language === 'javascript' ? 'main.js' : 
             language === 'python' ? 'main.py' : 
             language === 'go' ? 'main.go' : 
             'code.txt'}
          </span>
        </div>
        <div className="flex space-x-2">
          {!readOnly && (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button 
                size="sm" 
                variant="primary"
                isLoading={isSubmitting}
                onClick={handleSubmit}
              >
                Run
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="relative">
        {readOnly ? (
          <SyntaxHighlighter
            language={language}
            style={atomOneDark}
            customStyle={{ margin: 0, padding: '1rem' }}
            showLineNumbers={true}
          >
            {editorCode}
          </SyntaxHighlighter>
        ) : (
          <textarea
            value={editorCode}
            onChange={handleCodeChange}
            className="w-full h-64 p-4 bg-gray-800 text-gray-200 font-mono text-sm resize-y focus:outline-none"
            spellCheck="false"
            disabled={readOnly || isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

export default CodeEditor;