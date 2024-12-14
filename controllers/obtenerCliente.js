const ExcelJS = require('exceljs');
const ClienteAxia = require('../models/ClienteAxia'); // Asegúrate de poner la ruta correcta

// Controlador para obtener los datos de un cliente por su 'cedula' y devolverlos en formato JSON
const obtenerClientePorCedulaEnJSON = async (req, res) => {
    try {
        // Obtener la 'cedula' del cliente desde los parámetros de la URL
        const {
            cedula
        } = req.params;

        // Buscar el cliente por su 'cedula' en la base de datos
        const cliente = await ClienteAxia.findOne({
            cedula
        });

        // Si no se encuentra el cliente, enviar una respuesta de error
        if (!cliente) {
            return res.status(404).json({
                message: 'Cliente no encontrado con esa cédula'
            });
        }

        // Generar el archivo Excel
        await generarExcel(cliente, res); // Solo enviamos el archivo, no el JSON

    } catch (error) {
        // En caso de error, enviar una respuesta con el error
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

                        const clave = Object.keys(ingreso[empresa])
                        const valor = Object.values(ingreso[empresa])
                        hojaIngresos.addRow([tipoIngreso.replace(/_/g, ' '), clave[0].split('-')[1].replace(/_/g, ' '), valor[0]]);
                    }
                }
            }
        }
    } else {
        hojaIngresos.addRow(['No hay ingresos disponibles']);
    }

    // Crear la hoja "Ahorro"
    const hojaAhorro = workbook.addWorksheet('Ahorro');
    if (cliente.Ahorro && typeof cliente.Ahorro === 'object') {
        const clave = Object.keys(cliente.Ahorro)
        const valor = Object.values(cliente.Ahorro)
        for (let Index in clave) {
            hojaAhorro.addRow([clave[Index].split('-')[0].replace(/_/g, ' '), clave[Index].split('-')[1], valor[Index]]);
        }
    }

    // Crear la hoja "Transporte"
    const hojaTransporte = workbook.addWorksheet('Transporte');
    if (cliente.Transporte && typeof cliente.Transporte === 'object') {
        const clave = Object.keys(cliente.Transporte)
        const valor = Object.values(cliente.Transporte)
        for (let Index in clave) {
            hojaTransporte.addRow([clave[Index].replace(/_/g, ' '), valor[Index]]);

        }
    }


    // Crear la hoja "Descuentos Nomina"
    const hojaDescuentosNomina = workbook.addWorksheet('Descuentos Nomina');
    if (cliente.descuentosnomina && typeof cliente.descuentosnomina === 'object') {
        const clave = Object.keys(cliente.descuentosnomina)
        const valor = Object.values(cliente.descuentosnomina)
        for (let Index in clave) {
            hojaDescuentosNomina.addRow([clave[Index].replace(/_/g, ' '), valor[Index]]);
        }
    }



    // Crear la hoja " Educacion"
    const hojaeducacion = workbook.addWorksheet('Educacion');
    if (cliente.educacion && typeof cliente.educacion === 'object') {
        const clave = Object.keys(cliente.educacion)
        const valor = Object.values(cliente.educacion)
        for (let Index in clave) {
            hojaeducacion.addRow([clave[Index].replace(/_/g, ' '), valor[Index]]);
        }
    }


    // Crear la hoja " Entretenimiento"
    const hojaentretenimiento = workbook.addWorksheet('Entretenimiento');
    if (cliente.entretenimiento && typeof cliente.entretenimiento === 'object') {
        const clave = Object.keys(cliente.entretenimiento)
        const valor = Object.values(cliente.entretenimiento)
        for (let Index in clave) {
            hojaentretenimiento.addRow([clave[Index].replace(/_/g, ' '), valor[Index]]);
        }
    }


    // Crear la hoja " Financieros"
    const hojafinancieros = workbook.addWorksheet('Financieros');
    if (cliente.financieros && typeof cliente.financieros === 'object') {
        const clave = Object.keys(cliente.financieros)
        const valor = Object.values(cliente.financieros)
        for (let Index in clave) {
            hojafinancieros.addRow([clave[Index].replace(/_/g, ' '), valor[Index]]);
        }
    }


    // Crear la hoja "gastosPersonales"
    const gastosPersonales = workbook.addWorksheet('gastos Personales');
    if (cliente.gastosPersonales && typeof cliente.gastosPersonales === 'object') {
        const clave = Object.keys(cliente.gastosPersonales);
        const valor = Object.values(cliente.gastosPersonales);
        for (let Index in clave) {
            gastosPersonales.addRow([clave[Index].replace(/_/g, ' '), valor[Index]]);
        }
    }

    // Crear la hoja "hogar"
    const hogar = workbook.addWorksheet('hogar');
    if (cliente.hogar && typeof cliente.hogar === 'object') {
        const clave = Object.keys(cliente.hogar);
        const valor = Object.values(cliente.hogar);
        for (let Index in clave) {
            hogar.addRow([clave[Index].replace(/_/g, ' '), valor[Index]]);
        }
    }

    // Crear la hoja "otros"
    const otros = workbook.addWorksheet('otros');
    if (cliente.otros && typeof cliente.otros === 'object') {
        const clave = Object.keys(cliente.otros);
        const valor = Object.values(cliente.otros);
        for (let Index in clave) {
            otros.addRow([clave[Index].replace(/_/g, ' '), valor[Index]]);
        }
    }

    // Crear la hoja "protecciones"
    const protecciones = workbook.addWorksheet('protecciones');
    if (cliente.protecciones && typeof cliente.protecciones === 'object') {
        const clave = Object.keys(cliente.protecciones);
        const valor = Object.values(cliente.protecciones);
        for (let Index in clave) {
            protecciones.addRow([clave[Index].replace(/_/g, ' '), valor[Index]]);
        }
    }

    // Crear la hoja "AnualidadesFijas"
    const AnualidadesFijas = workbook.addWorksheet('Anualidades Fijas');
    if (cliente.AnualidadesFijas && typeof cliente.AnualidadesFijas === 'object') {
        const clave = Object.keys(cliente.AnualidadesFijas);
        const valor = Object.values(cliente.AnualidadesFijas);
        for (let Index in clave) {
            AnualidadesFijas.addRow([clave[Index].replace(/_/g, ' '), valor[Index]]);
        }
    }

    // Crear la hoja "AnualidadesPresupuestadas"
    const AnualidadesPresupuestadas = workbook.addWorksheet('Anualidades Presupuestadas');
    if (cliente.AnualidadesPresupuestadas && typeof cliente.AnualidadesPresupuestadas === 'object') {
        const clave = Object.keys(cliente.AnualidadesPresupuestadas);
        const valor = Object.values(cliente.AnualidadesPresupuestadas);
        for (let Index in clave) {
            AnualidadesPresupuestadas.addRow([clave[Index].replace(/_/g, ' '), valor[Index]]);
        }
    }

    // Crear la hoja "Impuestos"
    const Impuestos = workbook.addWorksheet('Impuestos');
    if (cliente.Impuestos && typeof cliente.Impuestos === 'object') {
        const clave = Object.keys(cliente.Impuestos);
        const valor = Object.values(cliente.Impuestos);
        for (let Index in clave) {
            Impuestos.addRow([clave[Index].replace(/_/g, ' '), valor[Index]]);
        }
    }

    // Crear la hoja "seguros"
    const seguros = workbook.addWorksheet('seguros');
    if (cliente.seguros && typeof cliente.seguros === 'object') {
        const clave = Object.keys(cliente.seguros);
        const valor = Object.values(cliente.seguros);
        for (let Index in clave) {
            seguros.addRow([clave[Index].replace(/_/g, ' '), valor[Index]]);
        }
    }

    // Crear la hoja "activoLiquidos"
    const activoLiquidos = workbook.addWorksheet('activo Liquidos');
    if (cliente.activoLiquidos && typeof cliente.activoLiquidos === 'object') {
        const clave = Object.keys(cliente.activoLiquidos);
        const valor = Object.values(cliente.activoLiquidos);
        for (let Index in clave) {
            activoLiquidos.addRow([clave[Index].replace(/_/g, ' '), valor[Index]]);
        }
    }

    // Crear la hoja "activosImproductivos"
    const activosImproductivos = workbook.addWorksheet('activos Improductivos');
    if (cliente.activosImproductivos && typeof cliente.activosImproductivos === 'object') {
        const clave = Object.keys(cliente.activosImproductivos);
        const valor = Object.values(cliente.activosImproductivos);
        for (let Index in clave) {
            activosImproductivos.addRow([clave[Index].replace(/_/g, ' '), valor[Index]]);
        }
    }

    // Crear la hoja "activosProductivos"
    const activosProductivos = workbook.addWorksheet('activos Productivos');
    if (cliente.activosProductivos && typeof cliente.activosProductivos === 'object') {
        const clave = Object.keys(cliente.activosProductivos);
        const valor = Object.values(cliente.activosProductivos);
        for (let Index in clave) {
            activosProductivos.addRow([clave[Index].replace(/_/g, ' '), valor[Index]]);
        }
    }




    // Establecer los encabezados para la descarga
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=cliente_${cliente.cedula}.xlsx`);

    // Escribir el archivo Excel a la respuesta
    await workbook.xlsx.write(res);
    console.log('Archivo Excel generado con éxito');
};


module.exports = obtenerClientePorCedulaEnJSON;