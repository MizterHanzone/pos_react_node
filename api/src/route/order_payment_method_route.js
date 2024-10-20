const { getList, create, update, remove } = require("../controller/order_payment_method_controller");

const order_payment_method = (app) => {
    app.get("/api/order_payment_method/getlist", getList)
    app.post("/api/order_payment_method/create", create)
    app.put("/api/order_payment_method/update", update)
    app.delete("/api/order_payment_method/remove", remove)
};


module.exports = order_payment_method;