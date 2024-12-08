const { Schema, model } = require('mongoose');

const ClienteAxiaSchema = new Schema({
  fecha: { type: Date, default: Date.now}, // Fecha (dd/mm/aaaa)
  sexo: { type: String, required: true }, // Sexo
  nombre: { type: String, required: true }, // Nombre
  apellidos: { type: String, required: true }, // Apellidos
  cedula: { type: String, required: true,unique: true}, // Cédula de Ciudadanía
  fechaNacimiento: { type: Date, required: true }, // Fecha de Nacimiento
  lugarNacimiento: { type: String, required: true }, // Lugar de Nacimiento
  edad: { type: Number, required: true }, // Edad
  direccionCasa: { type: String }, // Dirección Casa
  direccionOficina: { type: String }, // Dirección Oficina
  celular: { type: String, required: true }, // Celular
  telefonoCasa: { type: String }, // Teléfono Casa
  telefonoOficina: { type: String }, // Teléfono Oficina
  empresa: { type: String }, // Empresa
  cargo: { type: String }, // Cargo
  fechaIngresoCompania: { type: Date }, // Fecha de Ingreso Compañía
  tipoContratacion: { type: String}, // Tipo de contratación
  profesion: { type: String }, // Profesión
  universidad: { type: String}, // Universidad
  correoElectronico: { type: String, required: true,unique: true }, // Correo Electronico
  declaranteRenta: { type: Boolean }, // Declarante de Renta
  estadoCivil: { type: String }, // Estado Civil
  eps: { type: String }, // EPS
  prepaga: { type: String }, // PREPAGADA
  arl: { type: String }, // ARL
  fondoCesantias: { type: String }, // FONDO DE CESANTIAS
  saldoFondoCesantias: { type: Number }, // SALDO FONDO DE CESANTIAS
  afp: { type: String }, // AFP
  saldoAfp: { type: Number }, // SALDO AFP
  
});

// Configuración de `toJSON` para ocultar campos sensibles
ClienteAxiaSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// Crear el modelo basado en el esquema
const ClienteAxia = model('ClienteAxia', ClienteAxiaSchema);

// Exportar el modelo para usarlo en otras partes de la aplicación
module.exports = ClienteAxia;
