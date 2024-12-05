const express = require('express');
const router = express.Router();

const  crearCliente  = require('../controllers/crearCliente'); 

const  obtenerCliente  = require('../controllers/obtenerCliente'); 

// Ruta para crear un nuevo cliente
router.post('/clientes', crearCliente);

// Ruta para obtener los datos de un cliente por su ID
router.get('/clientes/:id', obtenerCliente);

module.exports = router;
