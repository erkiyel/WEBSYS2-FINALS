import { useState, useEffect } from 'react';
import { sellerOrdersAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function SpecialistOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await sellerOrdersAPI.getSpecialistOrders(statusFilter);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOrder = async (orderId: number) => {
    if (!window.confirm('Approve this order and transfer stock to shop inventory?')) {
      return;
    }

    try {
      await sellerOrdersAPI.approveOrder(orderId);
      alert('Order approved successfully');
      loadOrders();
    } catch (error) {
      alert('Failed to approve order');
    }
  };

  const handleDeclineOrder = async (orderId: number) => {
    if (!window.confirm('Decline this order?')) {
      return;
    }

    try {
      await sellerOrdersAPI.declineOrder(orderId);
      alert('Order declined successfully');
      loadOrders();
    } catch (error) {
      alert('Failed to decline order');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-6" data-theme="luxury">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate('/specialist')}
          className="px-6 py-3 bg-gradient-to-r from-secondary to-secondary-focus text-secondary-content rounded-xl font-medium shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center"
        >
          <span className="mr-2">←</span> Back to Dashboard
        </button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Seller Orders
          </h1>
          <p className="text-base-content/70 mt-2">Manage orders from scroll sellers</p>
        </div>
        
        <div className="w-28"></div> {/* Spacer for alignment */}
      </div>

      {/* Filter Section */}
      <div className="mb-8 bg-gradient-to-r from-base-100 to-base-200 rounded-2xl shadow-xl border border-base-300 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl mr-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-base-content">Filter Orders</h3>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-5 py-3 rounded-xl bg-base-300 border border-base-400 text-base-content font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="Pending">🟡 Pending</option>
            <option value="Approved">🟢 Approved</option>
            <option value="Declined">🔴 Declined</option>
            <option value="Cancelled">⚫ Cancelled</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12 bg-gradient-to-r from-base-100 to-base-200 rounded-2xl shadow-xl border border-base-300">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-6 text-xl text-base-content/70">Loading magical orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-r from-base-100 to-base-200 rounded-2xl shadow-xl border border-base-300">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-xl text-base-content/70">No orders found</p>
          <p className="text-base-content/50 mt-2">Orders from sellers will appear here</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.seller_order_id} className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl shadow-2xl border border-base-300 overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b border-base-300">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg mr-3">
                        <span className="text-xl">📦</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-base-content">Order #{order.seller_order_id}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-base-content/80">
                            <span className="font-medium">Date:</span> {formatDate(order.order_date)}
                          </p>
                          <p className="text-base-content/80">
                            <span className="font-medium">Total:</span> 
                            <span className="ml-1 font-bold text-accent text-lg">${parseFloat(order.total_amount).toFixed(2)}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-4 py-2 rounded-full font-medium text-sm shadow-md ${
                      order.status === 'Pending' ? 'bg-warning/20 text-warning border border-warning/30' :
                      order.status === 'Approved' ? 'bg-success/20 text-success border border-success/30' :
                      order.status === 'Declined' ? 'bg-error/20 text-error border border-error/30' :
                      'bg-base-300 text-base-content border border-base-400'
                    }`}>
                      {order.status === 'Pending' && '🟡 '}
                      {order.status === 'Approved' && '✅ '}
                      {order.status === 'Declined' && '❌ '}
                      {order.status}
                    </span>
                    
                    {order.status === 'Pending' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApproveOrder(order.seller_order_id)}
                          className="px-5 py-2.5 bg-gradient-to-r from-success to-success-focus text-success-content rounded-xl font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center"
                        >
                          <span className="mr-2">✅</span> Approve
                        </button>
                        <button
                          onClick={() => handleDeclineOrder(order.seller_order_id)}
                          className="px-5 py-2.5 bg-gradient-to-r from-error to-error-focus text-error-content rounded-xl font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center"
                        >
                          <span className="mr-2">❌</span> Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 border-b border-base-300">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gradient-to-r from-info/20 to-info/10 rounded-lg mr-3">
                    <span className="text-xl">📜</span>
                  </div>
                  <h4 className="text-lg font-bold text-base-content">Order Items</h4>
                </div>
                
                <div className="space-y-3">
                  {order.SellerOrderItems?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-base-300/30 rounded-xl hover:bg-base-300/50 transition-colors">
                      <div className="flex-1">
                        <p className="font-bold text-lg text-base-content mb-1">
                          {item.SpecialistInventory?.Scroll?.scroll_name || 'Unknown Scroll'}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1 bg-info/20 text-info rounded-full text-sm font-medium">
                            Quality: {item.quality_rating}/5
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-base-content/70 text-sm">Quantity</p>
                        <p className="font-bold text-lg text-primary">{item.quantity}</p>
                        <p className="text-base-content/70 text-sm mt-2">Unit Price</p>
                        <p className="font-bold text-lg text-success">${parseFloat(item.unit_price).toFixed(2)}</p>
                        <p className="text-base-content/50 text-sm mt-1">
                          Subtotal: ${(parseFloat(item.unit_price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seller Info */}
              {order.User && (
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-gradient-to-r from-accent/20 to-accent/10 rounded-lg mr-3">
                      <span className="text-xl">👤</span>
                    </div>
                    <h4 className="text-lg font-bold text-base-content">Seller Information</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-base-300/30 rounded-xl">
                      <p className="text-sm text-base-content/70 mb-1">Username</p>
                      <p className="font-medium text-base-content">{order.User.username}</p>
                    </div>
                    <div className="p-4 bg-base-300/30 rounded-xl">
                      <p className="text-sm text-base-content/70 mb-1">Email</p>
                      <p className="font-medium text-base-content">{order.User.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}