import { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('Pending');
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      const response = await ordersAPI.getAll(filter);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const handleAccept = async (id: number) => {
    try {
      await ordersAPI.accept(id);
      loadOrders();
    } catch (error) {
      alert('Failed to accept order');
    }
  };

  const handleDecline = async (id: number) => {
    try {
      await ordersAPI.decline(id);
      loadOrders();
    } catch (error) {
      alert('Failed to decline order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-success/20 text-success border border-success/30';
      case 'Pending': return 'bg-warning/20 text-warning border border-warning/30';
      case 'Cancelled': return 'bg-error/20 text-error border border-error/30';
      default: return 'bg-base-300 text-base-content border border-base-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-6" data-theme="luxury">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate('/seller')}
          className="px-6 py-3 bg-gradient-to-r from-secondary to-secondary-focus text-secondary-content rounded-xl font-medium shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center"
        >
          <span className="mr-2">←</span> Back to Dashboard
        </button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Customer Orders
          </h1>
          <p className="text-base-content/70 mt-2">Manage orders from customers</p>
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
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-5 py-3 rounded-xl bg-base-300 border border-base-400 text-base-content font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="Pending">🟡 Pending Orders</option>
            <option value="Completed">✅ Completed Orders</option>
            <option value="Cancelled">❌ Cancelled Orders</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-gradient-to-r from-base-100 to-base-200 rounded-2xl shadow-2xl border border-base-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-base-300">
                <th className="px-6 py-4 text-left text-base-content font-bold">Order ID</th>
                <th className="px-6 py-4 text-left text-base-content font-bold">Customer</th>
                <th className="px-6 py-4 text-left text-base-content font-bold">Total Amount</th>
                <th className="px-6 py-4 text-left text-base-content font-bold">Status</th>
                <th className="px-6 py-4 text-left text-base-content font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300">
              {orders.map((order) => (
                <tr key={order.order_id} className="hover:bg-base-300/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-base-content">#{order.order_id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-gradient-to-r from-info/20 to-info/10 rounded-lg mr-3">
                        <span className="text-lg">👤</span>
                      </div>
                      <div>
                        <div className="font-bold text-base-content">{order.customer?.username}</div>
                        {order.customer?.email && (
                          <div className="text-sm text-base-content/70">{order.customer.email}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-2xl text-accent">${order.total_amount}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-2 rounded-full font-medium ${getStatusColor(order.status)}`}>
                      {order.status === 'Pending' && '🟡 '}
                      {order.status === 'Completed' && '✅ '}
                      {order.status === 'Cancelled' && '❌ '}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {order.status === 'Pending' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAccept(order.order_id)}
                          className="px-5 py-2.5 bg-gradient-to-r from-success to-success-focus text-success-content rounded-xl font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center"
                        >
                          <span className="mr-2">✅</span> Accept
                        </button>
                        <button
                          onClick={() => handleDecline(order.order_id)}
                          className="px-5 py-2.5 bg-gradient-to-r from-error to-error-focus text-error-content rounded-xl font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center"
                        >
                          <span className="mr-2">❌</span> Decline
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {orders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-xl text-base-content/70">No orders found</p>
            <p className="text-base-content/50 mt-2">Customer orders will appear here</p>
          </div>
        )}
      </div>

      {/* Detailed Order Cards */}
      <div className="mt-8 space-y-6">
        {orders.map((order) => (
          <div key={order.order_id} className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl shadow-xl border border-base-300 overflow-hidden">
            {/* Order Header */}
            <div className="p-6 border-b border-base-300">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg mr-3">
                      <span className="text-xl">📦</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-base-content">Order #{order.order_id}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="text-base-content/80">
                          Customer: <span className="font-semibold text-accent">{order.customer?.username}</span>
                        </div>
                        {order.order_date && (
                          <div className="text-base-content/80">
                            Date: {new Date(order.order_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-2xl text-accent mb-2">${order.total_amount}</div>
                  <span className={`px-4 py-2 rounded-full font-medium ${getStatusColor(order.status)}`}>
                    {order.status === 'Pending' && '🟡 '}
                    {order.status === 'Completed' && '✅ '}
                    {order.status === 'Cancelled' && '❌ '}
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-r from-info/20 to-info/10 rounded-lg mr-3">
                  <span className="text-xl">📜</span>
                </div>
                <h4 className="text-lg font-bold text-base-content">Order Items</h4>
              </div>
              
              {order.OrderItems && order.OrderItems.length > 0 ? (
                <div className="space-y-3">
                  {order.OrderItems.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-base-300/30 rounded-xl">
                      <div className="flex-1">
                        <div className="font-bold text-base-content mb-1">
                          {item.ShopInventory?.Scroll?.scroll_name || 'Unknown Scroll'}
                        </div>
                        <div className="text-sm text-base-content/70">
                          Unit Price: <span className="font-medium text-success">${item.unit_price}</span> • 
                          Quantity: <span className="font-medium text-info">{item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-base-content/70">Subtotal</div>
                        <div className="font-bold text-lg text-accent">
                          ${(item.unit_price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-base-content/70">
                  No items found in this order
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {order.status === 'Pending' && (
              <div className="p-6 border-t border-base-300 bg-gradient-to-r from-base-300/30 to-transparent">
                <div className="flex justify-center gap-6">
                  <button
                    onClick={() => handleAccept(order.order_id)}
                    className="px-8 py-3 bg-gradient-to-r from-success to-success-focus text-success-content rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center"
                  >
                    <span className="mr-3">✅</span> Accept Order
                  </button>
                  <button
                    onClick={() => handleDecline(order.order_id)}
                    className="px-8 py-3 bg-gradient-to-r from-error to-error-focus text-error-content rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center"
                  >
                    <span className="mr-3">❌</span> Decline Order
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}