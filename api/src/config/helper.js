const fs = require("fs").promises;
const moment = require("moment");
const multer = require("multer");

// check error for developer
const logError = async (controller = "user.list", message = "error message", res) => {
    try {
        // Append the log message to the file (create the file if it doesn't exist)
        const timestamp = moment().format('DD-MM-YYYY HH:mm:ss'); // Use 'moment' for formatted timestamp
        const path = `./logs/${controller}.txt`;
        const logMessage = `[${timestamp}] error: ${message}\n\n`;
        await fs.appendFile(path, logMessage);
    } catch (error) {
        console.error('Error writing to log file:', error);
    }
    res.status(500).send('Internal Server Error');
};

// function check null value
const isEmptyOrNull = (value) => {
    if (value === "" || value === null || value === undefined || value === "null" || value === "undefined") {
        return true;
    }

    return false;
};

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, "C:/xampp/htdocs/image_node_api/");
        },
        filename: function (req, file, callback) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            callback(null, file.fieldname + '-' + uniqueSuffix);
        }
    }),
    limits: {
        fieldSize: (1024 * 1024) * 3
    },
    fileFilter: function (req, file, callback) {
        if (file.mimetype != "image/png" && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
            // not allow 
            callback(null, false)
        } else {
            callback(null, true)
        }
    }
});

const removeFile = async (fileName) => {
    var filePath = "C:/xampp/htdocs/image_node_api/"
    try {
        await fs.unlink(filePath+fileName);
        return 'File deleted successfully';
    } catch (err) {
        console.error('Error deleting file:', err);
        throw err;
    }
}

module.exports = { logError, isEmptyOrNull, upload, removeFile };
