const Customer =  require("../models/Customer");
const fs = require("fs");

const saveCustomer = (req, res) => {
    const params = req.body;
    //console.log(req.body);
    //console.log(req.file, req.files);

     if(!params.company_name || !params.identification || !params.name ||
        !params.department_id || !params.municipality_id || !params.category_id) {

         if(req.files){
             Object.entries(req.files).forEach(entry => {
                 const [key, item] = entry;
                 fs.unlink(item[0].path, (err) => {});
             });
         }
         return res.status(400).json({
             status: "error",
             message: "Faltan campos obligatorios"
         });
     } else {
         Customer.find({ $or:
                 [
                     {company_name: params.company_name},
                     {identification: params.identification},
                 ]
         }).then((customerFound) => {
             if (customerFound && customerFound.length >= 1) {
                 if(req.files){
                     Object.entries(req.files).forEach(entry => {
                         const [key, item] = entry;
                         fs.unlink(item[0].path, (err) => {});
                     });
                 }
                 return res.status(400).json({
                     status: "error",
                     message: "Cliente ya existe en el sistema"
                 });
             } else {
                 if(req.files) {
                     Object.entries(req.files).forEach(entry => {
                         const [key, item] = entry;
                         params[item[0].fieldname] = item[0].filename;
                         console.log('item: ', item[0]);
                     });
                 }

                 let customer_to_save = new Customer(params);
                 customer_to_save.save()
                     .then((saved) => {
                         return res.status(200).json({
                             status: "success",
                             message: "Guardado con exito!",
                             customer: saved,
                             //images: req.files
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
}

const listCustomers = (req, res) => {
    //console.log(req.params);
    let page = req.params.page >= 1 ? parseInt(req.params.page) : 1;
    let itemPerPage = req.params.limit >= 1 ? parseInt(req.params.limit) : 5;

    let options = {
        page: page,
        limit: itemPerPage,
        sort: {id: 1},
    }

    Customer.paginate({}, options)
        .then((customers) => {
            if(!customers){
                return res.status(404).send({
                    status: "err",
                    message: 'No hay clientes',
                });
            } else {
                return res.status(200).json({
                    status: "success",
                    customers: customers,
                });
            }
        }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            status: "err",
            message: 'Error al buscar los clientes',
            err
        });
    });
}

const listCustomer = (req, res) => {
    let id =  req.params.id;

    Customer.findById({_id: id})
        .select({})
        .then((customer) => {
            if(!customer){
                return res.status(404).send({
                    status: "err",
                    message: 'No hay clientes',
                });
            } else {
                return res.status(200).json({
                    status: "success",
                    customer: customer,
                });
            }
        }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            status: "err",
            message: 'Error al buscar los clientes',
            err
        });
    });
}

const deleteCustomer = (req, res) => {
    let id = req.params.id;

    if(id){
        Customer.findByIdAndDelete({_id: id})
            .then((customer) => {
                if (!customer) {
                    return res.status(404).send({
                        status: "err",
                        message: "No existe!",
                    });
                } else {
                    return res.status(200).send({
                        status: "success",
                        message: "Eliminado con exito!",
                        customer: customer,
                    });
                }
            }).catch((err) => {
                console.log(err);
                return res.status(400).send({
                    status: "err",
                    message: 'No se ha eliminado el cliente'
                });
            });
    } else {
        return res.status(400).send({
            status: "err",
            message: "El id es obligatorio",
        });
    }
}

const searchCustomerByDepartmentOrMuni = (req, res) => {
    //console.log(req.query);
    let q = req.query.q;
    let c = req.query.c;
    let depa = req.query.depa;
    let muni = req.query.muni;

    let search = [];
    if(q !== '' && q != undefined) {
        search = [{company_name: {"$regex": q, "$options": "i" }}];
    } else if (c !== '' && c != undefined) {
        search = [{category_id: c}];
    } else {
        search = [
            {department_id: depa},
            {municipality_id: muni}
        ];
    }
    //console.log(search);

    Customer.find({ "$or": search})
        .sort({date: -1})
        .then( (foundArticles) => {
            if (foundArticles.length === 0) {
                return res.status(404).send({
                    status: "no found",
                    message: "No se encontró clientes " + search,
                });
            } else {
                return res.status(200).send({
                    status: "success",
                    cont: foundArticles.length,
                    articles: foundArticles,
                });
            }
        }).catch((err) => {
            console.log(err);
            return res.status(400).send({
                status: "err",
                message: 'No se ha actualizado el articulo'
            });
        });
}

const updateCustomer = (req, res) => {
    let id =  req.params.id;
    const params = req.body;
    //console.log(req.body);
    //console.log(req.files);

    if(id){
        if(req.files) {
            Object.entries(req.files).forEach(entry => {
                const [key, item] = entry;
                params[item[0].fieldname] = item[0].filename;
                //console.log('item: ', item[0]);
            });
        }
        Customer.findByIdAndUpdate({_id: id},params,{new: true})
            .then((customer) => {
                if (!customer) {
                    return res.status(404).send({
                        status: "err",
                        message: "No existe!",
                    });
                } else {
                    return res.status(200).send({
                        status: "success",
                        customer: customer,
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
    saveCustomer,
    listCustomers,
    listCustomer,
    deleteCustomer,
    searchCustomerByDepartmentOrMuni,
    updateCustomer
}