'use client';

export default function UserTable({ users, loading, searchTerm, setSearchTerm, onEdit, onDelete, onResetPassword }) {
  return (
    <div style={{ background: 'white', borderRadius: '24px', padding: '24px', border: '1px solid #eef3fc' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="🔍 Search by ID, Name, Mobile..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px 16px', borderRadius: '40px', border: '1px solid #cadeff', width: '280px' }} 
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading users...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5faff', borderBottom: '2px solid #dbeafe' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>User ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Mobile</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No users found</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #eef2fc' }}>
                    <td style={{ padding: '12px' }}><strong>{user.user_id}</strong></td>
                    <td style={{ padding: '12px' }}>{user.mobile}</td>
                    <td style={{ padding: '12px' }}>{user.full_name || '—'}</td>
                    <td style={{ padding: '12px' }}>{user.email || '—'}</td>
                    <td style={{ padding: '12px' }}><span style={{ background: '#e1f0ff', padding: '4px 12px', borderRadius: '30px', fontSize: '12px' }}>{user.role}</span></td>
                    <td style={{ padding: '12px' }}>{user.status}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button onClick={() => onEdit(user)} style={{ background: '#e9f2fc', border: 'none', padding: '4px 12px', borderRadius: '30px', cursor: 'pointer' }}>✏️ Edit</button>
                        <button onClick={() => onResetPassword(user)} style={{ background: '#eef5e9', border: 'none', padding: '4px 12px', borderRadius: '30px', cursor: 'pointer' }}>🔑 Reset PW</button>
                        <button onClick={() => onDelete(user.user_id)} style={{ background: '#fee9e6', border: 'none', padding: '4px 12px', borderRadius: '30px', cursor: 'pointer' }}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '20px', color: '#6c8db0', fontSize: '14px' }}>Total Users: {users.length}</div>
    </div>
  );
}