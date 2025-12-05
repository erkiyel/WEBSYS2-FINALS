import { useState, useEffect } from 'react';
import { specialistsAPI, scrollsAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface InventoryItem {
  specialist_inventory_id: number;
  scroll_id: number;
  Scroll: {
    scroll_id: number;
    scroll_name: string;
    description: string;
    rarity: string;
    base_power: number;
    Elements: Array<{ element_name: string }>;
  };
  stock_quantity: number;
  source_price: number;
  quality_rating: number;
  is_specialty: boolean;
  last_updated: string;
}

interface Scroll {
  scroll_id: number;
  scroll_name: string;
  description: string;
  rarity: string;
  base_power: number;
  Elements: Array<{ element_name: string }>;
}

export default function MyInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [scrolls, setScrolls] = useState<Scroll[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingScrolls, setLoadingScrolls] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    scroll_id: '',
    stock_quantity: '',
    source_price: '',
    quality_rating: '',
    is_specialty: false
  });

  useEffect(() => {
    loadInventory();
    loadAllScrolls();
  }, []);

  const loadInventory = async () => {
    try {
      const response = await specialistsAPI.getInventory();
      setInventory(response.data || []);
    } catch (err: any) {
      setError('Failed to load inventory. Please check your specialist profile.');
      console.error('Inventory error:', err.response?.data);
    }
  };

  const loadAllScrolls = async () => {
    try {
      setLoadingScrolls(true);
      const response = await scrollsAPI.getAllScrolls();
      setScrolls(response.data || []);
    } catch (err: any) {
      console.error('Scrolls error:', err.response?.data);
      // Fallback: create a list of scrolls based on IDs 1-15
      setScrolls(Array.from({length: 15}, (_, i) => ({
        scroll_id: i + 1,
        scroll_name: `Scroll ${i + 1}`,
        description: 'A magical scroll',
        rarity: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'][i % 5],
        base_power: (i + 1) * 10,
        Elements: []
      })));
    } finally {
      setLoadingScrolls(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  // Validation
  if (!formData.scroll_id || !formData.stock_quantity || !formData.source_price || !formData.quality_rating) {
    setError('All fields are required');
    setLoading(false);
    return;
  }

  try {
    // Check if scroll already exists in inventory
    const scrollIdNum = parseInt(formData.scroll_id);
    const existingItem = inventory.find(item => item.scroll_id === scrollIdNum);
    
    if (existingItem) {
      // If exists, ask user if they want to add stock instead
      const shouldAdd = window.confirm(
        `Scroll "${selectedScroll?.scroll_name}" is already in your inventory (ID: ${existingItem.specialist_inventory_id}).\n\n` +
        'Would you like to add stock to the existing item instead?'
      );
      
      if (shouldAdd) {
        // Add stock to existing item
        await specialistsAPI.addStock(existingItem.specialist_inventory_id, { 
          quantity: parseInt(formData.stock_quantity) 
        });
        
        // Reset form
        setFormData({
          scroll_id: '',
          stock_quantity: '',
          source_price: '',
          quality_rating: '',
          is_specialty: false
        });
        setShowForm(false);
        loadInventory();
        setLoading(false);
        return;
      } else {
        setError('This scroll is already in your inventory. Please select a different scroll or add stock to the existing one.');
        setLoading(false);
        return;
      }
    }

    // If not exists, add new item
    await specialistsAPI.addInventory({
      scroll_id: scrollIdNum,
      stock_quantity: parseInt(formData.stock_quantity),
      source_price: parseFloat(formData.source_price),
      quality_rating: parseFloat(formData.quality_rating),
      is_specialty: formData.is_specialty
    });

    // Reset form
    setFormData({
      scroll_id: '',
      stock_quantity: '',
      source_price: '',
      quality_rating: '',
      is_specialty: false
    });
    setShowForm(false);
    loadInventory();
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to add item';
    setError(errorMessage);
    console.error('Add error:', err.response?.data);
  } finally {
    setLoading(false);
  }
};

  const handleAddStock = async (id: number) => {
    const quantity = prompt('How many to add?');
    if (quantity && parseInt(quantity) > 0) {
      try {
        await specialistsAPI.addStock(id, { quantity: parseInt(quantity) });
        loadInventory();
      } catch (err: any) {
        alert(err.response?.data?.error || 'Failed to add stock');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Remove this item from inventory?')) {
      try {
        await specialistsAPI.deleteInventory(id);
        loadInventory();
      } catch (err: any) {
        alert(err.response?.data?.error || 'Failed to remove item');
      }
    }
  };

  const rarityColors: Record<string, string> = {
    Common: 'badge-outline',
    Uncommon: 'badge-info',
    Rare: 'badge-primary',
    Epic: 'badge-secondary',
    Legendary: 'badge-warning',
    'Mythic': 'badge-accent'
  };

  // Get selected scroll details for preview
  const selectedScroll = scrolls.find(s => s.scroll_id === parseInt(formData.scroll_id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-300 p-4 md:p-6" data-theme="luxury">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/specialist')}
            className="btn btn-ghost hover:bg-primary/10 mb-4"
          >
            ← Back to Dashboard
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                My Inventory
              </h1>
              <p className="text-base-content/70 mt-2">Manage your magical scroll collection</p>
            </div>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {showForm ? '✕ Cancel' : '📜 Add Scroll'}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error shadow-lg mb-6 animate-fadeIn">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
            <button className="btn btn-sm btn-ghost" onClick={() => setError('')}>Dismiss</button>
          </div>
        )}

        {/* Add Form */}
        {showForm && (
          <div className="card bg-base-100 shadow-2xl border border-primary/20 mb-8 animate-fadeIn">
            <div className="card-body p-6 md:p-8">
              <h2 className="card-title text-2xl mb-6">Add New Scroll to Inventory</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Scroll Selection */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Select Scroll</span>
                    </label>
                    <select
                      className="select select-bordered w-full focus:select-primary"
                      value={formData.scroll_id}
                      onChange={(e) => setFormData({...formData, scroll_id: e.target.value})}
                      required
                      disabled={loadingScrolls}
                    >
                      <option value="">Choose a scroll...</option>
                      {loadingScrolls ? (
                        <option disabled>Loading scrolls...</option>
                      ) : (
                        scrolls.map((scroll) => (
                          <option key={scroll.scroll_id} value={scroll.scroll_id}>
                            {scroll.scroll_name} ({scroll.rarity})
                          </option>
                        ))
                      )}
                    </select>
                    {loadingScrolls && (
                      <div className="mt-2">
                        <span className="loading loading-spinner loading-xs"></span>
                        <span className="text-sm ml-2">Loading scrolls...</span>
                      </div>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Stock Quantity</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full focus:input-primary"
                      placeholder="Enter quantity"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                      required
                      min="1"
                    />
                  </div>

                  {/* Price */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Source Price ($)</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="input input-bordered w-full focus:input-primary"
                      placeholder="9.99"
                      value={formData.source_price}
                      onChange={(e) => setFormData({...formData, source_price: e.target.value})}
                      required
                      min="0.01"
                    />
                  </div>

                  {/* Quality */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Quality Rating (0-10)</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="input input-bordered w-full focus:input-primary"
                      placeholder="7.5"
                      value={formData.quality_rating}
                      onChange={(e) => setFormData({...formData, quality_rating: e.target.value})}
                      required
                      min="0"
                      max="10"
                    />
                    <div className="mt-2">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={formData.quality_rating || 5}
                        onChange={(e) => setFormData({...formData, quality_rating: e.target.value})}
                        className="range range-xs range-primary"
                      />
                      <div className="w-full flex justify-between text-xs px-2">
                        <span>0</span>
                        <span>5</span>
                        <span>10</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scroll Preview */}
                {selectedScroll && (
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                    <h4 className="font-bold text-lg mb-2">Selected Scroll Preview:</h4>
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-lg">
                        <span className="text-2xl">📜</span>
                      </div>
                      <div>
                        <div className="font-bold">{selectedScroll.scroll_name}</div>
                        <div className="text-sm opacity-70">{selectedScroll.description}</div>
                        <div className="flex gap-2 mt-2">
                          <div className={`badge ${rarityColors[selectedScroll.rarity] || 'badge-outline'}`}>
                            {selectedScroll.rarity}
                          </div>
                          <div className="badge badge-outline">Power: {selectedScroll.base_power}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Specialty Checkbox */}
                <div className="form-control">
                  <label className="cursor-pointer label justify-start gap-3 p-0">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-lg"
                      checked={formData.is_specialty}
                      onChange={(e) => setFormData({...formData, is_specialty: e.target.checked})}
                    />
                    <span className="label-text text-lg">Mark as specialty item (will be highlighted)</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`btn btn-primary btn-lg w-full ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Adding...' : '✨ Add to Inventory'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Inventory Stats */}
        <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 mb-8">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Unique Scrolls</div>
            <div className="stat-value text-primary">{inventory.length}</div>
            <div className="stat-desc">Different scroll types</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="stat-title">Total Stock</div>
            <div className="stat-value text-secondary">
              {inventory.reduce((sum, item) => sum + item.stock_quantity, 0)}
            </div>
            <div className="stat-desc">Total units in stock</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Avg Quality</div>
            <div className="stat-value text-accent">
              {inventory.length > 0 
                ? (inventory.reduce((sum, item) => sum + item.quality_rating, 0) / inventory.length).toFixed(1)
                : '0.0'
              }
            </div>
            <div className="stat-desc">Average quality rating</div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="card bg-base-100 shadow-2xl border border-primary/10">
          <div className="card-body p-4 md:p-6">
            <h2 className="card-title text-2xl mb-6">Scroll Collection</h2>
            
            {inventory.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block p-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mb-4">
                  <span className="text-6xl">📜</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Your inventory is empty</h3>
                <p className="text-base-content/70 mb-6 max-w-md mx-auto">
                  Start by adding magical scrolls to your inventory. Sellers will be able to purchase from you.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary btn-lg gap-2"
                >
                  <span>+</span>
                  Add First Scroll
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl">
                <table className="table table-zebra">
                  <thead className="bg-base-300">
                    <tr>
                      <th className="text-lg font-bold">Scroll Details</th>
                      <th className="text-lg font-bold">Stock</th>
                      <th className="text-lg font-bold">Price</th>
                      <th className="text-lg font-bold">Quality</th>
                      <th className="text-lg font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.specialist_inventory_id} className="hover:bg-primary/5 transition-colors duration-200">
                        <td>
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${item.is_specialty ? 'bg-gradient-to-br from-warning to-orange-500' : 'bg-gradient-to-br from-primary to-secondary'}`}>
                              <span className="text-2xl">📜</span>
                            </div>
                            <div>
                              <div className="font-bold text-lg">{item.Scroll.scroll_name}</div>
                              <div className="text-sm opacity-70 line-clamp-1 max-w-xs">
                                {item.Scroll.description}
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <div className={`badge ${rarityColors[item.Scroll.rarity] || 'badge-outline'}`}>
                                  {item.Scroll.rarity}
                                </div>
                                {item.Scroll.Elements?.map((el, idx) => (
                                  <div key={idx} className="badge badge-outline">
                                    {el.element_name}
                                  </div>
                                ))}
                                {item.is_specialty && (
                                  <div className="badge badge-warning gap-1">
                                    <span>✨</span>
                                    Specialty
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td>
                          <div className={`text-2xl font-bold ${
                            item.stock_quantity < 5 ? 'text-error' :
                            item.stock_quantity < 20 ? 'text-warning' :
                            'text-success'
                          }`}>
                            {item.stock_quantity}
                          </div>
                          <div className="text-sm opacity-70">units available</div>
                          {item.stock_quantity < 10 && (
                            <div className="text-xs text-warning mt-1">⚠️ Low stock</div>
                          )}
                        </td>
                        
                        <td>
                          <div className="text-2xl font-bold text-primary">
                            ${item.source_price.toFixed(2)}
                          </div>
                          <div className="text-sm opacity-70">per unit</div>
                        </td>
                        
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="rating rating-md">
                              {[1,2,3,4,5].map((star) => (
                                <input
                                  key={star}
                                  type="radio"
                                  name={`rating-${item.specialist_inventory_id}`}
                                  className="mask mask-star-2 bg-warning"
                                  checked={Math.floor(item.quality_rating / 2) === star}
                                  readOnly
                                />
                              ))}
                            </div>
                            <div>
                              <div className="font-bold text-lg">{item.quality_rating.toFixed(1)}</div>
                              <div className="text-xs opacity-70">out of 10</div>
                            </div>
                          </div>
                        </td>
                        
                        <td>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleAddStock(item.specialist_inventory_id)}
                              className="btn btn-primary btn-sm shadow hover:shadow-md"
                            >
                              + Add Stock
                            </button>
                            <button
                              onClick={() => handleDelete(item.specialist_inventory_id)}
                              className="btn btn-error btn-outline btn-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}