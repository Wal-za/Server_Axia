const { Schema, model } = require('mongoose');

// Definir el esquema para el formulario del cliente (ClienteAxias)
const ClienteAxiasSchema = new Schema({
  fecha: { type: Date, default: Date.now },
  sexo: { type: String, required: true },
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  cedula: { type: String, required: true, unique: true },
  fechaNacimiento: { type: Date, required: true },
  lugarNacimiento: { type: String, required: true },
  edad: { type: Number, required: true },
  direccionCasa: { type: String, required: true },
  direccionOficina: { type: String, required: true },
  celular: { type: String, required: true },
  telefonoCasa: { type: String, required: true },
  telefonoOficina: { type: String, required: true },
  empresa: { type: String, required: true },
  cargo: { type: String, required: true },
  fechaIngreso: { type: Date, required: true },
  tipoContratacion: { type: String, required: true },
  profesion: { type: String, required: true },
  universidad: { type: String, required: true },
  correoElectronico: { type: String, required: true, unique: true },
  declaranteRenta: { type: String, required: true },
  estadoCivil: { type: String, required: true },
  contraseña: { type: String, required: true }
});

// Configuración para transformar los datos antes de enviarlos como respuesta (JSON)
ClienteAxiasSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// Convertir la fechaNacimiento y fechaIngreso de string a Date al guardar
ClienteAxiasSchema.pre('save', function (next) {
  if (typeof this.fechaNacimiento === 'string') {
    this.fechaNacimiento = new Date(this.fechaNacimiento);  // Convertir cadena a Date
  }
  if (typeof this.fechaIngreso === 'string') {
    this.fechaIngreso = new Date(this.fechaIngreso);  // Convertir cadena a Date
  }
  next();
});

// Crear y exportar el modelo basado en el esquema
const ClienteAxias = model('ClienteAxias', ClienteAxiasSchema);

module.exports = ClienteAxias;
