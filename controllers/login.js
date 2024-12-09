const ClienteFormulario = require('../models/ClienteAxia'); 
const bcrypt = require('bcryptjs'); 

// Controlador para login (iniciar sesión)
const loginCliente = async (req, res) => {
  try {
    const { username, password } = req.body; 

    const cliente = await ClienteFormulario.findOne({ correoElectronico: username }); 
    
    if (!cliente) {
      return res.status(400).json({ message: 'Correo electrónico no registrado' });
    }

    const esContraseñaValida = await bcrypt.compare(password, cliente.contraseña); 
    
    if (!esContraseñaValida) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    res.status(200).json({
      valid: true, 
      cliente: cliente // Enviar todos los datos del cliente al front
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

module.exports = loginCliente;
