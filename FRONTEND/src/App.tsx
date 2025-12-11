import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import SellerDashboard from './pages/seller/SellerDashboard';
import ShopInventory from './pages/seller/ShopInventory';
import Orders from './pages/seller/Orders';
import PurchaseFromSpecialist from './pages/seller/PurchaseFromSpecialist';
import SpecialistDashboard from './pages/specialist/SpecialistDashboard';
import MyInventory from './pages/specialist/MyInventory';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import BrowseScrolls from './pages/customer/BrowseScrolls';
import MyOrders from './pages/customer/MyOrders';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div data-theme="luxury" className="min-h-screen bg-base-100">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Seller Routes */}
          <Route path="/seller" element={
            <ProtectedRoute allowedRoles={['Seller']}>
              <SellerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/seller/inventory" element={
            <ProtectedRoute allowedRoles={['Seller']}>
              <ShopInventory />
            </ProtectedRoute>
          } />
          <Route path="/seller/orders" element={
            <ProtectedRoute allowedRoles={['Seller']}>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/seller/purchase" element={
            <ProtectedRoute allowedRoles={['Seller']}>
              <PurchaseFromSpecialist />
            </ProtectedRoute>
          } />
          
          {/* Specialist Routes */}
          <Route path="/specialist" element={
            <ProtectedRoute allowedRoles={['Specialist']}>
              <SpecialistDashboard />
            </ProtectedRoute>
          } />
          <Route path="/specialist/inventory" element={
            <ProtectedRoute allowedRoles={['Specialist']}>
              <MyInventory />
            </ProtectedRoute>
          } />
          
          {/* Customer Routes */}
          <Route path="/customer" element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/customer/browse" element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <BrowseScrolls />
            </ProtectedRoute>
          } />
          <Route path="/customer/orders" element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <MyOrders />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;