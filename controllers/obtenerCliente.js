const { Parser } = require('json2csv');
const ClienteAxia = require('../models/ClienteAxia'); // Asegúrate de poner la ruta correcta

// Controlador para obtener los datos de un cliente por su 'cedula' y devolverlos como CSV
const obtenerClientePorCedulaEnCSV = async (req, res) => {
  try {
    // Obtener la 'cedula' del cliente desde los parámetros de la URL
    const { cedula } = req.params;
    console.log(`Buscando cliente con cédula: ${cedula}`); // Depuración: cédula que estamos buscando

    // Buscar el cliente por su 'cedula' en la base de datos
    const cliente = await ClienteAxia.findOne({ cedula });

    // Si no se encuentra el cliente, enviar una respuesta de error
    if (!cliente) {
      console.error(`Cliente no encontrado con cédula: ${cedula}`); // Depuración: no se encontró el cliente
      return res.status(404).json({ message: 'Cliente no encontrado con esa cédula' });
    }

    console.log(`Cliente encontrado: ${JSON.stringify(cliente)}`); // Depuración: cliente encontrado

    // Convertir los datos del cliente a un formato adecuado para CSV
    const datos = [cliente];
    console.log(`Datos a convertir a CSV: ${JSON.stringify(datos)}`); // Depuración: datos a convertir

    // Crear el parser para convertir el objeto cliente a CSV
    const parser = new Parser({
      delimiter: ';',
      quote: '"',
      eol: '\n'
    });

    // Convertir los datos a CSV
    const csv = parser.parse(datos);
    console.log(`CSV generado exitosamente.`); // Depuración: CSV generado correctamente

    // Establecer el encabezado para que el navegador descargue el archivo CSV
    res.setHeader('Content-Type', 'text/csv; charset=UTF-8');
    res.setHeader('Content-Disposition', 'attachment; filename=cliente.csv'); // Nombre del archivo CSV

    // Enviar el CSV como respuesta
    return res.send(csv);
  } catch (error) {
    // En caso de error, enviar una respuesta con el error
    console.error(`Error al obtener el cliente: ${error.message}`); // Depuración: error en la ejecución
    res.status(500).json({ message: 'Error al obtener el cliente', error: error.message });
  }
};

module.exports = obtenerClientePorCedulaEnCSV;
