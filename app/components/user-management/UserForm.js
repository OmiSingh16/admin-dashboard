'use client';

import { useEffect } from 'react';

export default function UserForm({ isOpen, onClose, formData, setFormData, isEditMode, onSave }) {
  
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 999,
          animation: 'fadeIn 0.3s ease'
        }}
      />

      {/* Slide Form */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '500px',
        maxWidth: '90%',
        height: '100vh',
        background: 'white',
        boxShadow: '-5px 0 30px rgba(0,0,0,0.1)',
        zIndex: 1000,
        padding: '28px',
        overflowY: 'auto',
        animation: 'slideIn 0.3s ease',
        borderLeft: '1px solid #eef3fc'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', paddingBottom: '16px', borderBottom: '2px solid #eef3fc' }}>
          <h2 style={{ color: '#1e4a8a', margin: 0 }}>
            {isEditMode ? '✏️ Edit User' : '➕ Register New User'}
          </h2>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#64748b' }}>
            ✕
          </button>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontWeight: 600, color: '#16437e', display: 'block', marginBottom: '6px' }}>🆔 User ID *</label>
            <input 
              type="text" 
              id="userId" 
              value={formData.userId} 
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e2edff', fontSize: '14px' }} 
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, color: '#16437e', display: 'block', marginBottom: '6px' }}>📱 Mobile Number *</label>
            <input 
              type="tel" 
              id="mobile" 
              value={formData.mobile} 
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e2edff', fontSize: '14px' }} 
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, color: '#16437e', display: 'block', marginBottom: '6px' }}>👤 Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              value={formData.fullName} 
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e2edff', fontSize: '14px' }} 
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, color: '#16437e', display: 'block', marginBottom: '6px' }}>📧 Email</label>
            <input 
              type="email" 
              id="email" 
              value={formData.email} 
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e2edff', fontSize: '14px' }} 
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, color: '#16437e', display: 'block', marginBottom: '6px' }}>
              🔑 Password {!isEditMode && <span style={{ color: '#ef4444' }}>*</span>}
            </label>
            <input 
              type="password" 
              id="password" 
              value={formData.password} 
              onChange={handleChange}
              placeholder={isEditMode ? 'Leave blank to keep current' : 'Min 6 characters'}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e2edff', fontSize: '14px' }} 
            />
            {isEditMode && <small style={{ color: '#6c8db0' }}>💡 Empty = keep old password</small>}
          </div>

          <div>
            <label style={{ fontWeight: 600, color: '#16437e', display: 'block', marginBottom: '6px' }}>🏷️ Role</label>
            <select 
              id="role" 
              value={formData.role} 
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e2edff', fontSize: '14px' }}>
              <option>Member</option>
              <option>Moderator</option>
              <option>Support</option>
              <option>Admin</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 600, color: '#16437e', display: 'block', marginBottom: '6px' }}>💼 Status</label>
            <select 
              id="status" 
              value={formData.status} 
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e2edff', fontSize: '14px' }}>
              <option>Active</option>
              <option>Suspended</option>
              <option>Pending</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          <button 
            onClick={onClose}
            style={{ flex: 1, padding: '12px', borderRadius: '40px', border: '1px solid #b9d3f8', background: 'white', cursor: 'pointer', fontWeight: 600 }}>
            Cancel
          </button>
          <button 
            onClick={onSave}
            style={{ flex: 1, padding: '12px', borderRadius: '40px', border: 'none', background: '#1a66c9', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
            {isEditMode ? '✏️ Update User' : '💾 Save User'}
          </button>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}