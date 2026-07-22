const { getHoja } = require('./excel');

const NOMBRE_HOJA = 'Info Patrimonio';

// Cache por bloque, indexado por título
const bloques = {};

// Busca el título del bloque en la columna B y lee sus filas de datos
// (empiezan 2 filas después: título -> encabezados -> datos) hasta la
// primera fila con la columna ACTIVO vacía
const leerBloqueActivos = (titulo) => {
    if (bloques[titulo]) return bloques[titulo];

    const filas = getHoja(NOMBRE_HOJA);

    const indiceTitulo = filas.findIndex(
        (f) => typeof f[1] === 'string' && f[1].trim().toUpperCase() === titulo
    );

    if (indiceTitulo === -1) {
        throw new Error(`No se encontró el bloque "${titulo}" en la hoja "${NOMBRE_HOJA}"`);
    }

    const activos = [];
    let id = 1;

    for (let i = indiceTitulo + 2; i < filas.length; i++) {
        const [, activo, entidad, valor, comentario] = filas[i];

        if (activo === null || String(activo).trim() === '') break;

        activos.push({
            id,
            activo: String(activo).trim(),
            entidad,
            valor: Number(valor) || 0,
            comentario
        });
        id++;
    }

    bloques[titulo] = activos;
    return activos;
};

const getActivosLiquidos = () => leerBloqueActivos('ACTIVOS LÍQUIDOS');

const getActivosProductivos = () => leerBloqueActivos('ACTIVOS PRODUCTIVOS');

const getActivosImproductivos = () => leerBloqueActivos('ACTIVOS IMPRODUCTIVOS');

module.exports = {
    getActivosLiquidos,
    getActivosProductivos,
    getActivosImproductivos
};
