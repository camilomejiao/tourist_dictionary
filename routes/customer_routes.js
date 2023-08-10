const express = require("express");
const multer = require("multer");
const api = express.Router();
const auth = require("../middlewares/auth");
const CustomerController = require("../controllers/CustomerController");

//Middelware de imagenes
const bucketImages = multer.diskStorage({
    destination: function(req, file, cb) {
        let extension = file.originalname.split("\.")[1];
        if(extension == "png" || extension == "jpg" || extension == "jpeg" || extension == "gif") {
            cb(null, './uploads/customer/');
        } else if (extension == "pdf") {
            cb(null, './uploads/file_rtf/');
        }
    },

    filename: function(req, file, cb){
        let extension = file.originalname.split("\.")[1];
        if(extension == "png" || extension == "jpg" || extension == "jpeg" || extension == "gif") {
            cb(null, "cutomer-"+Date.now()+"-"+file.originalname);
        } else if (extension == "pdf") {
            cb(null, "file_rtf-"+Date.now()+"-"+file.originalname);
        }
    }
});

const upload = multer({
    storage: bucketImages,
    limits: {
        fileSize: 1048576
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf") {
            cb(null, true);
        } else {
            return cb(new Error('Invalid mime type'));
        }
    }
})

const uploadArrayImage = upload.fields(
    [
            {name: 'file_rnt', maxCount: 1},
            {name: 'file_01', maxCount: 1},
            {name: 'file_02', maxCount: 1},
            {name: 'file_03', maxCount: 1},
            {name: 'file_04', maxCount: 1},
            {name: 'file_05', maxCount: 1},
            {name: 'file_06', maxCount: 1},
            {name: 'file_07', maxCount: 1},
            {name: 'file_08', maxCount: 1},
            {name: 'file_09', maxCount: 1},
            {name: 'file_10', maxCount: 1}
    ]
);

api.post("/save-customer", [auth.auth, uploadArrayImage], CustomerController.saveCustomer);
api.get('/customer/:id', [auth.auth], CustomerController.listCustomer);
api.get('/list-customers/:page?/:limit?', CustomerController.listCustomers);
api.delete('/customer-delete/:id', [auth.auth], CustomerController.deleteCustomer);
api.put('/update-customer/:id', [auth.auth, uploadArrayImage], CustomerController.updateCustomer);
api.get(`/image/:file`, CustomerController.getAvatarImage);
api.get(`/file/:file`, CustomerController.getFileRTF);

//
api.get("/search-customer", CustomerController.searchCustomerByDepartmentOrMuni);

//Export
module.exports = api;