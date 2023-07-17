const Category =  require("../models/Category");

/** Funcion para registrar categories **/
function saveCategory(req, res) {
    let params = req.body;
    //console.log(params);

    if(!params.categorie) {
        return res.status(400).json({
            status: "error",
            message: "Faltan campos obligatorios"
        });
    }

    Category.find(
        {categorie: params.categorie}
    ).then((found) => {
        if (found && found.length >= 1) {
            return res.status(400).json({
                status: "error",
                message: "Esta categoria ya existe en el sistema"
            });
        } else {
            let Category_to_save = new Category(params);
            Category_to_save.save().then((saved) => {
                return res.status(200).json({
                    status: "success",
                    message: "Guardado con exito!",
                    category: saved
                });
            }).catch((err) => {
                return res.status(400).send({
                    status: "err",
                    message: 'No se ha guardado la categoria',
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

/** Funcion para obtener todos los categories **/
function getCategories(req, res){
    Category.find({})
        .populate()
        .then((categories) => {
            if(categories.length == 0) {
                res.status(404).send({
                    status: "err",
                    message: 'No hay categorias'
                });
            } else {
                res.status(200).send({
                    status: "success",
                    categories: categories
                });
            }
        }).catch((err) => {
        return res.status(500).send({
            status: "err",
            message: "Error en la petición",
        });
    });
}

/** Función para obtener un solo Category **/
function getCategory(req, res) {
    let id = req.params.id;

    Category.findById(id).then((category) => {
        if(!category) {
            res.status(404).send({
                status: "err",
                message: 'No existe!'
            });
        } else {
            res.status(200).send({
                status: "success",
                category: category
            });
        }
    }).catch((err) => {
        return res.status(500).send({
            status: "err",
            message: "Error en la petición",
        });
    });
}

/** Función para actualizar un Category **/
function updateCategory(req, res) {
    let id = req.params.id;
    let params = req.body;
    //console.log(update);

    if(id){
        Category.findByIdAndUpdate({_id: id}, params, {new: true})
            .then((category) => {
                if (!category) {
                    return res.status(404).send({
                        status: "err",
                        message: "No existe!",
                    });
                } else {
                    return res.status(200).send({
                        status: "success",
                        category: category,
                    });
                }
            }).catch((err) => {
                console.log(err);
                return res.status(400).send({
                    status: "err",
                    message: 'No se ha actualizado el categoria'
                });
            });
    } else {
        return res.status(400).send({
            status: "err",
            message: "El id es obligatorio",
        });
    }
}

/** Función para eliminar un Category **/
function deleteCategory(req, res) {
    let id = req.params.id;

    if(id){
        Category.findByIdAndDelete({_id: id})
            .then((Category) => {
                if (!Category) {
                    return res.status(404).send({
                        status: "err",
                        message: "No existe!",
                    });
                } else {
                    return res.status(200).send({
                        status: "success",
                        Category: Category,
                    });
                }
            }).catch((err) => {
            console.log(err);
            return res.status(400).send({
                status: "err",
                message: 'No se ha actualizado el Category'
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
    saveCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
};