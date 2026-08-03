'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar({ onLogout }) {
  const pathname = usePathname();
  const { sidebarTheme } = useTheme();
  const [profileImage, setProfileImage] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    } else {
      setProfileImage('/default-avatar.jpeg');
    }
  }, []);

  // ✅ Hydration fix - Don't render until mounted
  if (!isMounted) {
    return null;
  }

  const navItems = [
    { name: 'Dashboard', icon: 'fa-th-large', path: '/dashboard' },
    { name: 'User Management', icon: 'fa-users', path: '/dashboard/users' },
    { name: 'Deposit Orders', icon: 'fa-hand-holding-usd', path: '/dashboard/deposit' },
    { name: 'Withdraw Orders', icon: 'fa-money-bill-wave', path: '/dashboard/withdraw' },
    { name: 'Update UPI', icon: 'fa-qrcode', path: '/dashboard/upi' },
    { name: 'Settings', icon: 'fa-sliders-h', path: '/dashboard/settings' },
  ];

  return (
    <div className="sidebar" style={{ 
      background: sidebarTheme.background,
      backdropFilter: 'blur(8px)',
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100vh',
      width: '260px',
      zIndex: 1000,
      overflowY: 'auto',
      borderRight: '1px solid rgba(255,255,255,0.06)'
    }}>
      {/* Logo Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '24px',
        paddingTop: '24px',
        position: 'relative'
      }}>
        <div style={{
          width: '66px',
          height: '66px',
          borderRadius: '50%',
          padding: '3px',
          background: 'conic-gradient(from 0deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff, #5f27cd, #ff6b6b)',
          boxShadow: '0 0 25px rgba(72, 219, 251, 0.6), 0 0 50px rgba(255, 107, 107, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#f8fafc',
            position: 'relative'
          }}>
            <img 
              src={profileImage || '/default-avatar.jpeg'} 
              alt="Profile"
              suppressHydrationWarning  // ← YEH BHI ADD KAREIN
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Ccircle cx="50" cy="50" r="50" fill="%23e2e8f0"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" font-size="40" fill="%2394a3b8"%3E👤%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      {navItems.map((item) => (
        <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
          <div 
            className={`nav-item ${pathname === item.path ? 'active' : ''}`}
            style={{
              color: pathname === item.path ? sidebarTheme.activeColor : sidebarTheme.textColor,
              background: pathname === item.path ? sidebarTheme.activeBg : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (pathname !== item.path) {
                e.currentTarget.style.background = sidebarTheme.hoverBg;
              }
            }}
            onMouseLeave={(e) => {
              if (pathname !== item.path) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <i className={`fas ${item.icon}`} style={{ 
              color: pathname === item.path ? sidebarTheme.activeColor : sidebarTheme.iconColor 
            }}></i>
            <span>{item.name}</span>
          </div>
        </Link>
      ))}
      
      {/* Logout Button */}
      <div style={{ 
        position: 'absolute', 
        bottom: '30px', 
        left: 0, 
        right: 0, 
        marginLeft: '12px', 
        marginRight: '12px' 
      }}>
        <button
          onClick={onLogout}
          style={{ 
            background: '#fee2e2',
            border: 'none',
            borderRadius: '40px',
            padding: '8px 16px',
            cursor: 'pointer',
            color: '#dc2626',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            width: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fecaca';
            e.currentTarget.style.transform = 'scale(0.98)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fee2e2';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}