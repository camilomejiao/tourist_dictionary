const express = require("express");
const app = express();
const cors = require("cors");

//Middlewares //Son metodos que se ejecutan antes de llegar al controlador
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //form-www-encode

//Cors configuracion de cabeceras http
app.use(cors());

//Instanciar Rutas
const RoleRoutes = require("../routes/role_routes");
const UserRoutes = require("../routes/user_routes");
const CategoryRoutes = require("../routes/category_routes");
const DepartmentMunicipalityRoutes = require("../routes/department_municipality_routes");
const CustomerRotes = require("../routes/customer_routes");

//Cargar Rutas
app.use("/api/role", RoleRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/category", CategoryRoutes);
app.use("/api/depa-muni", DepartmentMunicipalityRoutes);
app.use("/api/customer", CustomerRotes);


//Exportar
module.exports = app;