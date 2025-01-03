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
    hojaDatosBasicos.addRow(['Sexo', cliente.sexo]);
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
    if (cliente.ingresos && typeof cliente.ingresos === 'object' && Object.keys(cliente.ingresos).length > 0) {
        const hojaIngresos = workbook.addWorksheet('Ingresos');

        for (let key in cliente.ingresos) {
            const ingresos = cliente.ingresos[key];
            const claves = Object.keys(ingresos);
            const valores = Object.values(ingresos);

            if (claves.length === valores.length) {
                for (let i = 0; i < claves.length; i++) {
                    hojaIngresos.addRow([claves[i].replace(/[-_]/g, ' '), Number(valores[i])]);
                }
            } else {
                console.error("Las claves y los valores no coinciden en longitud para", key);
            }
        }
    }




    // Crear la hoja "Ahorro"    
    if (cliente.Ahorro && typeof cliente.Ahorro === 'object' && Object.keys(cliente.Ahorro).length > 0) {
        const hojaAhorro = workbook.addWorksheet('Ahorro');
        const clave = Object.keys(cliente.Ahorro)
        const valor = Object.values(cliente.Ahorro)
        for (let Index in clave) {
            hojaAhorro.addRow([clave[Index].replace(/[-_]/g, ' '), Number(valor[Index])]);
        }
    }


    // Crear la hoja "Transporte"      
    if (cliente.Transporte && typeof cliente.Transporte === 'object' && Object.keys(cliente.Transporte).length > 0) {
        const hojaTransporte = workbook.addWorksheet('Transporte');
        const clave = Object.keys(cliente.Transporte)
        const valor = Object.values(cliente.Transporte)
        for (let Index in clave) {
            hojaTransporte.addRow([clave[Index].replace(/[-_]/g, ' '), Number(valor[Index])]);
        }
    }

    // Crear la hoja "gastosPersonales"
    if (cliente.gastosPersonales && typeof cliente.gastosPersonales === 'object' && Object.keys(cliente.gastosPersonales).length > 0) {
        const gastosPersonales = workbook.addWorksheet('Gastos Personales');
        const clave = Object.keys(cliente.gastosPersonales);
        const valor = Object.values(cliente.gastosPersonales);
        for (let Index in clave) {
            gastosPersonales.addRow([clave[Index].replace(/[-_]/g, ' '), Number(valor[Index])]);
        }
    }

    // Crear la hoja "hogar"  
    if (cliente.hogar && typeof cliente.hogar === 'object' && Object.keys(cliente.hogar).length > 0) {
        const hogar = workbook.addWorksheet('hogar');
        const clave = Object.keys(cliente.hogar);
        const valor = Object.values(cliente.hogar);
        for (let Index in clave) {
            hogar.addRow([clave[Index].replace(/[-_]/g, ' '), Number(valor[Index])]);
        }
    }

    // Crear la hoja " Entretenimiento"   
    if (cliente.entretenimiento && typeof cliente.entretenimiento === 'object' && Object.keys(cliente.entretenimiento).length > 0) {
        const hojaentretenimiento = workbook.addWorksheet('Entretenimiento');
        const clave = Object.keys(cliente.entretenimiento)
        const valor = Object.values(cliente.entretenimiento)
        for (let Index in clave) {
            hojaentretenimiento.addRow([clave[Index].replace(/[-_]/g, ' '), Number(valor[Index])]);
        }
    }


    // Crear la hoja "protecciones" 
    if (cliente.protecciones && typeof cliente.protecciones === 'object' && Object.keys(cliente.protecciones).length > 0) {
        const protecciones = workbook.addWorksheet('protecciones');
        const clave = Object.keys(cliente.protecciones);
        const valor = Object.values(cliente.protecciones);
        for (let Index in clave) {
            protecciones.addRow([clave[Index].replace(/[-_]/g, ' '), Number(valor[Index])]);
        }
    }

    // Crear la hoja "Descuentos Nomina"    
    if (cliente.descuentosnomina && typeof cliente.descuentosnomina === 'object' && Object.keys(cliente.descuentosnomina).length > 0) {
        const hojaDescuentosNomina = workbook.addWorksheet('Descuentos Nomina');
        const clave = Object.keys(cliente.descuentosnomina)
        const valor = Object.values(cliente.descuentosnomina)
        for (let Index in clave) {
            hojaDescuentosNomina.addRow([clave[Index].replace(/[-_]/g, ' '), Number(valor[Index])]);
        }
    }



    // Crear la hoja " Educacion"
    if (cliente.educacion && typeof cliente.educacion === 'object' && Object.keys(cliente.educacion).length > 0) {
        const hojaeducacion = workbook.addWorksheet('Educacion');
        const clave = Object.keys(cliente.educacion)
        const valor = Object.values(cliente.educacion)
        for (let Index in clave) {
            hojaeducacion.addRow([clave[Index].replace(/[-_]/g, ' '), Number(valor[Index])]);
        }
    }


    // Crear la hoja " Financieros"
    if (cliente.financieros && typeof cliente.financieros === 'object' && Object.keys(cliente.financieros).length > 0) {
        const hojafinancieros = workbook.addWorksheet('Financieros');
        const clave = Object.keys(cliente.financieros)
        const valor = Object.values(cliente.financieros)
        for (let Index in clave) {
            hojafinancieros.addRow([clave[Index].replace(/[-_]/g, ' '), Number(valor[Index])]);
        }
    }

    // Crear la hoja Ingresos Anuales  
    if (cliente.IngresosAnuales && typeof cliente.IngresosAnuales === 'object' && Object.keys(cliente.IngresosAnuales).length > 0) {
        const hojaAhorro = workbook.addWorksheet('Ingresos Anuales');
        for (let tipoIngreso in cliente.IngresosAnuales) {
            if (cliente.IngresosAnuales.hasOwnProperty(tipoIngreso)) {
                let tipoIngresoModificado = tipoIngreso.replace(/[-_]/g, ' ');
                const ingresos = cliente.IngresosAnuales[tipoIngreso];
                if (Array.isArray(ingresos)) {
                    ingresos.forEach((valor, index) => {
                        if (typeof valor === 'object') {
                            for (let key in valor) {
                                if (valor.hasOwnProperty(key)) {
                                    hojaAhorro.addRow([key.replace(/[-_]/g, ' '), Number(valor[key])]);
                                }
                            }
                        } else {
                            hojaAhorro.addRow([tipoIngresoModificado, Number(valor)]);
                        }
                    });
                } else if (typeof ingresos === 'object') {
                    for (let empresa in ingresos) {
                        if (ingresos.hasOwnProperty(empresa)) {
                            const clave = Object.keys(ingresos[empresa])[0].replace(/[-_]/g, ' ');
                            const valor = Object.values(ingresos[empresa])[0];
                            hojaAhorro.addRow([clave, Number(valor)]);
                        }
                    }
                } else if (typeof ingresos === 'string' || typeof ingresos === 'number') {
                    hojaAhorro.addRow([tipoIngresoModificado, Number(ingresos)]);
                }
            }
        }
    }




    // Crear la hoja "otros"
    if (cliente.otros && typeof cliente.otros === 'object' && Object.keys(cliente.otros).length > 0) {
        const hojaOtros = workbook.addWorksheet('otros');
        for (let tipoOtro in cliente.otros) {
            if (cliente.otros.hasOwnProperty(tipoOtro)) {
                let tipoOtroModificado = tipoOtro.replace(/[-_]/g, ' ');
                const valores = cliente.otros[tipoOtro];
                if (Array.isArray(valores)) {
                    valores.forEach((valor, index) => {
                        if (typeof valor === 'object') {
                            for (let key in valor) {
                                if (valor.hasOwnProperty(key)) {
                                    hojaOtros.addRow([key.replace(/[-_]/g, ' '), Number(valor[key])]);
                                }
                            }
                        } else {
                            hojaOtros.addRow([tipoOtroModificado, Number(valor)]);
                        }
                    });
                } else if (typeof valores === 'object') {
                    for (let empresa in valores) {
                        if (valores.hasOwnProperty(empresa)) {
                            const clave = Object.keys(valores[empresa])[0].replace(/[-_]/g, ' ');
                            const valor = Object.values(valores[empresa])[0];
                            hojaOtros.addRow([clave, Number(valor)]);
                        }
                    }
                } else if (typeof valores === 'string' || typeof valores === 'number') {
                    hojaOtros.addRow([tipoOtroModificado, Number(valores)]);
                }
            }
        }
    }


    // Crear la hoja "seguros" 
    if (cliente.seguros && typeof cliente.seguros === 'object' && Object.keys(cliente.seguros).length > 0) {
        const seguros = workbook.addWorksheet('seguros');
        for (let tipoSeguro in cliente.seguros) {
            if (cliente.seguros.hasOwnProperty(tipoSeguro)) {
                let tipoSeguroModificado = tipoSeguro.replace(/[-_]/g, ' ');
                const valores = cliente.seguros[tipoSeguro];
                if (Array.isArray(valores)) {
                    valores.forEach((valor, index) => {
                        if (typeof valor === 'object') {
                            for (let key in valor) {
                                if (valor.hasOwnProperty(key)) {
                                    seguros.addRow([key.replace(/[-_]/g, ' '), Number(valor[key])]);
                                }
                            }
                        } else {
                            seguros.addRow([tipoSeguroModificado, Number(valor)]);
                        }
                    });
                } else if (typeof valores === 'object') {
                    for (let empresa in valores) {
                        if (valores.hasOwnProperty(empresa)) {
                            const clave = Object.keys(valores[empresa])[0].replace(/[-_]/g, ' ');
                            const valor = Object.values(valores[empresa])[0];
                            seguros.addRow([clave, Number(valor)]);
                        }
                    }
                } else if (typeof valores === 'string' || typeof valores === 'number') {
                    seguros.addRow([tipoSeguroModificado, Number(valores)]);
                }
            }
        }
    }



    // Crear la hoja "AnualidadesFijas"   
    if (cliente.AnualidadesFijas && typeof cliente.AnualidadesFijas === 'object' && Object.keys(cliente.AnualidadesFijas).length > 0) {
        const AnualidadesFijas = workbook.addWorksheet('Anualidades Fijas');
        const clave = Object.keys(cliente.AnualidadesFijas);
        const valor = Object.values(cliente.AnualidadesFijas);
        for (let Index in clave) {
            AnualidadesFijas.addRow([clave[Index].replace(/_/g, ' '), Number(valor[Index])]);
        }
    }

    // Crear la hoja "AnualidadesPresupuestadas"

    if (cliente.AnualidadesPresupuestadas && typeof cliente.AnualidadesPresupuestadas === 'object' && Object.keys(cliente.AnualidadesPresupuestadas).length > 0) {
        const AnualidadesPresupuestadas = workbook.addWorksheet('Anualidades Presupuestadas');
        const clave = Object.keys(cliente.AnualidadesPresupuestadas);
        const valor = Object.values(cliente.AnualidadesPresupuestadas);
        for (let Index in clave) {
            AnualidadesPresupuestadas.addRow([clave[Index].replace(/_/g, ' '), Number(valor[Index])]);
        }
    }


    // Crear la hoja "Impuestos"    
    if (cliente.Impuestos && typeof cliente.Impuestos === 'object' && Object.keys(cliente.Impuestos).length > 0) {
        const Impuestos = workbook.addWorksheet('Impuestos');
        for (let tipoImpuesto in cliente.Impuestos) {
            if (cliente.Impuestos.hasOwnProperty(tipoImpuesto)) {
                let tipoImpuestoModificado = tipoImpuesto.replace(/[-_]/g, ' ');
                const valores = cliente.Impuestos[tipoImpuesto];
                if (Array.isArray(valores)) {
                    valores.forEach((valor, index) => {
                        if (typeof valor === 'object') {
                            for (let key in valor) {
                                if (valor.hasOwnProperty(key)) {
                                    Impuestos.addRow([key.replace(/[-_]/g, ' '), Number(valor[key])]);
                                }
                            }
                        } else {
                            Impuestos.addRow([tipoImpuestoModificado, Number(valor)]);
                        }
                    });
                } else if (typeof valores === 'object') {
                    for (let empresa in valores) {
                        if (valores.hasOwnProperty(empresa)) {
                            const clave = Object.keys(valores[empresa])[0].replace(/[-_]/g, ' ');
                            const valor = Object.values(valores[empresa])[0];
                            Impuestos.addRow([clave, Number(valor)]);
                        }
                    }
                } else if (typeof valores === 'string' || typeof valores === 'number') {
                    Impuestos.addRow([tipoImpuestoModificado, Number(valores)]);
                }
            }
        }
    }




    // Crear la hoja "Objetivos"
    if (cliente.objetivos && Array.isArray(cliente.objetivos) && JSON.stringify(cliente.objetivos[0]) != '{}') {
        const hojaObjetivos = workbook.addWorksheet('Objetivos');
        let columnNumber = 1;
        cliente.objetivos.forEach((valores) => {
            valores.forEach((subcampoArray, subcampo) => {
                if (!Array.isArray(subcampoArray)) {
                    subcampoArray = [subcampoArray];
                }
                hojaObjetivos.getCell(1, columnNumber).value = subcampo;
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
if (cliente.activoLiquidos && typeof cliente.activoLiquidos === 'object' && cliente.activoLiquidos !== null && Object.keys(cliente.activoLiquidos).length > 0) {
    const activoLiquidos = workbook.addWorksheet('activo Liquidos');
    const claves = Object.keys(cliente.activoLiquidos);
    const valores = Object.values(cliente.activoLiquidos);
    for (let i = 0; i < claves.length; i++) {
        const clave = claves[i];
        const valor = valores[i];     
        const clavePartes = clave.replace(/_/g, ' ').split('-');
        const numero = isNaN(Number(valor)) ? 0 : Number(valor);
        activoLiquidos.addRow([clavePartes[0], clavePartes[1], numero]);
    }
}




    // Crear la hoja "activosProductivos"
    if (cliente.activosProductivos && typeof cliente.activosProductivos === 'object' && Object.keys(cliente.activosProductivos).length > 0) {
        const activosProductivos = workbook.addWorksheet('activos Productivos');
        const clave = Object.keys(cliente.activosProductivos);
        const valor = Object.values(cliente.activosProductivos);
        for (let Index in clave) {
            activosProductivos.addRow([clave[Index].replace(/_/g, ' ').split('-')[0], clave[Index].replace(/_/g, ' ').split('-')[1], Number(valor[Index])]);
        }
    }


    // Crear la hoja "activosImproductivos"
    if (cliente.activosImproductivos && typeof cliente.activosImproductivos === 'object' && Object.keys(cliente.activosImproductivos).length > 0) {
        const activosImproductivos = workbook.addWorksheet('activos Improductivos');
        const claves = Object.keys(cliente.activosImproductivos);
        const valores = Object.values(cliente.activosImproductivos);
        for (let Index in claves) {
            const [antesDelGuion, despuesDelGuion] = claves[Index].replace(/_/g, ' ').split('-');
            activosImproductivos.addRow([antesDelGuion, despuesDelGuion, Number(valores[Index])]);
        }
    }



    // Crear la hoja "Deudas Corto Plazo"
    if (cliente.DeudasCortoPlazo && Array.isArray(cliente.DeudasCortoPlazo) && JSON.stringify(cliente.DeudasCortoPlazo[0]) != '{}') {
        const hojaDeudasCortoPlazo = workbook.addWorksheet('Deudas Corto Plazo');
        let columnNumber = 1;
        
        cliente.DeudasCortoPlazo.forEach((valores) => {
            valores.forEach((subcampoArray, subcampo) => {               
                hojaDeudasCortoPlazo.getCell(1, columnNumber).value = subcampo;                
                let rowNumber = 2;
    
                // Si el subcampo es 'tasa', le aplicamos formato de porcentaje
                if (subcampo.toLowerCase() === 'tasa') {                   
                    if (!Array.isArray(subcampoArray)) {
                        subcampoArray = [subcampoArray];
                    }   
                        subcampoArray.forEach((valor) => {                        
                        const numericValue = isNaN(valor) ? valor : Number(valor) / 100;      
                        hojaDeudasCortoPlazo.getCell(rowNumber, columnNumber).value = numericValue;                          
                        hojaDeudasCortoPlazo.getCell(rowNumber, columnNumber).numFmt = '0.00%';
                        rowNumber++;
                    });
                } else {                    
                    if (!Array.isArray(subcampoArray)) {
                        subcampoArray = [subcampoArray];
                    }
    
                    subcampoArray.forEach((valor) => {
                        const numericValue = isNaN(valor) ? valor : Number(valor);
                        hojaDeudasCortoPlazo.getCell(rowNumber, columnNumber).value = numericValue;
                        rowNumber++;
                    });
                }
    
                columnNumber++;
            });
        });
    }        

    // Crear la hoja "Deudas Largo Plazo"
    if (cliente.DeudasLargoPlazo && Array.isArray(cliente.DeudasLargoPlazo) && JSON.stringify(cliente.DeudasLargoPlazo[0]) != '{}') {
        const hojaDeudasLargoPlazo = workbook.addWorksheet('Deudas Largo Plazo');
        let columnNumber = 1;        
        cliente.DeudasLargoPlazo.forEach((valores) => {
            valores.forEach((subcampoArray, subcampo) => {             
                hojaDeudasLargoPlazo.getCell(1, columnNumber).value = subcampo;                
                let rowNumber = 2;                   
                if (subcampo.toLowerCase() === 'tasa') {                 
                    if (!Array.isArray(subcampoArray)) {
                        subcampoArray = [subcampoArray];
                    }                 
                    subcampoArray.forEach((valor) => {                      
                        const numericValue = isNaN(valor) ? valor : Number(valor) / 100;      
                        hojaDeudasLargoPlazo.getCell(rowNumber, columnNumber).value = numericValue;                           
                        hojaDeudasLargoPlazo.getCell(rowNumber, columnNumber).numFmt = '0.00%';
                        rowNumber++;
                    });
                } else {                   
                    if (!Array.isArray(subcampoArray)) {
                        subcampoArray = [subcampoArray];
                    }    
                    subcampoArray.forEach((valor) => {
                        const numericValue = isNaN(valor) ? valor : Number(valor);
                        hojaDeudasLargoPlazo.getCell(rowNumber, columnNumber).value = numericValue;
                        rowNumber++;
                    });
                }
    
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