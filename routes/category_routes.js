const express = require("express");
const api = express.Router();
const auth = require("../middlewares/auth");
const CategoryController =  require("../controllers/CategoryController");

//Ruta Articles
api.post("/save", [auth.auth], CategoryController.saveCategory);
api.get("/get-categories/", [auth.auth], CategoryController.getCategories);
api.get("/get-category/:id", [auth.auth], CategoryController.getCategory);
api.delete("/delete-category/:id", [auth.auth], CategoryController.deleteCategory);
api.put("/edit-category/:id", [auth.auth], CategoryController.updateCategory);

module.exports = api;