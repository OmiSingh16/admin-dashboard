'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem('admin_logged_in') !== 'true') {
      router.push('/');
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_logged_in');
    router.push('/');
  };

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}