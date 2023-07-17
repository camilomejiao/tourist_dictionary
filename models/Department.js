const { Schema, model } = require("mongoose");

const DepartmentSchema = Schema({
    department_code: {
        type: Number,
        require: true
    },
    department: {
        type: String,
        require: true,
    },
});

module.exports = model("Department", DepartmentSchema, "departments");