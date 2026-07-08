const { getHoja } = require('./excel');

const NOMBRE_HOJA = 'Presupuesto';

const getCurrentBudget = () => {
    const filas = getHoja(NOMBRE_HOJA);

    const fila = filas.find(
        (f) => typeof f[1] === 'string' && f[1].trim() === 'INGRESOS - EGRESOS'
    );

    if (!fila) {
        throw new Error(`No se encontró la fila "INGRESOS - EGRESOS" en la hoja "${NOMBRE_HOJA}"`);
    }

    return { presupuestoActual: fila[2] };
};

module.exports = {
    getCurrentBudget
};
