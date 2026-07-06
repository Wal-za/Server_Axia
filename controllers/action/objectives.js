const objetivosService = require('../../services/objectives.service');

const obtenerObjetivos = async (req, res) => {
    try {
        const objetivos = objetivosService.obtenerObjetivos();
        res.status(200).json(objetivos);
    } catch (error) {
        console.error('❌ Error al obtener los objetivos:', error);
        res.status(500).json({
            message: 'Error al obtener los objetivos',
            error: error.message
        });
    }
};

const implementarObjetivo = async (req, res) => {
    try {
        const objetivo = objetivosService.implementarObjetivo(req.params.id);

        if (!objetivo) {
            return res.status(404).json({
                message: `No se encontró un objetivo con id ${req.params.id}`
            });
        }

        res.status(200).json({
            message: 'Objetivo marcado como implementado',
            objetivo
        });
    } catch (error) {
        console.error('❌ Error al implementar el objetivo:', error);
        res.status(500).json({
            message: 'Error al implementar el objetivo',
            error: error.message
        });
    }
};

module.exports = {
    obtenerObjetivos,
    implementarObjetivo
};
