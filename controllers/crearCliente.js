const ClienteFormulario = require('../models/ClienteAxia'); // Asegúrate de poner la ruta correcta
const bcrypt = require('bcryptjs'); // Importamos bcrypt para encriptar la contraseña

// Controlador para crear un nuevo cliente
const crearCliente = async (req, res) => {
  try {
    const {
      asesor,
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
      fechaIngreso,
      tipoContratacion,
      profesion,
      universidad,
      correoElectronico,
      declaranteRenta,
      estadoCivil,
      contraseña // Recibimos la contraseña en el cuerpo de la solicitud
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

    // Encriptar la contraseña antes de guardarla
    const contraseñaEncriptada = await bcrypt.hash(contraseña, 10);

    // Crear una nueva instancia de ClienteFormulario con la contraseña encriptada
    const nuevoCliente = new ClienteFormulario({
      fecha: fecha || new Date(), 
      asesor,
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
      contraseña: contraseñaEncriptada // Guardar la contraseña encriptada
    });

    // Guardar el cliente en la base de datos
    await nuevoCliente.save();

    // Enviar una respuesta exitosa, pero solo con la cédula
    res.status(201).json({ message: 'Cliente creado con éxito', cedula: nuevoCliente.cedula });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al crear el cliente', error: error.message });
  }
};

module.exports = crearCliente;
