const express = require('express');
const router = express.Router();

const { obtenerObjetivos, markAsImplmented } = require('../controllers/action/objectives');
const { currentBudget } = require('../controllers/action/budget');


router.get('/objetivos', obtenerObjetivos);


router.put('/objetivos/:id/implementar', markAsImplmented);


router.get('/budget', currentBudget);

module.exports = router;
