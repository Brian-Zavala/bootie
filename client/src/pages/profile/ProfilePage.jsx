// src/pages/profile/ProfilePage.jsx
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      username: user?.username || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      bio: user?.bio || ''
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be less than 30 characters')
        .required('Required'),
      firstName: Yup.string(),
      lastName: Yup.string(),
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      bio: Yup.string().max(500, 'Bio must be less than 500 characters')
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await updateProfile(values);
        setIsEditing(false);
      } catch (error) {
        setStatus('Failed to update profile. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  });
  
  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-lg text-gray-600">View and update your profile information</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
            
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>
          
          {isEditing ? (
            <form onSubmit={formik.handleSubmit} className="p-6">
              {formik.status && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                  {formik.status}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className="input"
                    {...formik.getFieldProps('username')}
                  />
                  {formik.touched.username && formik.errors.username ? (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.username}</div>
                  ) : null}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="input"
                    {...formik.getFieldProps('email')}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                  ) : null}
                </div>
                
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="input"
                    {...formik.getFieldProps('firstName')}
                  />
                  {formik.touched.firstName && formik.errors.firstName ? (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.firstName}</div>
                  ) : null}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="input"
                    {...formik.getFieldProps('lastName')}
                  />
                  {formik.touched.lastName && formik.errors.lastName ? (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.lastName}</div>
                  ) : null}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  className="input"
                  {...formik.getFieldProps('bio')}
                ></textarea>
                {formik.touched.bio && formik.errors.bio ? (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.bio}</div>
                ) : null}
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={formik.isSubmitting}
                  disabled={formik.isSubmitting}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Username</h3>
                  <p className="mt-1 text-lg text-gray-900">{user?.username}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">First Name</h3>
                  <p className="mt-1 text-lg text-gray-900">{user?.firstName || '-'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
                  <p className="mt-1 text-lg text-gray-900">{user?.lastName || '-'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                <p className="mt-1 text-gray-900">{user?.bio || 'No bio provided.'}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Account Security</h2>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Password</h3>
                <p className="text-gray-600">Update your password to keep your account secure.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert('This would navigate to a password change form')}
              >
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;