const express = require('express');
const router = express.Router();

const crearCliente = require('../controllers/crearCliente');
const obtenerCliente = require('../controllers/obtenerCliente');
const login = require('../controllers/login'); // Importar el controlador de login

// Ruta para crear un nuevo cliente
router.post('/clientes', crearCliente);

// Ruta para obtener los datos de un cliente por su ID
router.get('/clientes/:id', obtenerCliente);

// Ruta para login
router.post('/login', login); // Agregar la ruta de login

module.exports = router;
