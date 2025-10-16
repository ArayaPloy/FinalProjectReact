
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavigation from './AdminNavigation';

const AdminLayout = () => {
  // ไม่ต้องตรวจสอบสิทธิ์ที่นี่ เพราะ ProtectedRoute ทำหน้าที่นี้แล้ว
  
  return (
    <div className='container py-6 mx-auto flex flex-col md:flex-row gap-4 items-start justify-start shadow-md'>
      
      <header className='lg:w-1/5 sm:2/5 w-full'>
        <AdminNavigation/>
      </header>
      <main className='p-8 bg-white w-full'>
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;
