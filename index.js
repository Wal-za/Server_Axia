const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');


const connectDB = require('./dbConnection'); 
const clienteRoutes = require('./routes/clienteAxiaRoutes'); 

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end(); 
  }
  next();
});

app.use(express.json());

connectDB();

app.use('/api', clienteRoutes);

app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

if (process.env.NODE_ENV !== 'production') {
  // Solo escucha en local
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
  });
}

app.get('/favicon.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'favicon.png'));
});
// Exporta siempre la app para Vercel
module.exports = app;
