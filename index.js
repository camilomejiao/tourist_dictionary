//Importar dependencias
const Conex = require("./BD/conex");
const app = require("./server/app");

//Llamamos el puerto
const port = 3900;

//Iniciar App
console.log("App Start Node Tourist Dictionary ");

//Conex to BD
Conex();

//Escuchar peticiones http
app.listen(port, () => {
    console.log("Servidor corriendo en http://localhost:3900");
});