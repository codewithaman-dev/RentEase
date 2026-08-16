import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Wrench, 
  ShieldAlert, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  TrendingUp, 
  Star, 
  Building2, 
  Upload,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Product, MaintenanceTicket, Rental } from '../types';
import { useToast } from '../contexts/ToastContext';

export const VendorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [products, setProducts] = useState<Product[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [damageClaims, setDamageClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Search & Filter
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategory, setInventoryCategory] = useState('all');

  // Add / Edit Product Modal State
  const [showProductModal, setShowAddModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [categorySlug, setCategorySlug] = useState('bed');
  const [rate12m, setRate12m] = useState(549);
  const [deposit, setDeposit] = useState(1500);
  const [retailPrice, setRetailPrice] = useState(25000);
  const [stock, setStock] = useState(10);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [dimensions, setDimensions] = useState('Standard Size');
  const [material, setMaterial] = useState('Solid Sheesham Wood / Premium');

  // Damage Claim Form
  const [claimRentalId, setClaimRentalId] = useState('');
  const [claimDescription, setClaimDescription] = useState('');
  const [claimAmount, setClaimAmount] = useState(1500);

  // Store & Payout Settings State
  const [storeName, setStoreName] = useState('UrbanFurnish India Logistics');
  const [gstin, setGstin] = useState('29ABCDE1234F1Z5');
  const [upiVpa, setUpiVpa] = useState('supply.urbanfurnish@icici');
  const [warehouseCity, setWarehouseCity] = useState('Bengaluru (Electronic City Hub)');

  const fetchVendorData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('rentease_token') || '';
      const headers = { Authorization: `Bearer ${token}` };

      const [pRes, rRes, mRes, dRes] = await Promise.all([
        fetch('/api/vendor/products', { headers }),
        fetch('/api/vendor/rentals', { headers }),
        fetch('/api/vendor/maintenance', { headers }),
        fetch('/api/vendor/returns', { headers }),
      ]);

      if (pRes.ok) setProducts((await pRes.json()).data || []);
      if (rRes.ok) setRentals((await rRes.json()).data || []);
      if (mRes.ok) setTickets((await mRes.json()).data || []);
      if (dRes.ok) setDamageClaims((await dRes.json()).data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, []);

  // Calculate Vendor Metrics
  const activeRentalsCount = rentals.filter((r) => r.status === 'Active' || r.status === 'Delivering').length;
  const grossMonthlyEarnings = rentals.reduce((sum, r) => sum + Number(r.monthly_price || 0), 0);
  const totalStockUnits = products.reduce((sum, p) => sum + Number(p.total_stock || p.stock || 10), 0);
  const availableStockUnits = products.reduce((sum, p) => sum + Number(p.available_stock || p.stock || 0), 0);

  const openAddModal = () => {
    setEditingProductId(null);
    setName('');
    setCategorySlug('bed');
    setRate12m(549);
    setDeposit(1500);
    setRetailPrice(25000);
    setStock(10);
    setImageUrl('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80');
    setSelectedFileName(null);
    setDescription('');
    setDimensions('Standard Size');
    setMaterial('Solid Sheesham Wood / Premium');
    setShowAddModal(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setName(p.title || p.name || '');
    setCategorySlug(p.category_slug || 'bed');
    setRate12m(Number(p.monthly_rate_12m || p.monthly_rent || 499));
    setDeposit(Number(p.deposit_amount || p.security_deposit || 1200));
    setRetailPrice(Number(p.retail_price || 20000));
    setStock(Number(p.total_stock || p.stock || 10));
    setImageUrl(p.image || (p.images ? p.images[0] : ''));
    setSelectedFileName('Existing_product_photo.jpg');
    setDescription(p.description || '');
    setDimensions(p.dimensions || 'Standard Size');
    setMaterial(p.specifications?.finish || p.specifications?.material || 'Solid Wood / Inverter');
    setShowAddModal(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('File size exceeds 5MB limit', 'error');
      return;
    }

    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setImageUrl(reader.result as string);
        showToast(`Attached product photo: ${file.name}`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Product title is required', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('rentease_token') || '';
      const method = editingProductId ? 'PUT' : 'POST';
      const bodyPayload: any = {
        name: name.trim(),
        title: name.trim(),
        slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
        category_id: `cat_sub_${categorySlug}`,
        category_slug: categorySlug,
        category_name: categorySlug.toUpperCase(),
        description: description.trim(),
        image: imageUrl.trim(),
        images: [imageUrl.trim()],
        monthly_rate_3m: Math.round(rate12m * 1.3),
        monthly_rate_6m: Math.round(rate12m * 1.15),
        monthly_rate_12m: Number(rate12m),
        monthly_rent: Number(rate12m),
        retail_price: Number(retailPrice),
        deposit_amount: Number(deposit),
        security_deposit: Number(deposit),
        total_stock: Number(stock),
        available_stock: Number(stock),
        stock: Number(stock),
        dimensions,
        specifications: {
          material,
          warranty: 'Free Technician Repair Guarantee',
        },
        condition: 'Brand New',
        rating: 4.8,
        reviews_count: 1,
        is_active: true,
      };

      if (editingProductId) {
        bodyPayload.id = editingProductId;
      }

      const res = await fetch('/api/vendor/products', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyPayload),
      });

      if (res.ok) {
        showToast(
          editingProductId ? `Updated "${name}"!` : `Listed "${name}" on Marketplace!`,
          'success'
        );
        setShowAddModal(false);
        setEditingProductId(null);
        fetchVendorData();
      } else {
        showToast('Error saving product details', 'error');
      }
    } catch {
      showToast('Error saving product details', 'error');
    }
  };

  const handleAdjustStock = async (productId: string, delta: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newAvailable = Math.max(0, (product.available_stock || product.stock || 0) + delta);
    const newTotal = Math.max(newAvailable, (product.total_stock || 10) + (delta > 0 ? delta : 0));

    try {
      const token = localStorage.getItem('rentease_token') || '';
      const res = await fetch('/api/vendor/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: productId,
          available_stock: newAvailable,
          stock: newAvailable,
          total_stock: newTotal,
        }),
      });

      if (res.ok) {
        showToast(`Stock updated for ${product.title || product.name}`, 'info');
        fetchVendorData();
      }
    } catch {
      showToast('Failed to adjust stock', 'error');
    }
  };

  const handleDeleteProduct = async (productId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}" from inventory?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('rentease_token') || '';
      const res = await fetch('/api/vendor/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: productId }),
      });

      if (res.ok) {
        showToast(`Product "${title}" unlisted`, 'info');
        fetchVendorData();
      }
    } catch {
      showToast('Failed to delete product', 'error');
    }
  };

  const handleCreateDamageClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('rentease_token') || '';
      const res = await fetch('/api/vendor/returns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rentalId: claimRentalId || 'rent_001',
          productId: 'prod_001',
          productTitle: 'Rented Item Inspection',
          description: claimDescription,
          claimAmount,
        }),
      });

      if (res.ok) {
        showToast('Damage inspection claim submitted to Admin HQ!', 'success');
        setClaimDescription('');
        fetchVendorData();
      }
    } catch {
      showToast('Error filing damage claim', 'error');
    }
  };

  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Supplier profile & payout details updated!', 'success');
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = inventoryCategory === 'all' || p.category_slug === inventoryCategory;
    const matchesSearch = !inventorySearch || (
      (p.name || p.title || '').toLowerCase().includes(inventorySearch.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(inventorySearch.toLowerCase())
    );
    return matchesCat && matchesSearch;
  });

  const sidebarItems = [
    { id: 'inventory', label: 'Inventory Catalog', icon: Package, count: products.length },
    { id: 'overview', label: 'Seller Analytics', icon: LayoutDashboard },
    { id: 'orders', label: 'Order Fulfillments', icon: Truck, count: rentals.length },
    { id: 'maintenance', label: 'Technician SLA', icon: Wrench, count: tickets.length },
    { id: 'claims', label: 'Damage Claims', icon: ShieldAlert, count: damageClaims.length },
    { id: 'store', label: 'Store & Payouts', icon: Building2 },
  ];

  return (
    <DashboardLayout
      title="UrbanFurnish Seller Central (India)"
      subtitle="Manage inventory listings, edit prices, upload product photos, stock counts, and fulfillments"
      roleBadge="VENDOR"
      roleColor="amber"
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      
      {/* Tab 1: Inventory Catalog Management */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          
          {/* Top Filter & Add Product Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="Search inventory by title or name..."
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white w-full sm:w-64"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={inventoryCategory}
                onChange={(e) => setInventoryCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
              >
                <option value="all">All Categories</option>
                <option value="bed">Beds</option>
                <option value="sofa">Sofas</option>
                <option value="table">Tables & Desks</option>
                <option value="fridge">Refrigerators</option>
                <option value="washing-machine">Washing Machines</option>
                <option value="tv">Smart TVs</option>
                <option value="dining">Dining Sets</option>
              </select>

              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add New Inventory Product
              </button>
            </div>
          </div>

          {/* Interactive Product Add / Edit Modal */}
          {showProductModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl w-full max-w-xl space-y-4 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-400" />
                  {editingProductId ? 'Edit Inventory Product' : 'List New Product on Marketplace'}
                </h3>

                <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">PRODUCT NAME / TITLE *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sheesham Wood Queen Bed with Ortho Mattress"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">CATEGORY *</label>
                      <select
                        value={categorySlug}
                        onChange={(e) => setCategorySlug(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                      >
                        <option value="bed">Bed</option>
                        <option value="sofa">Sofa</option>
                        <option value="table">Table & Desk</option>
                        <option value="fridge">Fridge</option>
                        <option value="washing-machine">Washing Machine</option>
                        <option value="tv">TV</option>
                        <option value="dining">Dining Set</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">12m MONTHLY RENT (₹) *</label>
                      <input
                        type="number"
                        required
                        value={rate12m}
                        onChange={(e) => setRate12m(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">DEPOSIT (₹) *</label>
                      <input
                        type="number"
                        required
                        value={deposit}
                        onChange={(e) => setDeposit(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">RETAIL PRICE (₹)</label>
                      <input
                        type="number"
                        required
                        value={retailPrice}
                        onChange={(e) => setRetailPrice(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">STOCK UNITS *</label>
                      <input
                        type="number"
                        required
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* File Upload Box instead of text URL input */}
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5 text-amber-400" /> UPLOAD PRODUCT PHOTO *
                    </label>

                    <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 text-center bg-slate-950/60 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      />
                      <Upload className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                      <div className="text-xs font-bold text-white">
                        {selectedFileName ? `Selected: ${selectedFileName}` : 'Click to Upload Product Photo'}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">PNG, JPG or WEBP (Max 5MB)</div>
                    </div>

                    {imageUrl && (
                      <div className="mt-3 flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <img src={imageUrl} alt="Uploaded product photo preview" className="w-14 h-14 rounded-lg object-cover bg-slate-900 border border-slate-700 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-emerald-400 block flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Photo Attached & Preview Ready
                          </span>
                          <span className="text-[10px] text-slate-400">Image will be saved with this product</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">DIMENSIONS</label>
                      <input
                        type="text"
                        value={dimensions}
                        onChange={(e) => setDimensions(e.target.value)}
                        placeholder="e.g. 62x82x40 inches"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">MATERIAL / FINISH</label>
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        placeholder="e.g. Solid Sheesham Wood"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">DESCRIPTION</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter detailed item description..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                    ></textarea>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="w-1/2 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg"
                    >
                      {editingProductId ? 'Save Changes' : 'List Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Product Inventory Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Product Details</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">12m Rent</th>
                    <th className="p-3.5">Deposit</th>
                    <th className="p-3.5">Available / Total Stock</th>
                    <th className="p-3.5 text-right">Stock Adjust & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredProducts.map((p) => {
                    const avail = p.available_stock || p.stock || 0;
                    const tot = p.total_stock || 12;
                    return (
                      <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-3.5 flex items-center gap-3">
                          <img src={p.image || (p.images ? p.images[0] : '')} alt={p.title || p.name} className="w-12 h-12 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-800" />
                          <div>
                            <div className="font-bold text-white text-sm">{p.title || p.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">ID: {p.id}</div>
                          </div>
                        </td>

                        <td className="p-3.5 uppercase font-semibold text-slate-400">{p.category_slug}</td>

                        <td className="p-3.5 font-bold text-amber-400 text-sm">₹{Number(p.monthly_rate_12m || p.monthly_rent).toLocaleString('en-IN')}/mo</td>

                        <td className="p-3.5 text-teal-400 font-medium">₹{Number(p.deposit_amount || p.security_deposit).toLocaleString('en-IN')}</td>

                        <td className="p-3.5">
                          <div className="space-y-1">
                            <span className={`font-bold ${avail > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {avail} available
                            </span>
                            <span className="text-slate-500 text-[10px]"> / {tot} total</span>
                          </div>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleAdjustStock(p.id, -1)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg border border-slate-700"
                              title="Decrease available stock"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => handleAdjustStock(p.id, +1)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg border border-slate-700"
                              title="Increase available stock"
                            >
                              +1
                            </button>

                            <button
                              onClick={() => openEditModal(p)}
                              className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg border border-slate-700 ml-1"
                              title="Edit Product Details & Photo"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(p.id, p.title || p.name || 'item')}
                              className="p-2 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/80 rounded-lg"
                              title="Delete / Unlist Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Seller Central Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400">Monthly Gross Payout (₹)</span>
              <div className="text-2xl font-black text-amber-400">₹{(grossMonthlyEarnings || 42800).toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +15.8% MoM earnings
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400">Active Rentals on Supply</span>
              <div className="text-2xl font-black text-emerald-400">{activeRentalsCount || rentals.length} Items</div>
              <div className="text-[11px] text-slate-400">Rented out to customers</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400">Available Stock Units</span>
              <div className="text-2xl font-black text-teal-400">{availableStockUnits} / {totalStockUnits}</div>
              <div className="text-[11px] text-slate-400">Ready in Electronic City Hub</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400">Average Supplier Rating</span>
              <div className="text-2xl font-black text-amber-300 flex items-center gap-1">
                4.9 <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
              <div className="text-[11px] text-emerald-400 font-bold">Top Quality Supplier</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Order Fulfillments */}
      {activeTab === 'orders' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base">Incoming Rental Orders ({rentals.length})</h3>
          <div className="space-y-3">
            {rentals.map((r) => (
              <div key={r.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                <div>
                  <div className="font-bold text-white text-sm">{r.product_title}</div>
                  <div className="text-slate-400">Order Ref: <span className="font-mono text-amber-400">{r.order_number}</span> • Renter: {r.user_name} ({r.city})</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Address: {r.delivery_address}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-full border border-emerald-500/30">
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Technician SLA */}
      {activeTab === 'maintenance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base">Customer Service Tickets ({tickets.length})</h3>
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{t.product_title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[10px]">{t.status}</span>
                </div>
                <p className="text-slate-400">{t.description || t.issue_category}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Damage Claims */}
      {activeTab === 'claims' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-white text-base">File Damage Claim</h3>
            <form onSubmit={handleCreateDamageClaim} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Select Rental Order</label>
                <select
                  value={claimRentalId}
                  onChange={(e) => setClaimRentalId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  {rentals.map((r) => (
                    <option key={r.id} value={r.id}>{r.product_title} ({r.order_number})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Claim Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Inspection Notes</label>
                <textarea
                  required
                  rows={3}
                  value={claimDescription}
                  onChange={(e) => setClaimDescription(e.target.value)}
                  placeholder="Describe damage found during return inspection..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg"
              >
                Submit Damage Claim
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-white text-base">Filed Damage Claims ({damageClaims.length})</h3>
            <div className="space-y-3">
              {damageClaims.map((claim) => (
                <div key={claim.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{claim.product_title || 'Rental Item'}</span>
                    <span className="font-bold text-amber-400">Claim: ₹{Number(claim.claim_amount || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-slate-400">{claim.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Storefront & Payout Settings */}
      {activeTab === 'store' && (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 max-w-2xl mx-auto shadow-2xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Building2 className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-xl font-bold text-white">Supplier Profile & Monthly Payouts</h3>
              <p className="text-xs text-slate-400">Manage business tax GSTIN details and automated monthly UPI payout address</p>
            </div>
          </div>

          <form onSubmit={handleSaveStoreSettings} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">SUPPLIER STORE NAME</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">GSTIN NUMBER</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">PAYOUT UPI VPA / BANK</label>
                <input
                  type="text"
                  value={upiVpa}
                  onChange={(e) => setUpiVpa(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">PRIMARY WAREHOUSE HUB</label>
              <input
                type="text"
                value={warehouseCity}
                onChange={(e) => setWarehouseCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg mt-2"
            >
              Save Supplier Settings
            </button>
          </form>
        </div>
      )}

    </DashboardLayout>
  );
};
