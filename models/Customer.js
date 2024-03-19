const { Schema, model } = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");

const CustomerSchema = Schema({
    company_name: {
        type: String,
        required: true
    },
    identification: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: false
    },
    phone_number: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    whatsapp: {
        type: String,
        required: false
    },
    facebook: {
        type: String,
        required: false
    },
    instagram: {
        type: String,
        required: false
    },
    municipality_id: {
        type: Schema.ObjectId,
        ref: "Municipality",
    },
    category_id: {
        type: Schema.ObjectId,
        ref: "Category",
    },
    address: {
        type: String,
        required: false
    },
    how_to_get: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    RNT: {
        type: Boolean,
        required: false
    },
    file_rnt: {
        type: String,
        default: "",
        required: false,
    },
    link: {
        type: String,
        required: false
    },
    file_01: {
        type: String,
        default: "",
        required: false,
    },
    file_02: {
        type: String,
        default: "",
        required: false,
    },
    file_03: {
        type: String,
        default: "",
        required: false,
    },
    file_04: {
        type: String,
        default: "",
        required: false,
    },
    file_05: {
        type: String,
        default: "",
        required: false,
    },
    file_06: {
        type: String,
        default: "",
        required: false,
    },
    file_07: {
        type: String,
        default: "",
        required: false,
    },
    file_08: {
        type: String,
        default: "",
        required: false,
    },
    file_09: {
        type: String,
        default: "",
        required: false,
    },
    file_10: {
        type: String,
        default: "",
        required: false,
    },
    active: {
        type: Boolean,
        default: true,
        require: false
    },
    create_at: {
        type: Date,
        default: Date.now,
    }
});

CustomerSchema.plugin(mongoosePagination);
module.exports = model("Customer", CustomerSchema, "customers");