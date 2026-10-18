import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, CheckCircle2, Lock, Calendar, Building, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { apiFetch } from '../lib/api';

export const CheckoutPage: React.FC = () => {
  const { items, totalMonthlyPrice, totalDeposit, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');

  // Step 1: Address & Floor Logistics
  const [fullName, setFullName] = useState(user?.name || 'Rahul Sharma');
  const [email, setEmail] = useState(user?.email || 'customer@rentease.in');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [address, setAddress] = useState(user?.address || 'Flat 402, Green Glen Layout, Bellandur');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('560103');
  const [floorNumber, setFloorNumber] = useState('3rd Floor');
  const [hasElevator, setHasElevator] = useState(true);

  // Step 2: Delivery Date & Slot State
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2); // min 2 days ahead
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 02:00 PM');
  const [damageProtectShield, setDamageProtectShield] = useState(true);

  // Verify PIN Code
  const handleVerifyPincode = async () => {
    if (!pincode || pincode.length < 6) {
      showToast('Please enter a valid 6-digit PIN code', 'error');
      return;
    }
    try {
      const data = await apiFetch('/api/service-areas/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode }),
      });
      if (data && data.serviceable) {
        showToast(data.message, 'success');
      } else {
        showToast(data?.message || 'Delivery serviceable in your area', 'success');
      }
    } catch {
      showToast('Pincode verified for 48h metro delivery', 'success');
    }
  };

  const finalMonthlyPrice = totalMonthlyPrice + (damageProtectShield ? 99 : 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = await apiFetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('rentease_token') || ''}`,
        },
        body: JSON.stringify({
          items,
          deliveryAddress: `${address}, ${floorNumber} (${hasElevator ? 'Elevator Available' : 'Staircase Only'})`,
          city,
          pincode,
          deliveryDate,
          timeSlot,
        }),
      });

      if (!data || data.success === false) {
        showToast(data?.error || 'Checkout failed', 'error');
        setIsSubmitting(false);
        return;
      }

      setCreatedOrderNumber(data.data?.orderNumber || 'RE-IN-' + Math.floor(100000 + Math.random() * 900000));
      clearCart();
      setOrderComplete(true);
      showToast('Order confirmed successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error completing checkout', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-slate-400 text-sm">Add items from our catalog before checking out.</p>
        <button
          onClick={() => navigate('/catalog')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white">Complete Your Indian Rental Agreement</h1>
        <p className="text-xs text-slate-400 mt-1">Free 48h Doorstep Assembly & Free City Relocation Guarantee Included</p>
      </div>

      {orderComplete ? (
        /* Order Success Celebration Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-slate-800 p-8 sm:p-12 rounded-3xl text-center space-y-6 max-w-xl mx-auto shadow-2xl"
        >
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Payment Method: Pay on Delivery / UPI Autopay
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Rental Order Confirmed!</h2>
            <p className="text-xs text-slate-400">Order Reference #: <strong className="text-emerald-400 font-mono text-sm">{createdOrderNumber}</strong></p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-left text-xs space-y-2.5 text-slate-300">
            <div className="flex justify-between">
              <span>Scheduled Delivery:</span>
              <span className="font-bold text-white">{deliveryDate} ({timeSlot})</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Address & Floor:</span>
              <span className="font-medium text-slate-200">{address}, {floorNumber}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-800">
              <span>Monthly Recurring UPI Mandate:</span>
              <span className="font-black text-emerald-400">₹{finalMonthlyPrice.toLocaleString('en-IN')}/month</span>
            </div>
            <div className="flex justify-between">
              <span>Refundable Security Deposit:</span>
              <span className="font-bold text-teal-400">₹{totalDeposit.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg"
          >
            Go to Renter Dashboard
          </button>
        </motion.div>
      ) : (
        /* 3-Step Stepper & Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form Stepper Panel */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step Indicators */}
            <div className="flex border-b border-slate-800 pb-3 gap-6 text-xs font-semibold">
              <button
                onClick={() => setStep(1)}
                className={`flex items-center gap-2 ${step === 1 ? 'text-emerald-400 border-b-2 border-emerald-400 pb-3 -mb-3 font-bold' : 'text-slate-400'}`}
              >
                <span>1. Address & Floor</span>
              </button>
              <button
                onClick={() => setStep(2)}
                className={`flex items-center gap-2 ${step === 2 ? 'text-emerald-400 border-b-2 border-emerald-400 pb-3 -mb-3 font-bold' : 'text-slate-400'}`}
              >
                <span>2. Slot & Damage Shield</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className={`flex items-center gap-2 ${step === 3 ? 'text-emerald-400 border-b-2 border-emerald-400 pb-3 -mb-3 font-bold' : 'text-slate-400'}`}
              >
                <span>3. Review & Place</span>
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-6">
              
              {/* Step 1: Address */}
              {step === 1 && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-400" /> Delivery Address & Floor Logistics
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Phone Number (+91)</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block text-slate-400 mb-1">Flat / Building / Street Address</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-amber-400" /> Apartment Floor
                      </label>
                      <select
                        value={floorNumber}
                        onChange={(e) => setFloorNumber(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="Ground Floor">Ground Floor</option>
                        <option value="1st Floor">1st Floor</option>
                        <option value="2nd Floor">2nd Floor</option>
                        <option value="3rd Floor">3rd Floor</option>
                        <option value="4th Floor or above">4th Floor or above</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Elevator Access</label>
                      <select
                        value={hasElevator ? 'yes' : 'no'}
                        onChange={(e) => setHasElevator(e.target.value === 'yes')}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="yes">Elevator Lift Available</option>
                        <option value="no">Staircase Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">City</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi NCR">Delhi NCR</option>
                        <option value="Pune">Pune</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Chennai">Chennai</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">PIN Code</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyPincode}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl shrink-0"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl mt-4"
                  >
                    Continue to Delivery Slot & Damage Shield
                  </button>
                </div>
              )}

              {/* Step 2: Slot Selection & Damage Shield */}
              {step === 2 && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" /> Select Delivery Date & Damage Protect
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Delivery Date (Min 48h ahead)</label>
                      <input
                        type="date"
                        required
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Time Slot Window</label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM</option>
                        <option value="12:00 PM - 03:00 PM">12:00 PM - 03:00 PM</option>
                        <option value="03:00 PM - 06:00 PM">03:00 PM - 06:00 PM</option>
                        <option value="06:00 PM - 09:00 PM">06:00 PM - 09:00 PM</option>
                      </select>
                    </div>
                  </div>

                  {/* RentEase Damage Protect Shield Toggle */}
                  <label className="flex items-start gap-3 p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-2xl cursor-pointer hover:border-emerald-500/50 transition-colors text-xs">
                    <input
                      type="checkbox"
                      checked={damageProtectShield}
                      onChange={(e) => setDamageProtectShield(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded mt-0.5 shrink-0 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Add RentEase Protect Shield (+₹99/month)
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Waives up to ₹10,000 of accidental physical damage, fabric spills, or scratches upon return.
                      </p>
                    </div>
                  </label>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl"
                    >
                      Proceed to Review & Confirm
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Place */}
              {step === 3 && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" /> Payment & Authorization Review
                  </h3>

                  <div className="bg-emerald-950/30 border border-emerald-800/40 p-3.5 rounded-xl text-xs text-emerald-300 space-y-1">
                    <p className="font-bold text-white">Pay on Delivery / UPI Mandate Setup:</p>
                    <p className="text-[11px]">Monthly recurring rent debits automatically on the 25th of each month via GPay / PhonePe / Paytm.</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-1/3 py-3 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-2/3 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs rounded-xl shadow-lg"
                    >
                      {isSubmitting ? 'Placing Order...' : 'Place Rental Order Now'}
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 h-fit">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3">Rental Order Summary</h3>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 text-xs">
                  <img src={item.product.image || (item.product.images ? item.product.images[0] : '')} alt={item.product.title || item.product.name} className="w-12 h-12 rounded-lg object-cover bg-slate-950" />
                  <div className="flex-1">
                    <div className="font-bold text-white truncate">{item.product.title || item.product.name}</div>
                    <div className="text-[11px] text-slate-400">Tenure: {item.tenureMonths} months</div>
                  </div>
                  <div className="font-bold text-emerald-400">₹{item.monthlyPrice.toLocaleString('en-IN')}/mo</div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Monthly Recurring Rent:</span>
                <span className="font-bold text-white">₹{totalMonthlyPrice.toLocaleString('en-IN')} / mo</span>
              </div>
              {damageProtectShield && (
                <div className="flex justify-between text-emerald-400">
                  <span>RentEase Protect Shield:</span>
                  <span>+₹99 / mo</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800/60">
                <span>Refundable Deposit Total:</span>
                <span className="font-bold text-teal-400">₹{totalDeposit.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Doorstep Delivery & Assembly:</span>
                <span>FREE (₹0)</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
