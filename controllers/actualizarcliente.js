const ClienteFormulario = require('../models/ClienteAxia'); // Modelo Cliente
const bcrypt = require('bcryptjs'); // Librería para encriptar contraseñas si es necesario

// Controlador para actualizar el cliente
const actualizarCliente = async (req, res) => {
  try {
    const { cedula, datosMongo } = req.body; // Desestructuramos la cédula y los datos de la solicitud

    console.log('Recibiendo solicitud para actualizar cliente con cédula:', cedula);
    console.log('Datos recibidos para actualizar:', datosMongo);

    // Buscar el cliente por la cédula (puedes cambiar esto a 'correoElectronico' si prefieres)
    const cliente = await ClienteFormulario.findOne({ cedula });

    if (!cliente) {
      console.log('Cliente no encontrado con la cédula:', cedula);
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    console.log('Cliente encontrado:', cliente);

    // Actualización de la contraseña si se recibe en los datos
    if (datosMongo.contraseña) {
      console.log('Recibida nueva contraseña, encriptando...');
      const contraseñaEncriptada = await bcrypt.hash(datosMongo.contraseña, 10);
      datosMongo.contraseña = contraseñaEncriptada; // Reemplazamos la contraseña en el objeto de datos
      console.log('Contraseña encriptada correctamente');
    }

    // Ahora actualizamos los datos del cliente, excluyendo la contraseña si no es parte de los datos
    Object.keys(datosMongo).forEach(key => {
      if (datosMongo[key]) {
        console.log(`Actualizando el campo ${key} con el valor:`, datosMongo[key]);
        cliente[key] = datosMongo[key]; // Actualizamos solo los campos que vienen en datosMongo
      }
    });

    // Guardamos el cliente actualizado
    await cliente.save();

    // Responder con los datos del cliente actualizado
    console.log('Cliente actualizado exitosamente:', cliente);
    res.status(200).json({
      message: 'Cliente actualizado exitosamente',
      cliente: cliente // Enviar los datos del cliente actualizado al front
    });
  } catch (error) {
    console.error('Error en la actualización del cliente:', error);
    res.status(500).json({ message: 'Error al actualizar el cliente', error: error.message });
  }
};

module.exports = actualizarCliente;
