// require('dotenv').config();
// const connectDB = require('../config/db');
// const User = require('../models/User');

// (async () => {
//   try {
//     await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/banking-platform');
//     const existing = await User.findOne({ email: 'admin@local' });
//     if (existing) { console.log('admin exists'); process.exit(0); }
//     const admin = new User({ name: 'Admin', email: 'admin@local', password: 'password123', role: 'admin' });
//     await admin.save();
//     console.log('Admin created => admin@local / password123');
//     process.exit(0);
//   } catch (err) { console.error(err); process.exit(1); }
// })();
