const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./dbConnection');
const clienteRoutes = require('./routes/clienteAxiaRoutes');
const serverless = require('serverless-http');

const app = express();

app.use(cors());
app.use(express.json());

// Conectar base de datos
connectDB();

// Rutas
app.use('/api', clienteRoutes);

app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

if (process.env.NODE_ENV === 'production') {
  // En producción (Vercel), exportamos la app como función serverless
  module.exports = serverless(app);
} else {
  // En desarrollo local, levantamos el servidor normalmente
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
  });
}
