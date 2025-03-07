// src/pages/auth/ForgotPassword.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '../../components/common/Button';

const ForgotPassword = () => {
  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required')
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        // This would connect to your API
        console.log('Password reset requested for:', values.email);
        
        // For demo purposes, we'll just show success
        setStatus({ success: true });
      } catch (error) {
        setStatus({ error: 'Failed to process your request. Please try again.' });
      } finally {
        setSubmitting(false);
      }
    }
  });
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot your password?</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        {formik.status?.success ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
            {formik.status?.error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {formik.status.error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                ) : null}
              </div>
            </div>
            
            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={formik.isSubmitting}
                disabled={formik.isSubmitting}
              >
                Send Reset Link
              </Button>
            </div>
            
            <div className="text-sm text-center">
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;