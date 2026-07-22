const initialVariables = require("./initialvariables");
const budgetService = require("./budget.service");
const  {getActivosLiquidos,getActivosProductivos,getActivosImproductivos}  = require("./patrimonio.service");
const {formatCOP} = require("../utils/formatter");



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
const provision = await isRequiredAnualProvision();
console.log(provision)
     const cashAssets=await getActivosLiquidos()
     console.log(cashAssets,"cashAssets")
     let moneyAvailable=cashAssets.reduce((acum,item)=>{
         acum+=item.valor
         return acum
     },0) 

     const productiveAssets=await getActivosProductivos()
     console.log(productiveAssets)
     const improductiveAssets=await getActivosImproductivos()
     console.log(improductiveAssets)
      console.log(formatCOP(moneyAvailable),"moneyAvailable")

}

module.exports = {
  isRequiredAnualProvision,
  actionPlanFinanciero
};
