'use client';

import { useEffect, useState } from 'react';
import { 
    UserCog, Trash2, UserRoundCheck, Wallet, ChartLine,Search, FileUser, UserPlus, RefreshCw, Pencil,
    Plus,Minus,
    Cog,
    HardDriveUpload
} from 'lucide-react';
import Toast from '../../components/Toast';

export default function UserAccountsPage() {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [modalMode, setModalMode] = useState('view');
    const [editData, setEditData] = useState({});
    const [filterStatus, setFilterStatus] = useState('all');
    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [balanceAction, setBalanceAction] = useState('add');
    const [balanceAmount, setBalanceAmount] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null);

    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const hideToast = () => {
        setToast(null);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/users');
            const data = await response.json();
            setUsers(data.users || []);
            setStats(data.stats);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewUser = async (userId) => {
        try {
            const response = await fetch(`/api/users?userId=${userId}`);
            const data = await response.json();
            if (data.success) {
                setSelectedUser(data.data);
                setEditData(data.data);
                setModalMode('view');
                setShowUserModal(true);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleUpdateUser = async () => {
        try {
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: editData.user_id,
                    pin: editData.pin || null,
                    balance: editData.balance,
                    account_status: editData.account_status,
                    performed_by: 'Admin'
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showToast('User updated successfully!', 'success');
                fetchUsers();
                setShowUserModal(false);
            } else {
                showToast(data.error || 'Failed to update user', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Failed to update user', 'error');
        }
    };

    const handleCreateUser = async () => {
        if (!editData.user_id) {
            showToast('User ID is required', 'warning');
            return;
        }

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: editData.user_id,
                    pin: editData.pin || null,
                    balance: editData.balance || 0,
                    account_status: 'active'
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showToast('User created successfully!', 'success');
                fetchUsers();
                setShowUserModal(false);
                setEditData({});
            } else {
                showToast(data.error || 'Failed to create user', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Failed to create user', 'error');
        }
    };

    const handleDeleteClick = (userId) => {
        setDeleteUserId(userId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteUserId) return;
        
        try {
            const response = await fetch(`/api/users?userId=${deleteUserId}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showToast('User deleted successfully!', 'success');
                fetchUsers();
                if (selectedUser?.user_id === deleteUserId) {
                    setShowUserModal(false);
                }
                setShowDeleteModal(false);
                setDeleteUserId(null);
            } else {
                showToast(data.error || 'Failed to delete user', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Failed to delete user', 'error');
        }
    };

    const handleBalanceUpdate = async () => {
        if (!balanceAmount || isNaN(balanceAmount) || parseFloat(balanceAmount) <= 0) {
            showToast('Please enter a valid amount', 'warning');
            return;
        }

        const amount = parseFloat(balanceAmount);
        let newBalance = selectedUser.balance;

        switch(balanceAction) {
            case 'add':
                newBalance = selectedUser.balance + amount;
                break;
            case 'deduct':
                if (amount > selectedUser.balance) {
                    showToast('Insufficient balance!', 'error');
                    return;
                }
                newBalance = selectedUser.balance - amount;
                break;
            case 'set':
                newBalance = amount;
                break;
        }

        try {
            const response = await fetch('/api/users/balance', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: selectedUser.user_id,
                    new_balance: newBalance,
                    action: balanceAction,
                    amount: amount
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showToast(`Balance updated! New balance: ₹${newBalance.toLocaleString()}`, 'success');
                fetchUsers();
                handleViewUser(selectedUser.user_id);
                setShowBalanceModal(false);
                setBalanceAmount('');
            } else {
                showToast(data.error || 'Failed to update balance', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Failed to update balance', 'error');
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'active': { class: 'status-active', label: 'Active' },
            'inactive': { class: 'status-inactive', label: 'Inactive' },
            'suspended': { class: 'status-suspended', label: 'Suspended' }
        };
        const s = statusMap[status] || { class: 'status-default', label: status };
        return `<span class="status-badge ${s.class}">${s.label}</span>`;
    };

    const filteredUsers = users.filter(user => 
        user.user_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_id?.includes(searchTerm)
    ).filter(user => filterStatus === 'all' ? true : user.account_status === filterStatus);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <div className="loading-text">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="user-accounts-container">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">User Accounts Management</h1>
                    <p className="page-subtitle">Manage all user accounts and balances</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card stat-card-blue">
                    <div className="stat-card-content">
                        <p className="stat-card-label">Total Users</p>
                        <p className="stat-card-value">{stats?.total_users || 0}</p>
                    </div>
                    <span className="stat-card-icon"><FileUser size={26} /></span>
                </div>
                <div className="stat-card stat-card-green">
                    <div className="stat-card-content">
                        <p className="stat-card-label">Active Users</p>
                        <p className="stat-card-value">{stats?.active_users || 0}</p>
                    </div>
                    <span className="stat-card-icon"><UserRoundCheck size={26} /></span>
                </div>
                <div className="stat-card stat-card-orange">
                    <div className="stat-card-content">
                        <p className="stat-card-label">Total Balance</p>
                        <p className="stat-card-value">₹{(stats?.total_balance || 0).toLocaleString()}</p>
                    </div>
                    <span className="stat-card-icon"><Wallet size={26}/></span>
                </div>
                <div className="stat-card stat-card-purple">
                    <div className="stat-card-content">
                        <p className="stat-card-label">Avg Balance</p>
                        <p className="stat-card-value">₹{Math.round(stats?.avg_balance || 0).toLocaleString()}</p>
                    </div>
                    <span className="stat-card-icon"><ChartLine size={26} /></span>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="filters-container">
                <div className="filters-row">
                    <div className="search-wrapper">
                        <span className="search-icon"><Search size={16}/></span>
                        <input
                            type="text"
                            placeholder="Search by User ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                    </select>
                    <button
                        onClick={() => {
                            setEditData({ user_id: '', balance: 0 });
                            setModalMode('create');
                            setShowUserModal(true);
                        }}
                        className="btn btn-green"
                    >
                        <UserPlus size={16} />
                    </button>
                    <button onClick={fetchUsers} className="btn btn-gray"><RefreshCw size={16} /></button>
                </div>
            </div>

            {/* Users Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Balance</th>
                            <th>Status</th>
                            <th>PIN</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="empty-row">No users found</td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="user-id-cell">{user.user_id}</td>
                                    <td className="balance-cell">
                                        <span className="balance-amount">₹{user.balance?.toLocaleString() || 0}</span>
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setShowBalanceModal(true);
                                                setBalanceAction('add');
                                                setBalanceAmount('');
                                            }}
                                            className="btn-edit-balance"
                                            title="Edit Balance"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    </td>
                                    <td dangerouslySetInnerHTML={{ __html: getStatusBadge(user.account_status) }} />
                                    <td className="pin-cell">
                                        <span className="pin-display">{user.pin || '—'}</span>
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setEditData(user);
                                                setModalMode('edit');
                                                setShowUserModal(true);
                                            }}
                                            className="btn-edit-pin"
                                            title="Edit PIN"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => handleViewUser(user.user_id)}
                                                className="btn-action btn-view"
                                                title="View Details"
                                            >
                                                <UserCog size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(user.user_id)}
                                                className="btn-action btn-delete"
                                                title="Delete User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="table-footer">
                Showing {filteredUsers.length} of {users.length} users
            </div>

            {/* Balance Modal */}
            {showBalanceModal && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header modal-header-blue">
                            <h2><Wallet size={24} /> Update Balance</h2>
                            <button onClick={() => setShowBalanceModal(false)} className="modal-close">✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="balance-info">
                                <div className="balance-row">
                                    <div className="balance-item">
                                        <span className="balance-label">User</span>
                                        <span className="balance-value">{selectedUser.user_id}</span>
                                    </div>
                                    <div className="balance-divider"></div>
                                    <div className="balance-item">
                                        <span className="balance-label">Current Balance</span>
                                        <span className="balance-value">₹{selectedUser.balance?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Action Type</label>
                                <div className="action-btns-group">
                                    <button
                                        onClick={() => setBalanceAction('add')}
                                        className={`action-btn ${balanceAction === 'add' ? 'active-add' : 'inactive-add'}`}
                                    >
                                        <Plus size={16} /> Add
                                    </button>
                                    <button
                                        onClick={() => setBalanceAction('deduct')}
                                        className={`action-btn ${balanceAction === 'deduct' ? 'active-deduct' : 'inactive-deduct'}`}
                                    >
                                        <Minus size={16} /> Deduct
                                    </button>
                                    <button
                                        onClick={() => setBalanceAction('set')}
                                        className={`action-btn ${balanceAction === 'set' ? 'active-set' : 'inactive-set'}`}
                                    >
                                        <Cog size={16} /> Set
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    {balanceAction === 'add' ? 'Amount to Add' : 
                                     balanceAction === 'deduct' ? 'Amount to Deduct' : 
                                     'New Balance Amount'}
                                </label>
                                <div className="input-with-icon">
                                    <span className="input-icon">₹</span>
                                    <input
                                        type="number"
                                        value={balanceAmount}
                                        onChange={(e) => setBalanceAmount(e.target.value)}
                                        placeholder="Enter amount"
                                        className="form-input"
                                    />
                                </div>
                                {balanceAction === 'set' && balanceAmount && (
                                    <p className="helper-text">New balance will be: ₹{parseFloat(balanceAmount).toLocaleString()}</p>
                                )}
                                {balanceAction === 'add' && balanceAmount && (
                                    <p className="helper-text green">New balance: ₹{(selectedUser.balance + parseFloat(balanceAmount)).toLocaleString()}</p>
                                )}
                                {balanceAction === 'deduct' && balanceAmount && (
                                    <p className="helper-text red">New balance: ₹{(selectedUser.balance - parseFloat(balanceAmount)).toLocaleString()}</p>
                                )}
                            </div>

                            <div className="modal-actions">
                                <button onClick={handleBalanceUpdate} className="btn btn-blue btn-full"><HardDriveUpload size={20} /> Update Balance</button>
                                <button onClick={() => setShowBalanceModal(false)} className="btn btn-gray btn-full">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* User Modal */}
            {showUserModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header modal-header-blue">
                            <h2>{modalMode === 'view' ? '👤 User Details' : modalMode === 'edit' ? '✏️ Edit User' : '➕ Create New User'}</h2>
                            <button onClick={() => setShowUserModal(false)} className="modal-close">✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">User ID</label>
                                {modalMode === 'create' ? (
                                    <input
                                        type="text"
                                        value={editData.user_id || ''}
                                        onChange={(e) => setEditData({...editData, user_id: e.target.value})}
                                        className="form-input"
                                        placeholder="e.g., USR-1005"
                                    />
                                ) : (
                                    <p className="form-display">{selectedUser?.user_id}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Balance</label>
                                {modalMode === 'view' ? (
                                    <p className="balance-display">₹{selectedUser?.balance?.toLocaleString()}</p>
                                ) : (
                                    <div className="input-with-icon">
                                        <span className="input-icon">₹</span>
                                        <input
                                            type="number"
                                            value={editData.balance || 0}
                                            onChange={(e) => setEditData({...editData, balance: parseFloat(e.target.value) || 0})}
                                            className="form-input"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Account Status</label>
                                {modalMode === 'view' ? (
                                    <div dangerouslySetInnerHTML={{ __html: getStatusBadge(selectedUser?.account_status) }} />
                                ) : (
                                    <select
                                        value={editData.account_status || 'active'}
                                        onChange={(e) => setEditData({...editData, account_status: e.target.value})}
                                        className="form-select"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                )}
                            </div>

                            {/* PIN - View Mode */}
                            {modalMode === 'view' && selectedUser && (
                                <div className="form-group">
                                    <label className="form-label">PIN</label>
                                    <p className="form-display">{selectedUser?.pin || 'Not set'}</p>
                                </div>
                            )}

                            {/* PIN - Edit/Create Mode */}
                            {(modalMode === 'edit' || modalMode === 'create') && (
                                <div className="form-group">
                                    <label className="form-label">PIN</label>
                                    <input
                                        type="text"
                                        maxLength="10"
                                        value={editData.pin || ''}
                                        onChange={(e) => setEditData({...editData, pin: e.target.value})}
                                        className="form-input"
                                        placeholder="Enter PIN (optional)"
                                    />
                                </div>
                            )}

                            <div className="modal-actions">
                                {modalMode === 'view' && (
                                    <>
                                        <button onClick={() => setModalMode('edit')} className="btn btn-yellow btn-full">✏️ Edit User</button>
                                        <button onClick={() => handleDeleteClick(selectedUser?.user_id)} className="btn btn-red btn-full">🗑️ Delete User</button>
                                    </>
                                )}
                                {modalMode === 'edit' && (
                                    <>
                                        <button onClick={handleUpdateUser} className="btn btn-blue btn-full">💾 Save Changes</button>
                                        <button onClick={() => { setEditData(selectedUser); setModalMode('view'); }} className="btn btn-gray btn-full">Cancel</button>
                                    </>
                                )}
                                {modalMode === 'create' && (
                                    <>
                                        <button onClick={handleCreateUser} className="btn btn-green btn-full">➕ Create User</button>
                                        <button onClick={() => setShowUserModal(false)} className="btn btn-gray btn-full">Cancel</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header" style={{ background: '#ef4444', color: 'white' }}>
                            <h2>🗑️ Confirm Delete</h2>
                            <button onClick={() => setShowDeleteModal(false)} className="modal-close">✕</button>
                        </div>
                        <div className="modal-body" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                            <h3 style={{ marginBottom: '8px', color: '#1e293b' }}>Are you sure?</h3>
                            <p style={{ color: '#64748b', marginBottom: '24px' }}>
                                This action cannot be undone. This will permanently delete the user account.
                            </p>
                            <div className="modal-actions" style={{ flexDirection: 'row' }}>
                                <button
                                    onClick={confirmDelete}
                                    className="btn btn-red btn-full"
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="btn btn-gray btn-full"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={hideToast} 
                />
            )}
        </div>
    );
}