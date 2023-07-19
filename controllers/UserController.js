const bcrypt= require("bcrypt");
const User = require("../models/User");
const jwt = require("../services/jwt");
const uploads = require("../middlewares/uploads");
const fs = require("fs");
const path = require("path");

const saveUser = async (req, res) => {
    let params = req.body;
    console.log(params);

    if(!params.name || !params.email || !params.password || !params.role_id) {
        return res.status(400).json({
            status: "error",
            message: "Faltan campos obligatorios"
        });
    }

    User.find({email: params.email})
        .then(async (userFound) => {
            if (userFound && userFound.length >= 1) {
                return res.status(400).json({
                    status: "error",
                    message: "Usuario ya existe en el sistema"
                });
            } else {
                let pwd = await bcrypt.hash(params.password, 10);
                params.password = pwd;
                let user_to_save = new User(params);
                user_to_save.save().then((userSaved) => {
                    return res.status(200).json({
                        status: "success",
                        message: "Guardado con exito!",
                        user: userSaved
                    });
                }).catch((err) => {
                    return res.status(400).send({
                        status: "err",
                        message: 'No se ha guardado el usuario',
                        err
                    });
                })
            }
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            status: err,
            message: "Error en la petición",
        });
    });
}

const login = (req, res) => {
    let params= req.body;
    //console.log(params);

    if(!params.email || !params.password) {
        return res.status(400).json({
            status: "error",
            message: "Faltan campos obligatorios"
        });
    }

    User.findOne(
        {email: params.email}
    ).then((userFound) => {
        if(userFound) {
            //console.log(userFound);
            let match = bcrypt.compareSync(params.password, userFound.password);
            const token = jwt.createToken(userFound);
            if(!match) {
                return res.status(400).send({
                    status: "err",
                    message: 'No te has identificado correctamente!',
                });
            } else {
                return res.status(200).json({
                    status: "success",
                    message: "Identificado correctamente!",
                    user: {
                        id: userFound._id,
                        name: userFound.name,
                        surname: userFound.surname,
                        nick: userFound.nickname
                    },
                    token
                });
            }
        } else {
            return res.status(404).send({
                status: "err",
                message: 'Usuario no existe en el sistema',
            });
        }
    }).catch((err) => {
        console.log(err);
        return res.status(400).send({
            status: "err",
            message: 'Error al buscar el usuario',
            err
        });
    });
}

const profile = (req, res) => {
    let id =  req.params.id;

    User.findById({_id: id})
        .select({password: 0})
        .then((userFound) => {
            if(!userFound){
                return res.status(404).send({
                    status: "err",
                    message: 'Usuario no existe en el sistema',
                });
            } else {
                return res.status(200).json({
                    status: "success",
                    user: userFound
                });
            }
        }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            status: "err",
            message: 'Error al buscar el usuario',
            err
        });
    });
}

const listUser = (req, res) => {

    //console.log(req.params);

    let page = req.params.page >= 1 ? parseInt(req.params.page) : 1;
    let itemPerPage = req.params.limit >= 1 ? parseInt(req.params.limit) : 5;

    let options = {
        page: page,
        limit: itemPerPage,
        sort: {id: 1},
    }

    User.paginate({}, options)
        .then((users) => {
            if(!users){
                return res.status(404).send({
                    status: "err",
                    message: 'No hay usuarios',
                });
            } else {
                return res.status(200).json({
                    status: "success",
                    users: users,
                    //page,
                    //itemPerPage,
                    //total: users.totalDocs,
                    //pages: Math.ceil(users.totalDocs / itemPerPage)
                });
            }
        }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            status: "err",
            message: 'Error al buscar el usuario',
            err
        });
    });
}

const updateUser = (req, res) => {
    let identity = req.user;
    let params = req.body;

    if(!params.email) {
        return res.status(400).json({
            status: "error",
            message: "Faltan campos obligatorios"
        });
    }

    User.find({ $or:
            [
                {email: params.email},
            ]
    }).then(async (userFound) => {
        let userIsset = false;
        userFound.forEach(user => {
            if(user._id != identity.id) {
                userIsset = true;
            }
        })

        if(userIsset){
            return res.status(400).json({
                status: "error",
                message: "No eres el usuario " + params.nickname,
            });
        }

        if(params.password){
            let pwd = await bcrypt.hash(params.password, 10);
            params.password = pwd;
        }

        User.findByIdAndUpdate({_id: identity.id}, params, {new: true})
            .then((userEdit) => {
                return res.status(200).json({
                    status: "success",
                    message: "Actualizado con exito!",
                    user: userEdit
                });
            }).catch((err) => {
            return res.status(400).send({
                status: "err",
                message: 'No se ha guardado el usuario',
                err
            });
        })
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            status: err,
            message: "Error en la petición",
        });
    });
}

const upload = (req, res) => {

    //console.log(req.file);
    let extension = req.file.originalname.split("\.")[1];

    if(extension != "png"  && extension != "jpg" &&
       extension != "jpeg" && extension != "gif") {

        fs.unlink(req.file.path, (err) => {
            return res.status(500).send({
                status: "err",
                message: "Imagen invalida",
            });
        });
    } else {
        User.findByIdAndUpdate({_id: req.user.id}, {image: req.file.filename}, {new: true})
            .then((userImageUpdate) => {
                return res.status(200).json({
                    status: "success",
                    message: "Imagen actualizada con exito!",
                    user: userImageUpdate,
                    files: req.file
                })
            }).catch((err) => {
            console.log(err);
            return res.status(400).send({
                status: "err",
                message: 'No se ha actualizado el articulo'
            });
        });
    }
}

const getAvatarImage = (req, res) => {
    const file = req.params.file;
    const filePath = "./uploads/avatars/"+file;

    fs.stat(filePath, (error, exist) => {
        if(!exist) {
            return res.status(404).json({
                status: "error",
                message: "No existe imagen!"
            });
        } else {
            return res.sendFile(path.resolve(filePath));
        }
    });
}

const updatePassword = async (req, res) => {
    let identity = req.user;
    let params = req.body;

    if (params.password !== params.confirm_password) {
        return res.status(500).send({
            status: "err",
            message: "La contraseña no coincide",
        });
    }

    let pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;

    User.findByIdAndUpdate({_id: identity.id}, {password: params.password} , {new: true})
        .then((userEdit) => {
            return res.status(200).json({
                status: "success",
                message: "Actualizado con exito!",
                //user: userEdit
            });
        }).catch((err) => {
            return res.status(400).send({
                status: "err",
                message: 'No se ha guardado el usuario',
                err
            });
        });

}

module.exports = {
    saveUser,
    login,
    profile,
    listUser,
    updateUser,
    upload,
    getAvatarImage,
    updatePassword
}