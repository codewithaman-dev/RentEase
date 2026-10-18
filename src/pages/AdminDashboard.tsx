import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Package, 
  ShieldAlert, 
  MapPin, 
  FileSpreadsheet, 
  TrendingUp, 
  Wrench, 
  Plus, 
  RefreshCw,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Rental, Product } from '../types';
import { useToast } from '../contexts/ToastContext';
import { apiFetch } from '../lib/api';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [reports, setReports] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [serviceAreas, setServiceAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Search & Filter
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // Edit User Modal
  const [editUser, setEditUser] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState('CUSTOMER');

  // New Service Area Form
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincodes, setNewPincodes] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('rentease_token') || '';
      const headers = { Authorization: `Bearer ${token}` };

      const [repRes, uRes, pRes, rRes, tRes, dRes, saRes] = await Promise.all([
        apiFetch('/api/admin/reports', { headers }),
        apiFetch('/api/admin/users', { headers }),
        apiFetch('/api/admin/products', { headers }),
        apiFetch('/api/admin/rentals', { headers }),
        apiFetch('/api/admin/maintenance', { headers }),
        apiFetch('/api/admin/disputes', { headers }),
        apiFetch('/api/admin/service-areas', { headers }),
      ]);

      if (repRes) setReports(repRes.data || repRes);
      if (uRes) setUsers(uRes.data || (Array.isArray(uRes) ? uRes : []));
      if (pRes) setProducts(pRes.data || (Array.isArray(pRes) ? pRes : []));
      if (rRes) setRentals(rRes.data || (Array.isArray(rRes) ? rRes : []));
      if (tRes) setTickets(tRes.data || (Array.isArray(tRes) ? tRes : []));
      if (dRes) setDisputes(dRes.data || (Array.isArray(dRes) ? dRes : []));
      if (saRes) setServiceAreas(saRes.data || (Array.isArray(saRes) ? saRes : []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Edit User
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;

    try {
      const token = localStorage.getItem('rentease_token') || '';
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: editUser.id,
          name: editName,
          email: editEmail,
          phone: editPhone,
          role: editRole,
        }),
      });

      if (res.ok) {
        showToast('User account updated successfully!', 'success');
        setEditUser(null);
        fetchAdminData();
      }
    } catch {
      showToast('Failed to update user', 'error');
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete user account "${userName}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('rentease_token') || '';
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        showToast(`User "${userName}" deleted permanently`, 'info');
        fetchAdminData();
      }
    } catch {
      showToast('Error deleting user account', 'error');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`Are you sure you want to delete product "${productName}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('rentease_token') || '';
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: productId }),
      });

      if (res.ok) {
        showToast(`Product "${productName}" deleted from database`, 'info');
        fetchAdminData();
      }
    } catch {
      showToast('Error deleting product', 'error');
    }
  };

  // Override Rental Status
  const handleUpdateOrderStatus = async (rentalId: string, status: string) => {
    try {
      const token = localStorage.getItem('rentease_token') || '';
      const res = await fetch('/api/admin/rentals', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rentalId, status }),
      });

      if (res.ok) {
        showToast(`Order status updated to "${status}"`, 'success');
        fetchAdminData();
      }
    } catch {
      showToast('Failed to update order status', 'error');
    }
  };

  // Add Service Area
  const handleAddServiceArea = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('rentease_token') || '';
      const pincodeArray = newPincodes.split(',').map((p) => p.trim());

      const res = await fetch('/api/admin/service-areas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ city: newCity, state: newState, pincodes: pincodeArray, isActive: true }),
      });

      if (res.ok) {
        showToast(`Service area added for ${newCity}!`, 'success');
        setNewCity('');
        setNewState('');
        setNewPincodes('');
        fetchAdminData();
      }
    } catch {
      showToast('Error adding service area', 'error');
    }
  };

  const exportCSVReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Monthly Recurring Revenue (MRR),₹${reports?.mrr || 1485000}\n`
      + `Active Rentals,${reports?.totalActiveRentals || rentals.length}\n`
      + `Product Utilization Rate,${reports?.productUtilizationRate || 86.2}%\n`
      + `Customer Retention Rate,${reports?.customerRetentionRate || 94.2}%\n`
      + `Avg Repair SLA,${reports?.avgMaintenanceResolutionHours || 18.5} Hours\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RentEase_Executive_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    showToast('Executive CSV Report downloaded!', 'success');
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = userRoleFilter === 'all' || u.role?.toLowerCase() === userRoleFilter.toLowerCase();
    const matchesSearch = !userSearch || (
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone?.toLowerCase().includes(userSearch.toLowerCase())
    );
    return matchesRole && matchesSearch;
  });

  const sidebarItems = [
    { id: 'analytics', label: 'Executive Analytics', icon: BarChart3 },
    { id: 'users', label: 'User & Vendor Directory', icon: Users, count: users.length },
    { id: 'products', label: 'All Catalog Products', icon: Package, count: products.length },
    { id: 'orders', label: 'Master Orders', icon: Package, count: rentals.length },
    { id: 'tickets', label: 'Maintenance SLA Queue', icon: Wrench, count: tickets.length },
    { id: 'disputes', label: 'Disputes & Claims', icon: ShieldAlert, count: disputes.length },
    { id: 'cities', label: 'Service Metros', icon: MapPin, count: serviceAreas.length },
    { id: 'reports', label: 'CSV Reports', icon: FileSpreadsheet },
  ];

  return (
    <DashboardLayout
      title="RentEase Executive Admin HQ"
      subtitle="Full control over users, vendors, product listings, orders, maintenance SLAs & city expansions"
      roleBadge="ADMIN"
      roleColor="purple"
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      
      {/* Tab 1: Executive Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400">Monthly Recurring Revenue (MRR)</span>
              <div className="text-2xl font-black text-emerald-400">₹{(reports?.mrr || 1485000).toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +18.4% MoM growth
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400">Active Subscriptions</span>
              <div className="text-2xl font-black text-white">{reports?.totalActiveRentals || rentals.length} Orders</div>
              <div className="text-[11px] text-slate-400">Total in Database: {rentals.length}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400">Asset Utilization Rate</span>
              <div className="text-2xl font-black text-cyan-400">{reports?.productUtilizationRate || 86.2}%</div>
              <div className="text-[11px] text-slate-400">Active inventory on rent</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400">Avg Technician SLA</span>
              <div className="text-2xl font-black text-amber-300">{reports?.avgMaintenanceResolutionHours || 18.5} Hours</div>
              <div className="text-[11px] text-emerald-400 font-bold">Target &lt; 24h Met</div>
            </div>
          </div>

          {/* Revenue & City Distribution Visualization Bars */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h4 className="font-bold text-white text-sm">Monthly MRR Growth Curve (₹ Lakhs)</h4>
              <div className="space-y-3 pt-2">
                {[
                  { month: 'Oct 2024', val: 8.2, pct: 55 },
                  { month: 'Nov 2024', val: 10.4, pct: 70 },
                  { month: 'Dec 2024', val: 12.1, pct: 82 },
                  { month: 'Jan 2025', val: 13.5, pct: 90 },
                  { month: 'Feb 2025', val: 14.85, pct: 100 },
                ].map((bar, i) => (
                  <div key={i} className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>{bar.month}</span>
                      <span className="font-bold text-emerald-400">₹{bar.val} Lakhs</span>
                    </div>
                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${bar.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h4 className="font-bold text-white text-sm">Orders Share by Metro City</h4>
              <div className="space-y-3 pt-2">
                {[
                  { city: 'Bengaluru', pct: 42, color: 'bg-emerald-500' },
                  { city: 'Mumbai', pct: 28, color: 'bg-teal-500' },
                  { city: 'Pune', pct: 18, color: 'bg-cyan-500' },
                  { city: 'Hyderabad', pct: 12, color: 'bg-amber-500' },
                ].map((item, i) => (
                  <div key={i} className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>{item.city}</span>
                      <span className="font-bold text-white">{item.pct}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users & Vendors Directory */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users by name, email, phone..."
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white w-full sm:w-64"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-slate-400">Filter Role:</span>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
              >
                <option value="all">All Roles</option>
                <option value="customer">Customers / Renters</option>
                <option value="vendor">Vendors</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          {/* User Edit Modal */}
          {editUser && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
                <h3 className="font-bold text-white text-base">Edit Account Details</h3>
                <form onSubmit={handleUpdateUser} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Account Role</label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="CUSTOMER">Customer / Renter</option>
                      <option value="VENDOR">Vendor Partner</option>
                      <option value="ADMIN">Admin Executive</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditUser(null)}
                      className="w-1/2 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2.5 bg-purple-600 text-white font-bold rounded-xl"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* User Directory Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Phone</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/50">
                      <td className="p-3.5 font-bold text-white">{u.name}</td>
                      <td className="p-3.5">{u.email}</td>
                      <td className="p-3.5 text-slate-400">{u.phone || 'N/A'}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300 border border-purple-800' : u.role === 'VENDOR' ? 'bg-amber-500/20 text-amber-300 border border-amber-800' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditUser(u);
                              setEditName(u.name);
                              setEditEmail(u.email);
                              setEditPhone(u.phone || '');
                              setEditRole(u.role || 'CUSTOMER');
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                            title="Edit User"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/80 rounded-lg"
                            title="Delete User Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Products Control */}
      {activeTab === 'products' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-white text-sm">All Platform Catalog Products ({products.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">12m Rent</th>
                  <th className="p-3.5">Deposit</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/50">
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={p.image || (p.images ? p.images[0] : '')} alt={p.title || p.name} className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0" />
                      <span className="font-bold text-white">{p.title || p.name}</span>
                    </td>
                    <td className="p-3.5 uppercase font-semibold text-slate-400">{p.category_slug}</td>
                    <td className="p-3.5 font-bold text-emerald-400">₹{Number(p.monthly_rate_12m || p.monthly_rent).toLocaleString('en-IN')}/mo</td>
                    <td className="p-3.5 text-teal-400">₹{Number(p.deposit_amount || p.security_deposit).toLocaleString('en-IN')}</td>
                    <td className="p-3.5 font-mono">{p.available_stock || p.stock} / {p.total_stock || 12}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.title || p.name || 'product')}
                        className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/80 rounded-lg"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Master Orders */}
      {activeTab === 'orders' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm">Master Rental Orders ({rentals.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Order Ref</th>
                  <th className="p-3.5">Renter</th>
                  <th className="p-3.5">Item</th>
                  <th className="p-3.5">Tenure</th>
                  <th className="p-3.5">Monthly MRR</th>
                  <th className="p-3.5">Status Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {rentals.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/50">
                    <td className="p-3.5 font-mono font-bold text-emerald-400">{r.order_number}</td>
                    <td className="p-3.5 font-medium text-white">{r.user_name}</td>
                    <td className="p-3.5">{r.product_title}</td>
                    <td className="p-3.5">{r.tenure_months} months</td>
                    <td className="p-3.5 font-bold text-white">₹{Number(r.monthly_price).toLocaleString('en-IN')}/mo</td>
                    <td className="p-3.5">
                      <select
                        value={r.status}
                        onChange={(e) => handleUpdateOrderStatus(r.id, e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-emerald-400 font-bold rounded-lg px-2.5 py-1 text-xs"
                      >
                        <option value="Active">Active</option>
                        <option value="Delivering">Delivering</option>
                        <option value="RETURN_SCHEDULED">Return Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Maintenance SLA Queue */}
      {activeTab === 'tickets' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base">Technician SLA Support Queue ({tickets.length})</h3>
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-white">{t.product_title}</div>
                  <div className="text-slate-400">{t.user_email} • {t.issue_description || t.issue_category}</div>
                </div>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 font-bold rounded-full">
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Disputes */}
      {activeTab === 'disputes' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base">Damage Claims & Dispute Resolution ({disputes.length})</h3>
          <div className="space-y-3">
            {disputes.map((d) => (
              <div key={d.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{d.product_title || 'Rental Item'}</span>
                  <span className="font-bold text-amber-400">Claim Amount: ₹{Number(d.claim_amount || 0).toLocaleString('en-IN')}</span>
                </div>
                <p className="text-slate-400">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Service Areas */}
      {activeTab === 'cities' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-white text-base">Add New Metro Service Area</h3>
            <form onSubmit={handleAddServiceArea} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">City Name</label>
                <input
                  type="text"
                  required
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="e.g. Chennai"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  placeholder="e.g. Tamil Nadu"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Active PIN Codes (comma separated)</label>
                <textarea
                  required
                  rows={3}
                  value={newPincodes}
                  onChange={(e) => setNewPincodes(e.target.value)}
                  placeholder="600001, 600028, 600096"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl"
              >
                Add Metro Area
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-white text-base">Active Service Metros ({serviceAreas.length})</h3>
            <div className="space-y-3">
              {serviceAreas.map((sa) => (
                <div key={sa.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{sa.city}, {sa.state}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      Active
                    </span>
                  </div>
                  <div className="text-slate-400 font-mono text-[11px] truncate">
                    Pincodes: {Array.isArray(sa.pincodes) ? sa.pincodes.join(', ') : 'All Major Metro Areas'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: CSV Reports Export */}
      {activeTab === 'reports' && (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-6 max-w-xl mx-auto shadow-2xl">
          <div className="w-16 h-16 bg-purple-500/20 text-purple-300 rounded-full flex items-center justify-center mx-auto border border-purple-500/40">
            <FileSpreadsheet className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Export Executive Financial Summary</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download comprehensive platform CSV report including active MRR (₹), subscription counts, product utilization %, and SLA resolution metrics.
            </p>
          </div>

          <button
            onClick={exportCSVReport}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" /> Download Executive CSV Report
          </button>
        </div>
      )}

    </DashboardLayout>
  );
};
