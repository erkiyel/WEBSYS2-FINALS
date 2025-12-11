import { useState, useEffect } from 'react';
import { specialistsAPI, sellerOrdersAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function PurchaseFromSpecialist() {
  const [specialists, setSpecialists] = useState<any[]>([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadSpecialists();
  }, []);

  const loadSpecialists = async () => {
    try {
      const response = await specialistsAPI.getAll();
      setSpecialists(response.data);
    } catch (error) {
      console.error('Failed to load specialists:', error);
    }
  };

  const loadInventory = async (specialistId: number) => {
    try {
      const response = await specialistsAPI.getInventory(specialistId);
      setInventory(response.data);
    } catch (error) {
      console.error('Failed to load inventory:', error);
    }
  };

  const handleSpecialistSelect = (specialist: any) => {
    setSelectedSpecialist(specialist);
    loadInventory(specialist.specialist_id);
    setSelectedItems([]);
  };

  const handleAddItem = (item: any) => {
    setSelectedItems([...selectedItems, {
      specialist_inventory_id: item.specialist_inventory_id,
      quantity: 1,
      unit_price: item.source_price,
      scroll_name: item.Scroll.scroll_name
    }]);
  };

  const handleSubmitOrder = async () => {
    if (!selectedSpecialist || selectedItems.length === 0) {
      alert('Please select specialist and items');
      return;
    }

    const orderData = {
      specialist_id: selectedSpecialist.specialist_id,
      items: selectedItems
    };

    console.log('Submitting order with data:', orderData);
    console.log('Selected items details:', selectedItems);

    try {
      const response = await sellerOrdersAPI.create(orderData);
      console.log('Order response:', response);
      alert('Order placed successfully');
      setSelectedItems([]);
    } catch (error: any) {
      console.error('Order submission error details:', error);
      console.error('Error response:', error.response?.data);
      alert('Failed to place order: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-base-200 to-base-300" data-theme="luxury">
      <button 
        onClick={() => navigate('/seller')} 
        className="mb-6 px-5 py-2.5 bg-gradient-to-r from-secondary to-secondary-focus text-secondary-content rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
      >
        ← Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Specialists Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-primary bg-base-100 py-3 px-4 rounded-lg shadow-md border-l-4 border-accent">
            Specialists
          </h2>
          <div className="space-y-4">
            {specialists.map((specialist) => (
              <div
                key={specialist.specialist_id}
                onClick={() => handleSpecialistSelect(specialist)}
                className={`p-5 rounded-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                  selectedSpecialist?.specialist_id === specialist.specialist_id 
                    ? 'bg-gradient-to-r from-primary/20 to-primary/10 border-2 border-primary shadow-lg' 
                    : 'bg-gradient-to-r from-base-100 to-base-200 border border-base-300 hover:shadow-lg'
                }`}
              >
                <h3 className="font-bold text-xl text-primary mb-1">{specialist.shop_name}</h3>
                <p className="text-base-content/80">
                  <span className="font-medium">Specialty:</span> {specialist.specialtyElement?.element_name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Available Scrolls Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-primary bg-base-100 py-3 px-4 rounded-lg shadow-md border-l-4 border-accent">
            Available Scrolls
          </h2>
          {selectedSpecialist ? (
            <div className="space-y-4">
              {inventory.map((item) => (
                <div key={item.specialist_inventory_id} className="p-5 bg-gradient-to-r from-base-100 to-base-200 rounded-xl shadow-md border border-base-300">
                  <h3 className="font-bold text-xl text-accent mb-2">{item.Scroll.scroll_name}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-base-300/50 p-3 rounded-lg">
                      <p className="text-sm text-base-content/70">Stock</p>
                      <p className="font-bold text-lg text-info">{item.stock_quantity}</p>
                    </div>
                    <div className="bg-base-300/50 p-3 rounded-lg">
                      <p className="text-sm text-base-content/70">Price</p>
                      <p className="font-bold text-lg text-success">${item.source_price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddItem(item)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-accent to-accent-focus text-accent-content rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                  >
                    🛒 Add to Order
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-gradient-to-r from-base-100 to-base-200 rounded-xl shadow-md border border-base-300 text-center">
              <div className="text-5xl mb-4">🔮</div>
              <p className="text-xl text-base-content/70">Select a specialist to view their magical scrolls</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary */}
      {selectedItems.length > 0 && (
        <div className="mt-10 p-7 bg-gradient-to-r from-base-100 to-base-200 rounded-2xl shadow-xl border border-base-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">📦 Order Summary</h2>
            <span className="px-4 py-2 bg-primary/20 text-primary rounded-full font-medium">
              {selectedItems.length} Item{selectedItems.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="space-y-3 mb-8">
            {selectedItems.map((item, index) => (
              <div 
                key={`${item.specialist_inventory_id}-${index}`} 
                className="flex justify-between items-center p-4 bg-base-300/30 rounded-lg hover:bg-base-300/50 transition-colors"
              >
                <div>
                  <span className="font-bold text-lg text-base-content">{item.scroll_name || `Item ${index + 1}`}</span>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="px-3 py-1 bg-info/20 text-info rounded-full text-sm">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-xl text-success">${item.unit_price}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between pt-6 border-t border-base-300">
            <div>
              <p className="text-base-content/70">Total items: {selectedItems.length}</p>
              <p className="text-2xl font-bold text-accent mt-2">
                Total: ${selectedItems.reduce((sum, item) => sum + (parseFloat(item.unit_price) * item.quantity), 0).toFixed(2)}
              </p>
            </div>
            <button
              onClick={handleSubmitOrder}
              className="px-8 py-4 bg-gradient-to-r from-success to-success-focus text-success-content rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-[1.05] transition-all duration-300"
            >
              ✅ Submit Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}