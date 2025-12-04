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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button onClick={() => navigate('/seller')} className="mb-4 px-4 py-2 bg-gray-600 text-white rounded">
        Back to Dashboard
      </button>

      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Order ID</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td className="px-6 py-4">{order.order_id}</td>
                <td className="px-6 py-4">{order.customer?.username}</td>
                <td className="px-6 py-4">${order.total_amount}</td>
                <td className="px-6 py-4">{order.status}</td>
                <td className="px-6 py-4">
                  {order.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleAccept(order.order_id)}
                        className="mr-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(order.order_id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Decline
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}