'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalDeposit: 0,
    totalWithdraw: 0,
    totalUsers: 0,
    pendingDeposit: 0,
    pendingWithdraw: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch deposit orders
      const { data: depositData } = await supabase.from('deposit_orders').select('*');
      const depositOrders = depositData || [];
      const totalDeposit = depositOrders.reduce((sum, order) => sum + (order.order_price || 0), 0);
      const pendingDeposit = depositOrders.filter(o => o.status === 'pending').length;

      // Fetch withdraw orders
      const { data: withdrawData } = await supabase.from('withdraw_orders').select('*');
      const withdrawOrders = withdrawData || [];
      const totalWithdraw = withdrawOrders.reduce((sum, order) => sum + (order.order_price || 0), 0);
      const pendingWithdraw = withdrawOrders.filter(o => o.status === 'pending').length;

      // Mock total users (since user table may not exist yet)
      const totalUsers = 248;

      setStats({
        totalDeposit,
        totalWithdraw,
        totalUsers,
        pendingDeposit,
        pendingWithdraw
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample chart data for graph
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    deposit: [12500, 15000, 9800, 17200, 21000, 18500, 14200],
    withdraw: [8500, 9200, 7800, 10200, 6000, 8000, 9600]
  };

  const maxValue = Math.max(...weeklyData.deposit, ...weeklyData.withdraw);
  const chartHeight = 180;

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <button onClick={fetchStats} className="refresh-btn" style={{ marginLeft: 0 }}>
          <i className="fas fa-sync-alt"></i> Refresh Stats
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginTop: '24px',
        marginBottom: '32px'
      }}>
        {/* Total Deposits */}
        <div style={{
          background: 'linear-gradient(135deg, #2ecca4, #25a882)',
          padding: '20px',
          borderRadius: '24px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <i className="fas fa-hand-holding-usd" style={{ fontSize: '32px', opacity: 0.8 }}></i>
            <span style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {loading ? '...' : `₹${stats.totalDeposit.toLocaleString('en-IN')}`}
            </span>
          </div>
          <h3 style={{ fontSize: '14px', fontWeight: '500', marginTop: '12px', opacity: 0.9 }}>Total Deposits</h3>
          <p style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
            <i className="fas fa-clock"></i> {stats.pendingDeposit} pending
          </p>
        </div>

        {/* Total Withdrawals */}
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          padding: '20px',
          borderRadius: '24px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <i className="fas fa-money-bill-wave" style={{ fontSize: '32px', opacity: 0.8 }}></i>
            <span style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {loading ? '...' : `₹${stats.totalWithdraw.toLocaleString('en-IN')}`}
            </span>
          </div>
          <h3 style={{ fontSize: '14px', fontWeight: '500', marginTop: '12px', opacity: 0.9 }}>Total Withdrawals</h3>
          <p style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
            <i className="fas fa-clock"></i> {stats.pendingWithdraw} pending
          </p>
        </div>

        {/* Total Users */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          padding: '20px',
          borderRadius: '24px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <i className="fas fa-users" style={{ fontSize: '32px', opacity: 0.8 }}></i>
            <span style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {loading ? '...' : stats.totalUsers}
            </span>
          </div>
          <h3 style={{ fontSize: '14px', fontWeight: '500', marginTop: '12px', opacity: 0.9 }}>Total Users</h3>
          <p style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
            <i className="fas fa-user-plus"></i> +12 this week
          </p>
        </div>
      </div>

      {/* Weekly Transaction Graph */}
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '24px',
        border: '1px solid #eef3fc',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a2e4d' }}>
            <i className="fas fa-chart-line" style={{ color: '#2ecca4', marginRight: '10px' }}></i>
            Weekly Transaction Overview
          </h3>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', background: '#2ecca4', borderRadius: '3px' }}></div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Deposits</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '3px' }}></div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Withdrawals</span>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: `${chartHeight + 40}px`, marginTop: '20px' }}>
          {weeklyData.labels.map((day, index) => {
            const depositHeight = (weeklyData.deposit[index] / maxValue) * chartHeight;
            const withdrawHeight = (weeklyData.withdraw[index] / maxValue) * chartHeight;
            return (
              <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  {/* Deposit Bar */}
                  <div style={{
                    width: '70%',
                    height: `${depositHeight}px`,
                    background: '#2ecca4',
                    borderRadius: '8px 8px 4px 4px',
                    transition: 'height 0.3s ease',
                    minHeight: depositHeight > 0 ? '4px' : '0'
                  }}></div>
                  {/* Withdraw Bar */}
                  <div style={{
                    width: '70%',
                    height: `${withdrawHeight}px`,
                    background: '#f59e0b',
                    borderRadius: '8px 8px 4px 4px',
                    transition: 'height 0.3s ease',
                    minHeight: withdrawHeight > 0 ? '4px' : '0'
                  }}></div>
                </div>
                <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>{day}</span>
              </div>
            );
          })}
        </div>

        {/* Amount Labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '8px', borderTop: '1px solid #eef3fc' }}>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>₹0</span>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>₹{Math.round(maxValue / 2).toLocaleString('en-IN')}</span>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>₹{maxValue.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px'
      }}>
        {/* Deposit Orders Card */}
        <div style={{
          background: 'linear-gradient(135deg, #e3f9ec 0%, #d0f0e0 100%)',
          padding: '24px',
          borderRadius: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <i className="fas fa-hand-holding-usd" style={{ fontSize: '40px', color: '#2ecca4', marginBottom: '16px' }}></i>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a3b35', marginBottom: '8px' }}>Deposit Orders</h3>
          <p style={{ color: '#2c5a52', fontSize: '14px' }}>Manage and approve customer deposit requests</p>
          <a href="/dashboard/deposit" style={{ 
            display: 'inline-block', 
            marginTop: '16px', 
            color: '#2ecca4', 
            fontWeight: '600',
            textDecoration: 'none'
          }}>View Orders →</a>
        </div>

        {/* Withdraw Orders Card */}
        <div style={{
          background: 'linear-gradient(135deg, #fff3e0 0%, #ffe8d0 100%)',
          padding: '24px',
          borderRadius: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <i className="fas fa-money-bill-wave" style={{ fontSize: '40px', color: '#cc8b00', marginBottom: '16px' }}></i>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a3b35', marginBottom: '8px' }}>Withdraw Orders</h3>
          <p style={{ color: '#2c5a52', fontSize: '14px' }}>Manage and approve customer withdrawal requests</p>
          <a href="/dashboard/withdraw" style={{ 
            display: 'inline-block', 
            marginTop: '16px', 
            color: '#cc8b00', 
            fontWeight: '600',
            textDecoration: 'none'
          }}>View Orders →</a>
        </div>

        {/* User Management Card */}
        <div style={{
          background: 'linear-gradient(135deg, #e0f0ff 0%, #cce4ff 100%)',
          padding: '24px',
          borderRadius: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <i className="fas fa-users" style={{ fontSize: '40px', color: '#3b82f6', marginBottom: '16px' }}></i>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a3b35', marginBottom: '8px' }}>User Management</h3>
          <p style={{ color: '#2c5a52', fontSize: '14px' }}>Manage all registered users</p>
          <a href="/dashboard/users" style={{ 
            display: 'inline-block', 
            marginTop: '16px', 
            color: '#3b82f6', 
            fontWeight: '600',
            textDecoration: 'none'
          }}>Manage Users →</a>
        </div>

        {/* Update UPI Card */}
        <div style={{
          background: 'linear-gradient(135deg, #f0e6ff 0%, #e0d4ff 100%)',
          padding: '24px',
          borderRadius: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <i className="fas fa-qrcode" style={{ fontSize: '40px', color: '#8b5cf6', marginBottom: '16px' }}></i>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a3b35', marginBottom: '8px' }}>Update UPI</h3>
          <p style={{ color: '#2c5a52', fontSize: '14px' }}>Manage payment QR codes and UPI IDs</p>
          <a href="/dashboard/upi" style={{ 
            display: 'inline-block', 
            marginTop: '16px', 
            color: '#8b5cf6', 
            fontWeight: '600',
            textDecoration: 'none'
          }}>Update →</a>
        </div>
      </div>
    </>
  );
}