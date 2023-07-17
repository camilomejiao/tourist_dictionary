const Role = require("../models/Role");

//Pruebas
function test(req, res) {
    return res.status(200).send({
        message: 'Accion de pruebas en el servidor Node.Js, Hola Controlador Role!'
    });
}

/** Funcion para registrar roles **/
function saveRole(req, res) {
    let params = req.body;
    //console.log(params);

    if(!params.role_name) {
        return res.status(400).json({
            status: "error",
            message: "Faltan campos obligatorios"
        });
    }

    Role.find(
        {role_name: params.role_name}
    ).then((found) => {
        if (found && found.length >= 1) {
            return res.status(400).json({
                status: "error",
                message: "Role ya existe en el sistema"
            });
        } else {
            let role_to_save = new Role(params);
            role_to_save.save().then((saved) => {
                return res.status(200).json({
                    status: "success",
                    message: "Guardado con exito!",
                    role: saved
                });
            }).catch((err) => {
                return res.status(400).send({
                    status: "err",
                    message: 'No se ha guardado el role',
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

/** Funcion para obtener todos los roles **/
function getRoles(req, res){
    Role.find({})
        .populate()
        .then((roles) => {
        if(roles.length == 0) {
            return res.status(404).send({
                status: "err",
                message: 'No hay Roles'
            });
        } else {
            return res.status(200).send({
                status: "success",
                roles: roles
            });
        }
    }).catch((err) => {
        return res.status(500).send({
            status: "err",
            message: "Error en la petición",
        });
    });
}

/** Función para obtener un solo role **/
function getRole(req, res) {
    let id = req.params.id;

    Role.findById(id).then((role) => {
        if(!role) {
            return res.status(404).send({
                status: "err",
                message: 'No existe!'
            });
        } else {
            return res.status(200).send({
                status: "success",
                role: role
            });
        }
    }).catch((err) => {
        return res.status(500).send({
            status: "err",
            message: "Error en la petición",
        });
    });
}

/** Función para actualizar un Role **/
function updateRole(req, res) {
    let id = req.params.id;
    let params = req.body;
    //console.log(update);

    if(id){
        Role.findByIdAndUpdate({_id: id}, params, {new: true})
            .then((role) => {
                if (!role) {
                    return res.status(404).send({
                        status: "err",
                        message: "No existe!",
                    });
                } else {
                    return res.status(200).send({
                        status: "success",
                        role: role,
                    });
                }
            }).catch((err) => {
                console.log(err);
                return res.status(400).send({
                    status: "err",
                    message: 'No se ha actualizado el role'
                });
            });
    } else {
        return res.status(400).send({
            status: "err",
            message: "El id es obligatorio",
        });
    }
}

/** Función para eliminar un role **/
function deleteRole(req, res) {
    let id = req.params.id;

    if(id){
        Role.findByIdAndDelete({_id: id})
            .then((role) => {
                if (!role) {
                    return res.status(404).send({
                        status: "err",
                        message: "No existe!",
                    });
                } else {
                    return res.status(200).send({
                        status: "success",
                        message: "Eliminado con exito!",
                        role: role,
                    });
                }
            }).catch((err) => {
                console.log(err);
                return res.status(400).send({
                    status: "err",
                    message: 'No se ha eliminado el role'
                });
            });
    } else {
        return res.status(400).send({
            status: "err",
            message: "El id es obligatorio",
        });
    }
}

module.exports = {
    test,
    saveRole,
    getRoles,
    getRole,
    updateRole,
    deleteRole
};