const ExcelJS = require('exceljs');
    const ClienteAxia = require('../models/ClienteAxia');

    const exportarClientesExcel = async (req, res) => {
        try {
            const clientes = await ClienteAxia.find({}, {
                fecha: 1,
                nombre: 1,
                apellidos: 1,
                cedula: 1,
                fechaNacimiento: 1,
                celular: 1,
                correoElectronico: 1,
                edad: 1,
                empresa: 1,
                _id: 0
            });

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Clientes');

            // Definir encabezados
            worksheet.columns = [
                { header: 'Fecha', key: 'fecha', width: 15 },
                { header: 'Nombre', key: 'nombre', width: 20 },
                { header: 'Apellido', key: 'apellidos', width: 20 },
                { header: 'Cédula', key: 'cedula', width: 15 },
                { header: 'Fecha Nacimiento', key: 'fechaNacimiento', width: 15 },
                { header: 'Celular', key: 'celular', width: 15 },
                { header: 'Correo Electrónico', key: 'correoElectronico', width: 25 },
                { header: 'Edad', key: 'edad', width: 10 },
                { header: 'Empresa', key: 'empresa', width: 20 },
            ];

            // Agregar los datos de los clientes
            clientes.forEach(cliente => {
                worksheet.addRow(cliente);
            });

            // Escribir el archivo en memoria
            const buffer = await workbook.xlsx.writeBuffer();

            // Configurar encabezados para la descarga
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=clientesAxia.xlsx');

            // Enviar el buffer como respuesta
            res.send(buffer);

        } catch (error) {
            console.error('Error al generar el archivo Excel:', error);
            res.status(500).json({ error: 'Error al generar el archivo Excel' });
        }
    };

    module.exports = exportarClientesExcel;