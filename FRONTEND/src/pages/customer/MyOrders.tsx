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
      console.log('Loading orders with filter:', filter);
      const status = filter === 'all' ? undefined : filter;
      const response = await ordersAPI.getMyOrders(status);
      
      console.log('API Response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      console.log('Data type:', typeof response.data);
      console.log('Is array?', Array.isArray(response.data));
      
      if (Array.isArray(response.data)) {
        console.log('Number of orders:', response.data.length);
        if (response.data.length > 0) {
          console.log('First order:', response.data[0]);
          console.log('First order keys:', Object.keys(response.data[0]));
          console.log('First order items:', response.data[0].OrderItems);
        }
      }
      
      setOrders(response.data);
    } catch (error: any) {
      console.error('Failed to load orders:', error);
      console.error('Error response:', error.response?.data);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await ordersAPI.cancelMyOrder(orderId);
        alert('Order cancelled successfully!');
        loadOrders();
      } catch (error: any) {
        console.error('Failed to cancel order:', error);
        alert(error.response?.data?.error || 'Failed to cancel order');
      }
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
          onClick={() => navigate('/customer')}
          className="px-6 py-3 bg-gradient-to-r from-secondary to-secondary-focus text-secondary-content rounded-xl font-medium shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center"
        >
          <span className="mr-2">←</span> Back to Dashboard
        </button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Orders
          </h1>
          <p className="text-base-content/70 mt-2">View your magical scroll purchases</p>
        </div>
        
        <div className="w-28"></div> {/* Spacer for alignment */}
      </div>

      {/* Filter Buttons */}
      <div className="mb-8 bg-gradient-to-r from-base-100 to-base-200 rounded-2xl shadow-xl border border-base-300 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl mr-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-bold text-base-content">Filter Orders</h3>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2.5 rounded-xl font-medium shadow-md transition-all duration-300 ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-primary to-primary-focus text-primary-content shadow-lg' 
                  : 'bg-base-300 text-base-content hover:bg-base-400'
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setFilter('Pending')}
              className={`px-5 py-2.5 rounded-xl font-medium shadow-md transition-all duration-300 ${
                filter === 'Pending' 
                  ? 'bg-gradient-to-r from-warning to-warning-focus text-warning-content shadow-lg' 
                  : 'bg-base-300 text-base-content hover:bg-base-400'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('Completed')}
              className={`px-5 py-2.5 rounded-xl font-medium shadow-md transition-all duration-300 ${
                filter === 'Completed' 
                  ? 'bg-gradient-to-r from-success to-success-focus text-success-content shadow-lg' 
                  : 'bg-base-300 text-base-content hover:bg-base-400'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('Cancelled')}
              className={`px-5 py-2.5 rounded-xl font-medium shadow-md transition-all duration-300 ${
                filter === 'Cancelled' 
                  ? 'bg-gradient-to-r from-error to-error-focus text-error-content shadow-lg' 
                  : 'bg-base-300 text-base-content hover:bg-base-400'
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table (Desktop) */}
      <div className="bg-gradient-to-r from-base-100 to-base-200 rounded-2xl shadow-2xl border border-base-300 overflow-hidden mb-8 hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-base-300">
                <th className="px-6 py-4 text-left text-base-content font-bold">Order ID</th>
                <th className="px-6 py-4 text-left text-base-content font-bold">Date</th>
                <th className="px-6 py-4 text-left text-base-content font-bold">Items</th>
                <th className="px-6 py-4 text-left text-base-content font-bold">Total</th>
                <th className="px-6 py-4 text-left text-base-content font-bold">Status</th>
                <th className="px-6 py-4 text-left text-base-content font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300">
              {orders.map((order) => (
                <tr key={order.order_id} className="hover:bg-base-300/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-base-content">#{order.order_id}</td>
                  <td className="px-6 py-4 text-base-content">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-base-content/80">
                      {order.OrderItems?.length || 0} items
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-lg text-accent">${order.total_amount}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 text-sm rounded-full font-medium ${getStatusColor(order.status)}`}>
                      {order.status === 'Pending' && '🟡 '}
                      {order.status === 'Completed' && '✅ '}
                      {order.status === 'Cancelled' && '❌ '}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {order.status === 'Pending' && (
                      <button
                        onClick={() => handleCancelOrder(order.order_id)}
                        className="px-4 py-2 bg-gradient-to-r from-error to-error-focus text-error-content rounded-xl font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        Cancel
                      </button>
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
            <p className="text-base-content/50 mt-2">Your orders will appear here</p>
          </div>
        )}
      </div>

      {/* Orders Cards (Mobile/Tablet) */}
      <div className="space-y-6 lg:hidden">
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-r from-base-100 to-base-200 rounded-2xl shadow-xl border border-base-300">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-xl text-base-content/70">No orders found</p>
            <p className="text-base-content/50 mt-2">Your orders will appear here</p>
          </div>
        ) : (
          orders.map((order) => (
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
                        <div className="text-base-content/80 mt-1">
                          {new Date(order.order_date).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-2xl text-accent mb-2">${order.total_amount}</div>
                    <span className={`px-3 py-1.5 text-sm rounded-full font-medium ${getStatusColor(order.status)}`}>
                      {order.status === 'Pending' && '🟡 '}
                      {order.status === 'Completed' && '✅ '}
                      {order.status === 'Cancelled' && '❌ '}
                      {order.status}
                    </span>
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
                  {order.OrderItems?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-base-300/30 rounded-xl">
                      <div className="flex-1">
                        <div className="font-bold text-base-content mb-1">
                          {item.ShopInventory?.Scroll?.scroll_name}
                        </div>
                        <div className="text-sm text-base-content/70">
                          ${item.unit_price} × {item.quantity}
                        </div>
                      </div>
                      <div className="font-bold text-lg text-accent">
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {order.status === 'Pending' && (
                <div className="p-6">
                  <button
                    onClick={() => handleCancelOrder(order.order_id)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-error to-error-focus text-error-content rounded-xl font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    ❌ Cancel Order
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Additional Order Details (Desktop) */}
      <div className="hidden lg:grid grid-cols-1 gap-6 mt-8">
        {orders.map((order) => (
          <div key={order.order_id} className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl shadow-xl border border-base-300 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl mr-4">
                  <span className="text-2xl">📦</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-base-content">Order #{order.order_id} Details</h3>
                  <div className="text-base-content/80 mt-1">
                    Placed on {new Date(order.order_date).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-base-content/70">Total Amount</div>
                  <div className="font-bold text-2xl text-accent">${order.total_amount}</div>
                </div>
                <span className={`px-4 py-2 rounded-xl font-medium ${getStatusColor(order.status)}`}>
                  {order.status === 'Pending' && '🟡 '}
                  {order.status === 'Completed' && '✅ '}
                  {order.status === 'Cancelled' && '❌ '}
                  {order.status}
                </span>
                {order.status === 'Pending' && (
                  <button
                    onClick={() => handleCancelOrder(order.order_id)}
                    className="px-5 py-2.5 bg-gradient-to-r from-error to-error-focus text-error-content rounded-xl font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
            
            <div className="border-t border-base-300 pt-6">
              <h4 className="text-lg font-bold text-base-content mb-4">Items in this order:</h4>
              <div className="space-y-3">
                {order.OrderItems?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-base-300/30 rounded-xl hover:bg-base-300/50 transition-colors">
                    <div className="flex-1">
                      <div className="font-bold text-lg text-base-content mb-1">
                        {item.ShopInventory?.Scroll?.scroll_name}
                      </div>
                      <div className="text-base-content/70">
                        Unit Price: <span className="font-medium text-success">${item.unit_price}</span> • 
                        Quantity: <span className="font-medium text-info">{item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-base-content/70">Subtotal</div>
                      <div className="font-bold text-xl text-accent">
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </div>
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