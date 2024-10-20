const { getList, create, update, remove } = require("../controller/customer_controller");

const customer = (app) => {
    app.get("/api/customer/getlist", getList);
    app.post("/api/customer/create", create);
    app.put("/api/customer/update", update);
    app.delete("/api/customer/remove", remove);
}

module.exports = customer;