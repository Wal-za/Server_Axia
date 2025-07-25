const MiniPlan = require('../models/ApiMiniPLan');

// Función para normalizar los datos según el esquema de Mongoose
const normalizarSegunEsquema = (data, schema) => {
  if (!schema || !schema.paths) {
    throw new Error('El esquema no está definido o no tiene paths');
  }

  const result = {};
  for (const key in schema.paths) {
    if (key === '_id' || key === '__v') continue; // Ignorar campos internos de Mongoose

    const tipo = schema.paths[key].instance; // Ejemplo: 'String', 'Number', 'Boolean'

    let valor = data[key];

    if (valor === undefined || valor === null || valor === '') {
      // Valores por defecto según tipo
      if (tipo === 'Number') valor = 0;
      else if (tipo === 'Boolean') valor = false;
      else valor = '';
    } else {
      // Convertir al tipo correspondiente
      switch (tipo) {
        case 'Number':
          valor = parseFloat(valor);
          if (isNaN(valor)) valor = 0;
          break;
        case 'Boolean':
          if (typeof valor === 'string') {
            const valStr = valor.toLowerCase().trim();
            valor = (valStr === 'true' || valStr === 'sí' || valStr === 'si' || valStr === 'yes');
          } else {
            valor = Boolean(valor);
          }
          break;
        case 'String':
          valor = String(valor);
          break;
        // Agrega otros tipos si es necesario
      }
    }

    result[key] = valor;
  }
  return result;
};

const procesarMiniPlan = async (req, res) => {
  try {
    const datos = req.body;

    // Validar que el body no esté vacío ni sin propiedades
    if (
      !datos ||
      Object.keys(datos).length === 0 ||
      Object.values(datos).every(value => value === '' || value === null || value === undefined)
    ) {
      return res.status(400).json({
        error: 'Por favor, complete el formulario antes de enviarlo.'
      });
    }

    // Normalizar datos según esquema
    const datosNormalizados = normalizarSegunEsquema(datos, MiniPlan.schema);

    // Guardar en la base de datos
    const nuevoMiniPlan = new MiniPlan(datosNormalizados);
    await nuevoMiniPlan.save();

    // Convertir a objeto plano para evitar problemas con Mongoose
    const datosPlan = nuevoMiniPlan.toObject();

    // Calcular resumen financiero con datos limpios
    const resumen = calcularResumenFinanciero(datosPlan);

    // Enviar respuesta exitosa con resumen
    res.status(201).json({
      mensaje: 'MiniPlan guardado correctamente',
      resumenFinanciero: resumen
    });

  } catch (error) {
    console.error('❌ Error al procesar MiniPlan:', error);
    res.status(500).json({ error: error.message || 'Error al procesar el formulario' });
  }
};


const calcularResumenFinanciero = (form) => {
  const resumen = [];

  // Variables numéricas aseguradas desde el controlador
  const ingresoTotal =
    (form.ingresoNetoMensual || 0) +
    (form.ingresoTrimestral || 0) +
    (form.ingresosAdicionales || 0);

  const ingresosAnuales =
    (form.bonificacionesAnuales || 0) +
    (form.primaAnual || 0);

  const totalDeudasMensuales = form.totalDeudasMensuales || 0;
  const deudaTotal = form.deuda || 0;
  const patrimonio = form.patrimonio || 0;

  const ratioDeudaIngresos = ingresoTotal > 0 ? totalDeudasMensuales / ingresoTotal : 0;
  const ratioPasivoActivo = patrimonio > 0 ? deudaTotal / patrimonio : 0;

  resumen.push("🟢 Verde: ¡Lo estás haciendo muy bien! Vas por un excelente camino en este aspecto de tus finanzas.");
  resumen.push("🟡 Amarillo: Hay oportunidades de mejora. Estás en una zona intermedia y podrías fortalecer aún más esta área.");
  resumen.push("🔴 Rojo: Este aspecto necesita atención. Lo que estás haciendo actualmente no es suficiente y deberías tomar medidas para mejorar.");

  if (ingresosAnuales > 0) {
    resumen.push("Estos ingresos podrían ser utilizados para provisionar tus extras a lo largo del año como impuestos, viajes, compras de diciembre, entre otros. Por esto, te recomiendo tener presente estos gastos y ahorrar este monto.");
  } else {
    resumen.push("Teniendo presente que no se reciben ingresos anuales como bonos o primas, vale la pena que provisiones tus extras a lo largo del año.");
  }

  if (ratioDeudaIngresos === 0) {
    resumen.push("🔵 No cuentas con endeudamiento, lo cual es favorable. Ten presente invertir para lograr tus objetivos.");
  } else if (ratioDeudaIngresos <= 0.3) {
    resumen.push("🟢 Cuentas con un porcentaje bajo de endeudamiento, lo cual es aceptable.");
  } else {
    resumen.push("🔴 Cuentas con un porcentaje alto de endeudamiento. Vale la pena que revises cómo bajar el porcentaje que estás destinando a tus deudas. No obstante, revisa otros indicadores como endeudamiento en el patrimonio. Ten presente que las deudas buenas corresponden a un análisis diferente ya que estás poniendo dinero en tu bolsillo después de haberte endeudado.");
  }

  const gastosAnuales =
    (form.segurosAnuales || 0) +
    (form.anualidadesFijas || 0) +
    (form.anualidadesVariables || 0) +
    (form.impuestos || 0);

  if (ingresosAnuales > 0) {
    resumen.push("Recuerda revisar si tus ingresos anuales cubren tus gastos anuales. Si esto no pasa, vale la pena que provisiones estos gastos ya que caes en el riesgo de tomar deudas para cubrirlos.");
  } else {
    resumen.push("Ten presente que es importante provisionar estos gastos ya que caes en el riesgo de tomar deudas para cubrirlos.");
  }

  // Validar planB, considerando "0" como sin plan B
  if (form.planB && String(form.planB).trim() !== '' && String(form.planB) !== '0') {
    resumen.push("🟡 Es clave validar si el monto que estás ahorrando para tu pensión realmente te permitirá mantener tu estilo de vida al retirarte. Un buen plan de retiro necesita una base financiera sólida.");
  } else {
    resumen.push("🔴 No tener un plan B para tu pensión puede poner en riesgo tu bienestar futuro. Comienza a construir desde hoy un ahorro complementario que te permita retirarte con tranquilidad.");
  }

  if (form.seguroVida === 'No') {
    if (form.tieneHijosDependientes === 'Sí') {
      resumen.push("🔴 No contar con un seguro de vida teniendo hijos puede poner en riesgo la estabilidad financiera de tu familia en caso de una eventualidad. Considera incluirlo dentro de tu planeación financiera cuanto antes.");
    } else {
      resumen.push("🟡 Aunque no tengas dependientes o personas a cargo, los seguros de vida pueden ser una herramienta estratégica. Actualmente existen opciones que no solo brindan protección, sino que también te ayudan a optimizar impuestos y planificar tu pensión.");
    }
  }

  if (form.seguroIncapacidad === 'No') {
    resumen.push("🔴 Tu capacidad de generar ingresos es uno de tus activos más valiosos. Un seguro de incapacidad te protege si por alguna razón no puedes seguir ejerciendo tu profesión.");
  } else if (form.seguroIncapacidad === 'Sí') {
    resumen.push("🟡 Revisa las cláusulas de tu seguro de incapacidad o valores de cobertura ya que a veces esto no es suficiente para protegerte si una enfermedad grave afecta tus finanzas.");
  }

  if (form.polizaSalud === 'Sí') {
    resumen.push("🟢 ¡Excelente! Contar con un seguro de salud adicional demuestra una planificación financiera inteligente. Esta cobertura te permite acceder a mejores servicios.");
  } else if (form.polizaSalud === 'No') {
    resumen.push("🔴 Depender únicamente del sistema de salud obligatorio puede no ser suficiente frente a una urgencia o enfermedad de alto costo. Tener una cobertura adicional te da acceso más ágil y de mejor calidad a los servicios médicos.");
  }

  if (form.fondoEmergencia === 'Sí') {
    resumen.push("🟢 ¡Muy bien! Tener un fondo de emergencia demuestra una excelente gestión financiera. Asegúrate de que ese fondo sea suficiente para cubrir al menos entre tres y seis meses de tus gastos fijos.");
  } else if (form.fondoEmergencia === 'No') {
    resumen.push("🔴 No contar con un fondo de emergencia te deja expuesto a dificultades económicas en caso de imprevistos, como desempleo, enfermedad o una reparación urgente.");
  }

  if (ratioPasivoActivo > 0.5) {
    resumen.push("🔴 Cuentas con un elevado nivel de endeudamiento. Es importante que empieces a gestionar una estrategia de desmonte de deudas y a su vez generar inversiones para tener libertad financiera.");
  } else if (ratioPasivoActivo >= 0.3) {
    resumen.push("🟡 Cuentas con un nivel de endeudamiento aceptable. Es importante buscar bajar la deuda y a su vez generar inversiones para tener libertad financiera.");
  } else {
    resumen.push("🟢 Cuentas con un nivel de endeudamiento adecuado. Vale la pena comenzar muy pronto una estrategia de inversiones.");
  }

  return { resumen };
};

module.exports = { procesarMiniPlan };
