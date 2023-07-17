const { Schema, model } = require("mongoose");

const MunicipalitySchema = Schema({
    department_id: {
        type: Schema.ObjectId,
        ref: "Department",
    },
    municipality_code: {
        type: Number,
        require: true
    },
    municipality_name: {
        type: String,
        required: true
    },
});

module.exports = model("Municipality", MunicipalitySchema, "municipalities");