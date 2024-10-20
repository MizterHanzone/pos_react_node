// import controller
const { getList, create, update, remove } = require("../controller/role_controller");

// register user route
const user = (app) => {

    app.get("/api/user/getlist", getList);
    app.post("/api/user/create", create);
    app.put("/api/user/update", update);
    app.delete("/api/user/remove", remove);

};

module.exports = user;