const express = require('express');
const router = express.Router();

const crearCliente = require('../controllers/crearCliente');
const obtenerCliente = require('../controllers/obtenerCliente');
const login = require('../controllers/login'); // Importar el controlador de login
const  actualizarCliente  = require('../controllers/actualizarcliente');
const  obtenerFieldset  = require('../controllers/fieldset');
const  getAllClientes  = require('../controllers/GetAllClientes');

// Ruta para crear un nuevo cliente
router.post('/clientes', crearCliente);
router.get('/clientes', getAllClientes);

// Ruta para obtener los datos de un cliente por su ID
router.get('/clientes/:cedula', obtenerCliente);

// Ruta para login
router.post('/login', login); // Agregar la ruta de login

router.put('/actualizar', actualizarCliente);

// Definir la ruta para obtener el fieldset de un cliente por su cédula
router.get('/cliente/:cedula/fieldset', obtenerFieldset);

module.exports = router;
