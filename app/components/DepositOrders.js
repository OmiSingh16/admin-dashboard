'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function DepositOrders() {
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
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-[#1a2e4d]">
          <i className="fas fa-hand-holding-usd text-[#2ecca4] mr-3"></i>
          Deposit Orders
          <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full ml-3">{orders.length}</span>
        </h2>
        <button onClick={loadOrders} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100 transition">
          <i className="fas fa-sync-alt mr-2"></i> Refresh
        </button>
      </div>

      <div className="flex justify-between items-center mb-5 flex-wrap gap-4">
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border">
          <label className="text-sm font-medium">Show</label>
          <select
            value={entriesPerPage}
            onChange={(e) => { setEntriesPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
            className="border rounded-full px-3 py-1 text-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
          </select>
          <span>entries</span>
        </div>
        <div className="flex items-center gap-2 bg-white border rounded-full px-4 py-2">
          <i className="fas fa-search text-gray-400"></i>
          <input
            type="text"
            placeholder="Search Order ID, UTR..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="outline-none w-64 text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Order Price</th>
              <th className="p-4 text-left">Quantity</th>
              <th className="p-4 text-left">UTR</th>
              <th className="p-4 text-left">Deal Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="text-center py-12"><i className="fas fa-spinner fa-pulse text-2xl"></i> Loading...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan="8" className="text-center py-12 text-gray-400">No deposit orders found</td></tr>
            ) : (
              paginated.map((order, idx) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{start + idx + 1}</td>
                  <td className="p-4"><span className="bg-blue-50 px-3 py-1 rounded-full text-sm font-medium">{order.order_id}</span></td>
                  <td className="p-4">₹ {Number(order.order_price).toLocaleString('en-IN')}</td>
                  <td className="p-4">{order.quantity} ITokens</td>
                  <td className="p-4">{order.utr || 'N/A'}</td>
                  <td className="p-4">{order.deal_date ? new Date(order.deal_date).toLocaleString('en-IN') : 'N/A'}</td>
                  <td className="p-4"><span className={`status-${order.status}`}>{order.status}</span></td>
                  <td className="p-4">
                    {order.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(order.id, 'approved')} className="btn-approve"><i className="fas fa-check-circle"></i> Approve</button>
                        <button onClick={() => updateStatus(order.id, 'rejected')} className="btn-reject"><i className="fas fa-ban"></i> Reject</button>
                      </div>
                    ) : <span className="text-gray-400">—</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="flex justify-between items-center mt-5 flex-wrap gap-3">
          <div>Showing {Math.min(start+1, filtered.length)} to {Math.min(start+entriesPerPage, filtered.length)} of {filtered.length} entries</div>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="px-4 py-1 border rounded-full disabled:opacity-50">Prev</button>
            <span className="px-4 py-1">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="px-4 py-1 border rounded-full disabled:opacity-50">Next</button>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-5 right-5 bg-gray-800 text-white px-5 py-3 rounded-full text-sm z-50 animate-fadeIn">{toast}</div>}
    </div>
  );
}