// src/pages/Unauthorized.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router';
import Button from '../components/common/Button';

const Unauthorized = () => {
  const navigate = useNavigate();
  
  return (
    <div className="page-container flex items-center justify-center min-h-[70vh]">
      <div className="text-center">
        <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V9m1.5-2.25a11.959 11.959 0 00-1.5-.078 12.05 12.05 0 00-8.5 3.5 12.05 12.05 0 00-3.5 8.5 12 12 0 1020.5-8.5 12.05 12.05 0 00-7-3.42c-.18-.03-.37-.057-.554-.08L11.5 6.75z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Access Denied</h2>
        <p className="mt-2 text-xl text-gray-600">You don't have permission to access this page.</p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" size="lg" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Link to="/">
            <Button variant="primary" size="lg">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;