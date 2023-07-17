const mongoose = require("mongoose");
// we create 'users' collection in newdb database
const url = "mongodb://127.0.0.1:27017/tourist_dictionary";

const Conex = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(url);
        console.log("Conectado correctamente a la BD tourist_dictionary!!!");
    } catch (e) {
        console.log(e);
        console.log("No se ha podido conectar a la BD");
    }
}

module.exports = Conex;