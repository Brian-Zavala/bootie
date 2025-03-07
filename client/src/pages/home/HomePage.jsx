// src/pages/home/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
                Learn to code with interactive exercises
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Master in-demand programming skills with our hands-on learning platform. 
                Write real code and build your portfolio.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/courses">
                  <Button size="lg" variant="secondary">
                    Browse Courses
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="primary" className="bg-white text-primary-700 hover:bg-gray-100">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="p-6 bg-gray-800 text-white">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="ml-2 text-sm opacity-75">main.js</div>
                  </div>
                </div>
                <div className="p-6 bg-gray-900 text-green-400 font-mono text-sm">
                  <p>// Welcome to CodeAcademy!</p>
                  <p className="mt-2">function greeting() {`{`}</p>
                  <p className="ml-4">const name = "Student";</p>
                  <p className="ml-4">return `Hello, ${`{name}`}!`;</p>
                  <p>{`}`}</p>
                  <p className="mt-2">greeting(); <span className="text-gray-400">// Hello, Student!</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why learn with us?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform is designed to help you learn programming effectively through interactive challenges and real-world projects.
            </p>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="bg-primary-100 text-primary-600 w-12 h-12 rounded-md flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Code Exercises</h3>
                <p className="text-gray-600">
                  Write real code directly in your browser and get instant feedback on your solutions.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="bg-primary-100 text-primary-600 w-12 h-12 rounded-md flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Structured Curriculum</h3>
                <p className="text-gray-600">
                  Follow a carefully designed learning path that takes you from basics to advanced concepts.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="bg-primary-100 text-primary-600 w-12 h-12 rounded-md flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Learn by Doing</h3>
                <p className="text-gray-600">
                  Build real projects that you can add to your portfolio, not just theoretical knowledge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Popular Courses Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Popular Courses
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Start your coding journey with our most popular learning paths.
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">Beginner</span>
                  <span className="text-gray-500 text-sm">12 modules</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">JavaScript Fundamentals</h3>
                <p className="text-gray-600 mb-4">
                  Learn the core concepts of JavaScript programming from variables to async/await.
                </p>
                <Link to="/courses/javascript-fundamentals" className="text-primary-600 hover:text-primary-700 font-medium">
                  View Course →
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-green-500 to-teal-500"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Intermediate</span>
                  <span className="text-gray-500 text-sm">8 modules</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Go Programming</h3>
                <p className="text-gray-600 mb-4">
                  Build fast and efficient backend applications with Go and understand concurrency.
                </p>
                <Link to="/courses/go-programming" className="text-primary-600 hover:text-primary-700 font-medium">
                  View Course →
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">Advanced</span>
                  <span className="text-gray-500 text-sm">10 modules</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Full-Stack Web Development</h3>
                <p className="text-gray-600 mb-4">
                  Create complete web applications with React, Node.js, and MongoDB.
                </p>
                <Link to="/courses/fullstack-web-development" className="text-primary-600 hover:text-primary-700 font-medium">
                  View Course →
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/courses">
              <Button variant="outline" size="lg">
                Browse All Courses
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What our students say
            </h2>
          </div>
          
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold">Alex Johnson</h4>
                  <p className="text-gray-600">Software Developer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I tried many online courses, but this platform's hands-on approach really helped me understand the concepts. I landed my first developer job after completing just two courses!"
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold">Sarah Chen</h4>
                  <p className="text-gray-600">Data Scientist</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The interactive exercises are amazing! Being able to write code and get immediate feedback helped me build confidence in my programming skills. Highly recommended!"
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold">Michael Torres</h4>
                  <p className="text-gray-600">CS Student</p>
                </div>
              </div>
              <p className="text-gray-600">
                "This platform has been the perfect complement to my computer science degree. The practical projects gave me experience that theoretical university courses couldn't provide."
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold sm:text-4xl">
                Ready to start your coding journey?
              </h2>
              <p className="mt-4 text-lg">
                Join thousands of students who have transformed their careers through our interactive learning platform.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <Link to="/register">
                <Button size="lg" variant="primary" className="bg-white text-primary-700 hover:bg-gray-100">
                  Start Learning for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;