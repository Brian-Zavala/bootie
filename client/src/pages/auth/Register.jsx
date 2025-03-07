// src/pages/auth/Register.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const formik = useFormik({
    initialValues: {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
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
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required')
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        // Remove confirmPassword before sending to API
        const { confirmPassword, ...userData } = values;
        await register(userData);
        navigate('/dashboard');
      } catch (error) {
        setStatus(error.message);
      } finally {
        setSubmitting(false);
      }
    }
  });
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"></div>