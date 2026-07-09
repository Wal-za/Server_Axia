const { getHoja } = require('./excel');

const NOMBRE_HOJA = 'Presupuesto';

// "TOTAL INGRESOS" existe dos veces en la hoja; aquí se usa la que está después de la fila 110
const FILA_MINIMA_TOTAL_INGRESOS = 110;

let variablesIniciales = null;

// Busca la etiqueta en la columna B y devuelve el valor de la columna C
const buscarValorColumnaC = (filas, etiqueta, filaMinima = 0) => {
    const fila = filas.find(
        (f, i) => i >= filaMinima && typeof f[1] === 'string' && f[1].trim() === etiqueta
    );

    if (!fila) {
        throw new Error(`No se encontró la fila "${etiqueta}" en la hoja "${NOMBRE_HOJA}"`);
    }

    return fila[2];
};

const getInitialVariables = () => {
    if (variablesIniciales) return variablesIniciales;

    const filas = getHoja(NOMBRE_HOJA);

    variablesIniciales = {
        totalIngresos: buscarValorColumnaC(filas, 'TOTAL INGRESOS', FILA_MINIMA_TOTAL_INGRESOS),
        totalAnualidades: buscarValorColumnaC(filas, 'TOTAL ANUALIDADES'),
        provisionMensual: buscarValorColumnaC(filas, 'PROVISIÓN MENSUAL')
    };


    return variablesIniciales;
};

module.exports = {
    getInitialVariables
};
