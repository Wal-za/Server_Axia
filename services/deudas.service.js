const { getHoja } = require('./excel');

const NOMBRE_HOJA = 'Info Patrimonio';

// Cache por bloque, indexado por título
const bloques = {};

// Busca el título del bloque en la columna B y lee sus filas de datos
// (empiezan 2 filas después: título -> encabezados -> datos) hasta la
// primera fila con la columna PASIVO vacía
const leerBloquePasivos = (titulo) => {
    if (bloques[titulo]) return bloques[titulo];

    const filas = getHoja(NOMBRE_HOJA);

    const indiceTitulo = filas.findIndex(
        (f) => typeof f[1] === 'string' && f[1].trim().toUpperCase() === titulo
    );

    if (indiceTitulo === -1) {
        throw new Error(`No se encontró el bloque "${titulo}" en la hoja "${NOMBRE_HOJA}"`);
    }

    const pasivos = [];

    for (let i = indiceTitulo + 2; i < filas.length; i++) {
        const [, pasivo, saldoCapital, entidad, tasa, cuotasPendientes, cuotaMensual] = filas[i];

        if (pasivo === null || String(pasivo).trim() === '') break;

        pasivos.push({
            pasivo: String(pasivo).trim(),
            saldoCapital: Number(saldoCapital) || 0,
            entidad,
            tasa: Number(tasa) || 0,
            cuotasPendientes: Number(cuotasPendientes) || 0,
            cuotaMensual: Number(cuotaMensual) || 0
        });
    }

    bloques[titulo] = pasivos;
    return pasivos;
};

const getPasivosCortoPlazo = () => leerBloquePasivos('PASIVOS CORTO PLAZO');

const getPasivosLargoPlazo = () => leerBloquePasivos('PASIVOS LARGO PLAZO');

module.exports = {
    getPasivosCortoPlazo,
    getPasivosLargoPlazo
};
