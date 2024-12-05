const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

// Cambia la contraseña y nombre de usuario según lo que configuraste en MongoDB Atlas
const password = '<new-password>'; // Cambia por tu nueva contraseña
const username = '<new-username>'; // Cambia por tu nuevo nombre de usuario

// Aquí puedes cambiar el nombre de tu base de datos
const dbName = '<new-db-name>'; // Cambia por el nombre de tu nueva base de datos

// Cambia la URL de conexión con los datos específicos de tu nuevo clúster
const connectionString = `mongodb+srv://${username}:${password}@<new-cluster-name>.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
   await mongoose.connect(connectionString)
   .then(() => {
       console.log('DataBase Connected');
   })
   .catch((error) => {
       console.log(error);
   });
};

module.exports = connectDB;
