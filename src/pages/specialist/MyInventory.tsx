import { useState, useEffect } from 'react';
import { specialistsAPI, scrollsAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface InventoryFormData {
  scroll_id: string;
  stock_quantity: string;
  source_price: string;
  quality_rating: string;
  is_specialty: boolean;
}

interface Scroll {
  scroll_id: number;
  scroll_name: string;
  rarity: string;
  description?: string;
  base_power?: number;
}

export default function MyInventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [formData, setFormData] = useState<InventoryFormData>({
    scroll_id: '',
    stock_quantity: '',
    source_price: '',
    quality_rating: '',
    is_specialty: false
  });
  const [scrolls, setScrolls] = useState<Scroll[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadInventory();
    loadScrolls();
  }, []);

  const loadInventory = async () => {
    try {
      const response = await specialistsAPI.getInventory();
      setInventory(response.data);
    } catch (error) {
      console.error('Failed to load inventory:', error);
      setError('Failed to load inventory');
    }
  };

  const loadScrolls = async () => {
    try {
      // Try to load scrolls from API
      const response = await scrollsAPI.getAll();
      if (response.data && response.data.length > 0) {
        const scrollsList = response.data.map((scroll: any) => ({
          scroll_id: scroll.scroll_id,
          scroll_name: scroll.scroll_name,
          rarity: scroll.rarity
        }));
        setScrolls(scrollsList);
      } else {
        // Fallback dummy data if API fails
        setScrolls([
          { scroll_id: 1, scroll_name: 'Fireball Scroll', rarity: 'Common' },
          { scroll_id: 2, scroll_name: 'Ice Blast Scroll', rarity: 'Uncommon' },
          { scroll_id: 3, scroll_name: 'Lightning Storm Scroll', rarity: 'Rare' },
          { scroll_id: 4, scroll_name: 'Earthquake Scroll', rarity: 'Epic' },
          { scroll_id: 5, scroll_name: 'Divine Intervention Scroll', rarity: 'Legendary' },
        ]);
      }
    } catch (error) {
      console.error('Failed to load scrolls:', error);
      // Fallback dummy data
      setScrolls([
        { scroll_id: 1, scroll_name: 'Fireball Scroll', rarity: 'Common' },
        { scroll_id: 2, scroll_name: 'Ice Blast Scroll', rarity: 'Uncommon' },
        { scroll_id: 3, scroll_name: 'Lightning Storm Scroll', rarity: 'Rare' },
        { scroll_id: 4, scroll_name: 'Earthquake Scroll', rarity: 'Epic' },
        { scroll_id: 5, scroll_name: 'Divine Intervention Scroll', rarity: 'Legendary' },
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Validate form data
      if (!formData.scroll_id || !formData.stock_quantity || !formData.source_price || !formData.quality_rating) {
        setError('All fields are required');
        return;
      }
      
      const dataToSend = {
        scroll_id: parseInt(formData.scroll_id),
        stock_quantity: parseInt(formData.stock_quantity),
        source_price: parseFloat(formData.source_price),
        quality_rating: parseFloat(formData.quality_rating),
        is_specialty: formData.is_specialty
      };
      
      await specialistsAPI.addInventory(dataToSend);
      setShowForm(false);
      loadInventory();
      // Reset form
      setFormData({
        scroll_id: '',
        stock_quantity: '',
        source_price: '',
        quality_rating: '',
        is_specialty: false
      });
    } catch (error: any) {
      console.error('Failed to add inventory:', error);
      setError(error.response?.data?.error || 'Failed to add inventory');
    }
  };

  const handleAddStock = async (id: number) => {
    const quantity = prompt('Enter quantity to add:');
    if (quantity && parseInt(quantity) > 0) {
      try {
        await specialistsAPI.addStock(id, { quantity: parseInt(quantity) });
        loadInventory();
      } catch (error) {
        console.error('Failed to add stock:', error);
        alert('Failed to add stock');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      try {
        await specialistsAPI.deleteInventory(id);
        loadInventory();
      } catch (error) {
        console.error('Failed to delete inventory:', error);
        alert('Failed to delete inventory item');
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button onClick={() => navigate('/specialist')} className="mb-4 px-4 py-2 bg-gray-600 text-white rounded">
        Back to Dashboard
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Inventory</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add New Scroll'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Scroll to Inventory</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Scroll</label>
                <select
                  name="scroll_id"
                  value={formData.scroll_id}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Scroll</option>
                  {scrolls.map(scroll => (
                    <option key={scroll.scroll_id} value={scroll.scroll_id}>
                      {scroll.scroll_name} ({scroll.rarity})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                <input
                  type="number"
                  name="stock_quantity"
                  placeholder="Stock Quantity"
                  value={formData.stock_quantity}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  required
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Source Price</label>
                <input
                  type="number"
                  name="source_price"
                  step="0.01"
                  placeholder="Source Price"
                  value={formData.source_price}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  required
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Quality Rating (0-10)</label>
                <input
                  type="number"
                  name="quality_rating"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="Quality Rating"
                  value={formData.quality_rating}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_specialty"
                checked={formData.is_specialty}
                onChange={handleFormChange}
                className="rounded"
              />
              <span className="text-sm">Is Specialty Item</span>
            </label>
            
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Add to Inventory
            </button>
          </form>
        </div>
      )}

      {inventory.length === 0 ? (
        <div className="bg-white rounded shadow p-8 text-center">
          <p className="text-gray-500">No inventory items found</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Your First Scroll
          </button>
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Scroll Name</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Quality</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventory.map((item) => (
                <tr key={item.inventory_id}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-bold">{item.Scroll?.scroll_name}</div>
                      <div className="text-sm text-gray-500">{item.Scroll?.rarity}</div>
                      {item.is_specialty && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                          Specialty
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${
                      item.stock_quantity < 10 ? 'text-red-600' : 
                      item.stock_quantity < 20 ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {item.stock_quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">${parseFloat(item.source_price).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${
                      item.quality_rating >= 8 ? 'bg-green-100 text-green-800' :
                      item.quality_rating >= 6 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.quality_rating}/10
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleAddStock(item.inventory_id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Add Stock
                    </button>
                    <button
                      onClick={() => handleDelete(item.inventory_id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}