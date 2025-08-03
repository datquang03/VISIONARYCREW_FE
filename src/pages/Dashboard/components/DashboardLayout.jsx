// pages/Dashboard/components/DashboardLayout.js
import React, { useContext } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { SidebarContext } from './SidebarContext';

const DashboardLayout = ({ role, title }) => {
  const { isCollapsed } = useContext(SidebarContext);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <Sidebar role={role} />
      <div
        className={`flex-1 transition-all duration-300 overflow-x-hidden ${
          isCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <div className="p-2 sm:p-4 md:p-6 max-w-full">
          <header className="mb-4 sm:mb-6 flex items-center justify-between bg-white p-3 sm:p-4 rounded-xl shadow-md">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">{title || 'Dashboard'}</h1>
          </header>
          <main className="bg-white rounded-xl shadow-xl p-2 sm:p-4 md:p-6 overflow-hidden">
            <div className="max-w-full overflow-x-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;