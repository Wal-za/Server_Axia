// Datos en memoria mientras no hay conexión a base de datos
const objetivos = [
    {
        id: 1,
        objetivo: 'Comprar casa',
        descripcion: 'Cuota inicial de la vivienda',
        plazoAnios: 5,
        valorObjetivo: 100000000,
        valorMensualAhorrar: 1666667,
        implementado: true
    },
    {
        id: 2,
        objetivo: 'Viaje a Europa',
        descripcion: 'Vacaciones familiares',
        plazoAnios: 2,
        valorObjetivo: 20000000,
        valorMensualAhorrar: 833333,
        implementado: false
    }
];

const obtenerObjetivos = () => objetivos.filter((obj) => !obj.implementado);

// Marca un objetivo como implementado; devuelve null si no existe
const markAstrue = (id) => {
    const objetivo = objetivos.find((obj) => obj.id === Number(id));

    if (!objetivo) return null;

    objetivo.implementado = true;
    return objetivo;
};

module.exports = {
    obtenerObjetivos,
    markAstrue
};
