const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const MiniPlan = require('../models/ApiMiniPLan');

const normalizarSegunEsquema = (data, schema) => {
  if (!schema || !schema.paths) {
    throw new Error('El esquema no está definido o no tiene paths');
  }

  const result = {};
  for (const key in schema.paths) {
    if (key === '_id' || key === '__v') continue;
    const tipo = schema.paths[key].instance;
    let valor = data[key];

    if (valor === undefined || valor === null || valor === '') {
      if (tipo === 'Number') valor = 0;
      else if (tipo === 'Boolean') valor = false;
      else valor = '';
    } else {
      switch (tipo) {
        case 'Number':
          valor = parseFloat(valor);
          if (isNaN(valor)) valor = 0;
          break;
        case 'Boolean':
          if (typeof valor === 'string') {
            const valStr = valor.toLowerCase().trim();
            valor = ['true', 'sí', 'si', 'yes'].includes(valStr);
          } else {
            valor = Boolean(valor);
          }
          break;
        case 'String':
          valor = String(valor);
          break;
      }
    }

    result[key] = valor;
  }
  return result;
};

const calcularResumenFinanciero = (form) => {
  const resumen = [];

  const ingresoTotal = (form.ingresoNetoMensual || 0) + (form.ingresoTrimestral || 0) + (form.ingresosAdicionales || 0);
  const ingresosAnuales = (form.bonificacionesAnuales || 0) + (form.primaAnual || 0);
  const totalDeudasMensuales = form.totalDeudasMensuales || 0;
  const deudaTotal = form.deuda || 0;
  const patrimonio = form.patrimonio || 0;

  const ratioDeudaIngresos = ingresoTotal > 0 ? totalDeudasMensuales / ingresoTotal : 0;
  const ratioPasivoActivo = patrimonio > 0 ? deudaTotal / patrimonio : 0;

  if (ingresosAnuales > 0) {
    resumen.push("Tus ingresos anuales podrían ser utilizados para cubrir gastos extraordinarios como impuestos, vacaciones o compras.");
  } else {
    resumen.push("Como no tienes ingresos anuales extras, deberías planificar cómo cubrir esos gastos importantes.");
  }

  if (ratioDeudaIngresos === 0) {
    resumen.push("No tienes endeudamiento mensual, excelente para tu salud financiera.");
  } else if (ratioDeudaIngresos <= 0.3) {
    resumen.push("Tu nivel de deuda mensual es bajo, lo cual es bueno.");
  } else {
    resumen.push("Tienes un nivel alto de endeudamiento mensual, considera reducirlo.");
  }

  if (form.planB === '' || form.planB === '0') {
    resumen.push("No cuentas con un plan B para tu pensión, lo cual puede afectar tu futuro.");
  } else {
    resumen.push("Revisa si el ahorro para pensión es suficiente para mantener tu estilo de vida.");
  }

  if (form.seguroVida === 'No') {
    if (form.tieneHijosDependientes === 'Sí') {
      resumen.push("No tener seguro de vida teniendo hijos puede afectar su estabilidad.");
    } else {
      resumen.push("Aunque no tengas dependientes, considera el seguro de vida como estrategia financiera.");
    }
  }

  if (form.seguroIncapacidad === 'No') {
    resumen.push("No tener seguro de incapacidad te deja vulnerable ante imprevistos laborales.");
  }

  if (form.polizaSalud === 'No') {
    resumen.push("Depender solo del sistema obligatorio puede ser insuficiente en emergencias.");
  }

  if (form.fondoEmergencia === 'No') {
    resumen.push("No contar con fondo de emergencia puede afectar tu estabilidad en imprevistos.");
  }

  if (ratioPasivoActivo > 0.5) {
    resumen.push("Tienes un nivel elevado de endeudamiento general.");
  } else if (ratioPasivoActivo >= 0.3) {
    resumen.push("Tu nivel de endeudamiento es aceptable.");
  } else {
    resumen.push("Tu nivel de endeudamiento es adecuado.");
  }

  return resumen;
};

const procesarMiniPlan = async (req, res) => {
  try {
    const datos = req.body;

    console.log(datos)

    if (!datos || Object.keys(datos).length === 0 || Object.values(datos).every(v => v === '' || v === null || v === undefined)) {
      return res.status(400).json({ error: 'Por favor, complete el formulario antes de enviarlo.' });
    }

    const datosNormalizados = normalizarSegunEsquema(datos, MiniPlan.schema);
    const nuevoMiniPlan = new MiniPlan(datosNormalizados);
    await nuevoMiniPlan.save();

    const datosPlan = nuevoMiniPlan.toObject();
    const resumen = calcularResumenFinanciero(datosPlan);

    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="resumen_financiero.pdf"',
        'Content-Length': pdfData.length
      });
      res.send(pdfData);
    });

    // LOGO SIMULADO
    try {
      const logoPath = path.join(__dirname, '../assets/logo.png'); // reemplaza con tu ruta real
      if (fs.existsSync(logoPath)) doc.image(logoPath, { fit: [100, 100], align: 'center' });
    } catch (e) { }

    doc.moveDown();
    doc.fontSize(20).font('Helvetica-Bold').text('PLAN FINANCIERO PERSONALIZADO', { align: 'center' });
    doc.moveDown();   

    doc.fontSize(12).font('Helvetica').text(`Nombre: ${datosPlan.nombre}`);
    doc.fontSize(12).font('Helvetica').text(`Nombre: ${datosPlan.nombre || '---'}`);
    doc.text(`Cargo: ${datosPlan.cargo || '---'}`);
    doc.text(`Empresa: ${datosPlan.empresa || '---'}`);
    doc.text(`Email: ${datos.email || datos.Email || datosPlan.email || '---'}`);
    doc.text(`Celular: ${datosPlan.celular || '---'}`);
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('OBJETIVOS DE VIDA', { underline: true });
    (datosPlan.objetivos || []).forEach(obj => doc.font('Helvetica').text(`• ${obj}`));
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('LIBERTAD FINANCIERA', { underline: true });
    doc.fontSize(12).font('Helvetica').text('5.000.000 x 12 = $1.000.000.000');
    doc.text('Este es el total del monto ($1.000.000.000) que deberías ahorrar para lograr tu libertad financiera.');
    doc.text('Sabemos que armando un portafolio de inversiones ganador, lo lograrás.');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('ANÁLISIS FINANCIERO', { underline: true });
    resumen.forEach(linea => {
      const color = linea.includes('No') || linea.includes('alto') ? 'red' : linea.includes('bajo') ? 'green' : 'black';
      doc.fillColor(color).fontSize(12).font('Helvetica').text(`• ${linea}`);
    });
    doc.fillColor('black');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('REFLEXIÓN FINAL', { underline: true });
    doc.fontSize(12).font('Helvetica-Oblique').text('“Cada decisión que tomes terminará llevándote a donde quieras llegar o alejándote de tus propósitos de vida.”', {
      align: 'center'
    });
    doc.moveDown();

    doc.fontSize(12).font('Helvetica-Bold').text('Axia Finanzas');
    doc.font('Helvetica').text('Contáctanos para tomar decisiones que apunten a tu libertad financiera.');
    doc.end();

  } catch (error) {
    console.error('❌ Error al procesar MiniPlan:', error);
    res.status(500).json({ error: error.message || 'Error al procesar el formulario' });
  }
};

module.exports = { procesarMiniPlan };
