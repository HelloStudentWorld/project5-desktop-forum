require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// TODO: Import routes & use them, e.g.:
// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
