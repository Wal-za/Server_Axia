const ClienteFormulario = require('../models/ClienteAxia'); // Modelo Cliente

// Controlador para actualizar el cliente
const actualizarCliente = async (req, res) => {
  try {
    const { 
      seguridadsocial, ingresos, Ahorro, Transporte, 
      gastosPersonales, hogar, entretenimiento, protecciones, 
      descuentosnomina, educacion, financieros, otros, 
      seguros, AnualidadesFijas, AnualidadesPresupuestadas, 
      Impuestos, activoLiquidos, activosProductivos, activosImproductivos,
      objetivos, DeudasCortoPlazo, DeudasLargoPlazo, 
      datosMongo 
    } = req.body;

    // Buscar el cliente por la cédula
    const cliente = await ClienteFormulario.findOne({ cedula: datosMongo.cedula });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Actualizamos los datos del cliente, excluyendo campos sensibles
    Object.keys(req.body).forEach(key => {
      if (key !== 'cedula' && key !== 'contraseña' && key !== 'datosMongo') {  // Excluimos la cédula, contraseña y datosMongo

        // Solo actualizamos si el campo no existe o es diferente de lo que ya tiene
        if (cliente[key] === undefined || cliente[key] !== req.body[key]) {

          // Manejo de subdocumentos (objetivos, deudas)
          if (key === 'objetivos' && Array.isArray(objetivos) && objetivos.length > 0) {
            cliente[key] = objetivos.map((obj, index) => ({
              [`objetivo-${index}`]: {
                objetivo: obj.objetivo || "",
                descripcion: obj.descripcion || "",
                plazo: obj.plazo || 0,
                vrObjetivo: obj.vrObjetivo || 0,
                comentarios: obj.comentarios || ""
              }
            }));
          }
          
          else if (key === 'DeudasCortoPlazo' && Array.isArray(DeudasCortoPlazo) && DeudasCortoPlazo.length > 0) {
            cliente[key] = DeudasCortoPlazo.map((deuda, index) => ({
              [`pasivo-${index}`]: {
                pasivo: deuda.pasivo || "",
                saldoCapital: deuda.saldoCapital || "",
                entidad: deuda.entidad || "",
                tasa: deuda.tasa || "",
                cuotasPendientes: deuda.cuotasPendientes || "",
                cuotaMensual: deuda.cuotaMensual || ""
              }
            }));
          } 
          
          else if (key === 'DeudasLargoPlazo' && Array.isArray(DeudasLargoPlazo) && DeudasLargoPlazo.length > 0) {
            cliente[key] = DeudasLargoPlazo.map((deuda, index) => ({
              [`pasivo-${index}`]: {
                pasivo: deuda.pasivo || "",
                saldoCapital: deuda.saldoCapital || "",
                entidad: deuda.entidad || "",
                tasa: deuda.tasa || "",
                cuotasPendientes: deuda.cuotasPendientes || "",
                cuotaMensual: deuda.cuotaMensual || ""
              }
            }));
          }

          // Para otros campos no complejos, los asignamos directamente
          else {
            if (req.body[key] !== undefined && req.body[key] !== null) {
              cliente[key] = req.body[key];
            }
          }
        }
      }
    });

    // Guardamos el cliente actualizado
    await cliente.save();

    // Responder con los datos del cliente actualizado
    res.status(200).json({
      message: 'Cliente actualizado exitosamente',
      cliente: cliente
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el cliente', error: error.message });
  }
};

module.exports = actualizarCliente;
