const { getHoja } = require('./excel');

const NOMBRE_HOJA = 'Presupuesto';

let presupuesto = null;

const getCurrentBudget = () => {
    if (presupuesto) return presupuesto;

    const filas = getHoja(NOMBRE_HOJA);

    const fila = filas.find(
        (f) => typeof f[1] === 'string' && f[1].trim() === 'INGRESOS - EGRESOS'
    );

    if (!fila) {
        throw new Error(`No se encontró la fila "INGRESOS - EGRESOS" en la hoja "${NOMBRE_HOJA}"`);
    }

    presupuesto = { presupuestoActual: fila[2] };
    return presupuesto;
};



const subtractFromBudget = (monto) => {
    const valor = Number(monto);

    if (!Number.isFinite(valor) || valor <= 0) return null;

    const p = getCurrentBudget();
    p.presupuestoActual -= valor;
    return p;
};

module.exports = {
    getCurrentBudget,
    subtractFromBudget
};
