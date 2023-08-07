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
    let q = req.query.q;

    let search = [];
    let params_to_search = {};
    if(q !== '' && q != undefined) {
        search = [{municipality_name: {"$regex": q, "$options": "i" }}];
    } else if(id !== undefined) {
        search =  [{department_id: id}];
    }

    if(search && search.length > 0) {
        params_to_search = { "$or": search}
    }

    Municipality.find(params_to_search)
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

}

module.exports = {
    getDepartments,
    getMunicipality
}