const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const cors = require('cors');
const routes = require('./routes');
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");


dotenv.config();
const app = express();

connectDB();
app.use(cors());
app.use(express.json());


app.use(express.urlencoded({ extended: true }));

app.post('/api/users/sync', async (req, res) => {
  try {
    // Your sync logic here
    // Example: console.log the incoming data
    console.log('Sync request body:', req.body);

    // Respond success
    res.status(200).json({ message: 'Sync successful' });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.use('/api', routes);
app.get('/', (req, res) => res.send('QuickCourt API running'));
app.use("/api/payments", paymentRoutes);

app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
