require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes - UPDATE PATHS based on your structure
const authRoutes = require('./backend/routes/auth');
const scrollRoutes = require('./backend/routes/scrolls');
const specialistRoutes = require('./backend/routes/specialists');
const shopInventoryRoutes = require('./backend/routes/shopInventory');
const orderRoutes = require('./backend/routes/orders');
const sellerOrderRoutes = require('./backend/routes/sellerOrders');
const userRoutes = require('./backend/routes/users');

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins for now to debug
    callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scrolls', scrollRoutes);
app.use('/api/specialists', specialistRoutes);
app.use('/api/shop-inventory', shopInventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seller-orders', sellerOrderRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    serverless: true,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
  res.json({
    message: 'Server is running',
    node: process.version,
    cwd: process.cwd(),
    files: require('fs').readdirSync('.'),
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static files if they exist
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.use(express.static(path.join(__dirname, 'frontend/public')));

// For any other route, serve the frontend or return API info
app.get('*', (req, res) => {
  // Check if it's an API request
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    // Try to serve frontend if exists
    const frontendPath = path.join(__dirname, 'frontend/build/index.html');
    if (require('fs').existsSync(frontendPath)) {
      res.sendFile(frontendPath);
    } else {
      res.json({
        message: 'Magical Scroll Shop API',
        version: '1.0.0',
        endpoints: ['/api/health', '/api/debug', '/api/auth', '/api/scrolls'],
        frontend: 'Frontend not built or path not found'
      });
    }
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Export for Vercel
module.exports = app;