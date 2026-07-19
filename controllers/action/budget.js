const budgetService = require('../../services/budget.service');
const initialVariables = require('../../services/initialvariables');
const process = require('../../services/proccess');
const  {getActivosLiquidos,getActivosProductivos,getActivosImproductivos}  = require('../../services/patrimonio.service');


const currentBudget = async (req, res) => {
    try {
      const budget = await budgetService.getCurrentBudget();
      const isRequiredAnualProvision = await process.isRequiredAnualProvision();
     const moneyAvailable=await getActivosLiquidos()
     const productiveAssets=await getActivosProductivos()
     const improductiveAssets=await getActivosImproductivos()
     
     
     
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