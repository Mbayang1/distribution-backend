require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' })); // Update for production as needed

// ✅ No need to call db.connect() again — it's already connected in db.js

// Import routes
const agentsRouter = require('./routes/agents');
const departmentsRouter = require('./routes/departments');
const distributionsRouter = require('./routes/distributions');
const materialsRouter = require('./routes/materials');
const typeOfMaterialsRouter = require('./routes/type_of_materials');
const servicesRouter = require('./routes/services');
const dashboardRoutes = require('./routes/dashboard');



// Mount routers
app.use('/agents', agentsRouter);
app.use('/departments', departmentsRouter);
app.use('/distributions', distributionsRouter);
app.use('/materials', materialsRouter);
app.use('/type_of_materials', typeOfMaterialsRouter);
app.use('/services', servicesRouter);
app.use('/dashboard', dashboardRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('📦 Backend API is running');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
