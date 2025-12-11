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
    <div className="min-h-screen p-6" data-theme="luxury">
      <button 
        onClick={() => navigate('/seller')} 
        className="mb-4 px-4 py-2 bg-neutral text-neutral-content rounded-lg hover:opacity-90 transition-opacity"
      >
        Back to Dashboard
      </button>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-base-100 p-4 rounded-lg shadow-lg border border-base-300">
            <h3 className="font-bold text-base-content">Total Items</h3>
            <p className="text-2xl text-primary">{stats.totalItems}</p>
          </div>
          <div className="bg-base-100 p-4 rounded-lg shadow-lg border border-base-300">
            <h3 className="font-bold text-base-content">Total Stock</h3>
            <p className="text-2xl text-primary">{stats.totalStock}</p>
          </div>
          <div className="bg-base-100 p-4 rounded-lg shadow-lg border border-base-300">
            <h3 className="font-bold text-base-content">Total Value</h3>
            <p className="text-2xl text-primary">${stats.totalValue}</p>
          </div>
          <div className="bg-base-100 p-4 rounded-lg shadow-lg border border-base-300">
            <h3 className="font-bold text-base-content">Low Stock</h3>
            <p className="text-2xl text-warning">{stats.lowStockCount}</p>
          </div>
        </div>
      )}

      <div className="bg-base-100 rounded-lg shadow-lg overflow-hidden border border-base-300">
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* Head */}
            <thead>
              <tr className="bg-base-200">
                <th className="text-base-content">Scroll Name</th>
                <th className="text-base-content">Quantity</th>
                <th className="text-base-content">Price</th>
                <th className="text-base-content">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Rows */}
              {inventory.map((item) => (
                <tr key={item.shop_inventory_id} className="hover:bg-base-200">
                  <td className="text-base-content">{item.Scroll?.scroll_name}</td>
                  <td className="text-base-content">{item.quantity}</td>
                  <td className="text-base-content">${item.selling_price}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(item.shop_inventory_id)}
                      className="btn btn-error btn-sm text-error-content"
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
    </div>
  );
}