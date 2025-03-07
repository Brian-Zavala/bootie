// src/pages/profile/SubscriptionPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SubscriptionPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(location.state?.selectedPlan || null);
  
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await apiClient.get('/payments/subscription');
        setSubscription(response.data.subscription);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch subscription information. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchSubscription();
  }, []);
  
  const handleSubscribe = async (planId) => {
    setCheckoutLoading(true);
    
    try {
      const response = await apiClient.post('/payments/create-checkout-session', {
        planId
      });
      
      // Redirect to Stripe checkout
      window.location.href = response.data.url;
    } catch (error) {
      setError('Failed to create checkout session. Please try again.');
      setCheckoutLoading(false);
    }
  };
  
  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }
    
    try {
      await apiClient.post('/payments/cancel-subscription');
      
      // Refresh subscription data
      const response = await apiClient.get('/payments/subscription');
      setSubscription(response.data.subscription);
      
      alert('Your subscription has been canceled and will end on ' + new Date(subscription.endDate).toLocaleDateString());
    } catch (error) {
      setError('Failed to cancel subscription. Please try again or contact support.');
    }
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
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Subscription</h1>
          <p className="text-lg text-gray-600">Manage your subscription plan</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {/* Current Subscription */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Current Subscription</h2>
          </div>
          
          <div className="p-6">
            {subscription?.status === 'free' ? (
              <div>
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Free Plan</h3>
                    <p className="text-gray-600">Basic access to get started</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">You are currently on the Free plan. Upgrade to access premium features and courses.</p>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Upgrade to access all premium courses and features.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {subscription.status === 'basic' ? 'Basic Plan' : 'Premium Plan'}
                    </h3>
                    <p className="text-gray-600">
                      {subscription.status === 'basic' ? 'Access to all beginner and intermediate content' : 'Full access to all content'}
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-600">Your subscription is active until:</p>
                  <p className="text-lg font-medium text-gray-900">
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="mb-4 sm:mb-0">
                    <p className="text-gray-600">
                      {subscription.status === 'basic' 
                        ? 'Want access to advanced courses? Upgrade to Premium!'
                        : 'You have access to all available courses and features.'}
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    {subscription.status === 'basic' && (
                      <Button 
                        variant="primary"
                        onClick={() => handleSubscribe('premium')}
                        isLoading={checkoutLoading && selectedPlan === 'premium'}
                      >
                        Upgrade to Premium
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline"
                      onClick={handleCancelSubscription}
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Subscription Plans */}
        {subscription?.status === 'free' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Choose a Plan</h2>
            </div>
            
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Basic Plan */}
                <div className={`border rounded-lg overflow-hidden ${selectedPlan === 'basic' ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-200'}`}>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Basic Plan</h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-3xl font-extrabold text-gray-900">$9.99</span>
                      <span className="text-gray-600 ml-1">/month</span>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Access to all beginner courses</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Access to intermediate courses</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Certificate of completion</span>
                      </li>
                      <li className="flex items-start text-gray-400">
                        <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>Access to advanced courses</span>
                      </li>
                    </ul>
                    
                    <Button 
                      variant={selectedPlan === 'basic' ? 'primary' : 'outline'}
                      className="w-full"
                      onClick={() => {
                        setSelectedPlan('basic');
                        handleSubscribe('basic');
                      }}
                      isLoading={checkoutLoading && selectedPlan === 'basic'}
                    >
                      {selectedPlan === 'basic' ? 'Selected' : 'Select Basic Plan'}
                    </Button>
                  </div>
                </div>
                
                {/* Premium Plan */}
                <div className={`border rounded-lg overflow-hidden ${selectedPlan === 'premium' ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-200'}`}>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Plan</h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-3xl font-extrabold text-gray-900">$19.99</span>
                      <span className="text-gray-600 ml-1">/month</span>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Access to all courses (including advanced)</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Certificate of completion</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Priority support</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Downloadable resources</span>
                      </li>
                    </ul>
                    
                    <Button 
                      variant={selectedPlan === 'premium' ? 'primary' : 'outline'}
                      className="w-full"
                      onClick={() => {
                        setSelectedPlan('premium');
                        handleSubscribe('premium');
                      }}
                      isLoading={checkoutLoading && selectedPlan === 'premium'}
                    >
                      {selectedPlan === 'premium' ? 'Selected' : 'Select Premium Plan'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;