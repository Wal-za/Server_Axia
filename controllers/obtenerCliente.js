const ExcelJS = require('exceljs');
const ClienteAxia = require('../models/ClienteAxia'); 


const obtenerClientePorCedulaEnJSON = async (req, res) => {
    try {     
        const {
            cedula
        } = req.params;
        console.log(cedula)
      
        const cliente = await ClienteAxia.findOne({
            cedula
        });

        if (!cliente) {
            return res.status(404).json({
                message: 'Cliente no encontrado con esa cédula'
            });
        }

        await generarExcel(cliente, res);
    } catch (error) {
       
        res.status(500).json({
            message: 'Error al obtener el cliente',
            error: error.message
        });
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
    hojaDatosBasicos.addRow(['Sexo',cliente.sexo ]);
    hojaDatosBasicos.addRow(['nombre', cliente.nombre]);
    hojaDatosBasicos.addRow(['apellidos', cliente.apellidos]);
    hojaDatosBasicos.addRow(['cedula', cliente.cedula]);
    hojaDatosBasicos.addRow(['fechaNacimiento', cliente.fechaNacimiento]);
    hojaDatosBasicos.addRow(['lugarNacimiento', cliente.lugarNacimiento]);
    hojaDatosBasicos.addRow(['edad', cliente.edad]);   
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


    // Crear la hoja "Seguridad Social"  
    if (cliente.seguridadsocial) {
        const hojaSeguridadSocial = workbook.addWorksheet('Seguridad Social');
        hojaSeguridadSocial.addRow(['Eps', cliente.seguridadsocial?.EPS || '']);
        hojaSeguridadSocial.addRow(['Arl', cliente.seguridadsocial?.ARL || '']);
        hojaSeguridadSocial.addRow(['Fondo_cesantias', cliente.seguridadsocial?.Fondo_Cesantias || '']);  
        hojaSeguridadSocial.addRow(['Afp', cliente.seguridadsocial?.AFP || '']);
        hojaSeguridadSocial.addRow(['', '']);
        hojaSeguridadSocial.addRow(['Medicina_prepagada', cliente.seguridadsocial?.Medicina_Prepagada || '']);       
    }

    // Crear la hoja "Ingresos"
    if (cliente.ingresos && typeof cliente.ingresos === 'object') {        
       const hojaIngresos = workbook.addWorksheet('Ingresos');
        for (let tipoIngreso in cliente.ingresos) {
            if (cliente.ingresos.hasOwnProperty(tipoIngreso)) {
                const ingreso = cliente.ingresos[tipoIngreso];
                for (let empresa in ingreso) {
                    if (ingreso.hasOwnProperty(empresa)) {
                        const clave = Object.keys(ingreso[empresa])
                        const valor = Object.values(ingreso[empresa])
                        hojaIngresos.addRow([clave[0].replace(/[-_]/g, ' '), Number(valor[0])]);
                    }
                }
            }
        }
    } 

    // Crear la hoja "Ahorro"    
    if (cliente.Ahorro && typeof cliente.Ahorro === 'object') {       
        const hojaAhorro = workbook.addWorksheet('Ahorro');
        const clave = Object.keys(cliente.Ahorro)
        const valor = Object.values(cliente.Ahorro)
        for (let Index in clave) {
            hojaAhorro.addRow([clave[Index].replace(/[-_]/g, ' '),  Number(valor[Index])]);
        }
    } 


      // Crear la hoja "Transporte"      
      if (cliente.Transporte && typeof cliente.Transporte === 'object') {
        const hojaTransporte = workbook.addWorksheet('Transporte');
          const clave = Object.keys(cliente.Transporte)
          const valor = Object.values(cliente.Transporte)
          for (let Index in clave) {
              hojaTransporte.addRow([clave[Index].replace(/[-_]/g, ' '), Number(valor[Index])]);  
          }
      }

       // Crear la hoja "gastosPersonales"
    if (cliente.gastosPersonales && typeof cliente.gastosPersonales === 'object') {
        const gastosPersonales = workbook.addWorksheet('Gastos Personales');
        const clave = Object.keys(cliente.gastosPersonales);
        const valor = Object.values(cliente.gastosPersonales);
        for (let Index in clave) {
            gastosPersonales.addRow([clave[Index].replace(/[-_]/g, ' '), Number(valor[Index])]);
        }
    }

    // Crear la hoja "hogar"  
    if (cliente.hogar && typeof cliente.hogar === 'object') {
        const hogar = workbook.addWorksheet('hogar');
        const clave = Object.keys(cliente.hogar);
        const valor = Object.values(cliente.hogar);
        for (let Index in clave) {
            hogar.addRow([clave[Index].replace(/[-_]/g, ' '), Number(valor[Index])]);
        }
    }

  // Crear la hoja " Entretenimiento"   
  if (cliente.entretenimiento && typeof cliente.entretenimiento === 'object') {
    const hojaentretenimiento = workbook.addWorksheet('Entretenimiento');
    const clave = Object.keys(cliente.entretenimiento)
    const valor = Object.values(cliente.entretenimiento)
    for (let Index in clave) {
        hojaentretenimiento.addRow([clave[Index].replace(/[-_]/g, ' '), Number(valor[Index])]);
    }
}


 // Crear la hoja "protecciones" 
 if (cliente.protecciones && typeof cliente.protecciones === 'object') {
     const protecciones = workbook.addWorksheet('protecciones');
     const clave = Object.keys(cliente.protecciones);
     const valor = Object.values(cliente.protecciones);
     for (let Index in clave) {
         protecciones.addRow([clave[Index].replace(/[-_]/g, ' '), Number(valor[Index])]);
     }
 }

 // Crear la hoja "Descuentos Nomina"    
 if (cliente.descuentosnomina && typeof cliente.descuentosnomina === 'object') {
    const hojaDescuentosNomina = workbook.addWorksheet('Descuentos Nomina');
    const clave = Object.keys(cliente.descuentosnomina)
    const valor = Object.values(cliente.descuentosnomina)
    for (let Index in clave) {
        hojaDescuentosNomina.addRow([clave[Index].replace(/[-_]/g, ' '), Number(valor[Index])]);
    }
}



  // Crear la hoja " Educacion"
  if (cliente.educacion && typeof cliente.educacion === 'object') {
      const hojaeducacion = workbook.addWorksheet('Educacion');
      const clave = Object.keys(cliente.educacion)
      const valor = Object.values(cliente.educacion)
      for (let Index in clave) {
          hojaeducacion.addRow([clave[Index].replace(/[-_]/g, ' '), Number(valor[Index])]);
      }
  }


// Crear la hoja " Financieros"
if (cliente.financieros && typeof cliente.financieros === 'object') {
    const hojafinancieros = workbook.addWorksheet('Financieros');
    const clave = Object.keys(cliente.financieros)
    const valor = Object.values(cliente.financieros)
    for (let Index in clave) {
        hojafinancieros.addRow([clave[Index].replace(/[-_]/g, ' '), Number(valor[Index])]);
    }
}


// Crear la hoja "otros"
if (cliente.otros && typeof cliente.otros === 'object') {
    const otros = workbook.addWorksheet('otros');
    const clave = Object.keys(cliente.otros);
    const valor = Object.values(cliente.otros);
    for (let Index in clave) {
        otros.addRow([clave[Index].replace(/[-_]/g, ' '), Number(valor[Index])]);
    }
}

 // Crear la hoja "seguros" 
 if (cliente.seguros && typeof cliente.seguros === 'object') {
    const seguros = workbook.addWorksheet('seguros');
     const clave = Object.keys(cliente.seguros);
     const valor = Object.values(cliente.seguros);
     for (let Index in clave) {
         seguros.addRow([clave[Index].replace(/_/g, ' '), Number(valor[Index])]);
     }
 }


   // Crear la hoja "AnualidadesFijas"   
   if (cliente.AnualidadesFijas && typeof cliente.AnualidadesFijas === 'object') {
       const AnualidadesFijas = workbook.addWorksheet('Anualidades Fijas');
       const clave = Object.keys(cliente.AnualidadesFijas);
       const valor = Object.values(cliente.AnualidadesFijas);
       for (let Index in clave) {
           AnualidadesFijas.addRow([clave[Index].replace(/_/g, ' '), Number(valor[Index])]);
       }
   }

     // Crear la hoja "AnualidadesPresupuestadas"
     const AnualidadesPresupuestadas = workbook.addWorksheet('Anualidades Presupuestadas');
     if (cliente.AnualidadesPresupuestadas && typeof cliente.AnualidadesPresupuestadas === 'object') {
         const clave = Object.keys(cliente.AnualidadesPresupuestadas);
         const valor = Object.values(cliente.AnualidadesPresupuestadas);
         for (let Index in clave) {
             AnualidadesPresupuestadas.addRow([clave[Index].replace(/_/g, ' '), Number(valor[Index])]);
         }
     }


      // Crear la hoja "Impuestos"    
    if (cliente.Impuestos && typeof cliente.Impuestos === 'object') {
        const Impuestos = workbook.addWorksheet('Impuestos');
        const clave = Object.keys(cliente.Impuestos);
        const valor = Object.values(cliente.Impuestos);
        for (let Index in clave) {
            Impuestos.addRow([clave[Index].replace(/_/g, ' '), Number(valor[Index])]);
        }
    }




//Crear la hoja "Objetivos"
if (cliente.objetivos && Array.isArray(cliente.objetivos)) {
    const hojaObjetivos = workbook.addWorksheet('Objetivos');
    let columnNumber = 1; 
    cliente.objetivos.forEach((valores) => {
        valores.forEach((subcampoArray, subcampo) => {           
            hojaObjetivos.getCell(1, columnNumber).value = subcampo; // Coloca el encabezado
            let rowNumber = 2; 
            subcampoArray.forEach((valor) => {              
                const numericValue = isNaN(valor) ? valor : Number(valor);               
                hojaObjetivos.getCell(rowNumber, columnNumber).value = numericValue;
                rowNumber++; 
            });
            columnNumber++; 
        });
    });
}

// Crear la hoja "activo Liquidos"
const activoLiquidos = workbook.addWorksheet('activo Liquidos');
if (cliente.activoLiquidos && typeof cliente.activoLiquidos === 'object') {
    const clave = Object.keys(cliente.activoLiquidos);
    const valor = Object.values(cliente.activoLiquidos);
    for (let Index in clave) {
        activoLiquidos.addRow([clave[Index].replace(/_/g, ' ').split('-')[0], clave[Index].replace(/_/g, ' ').split('-')[1], Number(valor[Index])]);
    }
}

 

// Crear la hoja "activosProductivos"
const activosProductivos = workbook.addWorksheet('activos Productivos');
if (cliente.activosProductivos && typeof cliente.activosProductivos === 'object') {
    const clave = Object.keys(cliente.activosProductivos);
    const valor = Object.values(cliente.activosProductivos);
    for (let Index in clave) {
        activosProductivos.addRow([clave[Index].replace(/_/g, ' ').split('-')[0], clave[Index].replace(/_/g, ' ').split('-')[1], Number(valor[Index])]);
    }
}


// Crear la hoja "activosImproductivos"
if (cliente.activosImproductivos && typeof cliente.activosImproductivos === 'object') {
    const activosImproductivos = workbook.addWorksheet('activos Improductivos');
    const claves = Object.keys(cliente.activosImproductivos);
    const valores = Object.values(cliente.activosImproductivos);
    for (let Index in claves) {
        const [antesDelGuion, despuesDelGuion] = claves[Index].replace(/_/g, ' ').split('-');
        activosImproductivos.addRow([antesDelGuion, despuesDelGuion, Number(valores[Index])]);
    }
}


// Crear la hoja "Deudas Corto Plazo"  
if (cliente.DeudasCortoPlazo && Array.isArray(cliente.DeudasCortoPlazo)) {
    const hojaDeudasCortoPlazo = workbook.addWorksheet('Deudas Corto Plazo');
    let columnNumber = 1; 
    cliente.DeudasCortoPlazo.forEach((valores) => {
        valores.forEach((subcampoArray, subcampo) => {           
            hojaDeudasCortoPlazo.getCell(1, columnNumber).value = subcampo; 
            let rowNumber = 2; 
            subcampoArray.forEach((valor) => {                
                const numericValue = isNaN(valor) ? valor : Number(valor);                
                hojaDeudasCortoPlazo.getCell(rowNumber, columnNumber).value = numericValue;
                rowNumber++; 
            });
            columnNumber++; 
        });
    });
}


// Crear la hoja "Deudas Largo Plazo"
const hojaDeudasLargoPlazo = workbook.addWorksheet('Deudas Largo Plazo');
if (cliente.DeudasLargoPlazo && Array.isArray(cliente.DeudasLargoPlazo)) {
    let columnNumber = 1;
    cliente.DeudasLargoPlazo.forEach((valores) => {
        valores.forEach((subcampoArray, subcampo) => {
            hojaDeudasLargoPlazo.getCell(1, columnNumber).value = subcampo; 
            let rowNumber = 2;
            subcampoArray.forEach((valor) => {
                const numericValue = isNaN(valor) ? valor : Number(valor);
                hojaDeudasLargoPlazo.getCell(rowNumber, columnNumber).value = numericValue;
                rowNumber++; 
            });
            columnNumber++; 
        });
    });
}









































  


   


  

    


    


   

    

    
   

  

  

   
   
   

    
    




    // Establecer los encabezados para la descarga
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Cliente_Axia.xlsx`);

    // Escribir el archivo Excel a la respuesta
    await workbook.xlsx.write(res);
    console.log('Archivo Excel generado con éxito');
};


module.exports = obtenerClientePorCedulaEnJSON;