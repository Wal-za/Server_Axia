const ClienteAxia = require('../models/ClienteAxia'); // Asegúrate de poner la ruta correcta

// Controlador para crear un nuevo cliente
const crearCliente = async (req, res) => {
  try {
    const {
      fecha,
      sexo,
      nombre,
      apellidos,
      cedula,
      fechaNacimiento,
      lugarNacimiento,
      edad,
      direccionCasa,
      direccionOficina,
      celular,
      telefonoCasa,
      telefonoOficina,
      empresa,
      cargo,
      fechaIngresoCompania,
      tipoContratacion,
      profesion,
      universidad,
      correoElectronico,
      declaranteRenta,
      estadoCivil,
      eps,
      prepaga,
      arl,
      fondoCesantias,
      saldoFondoCesantias,
      afp,
      saldoAfp
    } = req.body; // Obtén los datos del cuerpo de la solicitud

    // Verificar si ya existe un cliente con la misma cédula
    const clienteExistente = await ClienteAxia.findOne({ cedula });

    if (clienteExistente) {
      // Si la cédula ya existe en la base de datos, enviar un mensaje de error
      return res.status(400).json({ message: 'El usuario con esta cédula ya está registrado' });
    }

    // Crear una nueva instancia de ClienteAxia
    const nuevoCliente = new ClienteAxia({
      fecha,
      sexo,
      nombre,
      apellidos,
      cedula,
      fechaNacimiento,
      lugarNacimiento,
      edad,
      direccionCasa,
      direccionOficina,
      celular,
      telefonoCasa,
      telefonoOficina,
      empresa,
      cargo,
      fechaIngresoCompania,
      tipoContratacion,
      profesion,
      universidad,
      correoElectronico,
      declaranteRenta,
      estadoCivil,
      eps,
      prepaga,
      arl,
      fondoCesantias,
      saldoFondoCesantias,
      afp,
      saldoAfp,
    });

    await nuevoCliente.save(); // Guardar el cliente en la base de datos

    // Enviar una respuesta exitosa
    res.status(201).json({ message: 'Cliente creado con éxito', cliente: nuevoCliente });
  } catch (error) {
    console.log(error);
    // En caso de error, enviar una respuesta con el error
    res.status(500).json({ message: 'Error al crear el cliente', error: error.message });
  }
};

module.exports = crearCliente;
