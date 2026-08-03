'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';

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
    <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onLogout={handleLogout} />
      <div className="main-content" style={{ 
        marginLeft: '260px',
        padding: '32px',
        flex: 1,
        background: '#f8fafc',
        minHeight: '100vh',
        width: 'calc(100% - 260px)'
      }}>
        {children}
      </div>
    </div>
  );
}