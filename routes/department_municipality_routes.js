const express = require("express");
const api = express.Router();
const DepartmentMunicipalityController = require("../controllers/DepartmentMunicipalityController");

//
api.get("/get-depa", DepartmentMunicipalityController.getDepartments);
api.get("/get-muni/:id?", DepartmentMunicipalityController.getMunicipality);

module.exports = api;