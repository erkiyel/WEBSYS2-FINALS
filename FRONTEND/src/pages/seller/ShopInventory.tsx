import { useState, useEffect } from 'react';
import { shopInventoryAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function ShopInventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadInventory();
    loadStats();
  }, []);

  const loadInventory = async () => {
    try {
      const response = await shopInventoryAPI.getAll();
      setInventory(response.data);
    } catch (error) {
      console.error('Failed to load inventory:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await shopInventoryAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      try {
        await shopInventoryAPI.delete(id);
        loadInventory();
      } catch (error) {
        alert('Cannot delete item with pending orders');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button onClick={() => navigate('/seller')} className="mb-4 px-4 py-2 bg-gray-600 text-white rounded">
        Back to Dashboard
      </button>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">Total Items</h3>
            <p className="text-2xl">{stats.totalItems}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">Total Stock</h3>
            <p className="text-2xl">{stats.totalStock}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">Total Value</h3>
            <p className="text-2xl">${stats.totalValue}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">Low Stock</h3>
            <p className="text-2xl">{stats.lowStockCount}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Scroll Name</th>
              <th className="px-6 py-3 text-left">Quantity</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr key={item.shop_inventory_id}>
                <td className="px-6 py-4">{item.Scroll?.scroll_name}</td>
                <td className="px-6 py-4">{item.quantity}</td>
                <td className="px-6 py-4">${item.selling_price}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(item.shop_inventory_id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}