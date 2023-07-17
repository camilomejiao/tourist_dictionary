const express = require("express");
const api = express.Router();
const auth = require("../middlewares/auth");
const DepartmentMunicipalityController = require("../controllers/DepartmentMunicipalityController");

//
api.get("/get-depa", [auth.auth], DepartmentMunicipalityController.getDepartments);
api.get("/get-muni/:id", [auth.auth], DepartmentMunicipalityController.getMunicipality);

module.exports = api;