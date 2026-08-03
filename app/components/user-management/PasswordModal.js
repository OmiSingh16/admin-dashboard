'use client';

import { useState } from 'react';

export default function PasswordModal({ isOpen, userId, onClose, onUpdate }) {
  const [newPassword, setNewPassword] = useState('');

  if (!isOpen) return null;

  const handleUpdate = () => {
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    onUpdate(userId, newPassword);
    setNewPassword('');
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>
      <div style={{ background: 'white', borderRadius: '28px', padding: '28px', maxWidth: '400px', width: '90%' }}>
        <h3 style={{ color: '#155799', marginBottom: '16px' }}>🔁 Update Password</h3>
        <p><strong>User:</strong> {userId}</p>
        <input 
          type="password" 
          placeholder="New password (min 6 chars)" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '16px', border: '1.5px solid #e2edff', margin: '16px 0' }} 
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onClose} style={{ padding: '8px 20px', borderRadius: '40px', border: '1px solid #b9d3f8', background: 'white', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleUpdate} style={{ padding: '8px 20px', borderRadius: '40px', border: 'none', background: '#1a66c9', color: 'white', cursor: 'pointer' }}>Update</button>
        </div>
      </div>
    </div>
  );
}