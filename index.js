const originalStderrWrite = process.stderr.write;

process.stderr.write = (chunk, encoding, callback) => {
  if (typeof chunk === 'string' && chunk.includes('Fontconfig error: Cannot load default config file')) {
    // Oculta solo el warning de Fontconfig
    if (callback) callback();
    return true;
  }
  // Para todo lo demás, sigue mostrando
  return originalStderrWrite.call(process.stderr, chunk, encoding, callback);
};

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar la función de conexión a la base de datos
const connectDB = require('./dbConnection'); 

// Importar las rutas
const clienteRoutes = require('./routes/clienteAxiaRoutes'); 
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a la base de datos usando la función importada
connectDB(); 

// Rutas
app.use('/api', clienteRoutes); 

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

const port = process.env.PORT || 3001;

//Comentar en producción
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
