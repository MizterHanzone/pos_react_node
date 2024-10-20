const { getList, create, update, remove, setPassword, login } = require("../controller/employee_controller");

const employee = (app) => {
    app.get("/api/employee/getlist", getList);
    app.post("/api/employee/create", create);
    app.put("/api/employee/update", update);
    app.delete("/api/employee/remove", remove);
    app.post("/api/employee/setpassword", setPassword);
    app.post("/api/employee/login", login);
}

module.exports = employee;