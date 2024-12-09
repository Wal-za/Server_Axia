const ClienteFormulario = require('../models/ClienteAxia'); // Asegúrate de poner la ruta correcta

// Controlador para crear un nuevo cliente
const crearCliente = async (req, res) => {
  try {
    const {
      fecha, // Esto debería ser generado automáticamente como la fecha de creación
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
      fechaIngreso,
      tipoContratacion,
      profesion,
      universidad,
      correoElectronico,
      declaranteRenta,
      estadoCivil,
      contraseña
    } = req.body; // Obtén los datos del cuerpo de la solicitud

    // Verificar si ya existe un cliente con la misma cédula
    const clienteExistente = await ClienteFormulario.findOne({ cedula });
    if (clienteExistente) {
      return res.status(400).json({ message: 'El usuario con esta cédula ya está registrado' });
    }

    // Verificar si ya existe un cliente con el mismo correo electrónico
    const correoExistente = await ClienteFormulario.findOne({ correoElectronico });
    if (correoExistente) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Asegurarse de que las fechas sean objetos Date, si vienen como cadena
    const fechaNacimientoDate = new Date(fechaNacimiento);
    const fechaIngresoDate = new Date(fechaIngreso);

    // Crear una nueva instancia de ClienteFormulario
    const nuevoCliente = new ClienteFormulario({
      fecha: fecha || new Date(), // Si no se proporciona una fecha, usa la fecha actual
      sexo,
      nombre,
      apellidos,
      cedula,
      fechaNacimiento: fechaNacimientoDate,
      lugarNacimiento,
      edad,
      direccionCasa,
      direccionOficina,
      celular,
      telefonoCasa,
      telefonoOficina,
      empresa,
      cargo,
      fechaIngreso: fechaIngresoDate,
      tipoContratacion,
      profesion,
      universidad,
      correoElectronico,
      declaranteRenta,
      estadoCivil,
      contraseña
    });

    // Guardar el cliente en la base de datos
    await nuevoCliente.save();

    // Enviar una respuesta exitosa
    res.status(201).json({ message: 'Cliente creado con éxito', cliente: nuevoCliente });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al crear el cliente', error: error.message });
  }
};

module.exports = crearCliente;
