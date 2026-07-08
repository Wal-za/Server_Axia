const { getHoja } = require('./excel');

const NOMBRE_HOJA = 'Info Objetivos';


let objetivos = null;

const cargarObjetivos = () => {
    if (objetivos) return objetivos;

    const filas = getHoja(NOMBRE_HOJA);


    const indiceEncabezados = filas.findIndex((fila) => fila.includes('PRIORIDAD'));

    if (indiceEncabezados === -1) {
        throw new Error(`No se encontró la fila de encabezados en la hoja "${NOMBRE_HOJA}"`);
    }

    const colInicio = filas[indiceEncabezados].indexOf('PRIORIDAD');

    objetivos = filas
        .slice(indiceEncabezados + 1)
        // Solo filas con prioridad numérica: descarta vacías y la fila de totales
        .filter((fila) => typeof fila[colInicio] === 'number')
        .map((fila) => {
            const [prioridad, objetivo, descripcion, plazoAnios, valorObjetivo, valorMensualAhorrar, comentarios] =
                fila.slice(colInicio);

            return {
                id: prioridad,
                prioridad,
                objetivo,
                descripcion,
                plazoAnios,
                valorObjetivo,
                valorMensualAhorrar: Number(valorMensualAhorrar) || 0,
                comentarios,
                implementado: false
            };
        });

    return objetivos;
};

const obtenerObjetivos = () => cargarObjetivos().filter((obj) => !obj.implementado);

const markAstrue = (id) => {
    const objetivo = cargarObjetivos().find((obj) => obj.id === Number(id));

    if (!objetivo) return null;

    objetivo.implementado = true;
    return objetivo;
};

module.exports = {
    obtenerObjetivos,
    markAstrue
};
