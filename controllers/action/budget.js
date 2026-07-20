const budgetService = require('../../services/budget.service');
const initialVariables = require('../../services/initialvariables');
const process = require('../../services/proccess');


const currentBudget = async (req, res) => {
    try {
      const budget = await budgetService.getCurrentBudget();
      
      res.status(200).json(budget);
    } catch (error) {
        console.error('❌ Error al obtener el presupuesto actual:', error);
        res.status(500).json({
            message: 'Error al obtener los presupuesto actual',
            error: error.message
            
        });
    }
};

module.exports = {
    currentBudget
};