import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <DashboardLayout role="admin" title="Admin Dashboard">
      <Outlet />
    </DashboardLayout>
  );    
};

export default AdminDashboard;