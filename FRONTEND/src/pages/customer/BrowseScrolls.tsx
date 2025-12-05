import { useState, useEffect } from 'react';
import { scrollsAPI } from '../../services/api';
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
      const response = await scrollsAPI.getAll(filters);
      setScrolls(response.data);
    } catch (error) {
      console.error('Failed to load scrolls:', error);
    }
  };

  const loadFilters = async () => {
    try {
      const elementsResponse = await scrollsAPI.getFilters();
      const raritiesResponse = await scrollsAPI.getRarities();
      setElements(elementsResponse.data);
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

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    
    const orderItems = cart.map(item => ({
      shop_inventory_id: item.shop_inventory_id,
      quantity: item.quantity
    }));
    
    // Implementation would call ordersAPI.create(orderItems)
    console.log('Placing order:', orderItems);
    alert('Order placed successfully!');
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button onClick={() => navigate('/customer')} className="mb-4 px-4 py-2 bg-gray-600 text-white rounded">
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white p-4 rounded shadow mb-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="search"
                  placeholder="Search scrolls..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="flex-1 p-2 border rounded"
                />
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Search
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <select
                  name="element"
                  value={filters.element}
                  onChange={handleFilterChange}
                  className="p-2 border rounded"
                >
                  <option value="">All Elements</option>
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
                  className="p-2 border rounded"
                >
                  <option value="">All Rarities</option>
                  {rarities.map(rarity => (
                    <option key={rarity} value={rarity}>{rarity}</option>
                  ))}
                </select>
                
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="p-2 border rounded"
                />
                
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="p-2 border rounded"
                />
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scrolls.map((item) => (
              <div key={item.shop_inventory_id} className="bg-white rounded shadow p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{item.scroll?.scroll_name}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${
                    item.scroll?.rarity === 'Legendary' ? 'bg-yellow-100 text-yellow-800' :
                    item.scroll?.rarity === 'Epic' ? 'bg-purple-100 text-purple-800' :
                    item.scroll?.rarity === 'Rare' ? 'bg-blue-100 text-blue-800' :
                    item.scroll?.rarity === 'Uncommon' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.scroll?.rarity}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">{item.scroll?.description}</p>
                
                <div className="mb-2">
                  <span className="font-bold">Elements: </span>
                  {item.scroll?.elements?.join(', ') || 'None'}
                </div>
                
                <div className="mb-2">
                  <span className="font-bold">Power: </span>
                  {item.scroll?.base_power}
                </div>
                
                <div className="mb-2">
                  <span className="font-bold">From: </span>
                  {item.sourced_from?.shop_name}
                  <span className="text-sm text-gray-600 ml-2">
                    ({item.sourced_from?.specialty} specialist)
                  </span>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <div className="font-bold text-xl">${item.price}</div>
                    <div className="text-sm text-gray-500">Stock: {item.quantity_available}</div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    disabled={item.quantity_available === 0}
                  >
                    {item.quantity_available === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="bg-white rounded shadow p-4 sticky top-6">
            <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
            
            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-bold">{item.scroll?.scroll_name}</div>
                        <div className="text-sm text-gray-600">${item.price} × {item.quantity}</div>
                      </div>
                      <button
                        onClick={() => setCart(cart.filter((_, i) => i !== index))}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="font-bold text-lg mb-4">
                  Total: ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                </div>
                
                <button
                  onClick={handlePlaceOrder}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Place Order
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}