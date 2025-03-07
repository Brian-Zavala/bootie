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
      <Header>
        <h1>My App</h1>
      </Header>
      <div className="content">
        <Outlet /> {/* This is where the content of the child routes will be rendered */}
      </div>
      <Footer>
        <p>&copy; 2025</p>
      </Footer>
    </div>
  );
}

export default MainLayout;