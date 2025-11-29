require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

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

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/scrolls', scrollRoutes);
app.use('/api/specialists', specialistRoutes);
app.use('/api/shop-inventory', shopInventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seller-orders', sellerOrderRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Magical Scroll Shop API' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});