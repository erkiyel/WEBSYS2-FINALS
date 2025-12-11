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

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300" data-theme="luxury">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="mt-4 text-base-content/70">Loading your dashboard...</p>
    </div>
  </div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300" data-theme="luxury">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-base-100 to-base-200 shadow-2xl border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-primary to-primary-focus p-3 rounded-xl shadow-lg">
                <span className="text-2xl">🏪</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Seller Dashboard
                </h1>
                <p className="text-base-content/80 flex items-center">
                  <span className="mr-2">👋</span> Welcome back, <span className="font-semibold text-accent ml-1">{user.username}</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-gradient-to-r from-error to-error-focus text-error-content rounded-xl font-medium shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center"
            >
              <span className="mr-2">🚪</span> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Cards */}
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-primary mb-3">Magical Scroll Shop Management</h2>
          <p className="text-base-content/70 text-lg">Manage your inventory, orders, and suppliers from one place</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Shop Inventory Card */}
          <Link 
            to="/seller/inventory" 
            className="group bg-gradient-to-br from-base-100 to-base-200 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-base-300 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -translate-y-12 translate-x-12 group-hover:scale-125 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="p-4 bg-gradient-to-r from-info/20 to-info/10 rounded-xl mr-4">
                  <span className="text-3xl">📦</span>
                </div>
                <h3 className="text-2xl font-bold text-base-content">Shop Inventory</h3>
              </div>
              <p className="text-base-content/70 mb-6">Manage your scroll inventory, track stock levels, and adjust prices</p>
              <div className="flex items-center text-primary font-medium">
                <span>View Inventory</span>
                <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
              </div>
            </div>
          </Link>
          
          {/* Customer Orders Card */}
          <Link 
            to="/seller/orders" 
            className="group bg-gradient-to-br from-base-100 to-base-200 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-base-300 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-success/10 rounded-full -translate-y-12 translate-x-12 group-hover:scale-125 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="p-4 bg-gradient-to-r from-success/20 to-success/10 rounded-xl mr-4">
                  <span className="text-3xl">📋</span>
                </div>
                <h3 className="text-2xl font-bold text-base-content">Customer Orders</h3>
              </div>
              <p className="text-base-content/70 mb-6">View, approve, and manage customer orders for scrolls</p>
              <div className="flex items-center text-success font-medium">
                <span>Manage Orders</span>
                <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
              </div>
            </div>
          </Link>
          
          {/* Purchase from Specialists Card */}
          <Link 
            to="/seller/purchase" 
            className="group bg-gradient-to-br from-base-100 to-base-200 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-base-300 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full -translate-y-12 translate-x-12 group-hover:scale-125 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="p-4 bg-gradient-to-r from-accent/20 to-accent/10 rounded-xl mr-4">
                  <span className="text-3xl">🧙‍♂️</span>
                </div>
                <h3 className="text-2xl font-bold text-base-content">Purchase from Specialists</h3>
              </div>
              <p className="text-base-content/70 mb-6">Order magical scrolls from specialist suppliers</p>
              <div className="flex items-center text-accent font-medium">
                <span>Browse Specialists</span>
                <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
              </div>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}