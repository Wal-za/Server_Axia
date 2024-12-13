const ClienteFormulario = require('../models/ClienteAxia'); 

// Controlador para obtener solo el fieldset de un cliente por cédula
const obtenerFieldset = async (req, res) => {
  try {
    const { cedula } = req.params; // Obtener la cédula de los parámetros de la URL

    // Buscar el cliente por la cédula
    const cliente = await ClienteFormulario.findOne({ cedula: cedula });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Retornar solo el campo 'fieldset'
    res.status(200).json({
      fieldset: cliente.fieldset
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el fieldset', error: error.message });
  }
};

module.exports = obtenerFieldset;
