const express = require('express');
const router = express.Router();

const { obtenerObjetivos, implementarObjetivo } = require('../controllers/action/objectives');

// Ruta para obtener los objetivos
router.get('/objetivos', obtenerObjetivos);

// Ruta para marcar un objetivo como implementado
router.put('/objetivos/:id/implementar', implementarObjetivo);

module.exports = router;
