const { Schema, model } = require("mongoose");

const CategorySchema = Schema({
    categorie: {
        type: String,
        require: true,
    },
    active: {
        type: Boolean,
        default: true,
        require: false
    }
});

module.exports = model("Category", CategorySchema, "categories");