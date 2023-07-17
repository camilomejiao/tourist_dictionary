const multer = require("multer");
const util = require("util");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads/avatars/");
    },
    filename: (req, file, callback) => {
        const match = ["image/png","image/jpeg", "image/jpg", "image/gif"];

        if (match.indexOf(file.mimetype) === -1) {
            let message = {
                code: 'error',
                message: `${file.originalname} is invalid.`,
            }
            return callback(message, null);
        }

        const filename = "avatar-"+Date.now()+"-"+file.originalname;
        callback(null, filename);
    }
});

const uploadFiles = multer({ storage: storage }).array("file", 1);
const uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;