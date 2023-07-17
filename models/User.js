const { Schema, model } = require("mongoose");
const mongoosePagination = require('mongoose-paginate-v2');

const UserSchema = Schema({
    role_id: {
        type: Schema.ObjectId,
        ref: "Role",
    },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "",
        required: false,
    },
    create_at: {
        type: Date,
        default: Date.now,
    }
});

UserSchema.plugin(mongoosePagination);
module.exports = model("User", UserSchema, "users");