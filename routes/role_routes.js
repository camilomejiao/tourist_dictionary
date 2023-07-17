const express = require("express");
const api = express.Router();
const RoleController =  require("../controllers/RoleController");

//Ruta Test
api.get("/test", RoleController.test);

//Ruta roles
api.post("/save", RoleController.saveRole);
api.get("/get-roles/", RoleController.getRoles);
api.get("/get-role/:id", RoleController.getRole);
api.delete("/delete-role/:id", RoleController.deleteRole);
api.put("/edit-role/:id", RoleController.updateRole);

module.exports = api;