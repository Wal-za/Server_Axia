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
    } = req.body;  // Desestructuramos los datos de la solicitud

    console.log('Recibiendo solicitud de actualización con los siguientes datos:', req.body);

    // Buscar el cliente por la cédula
    const cliente = await ClienteFormulario.findOne({ cedula: datosMongo.cedula });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Actualizamos los datos del cliente con los datos recibidos, excepto la cédula y la contraseña
    Object.keys(req.body).forEach(key => {
      if (key !== 'cedula' && key !== 'contraseña' && key !== 'datosMongo') {  // Excluimos la cédula, contraseña y datosMongo

        // Manejo de subdocumentos como "objetivos" o "Deudas"
        if (key === 'objetivos' && Array.isArray(objetivos) && objetivos.length > 0) {
          // Actualizamos los objetivos, con los valores recibidos
          cliente[key] = objetivos.map((obj, index) => {
            return {
              [`objetivo-${index}`]: {
                Objetivo: obj.Objetivo || "",
                Descripción: obj.Descripción || "",
                'Plazo (Años)': obj['Plazo (Años)'] || 0,
                'Valor del objetivo': obj['Valor del objetivo'] || 0,
                Comentarios: obj.Comentarios || ""
              }
            };
          });
        }
        
        // Manejo de deudas de corto plazo
        else if (key === 'DeudasCortoPlazo' && Array.isArray(DeudasCortoPlazo) && DeudasCortoPlazo.length > 0) {
          // Actualizamos las deudas de corto plazo, con los valores recibidos
          cliente[key] = DeudasCortoPlazo.map((deuda, index) => {
            return {
              [`pasivo-${index}`]: {
                Pasivo: deuda.Pasivo || "",
                'Saldo de Capital': deuda['Saldo de Capital'] || "",
                Entidad: deuda.Entidad || "",
                'Tasa (%)': deuda['Tasa (%)'] || "",
                '# Cuotas Pendientes': deuda['# Cuotas Pendientes'] || "",
                'Cuota Mensual': deuda['Cuota Mensual'] || ""
              }
            };
          });
        } 
        
        // Manejo de deudas de largo plazo
        else if (key === 'DeudasLargoPlazo' && Array.isArray(DeudasLargoPlazo) && DeudasLargoPlazo.length > 0) {
          // Actualizamos las deudas de largo plazo, con los valores recibidos
          console.log(DeudasLargoPlazo)
          cliente[key] = DeudasLargoPlazo.map((deuda, index) => {
            return {
              
              [`pasivo-${index}`]: {
                Pasivo: deuda.Pasivo || "",
                'Saldo de Capital': deuda['Saldo de Capital'] || "",
                Entidad: deuda.Entidad || "",
                'Tasa (%)': deuda['Tasa (%)'] || "",
                '# Cuotas Pendientes': deuda['# Cuotas Pendientes'] || "",
                'Cuota Mensual': deuda['Cuota Mensual'] || ""
              }
            };
          });
        }

        // Para otros campos no complejos, los asignamos directamente
        else {
          // Se asegura que se guarde solo si existe un valor
          if (req.body[key] !== undefined && req.body[key] !== null) {
            cliente[key] = req.body[key];
          }
        }
      }
    });

    // Guardamos el cliente actualizado
    await cliente.save();

    // Responder con los datos del cliente actualizado
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
