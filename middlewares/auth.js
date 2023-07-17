const jwt = require("jwt-simple");
const moment = require("moment");
const libjwt = require("../services/jwt");
const secret_word = libjwt.secret_word;

exports.auth = (req, res, next) => {
    //Validamos si viene el token en los headers
    if(!req.headers.authorization){
        return res.status(403).json({
            status: "error",
            message: "No tienes cabecera de autenticación"
        });
    }

    //Eliminamos las comillas
    let token = req.headers.authorization.replace(/['"]+/g, '');

    //Validamos si el token a expirado o es invalido
    try {
        let payload = jwt.decode(token, secret_word);

        if(payload.exp <= moment.unix()) {
            return res.status(400).send({
                status: "err",
                message: 'Token expirado',
            });
        }

        //Agregar los datos al request
        req.user = payload;

    } catch (err) {
        return res.status(400).send({
            status: "err",
            message: 'Token invalido',
        });
    }

    //Pasar a la siguiente accion
    next();
}