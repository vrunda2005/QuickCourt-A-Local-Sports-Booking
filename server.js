const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const cors = require('cors');
const routes = require('./routes');
const paymentRoutes = require("./routes/paymentRoutes");


dotenv.config();
const app = express();

connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);
app.get('/', (req, res) => res.send('QuickCourt API running'));
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
