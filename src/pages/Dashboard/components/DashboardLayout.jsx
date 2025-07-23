// pages/Dashboard/components/DashboardLayout.js
import React, { useContext } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { SidebarContext } from './SidebarContext';

const DashboardLayout = ({ role, title }) => {
  const { isCollapsed } = useContext(SidebarContext);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Sidebar role={role} />
      <div
        className={`flex-1 p-6 transition-all duration-300 ${
          isCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <header className="mb-6 flex items-center justify-between bg-white p-4 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-gray-900">{title || 'Dashboard'}</h1>
        </header>
        <main className="bg-white rounded-xl shadow-xl p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;