'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function DepositPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);

  const showToast = (msg, duration = 2000) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('deposit_orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      showToast('❌ Error loading deposit orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('deposit_orders')
      .update({ status: newStatus })
      .eq('id', id);
    if (error) {
      showToast('❌ Failed to update');
      return;
    }
    showToast(`✅ Order ${newStatus}`);
    loadOrders();
  };

  // Filter and pagination
  let filtered = orders.filter(order =>
    (order.order_id && order.order_id.toLowerCase().includes(search.toLowerCase())) ||
    (order.utr && order.utr.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / entriesPerPage));
  const start = (currentPage - 1) * entriesPerPage;
  const paginated = filtered.slice(start, start + entriesPerPage);

  return (
    <>
      <div className="page-header">
        <h1>Deposit Order Update</h1>
      </div>

      <div className="section-title">
        Deposit Order Requests
        <span className="order-count">{orders.length}</span>
        <button onClick={loadOrders} className="refresh-btn">
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>

      <div className="table-controls">
        <div className="entries-selector">
          <label>Show</label>
          <select
            value={entriesPerPage}
            onChange={(e) => { setEntriesPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
          </select>
          <span>entries</span>
        </div>
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search Order ID, UTR..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Order Price</th>
              <th>Quantity</th>
              <th>UTR</th>
              <th>Deal Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="empty-row">
                <td colSpan="8"><i className="fas fa-spinner fa-pulse"></i> Loading orders...</td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="8">No deposit orders found</td>
              </tr>
            ) : (
              paginated.map((order, idx) => {
                let dealDate = order.deal_date ? new Date(order.deal_date).toLocaleString('en-IN') : 'N/A';
                return (
                  <tr key={order.id}>
                    <td>{start + idx + 1}</td>
                    <td><span style={{ background: '#f0f6ff', padding: '4px 10px', borderRadius: '40px', fontSize: '0.7rem', fontWeight: '600' }}>{order.order_id}</span></td>
                    <td>₹ {Number(order.order_price).toLocaleString('en-IN')}</td>
                    <td>{order.quantity} ITokens</td>
                    <td>{order.utr || 'N/A'}</td>
                    <td>{dealDate}</td>
                    <td><span className={`status-badge status-${order.status}`}>{order.status}</span></td>
                    <td className="action-buttons">
                      {order.status === 'pending' ? (
                        <>
                          <button onClick={() => updateStatus(order.id, 'approved')} className="btn-approve">
                            <i className="fas fa-check-circle"></i> Approve
                          </button>
                          <button onClick={() => updateStatus(order.id, 'rejected')} className="btn-reject">
                            <i className="fas fa-ban"></i> Reject
                          </button>
                        </>
                      ) : <span style={{ color: '#8aa1bc' }}>—</span>}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="pagination-modern" style={{ justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}

      {toast && <div className="toast-notify">{toast}</div>}
    </>
  );
}