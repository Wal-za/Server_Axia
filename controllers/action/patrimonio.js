const { getActivosLiquidos, getActivosProductivos, getActivosImproductivos, eliminarActivoById } = require('../../services/patrimonio.service');

const eliminarActivo = async (req, res) => {
    try {
        const { tipo, id } = req.params;
        const idActivo = parseInt(id, 10);

        let activos;
        switch (tipo.toUpperCase()) {
            case 'LIQUIDOS':
                activos = getActivosLiquidos();
                break;
            case 'PRODUCTIVOS':
                activos = getActivosProductivos();
                break;
            case 'IMPRODUCTIVOS':
                activos = getActivosImproductivos();
                break;
            default:
                return res.status(400).json({
                    message: 'Tipo de activo inválido. Usa: LIQUIDOS, PRODUCTIVOS o IMPRODUCTIVOS'
                });
        }

        const activoEliminado = eliminarActivoById(activos, idActivo);

        res.status(200).json({
            message: `Activo ${idActivo} eliminado correctamente`,
            activoEliminado
        });
    } catch (error) {
        console.error('❌ Error al eliminar el activo:', error);
        res.status(500).json({
            message: 'Error al eliminar el activo',
            error: error.message
        });
    }
};

module.exports = {
    eliminarActivo
};
