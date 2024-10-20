const mysql = require("mysql2/promise");
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "re_project_node",
    port: 3306,
    connectionLimit: 10,
    namedPlaceholders: true
});

module.exports = db;