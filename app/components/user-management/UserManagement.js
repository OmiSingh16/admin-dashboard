'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import toast, { Toaster } from 'react-hot-toast';
import UserForm from './UserForm';
import UserTable from './UserTable';
import PasswordModal from './PasswordModal';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // ✅ Delete Confirm Modal State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState(null);
  
  const [formData, setFormData] = useState({
    userId: '',
    mobile: '',
    fullName: '',
    email: '',
    role: 'Member',
    status: 'Active',
    password: ''
  });

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load users');
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      userId: '',
      mobile: '',
      fullName: '',
      email: '',
      role: 'Member',
      status: 'Active',
      password: ''
    });
    setIsEditMode(false);
    setEditUserId(null);
    setShowForm(false);
  };

  // Save user
  const saveUser = async () => {
    const { userId, mobile, fullName, email, role, status, password } = formData;

    if (!userId.trim()) { toast.error('User ID is required'); return; }
    if (!mobile.trim() || !/^[0-9]{10}$/.test(mobile)) { toast.error('Valid 10-digit mobile number required'); return; }
    if (email.trim() && !/^[^\s@]+@([^\s@.,]+\.)+[^\s@]{2,}$/.test(email)) { toast.error('Invalid email format'); return; }
    if (!isEditMode && (!password || password.length < 6)) { toast.error('Password must be at least 6 characters'); return; }
    if (isEditMode && password.trim() && password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = password ? await bcrypt.hash(password, salt) : null;

      if (isEditMode) {
        let updateData = { user_id: userId, mobile, full_name: fullName, email, role, status };
        if (password.trim()) updateData.password_hash = hashedPassword;

        const { error } = await supabase.from('users').update(updateData).eq('user_id', editUserId);
        if (error) { toast.error('Update failed: ' + error.message); return; }
        toast.success(`✏️ User "${userId}" updated successfully`);
      } else {
        const { data: existing } = await supabase.from('users').select('user_id').eq('user_id', userId).single();
        if (existing) { toast.error(`User ID "${userId}" already exists`); return; }

        const { error } = await supabase.from('users').insert([{ user_id: userId, mobile, full_name: fullName, email, role, status, password_hash: hashedPassword }]);
        if (error) { toast.error('Registration failed: ' + error.message); return; }
        toast.success(`🎉 User "${userId}" registered successfully`);
      }
      fetchUsers();
      resetForm();
    } catch (error) {
      toast.error('Something went wrong: ' + error.message);
    }
  };

  const startEdit = (user) => {
    setFormData({
      userId: user.user_id,
      mobile: user.mobile,
      fullName: user.full_name || '',
      email: user.email || '',
      role: user.role,
      status: user.status,
      password: ''
    });
    setIsEditMode(true);
    setEditUserId(user.user_id);
    setShowForm(true);
  };

  // ✅ Open delete confirmation modal
  const confirmDelete = (userId) => {
    setPendingDeleteUserId(userId);
    setShowDeleteConfirm(true);
  };

  // ✅ Actual delete function
  const deleteUser = async () => {
    if (!pendingDeleteUserId) return;
    
    const { error } = await supabase.from('users').delete().eq('user_id', pendingDeleteUserId);
    if (error) { 
      toast.error('Delete failed: ' + error.message); 
    } else { 
      toast.success(`🗑️ User "${pendingDeleteUserId}" deleted successfully`); 
      fetchUsers(); 
      if (isEditMode && editUserId === pendingDeleteUserId) resetForm(); 
    }
    setShowDeleteConfirm(false);
    setPendingDeleteUserId(null);
  };

  const updatePassword = async (userId, newPassword) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const { error } = await supabase.from('users').update({ password_hash: hashedPassword }).eq('user_id', userId);
    if (error) { toast.error('Password update failed: ' + error.message); } 
    else { toast.success(`🔑 Password updated for ${userId}`); fetchUsers(); }
  };

  const filteredUsers = users.filter(user =>
    user.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.includes(searchTerm) ||
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: '#363636', color: '#fff', borderRadius: '12px' } }} />

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>👥 User Management</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} style={{ padding: '10px 24px', borderRadius: '40px', border: 'none', background: '#1a66c9', color: 'white', fontWeight: 600, cursor: 'pointer' }}>➕ Register New User</button>
      </div>

      {/* Table Section */}
      <UserTable 
        users={filteredUsers}
        loading={loading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onEdit={startEdit}
        onDelete={confirmDelete}
        onResetPassword={(user) => { setSelectedUserId(user.user_id); setShowPasswordModal(true); }}
      />

      {/* Right Side Form */}
      <UserForm 
        isOpen={showForm}
        onClose={resetForm}
        formData={formData}
        setFormData={setFormData}
        isEditMode={isEditMode}
        onSave={saveUser}
      />

      {/* Password Modal */}
      <PasswordModal 
        isOpen={showPasswordModal}
        userId={selectedUserId}
        onClose={() => setShowPasswordModal(false)}
        onUpdate={updatePassword}
      />

      {/* ✅ Custom Delete Confirmation Modal - Bottom Center */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1002,
          animation: 'slideUp 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '20px 28px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            border: '1px solid #eef3fc',
            minWidth: '320px',
            textAlign: 'center'
          }}>
            <p style={{ marginBottom: '16px', color: '#1e4a8a', fontSize: '16px', fontWeight: 500 }}>
              ⚠️ Delete user <strong>{pendingDeleteUserId}</strong> permanently?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: '8px 24px',
                  borderRadius: '40px',
                  border: '1px solid #b9d3f8',
                  background: 'white',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontWeight: 500
                }}>
                No
              </button>
              <button 
                onClick={deleteUser}
                style={{
                  padding: '8px 24px',
                  borderRadius: '40px',
                  border: 'none',
                  background: '#ef4444',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 500
                }}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </>
  );
}