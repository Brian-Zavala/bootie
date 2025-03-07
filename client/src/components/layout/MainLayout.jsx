// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router';

const MainLayout = () => {
  return (
    <div>
      <h1>Main Layout</h1>
      <Outlet />
    </div>
  );
};

export default MainLayout;
