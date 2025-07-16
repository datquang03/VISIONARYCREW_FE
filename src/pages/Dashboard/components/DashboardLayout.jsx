import React, { useContext } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { SidebarContext } from '../components/SidebarContext';

const DashboardLayout = ({ role }) => {
  const { isCollapsed } = useContext(SidebarContext);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role={role} />
      <div className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;