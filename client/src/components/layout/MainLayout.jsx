// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
import Footer from './Footer';


function MainLayout() {
  return (
    <div>
      {/* Your header, sidebar, and other layout elements here */}
      <header>
        <h1>My App</h1>
      </header>
      <div className="content">
        <Outlet /> {/* This is where the content of the child routes will be rendered */}
      </div>
      <footer>
        <p>&copy; 2025</p>
      </footer>
    </div>
  );
}

export default MainLayout;