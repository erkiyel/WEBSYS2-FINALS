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
    <div className="min-h-screen bg-gray-100 p-6" data-theme="luxury">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate('/specialist')}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold">Seller Orders</h1>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded bg-white"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Declined">Declined</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 bg-white rounded shadow">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.seller_order_id} className="bg-white rounded shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">Order #{order.seller_order_id}</h3>
                  <p className="text-gray-600">
                    Date: {formatDate(order.order_date)}
                  </p>
                  <p className="text-gray-600">
                    Total: ${parseFloat(order.total_amount).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    order.status === 'Declined' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                  {order.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleApproveOrder(order.seller_order_id)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeclineOrder(order.seller_order_id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Decline
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4">
                <h4 className="font-bold mb-2">Items:</h4>
                <div className="space-y-2">
                  {order.SellerOrderItems?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">
                          {item.SpecialistInventory?.Scroll?.scroll_name || 'Unknown Scroll'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quality: {item.quality_rating}/5
                        </p>
                      </div>
                      <div className="text-right">
                        <p>Qty: {item.quantity}</p>
                        <p>${parseFloat(item.unit_price).toFixed(2)} each</p>
                        <p className="font-medium">
                          ${(parseFloat(item.unit_price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seller Info */}
              {order.User && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-bold mb-2">Seller Information:</h4>
                  <p>Username: {order.User.username}</p>
                  <p>Email: {order.User.email}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}