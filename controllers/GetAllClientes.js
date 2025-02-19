const ExcelJS = require('exceljs');
const ClienteAxia = require('../models/ClienteAxia');
const fs = require('fs');
const path = require('path');
const os = require('os'); // Para obtener la carpeta Descargas del usuario

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

        // Obtener la ruta de la carpeta Descargas del usuario
        const downloadFolderPath = path.join(os.homedir(), 'Downloads');
        const filePath = path.join(downloadFolderPath, 'clientesAxia.xlsx');

        // Crear un nuevo libro de Excel
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
            worksheet.addRow({
                fecha: cliente.fecha,
                nombre: cliente.nombre,
                apellidos: cliente.apellidos,
                cedula: cliente.cedula,
                fechaNacimiento: cliente.fechaNacimiento,
                celular: cliente.celular,
                correoElectronico: cliente.correoElectronico,
                edad: cliente.edad,
                empresa: cliente.empresa,
            });
        });

        // Guardar el archivo en la carpeta Descargas
        await workbook.xlsx.writeFile(filePath);

        // Enviar la respuesta con la ubicación del archivo
        res.status(200).json({
            mensaje: 'Archivo guardado correctamente',
            ruta: filePath
        });

    } catch (error) {
        console.error('Error al generar el archivo Excel:', error);
        res.status(500).json({ error: 'Error al generar el archivo Excel' });
    }
};

module.exports = exportarClientesExcel;
