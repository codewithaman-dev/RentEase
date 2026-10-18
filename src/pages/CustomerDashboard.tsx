import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Wrench, 
  RefreshCw, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  Truck,
  User,
  Plus,
  Clock,
  X,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { OrderTrackerModal } from '../components/OrderTrackerModal';
import { RentalContractModal } from '../components/RentalContractModal';
import { Rental, MaintenanceTicket, RelocationRequest } from '../types';
import { apiFetch } from '../lib/api';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'rentals' | 'relocation' | 'tickets' | 'profile'>('overview');

  const [rentals, setRentals] = useState<Rental[]>([]);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [relocations, setRelocations] = useState<RelocationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals State
  const [trackRental, setTrackRental] = useState<Rental | null>(null);
  const [contractRental, setContractRental] = useState<Rental | null>(null);

  // Extend Tenure Modal State
  const [extendModalRental, setExtendModalRental] = useState<Rental | null>(null);
  const [extendMonths, setExtendMonths] = useState(6);
  const [extending, setExtending] = useState(false);

  // Schedule Return Pickup Modal State
  const [returnModalRental, setReturnModalRental] = useState<Rental | null>(null);
  const [pickupDate, setPickupDate] = useState('2025-04-15');
  const [returning, setReturning] = useState(false);

  // Relocation Form State
  const [selectedRentalForMove, setSelectedRentalForMove] = useState('');
  const [currentAddr, setCurrentAddress] = useState(user?.address || '');
  const [newAddr, setNewAddress] = useState('');
  const [preferredMoveDate, setPreferredMoveDate] = useState('2025-04-10');
  const [relocationSubmitting, setRelocationSubmitting] = useState(false);

  // Ticket Form State
  const [ticketRentalId, setTicketRentalId] = useState('');
  const [ticketCategory, setTicketCategory] = useState<string>('General Inquiry');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketPriority, setTicketPriority] = useState<string>('MEDIUM');
  const [ticketSubmitting, setTicketSubmitting] = useState(false);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('rentease_token') || '';
      const [rRes, tRes, relRes] = await Promise.all([
        apiFetch('/api/rentals', { headers: { Authorization: `Bearer ${token}` } }),
        apiFetch('/api/maintenance', { headers: { Authorization: `Bearer ${token}` } }),
        apiFetch(`/api/relocations?user_email=${encodeURIComponent(user?.email || 'customer@rentease.in')}`),
      ]);

      if (rRes) {
        setRentals(Array.isArray(rRes) ? rRes : (rRes.data || []));
      }
      if (tRes) {
        setTickets(Array.isArray(tRes) ? tRes : (tRes.data || []));
      }
      if (relRes) {
        setRelocations(Array.isArray(relRes) ? relRes : (relRes.data || []));
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const handleExtendTenure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extendModalRental) return;

    setExtending(true);
    try {
      const data = await apiFetch('/api/rentals/extend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('rentease_token') || ''}`,
        },
        body: JSON.stringify({ rentalId: extendModalRental.id, extendMonths }),
      });

      if (data && data.success !== false) {
        showToast(`Tenure extended by ${extendMonths} months!`, 'success');
        setExtendModalRental(null);
        fetchUserData();
      }
    } catch {
      showToast('Failed to extend tenure', 'error');
    } finally {
      setExtending(false);
    }
  };

  const handleScheduleReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnModalRental) return;

    setReturning(true);
    try {
      const data = await apiFetch('/api/rentals/return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('rentease_token') || ''}`,
        },
        body: JSON.stringify({ rentalId: returnModalRental.id, pickupDate }),
      });

      if (data && data.success !== false) {
        showToast('Return scheduled for pickup! Deposit refund queued.', 'success');
        setReturnModalRental(null);
        fetchUserData();
      }
    } catch {
      showToast('Failed to schedule return', 'error');
    } finally {
      setReturning(false);
    }
  };

  const handleCreateRelocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.trim()) return;

    setRelocationSubmitting(true);
    const rentalItem = rentals.find((r) => r.id === selectedRentalForMove) || rentals[0];

    try {
      const data = await apiFetch('/api/relocations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rental_id: rentalItem?.id || 'rent_001',
          product_title: rentalItem?.product_title || 'Living Room Furniture Set',
          user_email: user?.email || 'customer@rentease.in',
          user_name: user?.name || 'Rahul Sharma',
          current_address: currentAddr,
          new_address: newAddr,
          preferred_date: preferredMoveDate,
          status: 'Pending',
        }),
      });

      if (data) {
        const newReq = data.data || data;
        setRelocations([newReq, ...relocations]);
        setNewAddress('');
        showToast('Free City Relocation request submitted!', 'success');
      }
    } catch (err) {
      console.error('Relocation error:', err);
    } finally {
      setRelocationSubmitting(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketDescription.trim()) return;

    setTicketSubmitting(true);
    const rentalItem = rentals.find((r) => r.id === ticketRentalId) || rentals[0];

    try {
      const data = await apiFetch('/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('rentease_token') || ''}`,
        },
        body: JSON.stringify({
          rentalId: rentalItem?.id || 'rent_001',
          productTitle: rentalItem?.product_title || 'Item Service Support',
          issueDescription: ticketDescription,
          priority: ticketPriority,
        }),
      });

      if (data) {
        showToast('Maintenance ticket created! Technician SLA < 24h', 'success');
        setTicketDescription('');
        fetchUserData();
      }
    } catch (err) {
      console.error('Ticket error:', err);
    } finally {
      setTicketSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Profile Welcome Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
            {user?.name?.[0] || 'R'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Welcome, {user?.name}
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                Verified Renter
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email} • {user?.address || 'Bellandur, Bengaluru'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Items</div>
            <div className="text-lg font-black text-emerald-400">{rentals.length} Subscriptions</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Package },
          { id: 'rentals', label: 'My Subscriptions', icon: Calendar, count: rentals.length },
          { id: 'relocation', label: 'Free Relocation', icon: RefreshCw, count: relocations.length },
          { id: 'tickets', label: 'Maintenance Support', icon: Wrench, count: tickets.length },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-emerald-400 text-emerald-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-mono">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400">Active Subscriptions</span>
              <div className="text-2xl font-black text-emerald-400">{rentals.length} Items</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400">Next Scheduled Delivery</span>
              <div className="text-2xl font-black text-teal-400">August 20th</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400">Open Service Tickets</span>
              <div className="text-2xl font-black text-cyan-400">{tickets.filter((t) => t.status !== 'RESOLVED' && t.status !== 'Resolved').length} Open</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: My Rentals */}
      {activeTab === 'rentals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rentals.map((rental) => (
              <div key={rental.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-lg">
                <div className="flex gap-4">
                  <img
                    src={rental.product_image || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'}
                    alt={rental.product_title}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-950 shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white text-sm">{rental.product_title}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {rental.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Order #: <span className="font-mono text-slate-300">{rental.order_number}</span></div>
                    <div className="text-xs font-bold text-emerald-400 mt-2">₹{rental.monthly_price.toLocaleString('en-IN')} / month ({rental.tenure_months}m tenure)</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <button
                    onClick={() => setTrackRental(rental)}
                    className="py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-1"
                  >
                    <Truck className="w-3.5 h-3.5" /> Track Delivery
                  </button>

                  <button
                    onClick={() => setContractRental(rental)}
                    className="py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" /> Agreement PDF
                  </button>
                </div>

                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => setExtendModalRental(rental)}
                    className="w-1/2 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl transition-all"
                  >
                    Extend Tenure
                  </button>
                  <button
                    onClick={() => setReturnModalRental(rental)}
                    className="w-1/2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-all border border-slate-700"
                  >
                    Schedule Return
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Relocation */}
      {activeTab === 'relocation' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 max-w-xl">
          <h3 className="font-bold text-white text-base">Request Free City Relocation</h3>
          <form onSubmit={handleCreateRelocation} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">New Address</label>
              <input
                type="text"
                required
                value={newAddr}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="e.g. Purva Riviera, Marathahalli"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <button
              type="submit"
              disabled={relocationSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl"
            >
              Submit Relocation
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Tickets */}
      {activeTab === 'tickets' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 max-w-xl">
          <h3 className="font-bold text-white text-base">Raise Maintenance Support Ticket</h3>
          <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Describe Issue</label>
              <textarea
                required
                rows={3}
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                placeholder="Describe issue..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={ticketSubmitting}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl"
            >
              Dispatch Ticket
            </button>
          </form>
        </div>
      )}

      {/* Track Delivery Modal */}
      {trackRental && (
        <OrderTrackerModal
          orderNumber={trackRental.order_number}
          productTitle={trackRental.product_title}
          deliveryDate={trackRental.start_date || 'March 25, 2025'}
          status={trackRental.status}
          onClose={() => setTrackRental(null)}
        />
      )}

      {/* Rental Contract PDF Modal */}
      {contractRental && (
        <RentalContractModal
          rental={contractRental}
          onClose={() => setContractRental(null)}
        />
      )}

      {/* Extend Tenure Modal */}
      {extendModalRental && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="font-bold text-white text-base">Extend Tenure for {extendModalRental.product_title}</h3>
            <form onSubmit={handleExtendTenure} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Add Extension Months</label>
                <select
                  value={extendMonths}
                  onChange={(e) => setExtendMonths(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value={3}>+3 Months</option>
                  <option value={6}>+6 Months</option>
                  <option value={12}>+12 Months</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setExtendModalRental(null)}
                  className="w-1/2 py-2.5 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={extending}
                  className="w-1/2 py-2.5 bg-emerald-600 text-slate-950 font-bold rounded-xl"
                >
                  Confirm Extension
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Return Modal */}
      {returnModalRental && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="font-bold text-white text-base">Schedule Return Pickup for {returnModalRental.product_title}</h3>
            <form onSubmit={handleScheduleReturn} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Pickup Date</label>
                <input
                  type="date"
                  required
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReturnModalRental(null)}
                  className="w-1/2 py-2.5 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={returning}
                  className="w-1/2 py-2.5 bg-emerald-600 text-slate-950 font-bold rounded-xl"
                >
                  Schedule Pickup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
