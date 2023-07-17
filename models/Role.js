const { Schema, model } = require("mongoose");

const RoleSchema = Schema({
    role_name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: false
    },
    active: {
        type: Boolean,
        default: true,
        require: false
    }
});

module.exports = model("Role", RoleSchema, "roles");