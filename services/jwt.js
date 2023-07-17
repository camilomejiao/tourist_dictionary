const jwt = require("jwt-simple");
const moment = require("moment");

//Clave secreta
const secret_word = "CLAVE_SECRETA_987";

const createToken = (user) => {

    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        role: user.role,
        email: user.email,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(1, "days").unix()
    }

    return jwt.encode(payload, secret_word);
}

module.exports = {
    secret_word,
    createToken
};