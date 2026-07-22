const express = require('express');
const router = express.Router();

const { eliminarActivo } = require('../controllers/action/patrimonio');

router.delete('/activos/:tipo/:id', eliminarActivo);

module.exports = router;
