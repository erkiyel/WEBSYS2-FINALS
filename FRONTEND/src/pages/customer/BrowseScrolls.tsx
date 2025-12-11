import { useState, useEffect } from 'react';
import { shopInventoryAPI, scrollsAPI, ordersAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function BrowseScrolls() {
  const [scrolls, setScrolls] = useState<any[]>([]);
  const [elements, setElements] = useState<any[]>([]);
  const [rarities, setRarities] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    element: '',
    rarity: '',
    search: '',
    minPrice: '',
    maxPrice: ''
  });
  const [cart, setCart] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadScrolls();
    loadFilters();
  }, []);

  const loadScrolls = async () => {
    try {
      const response = await shopInventoryAPI.getAll();
      
      const availableItems = response.data.filter((item: any) => 
        item.quantity > 0
      );
      
      const transformedItems = availableItems.map((item: any) => ({
        shop_inventory_id: item.shop_inventory_id,
        price: item.selling_price,
        quantity_available: item.quantity,
        scroll: {
          scroll_name: item.Scroll?.scroll_name,
          description: item.Scroll?.description,
          rarity: item.Scroll?.rarity,
          base_power: item.Scroll?.base_power,
          elements: item.Scroll?.Elements?.map((e: any) => e.element_name) || []
        },
        sourced_from: item.Specialist || { shop_name: 'Unknown Shop' }
      }));
      
      setScrolls(transformedItems);
    } catch (error) {
      console.error('Failed to load scrolls from shop inventory:', error);
      
      try {
        const response = await scrollsAPI.getAll(filters);
        setScrolls(response.data);
      } catch (fallbackError) {
        console.error('Failed to load scrolls from both sources:', fallbackError);
      }
    }
  };

  const loadFilters = async () => {
    try {
      const elementsResponse = await scrollsAPI.getFilters();
      setElements(elementsResponse.data);
      
      const raritiesResponse = await scrollsAPI.getRarities();
      setRarities(raritiesResponse.data);
    } catch (error) {
      console.error('Failed to load filters:', error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadScrolls();
  };

  const handleAddToCart = (item: any) => {
    setCart([...cart, { ...item, quantity: 1 }]);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    
    const orderItems = cart.map(item => ({
      shop_inventory_id: item.shop_inventory_id,
      quantity: item.quantity
    }));
    
    try {
      console.log('Creating order with items:', orderItems);
      
      const response = await ordersAPI.createOrder({
        items: orderItems
      });
      
      console.log('Order created successfully:', response.data);
      alert('Order placed successfully! Waiting for seller approval.');
      setCart([]);
      
    } catch (error: any) {
      console.error('Failed to place order:', error);
      alert(error.response?.data?.error || 'Failed to place order');
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
            Magical Scroll Emporium
          </h1>
          <p className="text-base-content/70 mt-2">Browse and purchase magical scrolls</p>
        </div>
        
        <div className="flex items-center">
          <div className="relative mr-4">
            <span className="absolute -top-2 -right-2 bg-error text-error-content text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {cart.length}
            </span>
            <div className="p-2 bg-gradient-to-r from-accent to-accent-focus rounded-xl">
              <span className="text-2xl">🛒</span>
            </div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search and Filters */}
          <div className="bg-gradient-to-r from-base-100 to-base-200 rounded-2xl shadow-2xl border border-base-300 p-6 mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="flex space-x-3">
                <input
                  type="text"
                  name="search"
                  placeholder="🔍 Search magical scrolls..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="flex-1 p-4 rounded-xl bg-base-300 border border-base-400 text-base-content placeholder-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button type="submit" className="px-6 py-4 bg-gradient-to-r from-primary to-primary-focus text-primary-content rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Search
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <select
                  name="element"
                  value={filters.element}
                  onChange={handleFilterChange}
                  className="p-3 rounded-xl bg-base-300 border border-base-400 text-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">🌌 All Elements</option>
                  {elements.map(element => (
                    <option key={element.element_id} value={element.element_name}>
                      {element.element_name}
                    </option>
                  ))}
                </select>
                
                <select
                  name="rarity"
                  value={filters.rarity}
                  onChange={handleFilterChange}
                  className="p-3 rounded-xl bg-base-300 border border-base-400 text-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">⭐ All Rarities</option>
                  {rarities.map(rarity => (
                    <option key={rarity} value={rarity}>{rarity}</option>
                  ))}
                </select>
                
                <input
                  type="number"
                  name="minPrice"
                  placeholder="💰 Min Price"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="p-3 rounded-xl bg-base-300 border border-base-400 text-base-content placeholder-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="💰 Max Price"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="p-3 rounded-xl bg-base-300 border border-base-400 text-base-content placeholder-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Scrolls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scrolls.map((item) => (
              <div key={item.shop_inventory_id} className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl shadow-xl border border-base-300 p-5 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                {/* Header with rarity */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-xl text-base-content">{item.scroll?.scroll_name}</h3>
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                    item.scroll?.rarity === 'Legendary' ? 'bg-gradient-to-r from-warning/20 to-warning/10 text-warning border border-warning/30' :
                    item.scroll?.rarity === 'Epic' ? 'bg-gradient-to-r from-accent/20 to-accent/10 text-accent border border-accent/30' :
                    item.scroll?.rarity === 'Rare' ? 'bg-gradient-to-r from-info/20 to-info/10 text-info border border-info/30' :
                    item.scroll?.rarity === 'Uncommon' ? 'bg-gradient-to-r from-success/20 to-success/10 text-success border border-success/30' :
                    'bg-gradient-to-r from-base-300 to-base-400 text-base-content border border-base-400'
                  }`}>
                    {item.scroll?.rarity}
                  </span>
                </div>
                
                {/* Description */}
                <p className="text-base-content/70 text-sm mb-4 line-clamp-2">{item.scroll?.description}</p>
                
                {/* Elements */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {item.scroll?.elements?.map((element: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {element}
                      </span>
                    )) || <span className="text-base-content/50">No elements</span>}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-base-300/30 p-3 rounded-lg">
                    <p className="text-xs text-base-content/70 mb-1">Power Level</p>
                    <p className="font-bold text-lg text-info">{item.scroll?.base_power}</p>
                  </div>
                  <div className="bg-base-300/30 p-3 rounded-lg">
                    <p className="text-xs text-base-content/70 mb-1">In Stock</p>
                    <p className="font-bold text-lg text-success">{item.quantity_available}</p>
                  </div>
                </div>
                
                {/* Source */}
                <div className="mb-4 p-3 bg-base-300/30 rounded-lg">
                  <p className="text-sm text-base-content/70 mb-1">Crafted by</p>
                  <p className="font-medium text-base-content flex items-center">
                    <span className="mr-2">🧙‍♂️</span>
                    {item.sourced_from?.shop_name}
                  </p>
                </div>
                
                {/* Price and Add to Cart */}
                <div className="flex justify-between items-center pt-4 border-t border-base-300">
                  <div>
                    <div className="font-bold text-2xl text-accent">${item.price}</div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="px-5 py-3 bg-gradient-to-r from-success to-success-focus text-success-content rounded-xl font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={item.quantity_available === 0}
                  >
                    {item.quantity_available === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shopping Cart Sidebar */}
        <div>
          <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl shadow-2xl border border-base-300 p-6 sticky top-6">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-r from-accent/20 to-accent/10 rounded-xl mr-4">
                <span className="text-2xl">🛒</span>
              </div>
              <h2 className="text-2xl font-bold text-base-content">Shopping Cart</h2>
            </div>
            
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-base-content/70">Your cart is empty</p>
                <p className="text-base-content/50 text-sm mt-2">Add some magical scrolls!</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-2">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-base-300/30 rounded-xl hover:bg-base-300/50 transition-colors">
                      <div className="flex-1">
                        <div className="font-bold text-base-content">{item.scroll?.scroll_name}</div>
                        <div className="text-sm text-base-content/70">
                          ${item.price} × {item.quantity}
                          <span className="ml-2 font-medium text-accent">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setCart(cart.filter((_, i) => i !== index))}
                        className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="pt-6 border-t border-base-300 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-base-content">Total:</span>
                    <span className="text-2xl font-bold text-accent">
                      ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handlePlaceOrder}
                  className="w-full px-6 py-4 bg-gradient-to-r from-primary to-primary-focus text-primary-content rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  ✨ Place Order
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}