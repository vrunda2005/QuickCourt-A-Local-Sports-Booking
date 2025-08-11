const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const itemRoutes = require('./routes/itemRoutes');
const adminRoutes = require("./routes/adminRoutes");
const cors = require('cors');

dotenv.config();
const app = express();



connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/admin", adminRoutes);


app.use((err, req, res, next) => {
  console.error("🔥 Global error:", err.stack);
  res.status(500).send("Something broke!");
});

app.use('/api/items', itemRoutes);

const PORT = process.env.PORT || 5000;
app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
