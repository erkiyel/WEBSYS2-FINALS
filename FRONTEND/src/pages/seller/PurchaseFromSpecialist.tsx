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
      inventory_id: item.inventory_id,
      quantity: 1,
      unit_price: item.source_price
    }]);
  };

  const handleSubmitOrder = async () => {
    if (!selectedSpecialist || selectedItems.length === 0) {
      alert('Please select specialist and items');
      return;
    }

    try {
      await sellerOrdersAPI.create({
        specialist_id: selectedSpecialist.specialist_id,
        items: selectedItems
      });
      alert('Order placed successfully');
      setSelectedItems([]);
    } catch (error) {
      alert('Failed to place order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button onClick={() => navigate('/seller')} className="mb-4 px-4 py-2 bg-gray-600 text-white rounded">
        Back to Dashboard
      </button>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Specialists</h2>
          <div className="space-y-2">
            {specialists.map((specialist) => (
              <div
                key={specialist.specialist_id}
                onClick={() => handleSpecialistSelect(specialist)}
                className={`p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-50 ${
                  selectedSpecialist?.specialist_id === specialist.specialist_id ? 'border-2 border-blue-500' : ''
                }`}
              >
                <h3 className="font-bold">{specialist.shop_name}</h3>
                <p>Specialty: {specialist.specialtyElement?.element_name}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Available Scrolls</h2>
          {selectedSpecialist ? (
            <div className="space-y-2">
              {inventory.map((item) => (
                <div key={item.inventory_id} className="p-4 bg-white rounded shadow">
                  <h3 className="font-bold">{item.Scroll.scroll_name}</h3>
                  <p>Stock: {item.stock_quantity}</p>
                  <p>Price: ${item.source_price}</p>
                  <button
                    onClick={() => handleAddItem(item)}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add to Order
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>Select a specialist to view their inventory</p>
          )}
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="mt-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2">
            {selectedItems.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>Item {index + 1}</span>
                <span>Qty: {item.quantity}</span>
                <span>${item.unit_price}</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmitOrder}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit Order
          </button>
        </div>
      )}
    </div>
  );
}