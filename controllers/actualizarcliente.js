const ClienteFormulario = require('../models/ClienteAxia'); // Modelo Cliente

// Controlador para actualizar el cliente
const actualizarCliente = async (req, res) => {
  try {
    const { 
      seguridadsocial, ingresos, ingresosanuales, Ahorro, Transporte, 
      gastosPersonales, hogar, entretenimiento, protecciones, 
      descuentosnomina, educacion, financieros, otros, 
      seguros, AnualidadesFijas, AnualidadesPresupuestadas, 
      Impuestos, activoLiquidos, activosProductivos, activosImproductivos,
      objetivos, DeudasCortoPlazo, DeudasLargoPlazo, 
      datosMongo 
    } = req.body;

   

    // Buscar el cliente por la cédula que está en datosMongo
    const cliente = await ClienteFormulario.findOne({ cedula: datosMongo.cedula });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Siempre actualizar el campo `fieldset` si se proporciona en datosMongo
    if (datosMongo.hasOwnProperty('fieldset')) {
      cliente.fieldset = datosMongo.fieldset;
    } else {
      // Si no se pasa el campo `fieldset`, asignamos el valor predeterminado (0)
      cliente.fieldset = 0;
    }

    // Actualizar todos los demás campos sin importar si son iguales o no al valor actual
    Object.keys(req.body).forEach(key => {
      if (key !== 'cedula' && key !== 'contraseña' && key !== 'datosMongo') {  // Excluimos la cédula, contraseña y datosMongo

        // Siempre actualizamos el campo sin verificar si el valor ha cambiado
        if (req.body[key] !== undefined && req.body[key] !== null) {
          // Manejo de subdocumentos (objetivos, deudas)
          if (key === 'objetivos' && Array.isArray(objetivos) && objetivos.length > 0) {
            cliente[key] = objetivos.map((obj, index) => ({
              [`objetivo-${index}`]: {
                objetivo: obj.objetivo || "0",
                descripcion: obj.descripcion || "0",
                plazo: obj.plazo || 0,
                vrObjetivo: obj.vrObjetivo || 0,
                comentarios: obj.comentarios || "0"
              }
            }));
          }
          
          else if (key === 'DeudasCortoPlazo' && Array.isArray(DeudasCortoPlazo) && DeudasCortoPlazo.length > 0) {
            cliente[key] = DeudasCortoPlazo.map((deuda, index) => ({
              [`pasivo-${index}`]: {
                pasivo: deuda.pasivo || "0",
                saldoCapital: deuda.saldoCapital || "0",
                entidad: deuda.entidad || "0",
                tasa: deuda.tasa || "0",
                cuotasPendientes: deuda.cuotasPendientes || "0",
                cuotaMensual: deuda.cuotaMensual || "0"
              }
            }));
          } 
          
          else if (key === 'DeudasLargoPlazo' && Array.isArray(DeudasLargoPlazo) && DeudasLargoPlazo.length > 0) {
            cliente[key] = DeudasLargoPlazo.map((deuda, index) => ({
              [`pasivo-${index}`]: {
                pasivo: deuda.pasivo || "0",
                saldoCapital: deuda.saldoCapital || "0",
                entidad: deuda.entidad || "0",
                tasa: deuda.tasa || "0",
                cuotasPendientes: deuda.cuotasPendientes || "0",
                cuotaMensual: deuda.cuotaMensual || "0"
              }
            }));
          }

          // Para otros campos no complejos, los asignamos directamente
          else {
            cliente[key] = req.body[key]; // Actualizamos directamente el valor
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
