import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Outlet } from 'react-router-dom';
import DoctorHome from './DoctorHome';

const DoctorDashboard = () => {
  return (
    <DashboardLayout role="doctor" title="Doctor Dashboard">
      <Outlet />
    </DashboardLayout>
  );
};

export default DoctorDashboard; 