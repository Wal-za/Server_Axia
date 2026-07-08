const path = require('path');
const XLSX = require('xlsx');

const RUTA_EXCEL = path.join(__dirname, '..', 'data', 'MIS FINANZAS PA NICOLAS KRALICSEK-1.xlsm');

// Cache en memoria: el Excel se lee del disco una sola vez mientras no hay base de datos
let libro = null;

// Devuelve las filas de una hoja como matriz (header: 1), con null en celdas vacías
const getHoja = (nombre) => {
    if (!libro) libro = XLSX.readFile(RUTA_EXCEL);

    const hoja = libro.Sheets[nombre];

    if (!hoja) {
        throw new Error(`No se encontró la hoja "${nombre}" en el Excel`);
    }

    return XLSX.utils.sheet_to_json(hoja, { header: 1, defval: null });
};

module.exports = { getHoja };
