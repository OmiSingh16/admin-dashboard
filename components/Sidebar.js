'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ onLogout }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: 'fa-th-large', path: '/dashboard' },
    { name: 'User Management', icon: 'fa-users', path: '/dashboard/users' },
    { name: 'Deposit Orders', icon: 'fa-hand-holding-usd', path: '/dashboard/deposit' },
    { name: 'Withdraw Orders', icon: 'fa-money-bill-wave', path: '/dashboard/withdraw' },
    { name: 'Update UPI', icon: 'fa-qrcode', path: '/dashboard/upi' },
    { name: 'Settings', icon: 'fa-sliders-h', path: '/dashboard/settings' },
  ];

  return (
    <div className="sidebar">
      {navItems.map((item) => (
        <Link key={item.path} href={item.path}>
          <div className={`nav-item ${pathname === item.path ? 'active' : ''}`}>
            <i className={`fas ${item.icon}`}></i>
            <span>{item.name}</span>
          </div>
        </Link>
      ))}
      
      <div style={{ position: 'absolute', bottom: '30px', left: 0, right: 0, marginLeft: '12px', marginRight: '12px' }}>
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
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#fecaca';
            e.target.style.transform = 'scale(0.98)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#fee2e2';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}