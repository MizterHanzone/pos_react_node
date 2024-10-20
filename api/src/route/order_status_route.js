const { getList, create, update, remove } = require("../controller/order_status_controller");

const order_status = (app) => {
    app.get("/api/order_status/getlist", getList)
    app.post("/api/order_status/create", create)
    app.put("/api/order_status/update", update)
    app.delete("/api/order_status/remove", remove)
};


module.exports = order_status;