const initialVariables = require("./initialvariables");
const budgetService = require("./budget.service");
const  {getActivosLiquidos,getActivosProductivos,getActivosImproductivos}  = require('../../services/patrimonio.service');



const isRequiredAnualProvision = () => {
  let provisionMensual =
    initialVariables.getInitialVariables().provisionMensual;
  let totalIngresos = initialVariables.getInitialVariables().totalIngresos;

  const totalAnualidades =
    initialVariables.getInitialVariables().totalAnualidades;
  let presupuesto = budgetService.getCurrentBudget().presupuestoActual;

  if (totalIngresos >= totalAnualidades) return { status: false, presupuesto };

  if (presupuesto < provisionMensual) {
    return {
      status: false,
      message:
        "No se puede realizar el plan debera recortar gastos o subir sus ingresos",
    };
  }
  presupuesto = budgetService.subtractFromBudget(provisionMensual);
  return { status: true, presupuesto };
};

const actionPlanFinanciero = async () => {
const isRequiredAnualProvision = await isRequiredAnualProvision();
     const moneyAvailable=await getActivosLiquidos()
     console.log(moneyAvailable)
     const productiveAssets=await getActivosProductivos()
     console.log(productiveAssets)
     const improductiveAssets=await getActivosImproductivos()
     console.log(improductiveAssets)

}

module.exports = {
  isRequiredAnualProvision,
  actionPlanFinanciero
};
