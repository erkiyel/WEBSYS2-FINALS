require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');

require('./config/passport');

const authRoutes = require('./routes/auth');
const scrollRoutes = require('./routes/scrolls');
const specialistRoutes = require('./routes/specialists');
const shopInventoryRoutes = require('./routes/shopInventory');
const orderRoutes = require('./routes/orders');
const sellerOrderRoutes = require('./routes/sellerOrders');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// ========== VERCEL SPECIFIC ==========
// For Vercel, we need to handle CORS differently
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-frontend-app.vercel.app',  // Your frontend URL
  process.env.FRONTEND_URL  // From environment variable
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
// =====================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// For Vercel, sessions need special handling
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Your API routes
app.use('/api/auth', authRoutes);
app.use('/api/scrolls', scrollRoutes);
app.use('/api/specialists', specialistRoutes);
app.use('/api/shop-inventory', shopInventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seller-orders', sellerOrderRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint (important for Vercel)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Magical Scroll Shop API',
    version: '1.0.0',
    endpoints: [
      '/api/auth - Authentication endpoints',
      '/api/scrolls - Scroll browsing',
      '/api/specialists - Specialist profiles',
      '/api/shop-inventory - Shop inventory',
      '/api/orders - Customer orders',
      '/api/seller-orders - Seller orders',
      '/api/users - User profiles',
      '/api/health - Health check'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ========== IMPORTANT: SINGLE EXPORT ==========
// Export the Express app for Vercel serverless
// ONLY ONE module.exports statement!

module.exports = app;

// Only listen locally if not on Vercel
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`API available at: http://localhost:${PORT}`);
  });
}