const ExcelJS = require('exceljs');
const ClienteAxia = require('../models/ClienteAxia'); // Asegúrate de poner la ruta correcta

// Controlador para obtener los datos de un cliente por su 'cedula' y devolverlos en formato JSON
const obtenerClientePorCedulaEnJSON = async (req, res) => {
  try {
    // Obtener la 'cedula' del cliente desde los parámetros de la URL
    const { cedula } = req.params;

    // Buscar el cliente por su 'cedula' en la base de datos
    const cliente = await ClienteAxia.findOne({ cedula });

    // Si no se encuentra el cliente, enviar una respuesta de error
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado con esa cédula' });
    }

    // Generar el archivo Excel
    await generarExcel(cliente, res);  // Solo enviamos el archivo, no el JSON

  } catch (error) {
    // En caso de error, enviar una respuesta con el error
    res.status(500).json({ message: 'Error al obtener el cliente', error: error.message });
  }
};


// Función para generar el archivo Excel


const generarExcel = async (cliente, res) => {
  const workbook = new ExcelJS.Workbook();

  // Función auxiliar para agregar filas si el campo es un array o valor
  const addArrayRows = (worksheet, sheetName, fieldName, array) => {
    if (array && Array.isArray(array)) {
      array.forEach(item => {
        worksheet.addRow([sheetName, fieldName, item || 'No disponible']);
      });
    } else {
      worksheet.addRow([sheetName, fieldName, array || 'No disponible']);
    }
  };


  // Crear la hoja "Datos Básicos"
  const hojaDatosBasicos = workbook.addWorksheet('Datos Básicos');
  hojaDatosBasicos.addRow(['Campo Principal', 'Subcampo', 'Valor']);
  hojaDatosBasicos.addRow(['nombre', cliente.nombre]);
  hojaDatosBasicos.addRow(['apellidos', cliente.apellidos]);
  hojaDatosBasicos.addRow(['cedula', cliente.cedula]);
  hojaDatosBasicos.addRow(['fechaNacimiento', cliente.fechaNacimiento]);
  hojaDatosBasicos.addRow(['edad', cliente.edad]);
  hojaDatosBasicos.addRow(['lugarNacimiento', cliente.lugarNacimiento]);
  hojaDatosBasicos.addRow(['direccionCasa', cliente.direccionCasa]);
  hojaDatosBasicos.addRow(['direccionOficina', cliente.direccionOficina]);
  hojaDatosBasicos.addRow(['celular', cliente.celular]);
  hojaDatosBasicos.addRow(['telefonoCasa', cliente.telefonoCasa]);
  hojaDatosBasicos.addRow(['telefonoOficina', cliente.telefonoOficina]);
  hojaDatosBasicos.addRow(['empresa', cliente.empresa]);
  hojaDatosBasicos.addRow(['cargo', cliente.cargo]);
  hojaDatosBasicos.addRow(['fechaIngreso', cliente.fechaIngreso]);
  hojaDatosBasicos.addRow(['tipoContratacion', cliente.tipoContratacion]);
  hojaDatosBasicos.addRow(['profesion', cliente.profesion]);
  hojaDatosBasicos.addRow(['universidad', cliente.universidad]);
  hojaDatosBasicos.addRow(['correoElectronico', cliente.correoElectronico]);
  hojaDatosBasicos.addRow(['declaranteRenta', cliente.declaranteRenta]);
  hojaDatosBasicos.addRow(['estadoCivil', cliente.estadoCivil]);
  hojaDatosBasicos.addRow(['contraseña', cliente.contraseña]);
  hojaDatosBasicos.addRow(['fieldset', cliente.fieldset]);

  
// Crear la hoja "Seguridad Social"  
  if (cliente.seguridadsocial) {
    const hojaSeguridadSocial = workbook.addWorksheet('Seguridad Social');
    Object.keys(cliente.seguridadsocial).forEach(key => {
      const valor = cliente.seguridadsocial[key];   
      hojaSeguridadSocial.addRow([        
        key, 
        valor || 'No disponible' 
      ]);
    });
  }

 
  // Crear la hoja "Deudas Corto Plazo"
  const hojaDeudasCortoPlazo = workbook.addWorksheet('Deudas Corto Plazo');
  if (cliente.DeudasCortoPlazo && Array.isArray(cliente.DeudasCortoPlazo)) {
    cliente.DeudasCortoPlazo.forEach((valores) => {  
      let rowNumber = hojaDeudasCortoPlazo.rowCount + 1;    
      valores.forEach((subcampoArray, subcampo) => {        
        hojaDeudasCortoPlazo.getCell(rowNumber, 1).value = subcampo;          
        let columnNumber = 2;  
        subcampoArray.forEach((valor) => {           
          hojaDeudasCortoPlazo.getCell(rowNumber, columnNumber).value = valor;
          columnNumber++;  
        });    
        rowNumber++;
      });
    });
  } else {
    hojaDeudasCortoPlazo.addRow(['No hay deudas a corto plazo disponibles']);
  }

  // Crear la hoja "Deudas Largo Plazo"
  const hojaDeudasLargoPlazo = workbook.addWorksheet('Deudas Largo Plazo');
  if (cliente.DeudasLargoPlazo && Array.isArray(cliente.DeudasLargoPlazo)) {
    cliente.DeudasLargoPlazo.forEach((valores) => {  
      let rowNumber = hojaDeudasLargoPlazo.rowCount + 1;    
      valores.forEach((subcampoArray, subcampo) => {        
        hojaDeudasLargoPlazo.getCell(rowNumber, 1).value = subcampo;          
        let columnNumber = 2;  
        subcampoArray.forEach((valor) => {           
          hojaDeudasLargoPlazo.getCell(rowNumber, columnNumber).value = valor;
          columnNumber++;  
        });    
        rowNumber++;
      });
    });
  } else {
    hojaDeudasLargoPlazo.addRow(['No hay deudas a largo plazo disponibles']);
  }

  // Crear la hoja "Objetivos"
  const hojaObjetivos = workbook.addWorksheet('Objetivos');
  if (cliente.objetivos && Array.isArray(cliente.objetivos)) {
    cliente.objetivos.forEach((valores) => {  
      let rowNumber = hojaObjetivos.rowCount + 1;    
      valores.forEach((subcampoArray, subcampo) => {        
        hojaObjetivos.getCell(rowNumber, 1).value = subcampo;          
        let columnNumber = 2;  
        subcampoArray.forEach((valor) => {           
          hojaObjetivos.getCell(rowNumber, columnNumber).value = valor;
          columnNumber++;  
        });    
        rowNumber++;
      });
    });
  } else {
    hojaObjetivos.addRow(['No hay objetivos disponibles']);
  }

  // Crear la hoja "Ingresos"
  const hojaIngresos = workbook.addWorksheet('Ingresos');
  if (cliente.ingresos && typeof cliente.ingresos === 'object') {
    for (let tipoIngreso in cliente.ingresos) {
      if (cliente.ingresos.hasOwnProperty(tipoIngreso)) {
        const ingreso = cliente.ingresos[tipoIngreso];    
        for (let empresa in ingreso) {
          if (ingreso.hasOwnProperty(empresa)) {               
            
            const clave =  Object.keys(ingreso[empresa])   
            const valor =  Object.values(ingreso[empresa])  
            hojaIngresos.addRow([tipoIngreso, clave[0].split('-')[1], valor[0] ]);
          }
        }
      }
    }
  } else {
    hojaIngresos.addRow(['No hay ingresos disponibles']);
  }

  // Crear la hoja "Ahorro"



  const hojaAhorro  = workbook.addWorksheet('Ahorro');
  if (cliente.Ahorro && typeof cliente.Ahorro === 'object') {
    const clave =  Object.keys( cliente.Ahorro)   
    const valor =  Object.values( cliente.Ahorro)  
    for (let Ahorro in clave) {  
      hojaAhorro.addRow([clave[Ahorro].split('-')[0], clave[Ahorro].split('-')[1], valor[Ahorro] ]);
 
  }}

 
 

  // Crear la hoja "Transporte"
  const hojaTransporte = workbook.addWorksheet('Transporte');
  hojaTransporte.addRow(['Transporte', 'Parqueadero', cliente.Transporte?.Parqueadero]);
  hojaTransporte.addRow(['Transporte', 'Transporte_escolar', cliente.Transporte?.Transporte_escolar]);
  hojaTransporte.addRow(['Transporte', 'Uber', cliente.Transporte?.Uber]);

  // Crear la hoja "Descuentos Nomina"
  const hojaDescuentosNomina = workbook.addWorksheet('Descuentos Nomina');
  hojaDescuentosNomina.addRow(['Descuentos Nomina', 'Salud', cliente.descuentosnomina?.Salud]);
  hojaDescuentosNomina.addRow(['Descuentos Nomina', 'Pension', cliente.descuentosnomina?.Pension]);
  hojaDescuentosNomina.addRow(['Descuentos Nomina', 'Salud 1', cliente.descuentosnomina?.['Salud 1']]);
  hojaDescuentosNomina.addRow(['Descuentos Nomina', 'Aporte_a_fondo_de_solidaridad', cliente.descuentosnomina?.['Aporte_a_fondo_de_solidaridad']]);

  // Establecer los encabezados para la descarga
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=cliente_${cliente.cedula}.xlsx`);

  // Escribir el archivo Excel a la respuesta
  await workbook.xlsx.write(res);
  console.log('Archivo Excel generado con éxito');
};


module.exports = obtenerClientePorCedulaEnJSON;
