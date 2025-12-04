import { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      const status = filter === 'all' ? undefined : filter;
      const response = await ordersAPI.getAll(status);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        // Implementation would call ordersAPI.cancel(orderId)
        console.log('Cancel order:', orderId);
        loadOrders();
      } catch (error) {
        console.error('Failed to cancel order:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button onClick={() => navigate('/customer')} className="mb-4 px-4 py-2 bg-gray-600 text-white rounded">
        Back to Dashboard
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('Pending')}
            className={`px-3 py-1 rounded ${filter === 'Pending' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('Completed')}
            className={`px-3 py-1 rounded ${filter === 'Completed' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('Cancelled')}
            className={`px-3 py-1 rounded ${filter === 'Cancelled' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Cancelled
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Order ID</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Items</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td className="px-6 py-4">#{order.order_id}</td>
                <td className="px-6 py-4">
                  {new Date(order.order_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">
                    {order.OrderItems?.length || 0} items
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold">${order.total_amount}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {order.status === 'Pending' && (
                    <button
                      onClick={() => handleCancelOrder(order.order_id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders found
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div key={order.order_id} className="bg-white rounded shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold">Order #{order.order_id}</h3>
                <div className="text-sm text-gray-600">
                  {new Date(order.order_date).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="font-bold text-lg">${order.total_amount}</div>
                <span className={`px-2 py-1 text-xs rounded ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                {order.status === 'Pending' && (
                  <button
                    onClick={() => handleCancelOrder(order.order_id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-bold mb-2">Items:</h4>
              <div className="space-y-2">
                {order.OrderItems?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-bold">{item.ShopInventory?.Scroll?.scroll_name}</div>
                      <div className="text-sm text-gray-600">
                        ${item.unit_price} × {item.quantity}
                      </div>
                    </div>
                    <div className="font-bold">
                      ${(item.unit_price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}