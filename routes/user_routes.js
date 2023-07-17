const express = require("express");
const multer = require("multer");
const api = express.Router();
const auth = require("../middlewares/auth");
const UserController = require("../controllers/UserController");

//Middelware de imagenes
const bucketImages = multer.diskStorage({
    destination: function(req, file, cb) {
        if(file.mimetype == "image/png"  || file.mimetype == "image/jpg" ||
           file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
            cb(null, './uploads/avatars/');
        }
    },

    filename: function(req, file, cb){
        cb(null, "avatar-"+Date.now()+"-"+file.originalname);
    }
});

const upload = multer({storage: bucketImages, limits : {fileSize: 1048576} } ).single("file");

//Rutas user
api.post("/save-user", UserController.saveUser);
api.post("/login", UserController.login);

api.get("/profile/:id", [auth.auth], UserController.profile);
api.get('/list-users/:page?/:limit?', [auth.auth], UserController.listUser);
api.put('/update-user', [auth.auth], UserController.updateUser);
api.post('/upload', [auth.auth, upload], UserController.upload);
api.get('/avatar/:file', [auth.auth], UserController.getAvatarImage);
api.put('/change-password', [auth.auth], UserController.updatePassword);

//Export
module.exports = api;