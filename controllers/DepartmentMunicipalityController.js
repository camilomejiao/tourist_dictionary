const Department = require("../models/Department");
const Municipality =  require("../models/Municipality");

/** Funcion para obtener todos los departamentos **/
const getDepartments = (req, res) => {
    Department.find({})
        .populate()
        .then((departments) => {
                if(departments == 0) {
                    return res.status(404).send({
                        status: 'err',
                        message: 'No hay departamentos'
                    });
                } else {
                    return res.status(200).send({
                        status: "success",
                        departments: departments
                    });
                }
        }).catch((err) => {
            console.log(err);
            return res.status(500).send({
                status: err,
                message: "Error en la petición",
            });
        });
}

/** Funcion para obtener todos los municipios **/
const getMunicipality = (req, res) => {
    let id = req.params.id;

    if(id) {
        let department_id = {};
        if(id !== undefined) {
            department_id =  { department_id: id };
        }

        Municipality.find(department_id )
            .populate('department_id', 'department')
            .then((municipality) => {
                if(municipality == 0) {
                    return res.status(404).send({
                        status: 'err',
                        message: 'No hay municipios'
                    });
                } else {
                    return res.status(200).send({
                        status: "success",
                        municipality: municipality
                    });
                }
            }).catch((err) => {
            console.log(err);
            return res.status(500).send({
                status: err,
                message: "Error en la petición",
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
    getDepartments,
    getMunicipality
}