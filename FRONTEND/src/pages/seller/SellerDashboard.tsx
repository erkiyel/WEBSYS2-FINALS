import { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function SellerDashboard() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const response = await authAPI.getStatus();
      if (response.data.isAuthenticated) {
        setUser(response.data.user);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Seller Dashboard</h1>
              <span className="ml-4 text-gray-600">Welcome, {user.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/seller/inventory" className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
            <h3 className="text-lg font-bold mb-2">Shop Inventory</h3>
            <p>Manage your scroll inventory</p>
          </Link>
          
          <Link to="/seller/orders" className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
            <h3 className="text-lg font-bold mb-2">Customer Orders</h3>
            <p>View and manage customer orders</p>
          </Link>
          
          <Link to="/seller/purchase" className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
            <h3 className="text-lg font-bold mb-2">Purchase from Specialists</h3>
            <p>Order scrolls from specialists</p>
          </Link>
        </div>
      </div>
    </div>
  );
}